/// <reference types="webmcp-types" />
/**
 * WebMCP tools for in-browser AI agents (https://webmachinelearning.github.io/webmcp/).
 *
 * Tool names, descriptions, input schemas, and annotations live in `webmcp/schema.json`
 * (the same file the evals run against); this module only attaches the handlers.
 * Data comes from `/webmcp.json`, a build-time snapshot of the content collections.
 *
 * Errors are *resolved* as `{ error, code, retryable, suggestion }` rather than thrown:
 * a rejected `execute()` reaches the agent only as a generic `DOMException: UnknownError`.
 */
import { navigate } from 'astro:transitions/client';
import schema from '../../webmcp/schema.json';
import type { ProjectRecord, ReadRecord, SiteData } from './site-data';

type Args = Record<string, unknown>;
type ToolError = { error: string; code: string; retryable: boolean; suggestion?: string; [k: string]: unknown };
type Handler = (args: Args, signal: AbortSignal) => Promise<unknown>;

const DATA_URL = '/webmcp.json';
/** Keep each response under ~1,500 characters so it fits an agent's per-tool budget. */
const SECTION_CHARS = 1000;
const PROJECTS_PAGE_SIZE = 5;
const READS_PAGE_SIZE = 3;
const RANKINGS_PAGE_SIZE = 2;

// ── helpers ──────────────────────────────────────────────────────────────

const fail = (code: string, error: string, extra: Partial<ToolError> = {}): ToolError => ({
    error,
    code,
    retryable: false,
    ...extra
});

const norm = (s: string) =>
    s
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

// ── word matching ──
// Whole-word, not substring: "go" must not match "mongodb", "ai" must not match "failed".

const STOP_WORDS = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'of',
    'for',
    'with',
    'about',
    'on',
    'in',
    'to',
    'his',
    'that',
    'one',
    'app',
    'apps',
    'project',
    'projects',
    'book',
    'books'
]);
/** Drop a trailing plural "s" so "agents" and "agent" match (both sides are stemmed). */
const stem = (w: string) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w);
const tokensOf = (s: string) => new Set(norm(s).split(' ').filter(Boolean).map(stem));
const queryWords = (q: string) => [
    ...new Set(
        norm(q)
            .split(' ')
            .filter((w) => w && !STOP_WORDS.has(w))
            .map(stem)
    )
];
/** Exact token, or a prefix for words of 3+ chars ("swift" → "swiftui"). */
const hasWord = (tokens: Set<string>, w: string) => tokens.has(w) || (w.length >= 3 && [...tokens].some((t) => t.startsWith(w)));

/**
 * Keep items containing every query word. If none do, fall back to items containing some of them,
 * best first, and flag `partial` so the agent can tell the user the match was relaxed.
 */
function searchByWords<T>(items: T[], query: string, text: (item: T) => string): { items: T[]; partial: boolean } {
    const words = queryWords(query);
    if (words.length === 0) return { items, partial: false };
    const scored = items.map((item, idx) => {
        const tokens = tokensOf(text(item));
        return { item, idx, score: words.filter((w) => hasWord(tokens, w)).length };
    });
    const full = scored.filter((s) => s.score === words.length);
    if (full.length > 0) return { items: full.map((s) => s.item), partial: false };
    const some = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score || a.idx - b.idx);
    return { items: some.map((s) => s.item), partial: some.length > 0 };
}

/** "Node" ↔ "Node.js", "nextjs" ↔ "Next.js", "React" ↔ "React Native"; never "Go" ↔ "MongoDB". */
function usesTechnology(technologies: string[], wanted: string): boolean {
    const w = norm(wanted);
    return technologies.some((t) => {
        const n = norm(t);
        if (n === w || n.replace(/ /g, '') === w.replace(/ /g, '')) return true;
        const tokens = new Set(n.split(' '));
        return w.split(' ').every((part) => tokens.has(part));
    });
}

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
const int = (v: unknown, min: number) => (typeof v === 'number' && Number.isInteger(v) && v >= min ? v : undefined);

function clip(text: string, max: number): string {
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    return cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 20)).trimEnd() + '…';
}

function paginate<T>(items: T[], page: number, pageSize: number) {
    const total_pages = Math.max(1, Math.ceil(items.length / pageSize));
    return {
        slice: items.slice((page - 1) * pageSize, page * pageSize),
        meta: { page, page_size: pageSize, total_count: items.length, total_pages, has_more: page < total_pages }
    };
}

/**
 * Resolve a user-phrased name ("RoamReady", "the podcast app", "relay") to one entry.
 * Exact slug/title wins; otherwise a single partial match; otherwise report candidates.
 */
function resolveEntry<T extends { slug: string; title: string }>(
    items: T[],
    input: string,
    /** Extra searchable text per entry (summary, tech, authors) for descriptive references like "the podcast app". */
    describe: (item: T) => string = () => ''
): { entry: T } | { candidates: T[] } {
    const q = norm(input);
    const bare = (t: string) => norm(t.replace(/\(.*?\)/g, ''));
    const exact = items.find((i) => i.slug === input.toLowerCase() || norm(i.slug) === q || norm(i.title) === q || bare(i.title) === q);
    if (exact) return { entry: exact };
    const partial = items.filter((i) => {
        const t = norm(i.title);
        return q.length >= 3 && (t.includes(q) || norm(i.slug).includes(q) || (q.length >= 4 && q.includes(bare(i.title))));
    });
    if (partial.length === 1) return { entry: partial[0] };
    if (partial.length > 1) return { candidates: partial };
    // Descriptive references ("the camping app"): one item holding every word is a confident match.
    const found = searchByWords(items, input, (i) => `${i.title} ${i.slug} ${describe(i)}`);
    if (!found.partial && found.items.length === 1 && found.items.length < items.length) return { entry: found.items[0] };
    return { candidates: found.items.length < items.length ? found.items : [] };
}

function notFound(kind: 'project' | 'read', input: string, candidates: { title: string }[], all: { title: string }[]): ToolError {
    if (candidates.length > 1) {
        return fail('AMBIGUOUS', `"${input}" matches several ${kind}s.`, {
            matches: candidates.map((c) => c.title),
            suggestion: `Ask the user which one they mean, then call again with its exact name.`
        });
    }
    return fail('NOT_FOUND', `No ${kind} named "${input}".`, {
        ...(candidates.length === 1 ? { did_you_mean: candidates[0].title } : {}),
        available: all.map((a) => a.title),
        suggestion:
            kind === 'project'
                ? 'Pick the closest title from available or call list_projects with a keyword. Employer products not listed here (e.g. at Visa) are covered by get_experience.'
                : 'Pick the closest title from available, or call list_reads with a keyword query.'
    });
}

// ── data ─────────────────────────────────────────────────────────────────

let dataPromise: Promise<SiteData> | null = null;

function loadData(signal: AbortSignal): Promise<SiteData> {
    dataPromise ??= fetch(DATA_URL, { headers: { Accept: 'application/json' } })
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json() as Promise<SiteData>;
        })
        .catch((err) => {
            dataPromise = null; // allow a retry on the next call
            throw err;
        });
    // The fetch is shared and cached, so cancellation only detaches this caller.
    return new Promise((resolve, reject) => {
        if (signal.aborted) return reject(signal.reason);
        const onAbort = () => reject(signal.reason);
        signal.addEventListener('abort', onAbort, { once: true });
        dataPromise!.then(resolve, reject).finally(() => signal.removeEventListener('abort', onAbort));
    });
}

// ── handlers ─────────────────────────────────────────────────────────────

async function getProfile(_: Args, signal: AbortSignal) {
    const { profile } = await loadData(signal);
    return {
        name: profile.name,
        headline: profile.headline,
        summary: profile.summary.map((p) => clip(p, 260)),
        facts: Object.fromEntries(profile.facts.map((f) => [f.label, f.value])),
        focus_areas: profile.focus.map((f) => ({ title: f.title, related_projects: f.projects })),
        principles: profile.principles.map((p) => p.title),
        contact: Object.fromEntries(profile.links.map((l) => [l.label, l.url]))
    };
}

async function getExperience(args: Args, signal: AbortSignal) {
    const { experience, metrics, education } = await loadData(signal);
    const company = str(args.company);

    if (company) {
        const q = norm(company);
        const job = experience.find((e) => norm(e.company) === q) ?? experience.find((e) => norm(e.company).includes(q) || q.includes(norm(e.company)));
        if (!job) {
            return fail('NOT_FOUND', `Tanner has not listed work at "${company}".`, {
                companies: experience.map((e) => e.company),
                suggestion: 'Tell the user and offer the companies listed, or omit company for the full timeline.'
            });
        }
        return {
            ...job,
            ...(job === experience[0] ? { impact_metrics: metrics.map((m) => `${m.value}: ${m.label}`) } : {})
        };
    }

    return {
        roles: experience.map((e) => ({
            company: e.company,
            role: e.role,
            period: e.period,
            location: e.location,
            highlights: e.highlights.slice(0, 2).map((h) => clip(h, 190)),
            more_highlights: Math.max(0, e.highlights.length - 2)
        })),
        education,
        note: 'Call again with company for every highlight and impact metrics.'
    };
}

const projectOwnership = (p: ProjectRecord) => (p.isWorkProject ? 'work' : 'personal');
const describeProject = (p: ProjectRecord) => `${p.description} ${p.technologies.join(' ')}`;
const describeRead = (r: ReadRecord) => `${r.authors.join(' ')} ${r.topics.join(' ')} ${r.description}`;

async function listProjects(args: Args, signal: AbortSignal) {
    const { projects } = await loadData(signal);
    const query = str(args.query);
    const technology = str(args.technology);
    const { lane, status, ownership } = args as Record<string, string | undefined>;
    const page = int(args.page, 1) ?? 1;

    const filtered = projects.filter((p) => {
        if (lane && p.lane !== lane) return false;
        if (status && !p.statuses.includes(status as ProjectRecord['statuses'][number])) return false;
        if (ownership && projectOwnership(p) !== ownership) return false;
        if (technology && !usesTechnology(p.technologies, technology)) return false;
        return true;
    });
    const { items: matches, partial } = query
        ? searchByWords(filtered, query, (p) => [p.title, p.description, p.slug, p.lane === 'ai' ? 'AI' : '', ...p.technologies].join(' '))
        : { items: filtered, partial: false };

    if (matches.length === 0) {
        return fail('NO_RESULTS', 'No projects match those filters.', {
            technologies_used: [...new Set(projects.flatMap((p) => p.technologies))].sort(),
            suggestion: 'Drop or relax a filter (query, technology, status), or use a technology from technologies_used.'
        });
    }

    const { slice, meta } = paginate(matches, page, PROJECTS_PAGE_SIZE);
    if (slice.length === 0) {
        return fail('PAGE_OUT_OF_RANGE', `Page ${page} is past the last page (${meta.total_pages}).`, { ...meta });
    }
    return {
        projects: slice.map((p) => ({
            slug: p.slug,
            title: p.title,
            status: p.statuses.join(', '),
            lane: p.lane,
            ownership: projectOwnership(p),
            technologies: p.technologies.slice(0, 5),
            summary: clip(p.description, 110)
        })),
        ...(partial ? { match: 'partial', note: 'No project matched every keyword; these match some of them.' } : {}),
        ...meta
    };
}

async function getProject(args: Args, signal: AbortSignal) {
    const { projects } = await loadData(signal);
    const name = str(args.project);
    if (!name) return fail('MISSING_PROJECT', 'project is required.', { suggestion: 'Ask the user which project, or call list_projects.' });

    const found = resolveEntry(projects, name, describeProject);
    if ('candidates' in found) return notFound('project', name, found.candidates, projects);
    const p = found.entry;

    const sectionName = str(args.section);
    const section = sectionName
        ? (p.sections.find((s) => norm(s.heading) === norm(sectionName)) ?? p.sections.find((s) => norm(s.heading).includes(norm(sectionName))))
        : p.sections[0];
    if (!section) {
        return fail('SECTION_NOT_FOUND', `"${p.title}" has no section "${sectionName}".`, {
            sections: p.sections.map((s) => s.heading),
            suggestion: 'Call again with a heading from sections.'
        });
    }

    const offset = int(args.offset, 0) ?? 0;
    let end = Math.min(section.text.length, offset + SECTION_CHARS);
    if (end < section.text.length) {
        // Break on whitespace so continuation never splits a word.
        const ws = section.text.lastIndexOf(' ', end);
        if (ws > offset + SECTION_CHARS / 2) end = ws + 1;
    }
    const text = section.text.slice(offset, end);

    // Project metadata only on the first view; follow-up section reads stay within budget.
    const firstView = !sectionName && offset === 0;
    return {
        title: p.title,
        ...(firstView
            ? {
                  status: p.statuses.join(', '),
                  lane: p.lane,
                  ownership: projectOwnership(p),
                  technologies: p.technologies,
                  page_url: p.url,
                  ...(p.github ? { github: p.github } : {})
              }
            : {}),
        section: section.heading,
        text,
        ...(end < section.text.length ? { truncated: true, next_offset: end, section_length: section.text.length } : {}),
        sections: p.sections.map((s) => s.heading)
    };
}

async function listReads(args: Args, signal: AbortSignal) {
    const { reads } = await loadData(signal);
    const query = str(args.query);
    const { shelf, kind, progress } = args as Record<string, string | undefined>;
    const page = int(args.page, 1) ?? 1;

    const progressOf = (r: ReadRecord) => (r.readingNow ? 'reading' : r.progress);
    const filtered = reads
        .filter((r) => {
            if (shelf && r.shelf !== shelf) return false;
            if (kind && r.kind !== kind) return false;
            if (progress && progressOf(r) !== progress) return false;
            return true;
        })
        // Currently-reading first (in the site's own order), then most recently added.
        .sort((a, b) => Number(b.readingNow) - Number(a.readingNow) || (a.readingNowOrder ?? 999) - (b.readingNowOrder ?? 999));
    const { items: matches, partial } = query
        ? searchByWords(filtered, query, (r) => [r.title, ...r.authors, ...r.topics, r.description, r.notes, r.source ?? ''].join(' '))
        : { items: filtered, partial: false };

    if (matches.length === 0) {
        return fail('NO_RESULTS', 'No reads match those filters.', {
            topics: [...new Set(reads.flatMap((r) => r.topics))].sort(),
            suggestion: 'Relax a filter or search one of these topics instead.'
        });
    }

    const { slice, meta } = paginate(matches, page, READS_PAGE_SIZE);
    if (slice.length === 0) {
        return fail('PAGE_OUT_OF_RANGE', `Page ${page} is past the last page (${meta.total_pages}).`, { ...meta });
    }
    return {
        reads: slice.map((r) => ({
            slug: r.slug,
            title: r.title,
            authors: r.authors.join(', '),
            kind: r.kind,
            shelf: r.shelf,
            progress: progressOf(r) ?? 'unspecified',
            ...(r.year ? { year: r.year } : {}),
            topics: r.topics.slice(0, 3),
            about: clip(r.description, 120),
            ...(r.notes ? { tanners_note: clip(r.notes, 110) } : {})
        })),
        ...(partial ? { match: 'partial', note: 'Nothing matched every keyword; these match some.' } : {}),
        ...meta
    };
}

async function getTechStack(args: Args, signal: AbortSignal) {
    const { stack } = await loadData(signal);
    const category = str(args.category);
    const page = int(args.page, 1) ?? 1;

    if (!category) {
        return {
            software: stack.software.map((s) => ({ category: s.category, tools: s.items.map((i) => i.tools).join(' · ') })),
            ai_models_ranked: stack.models.map((m) => m.name),
            coding_harnesses_ranked: stack.harnesses.map((h) => h.name),
            note: 'Call again with category for details, reasoning, and pros/cons.'
        };
    }

    if (category === 'software') {
        return {
            software: stack.software.map((s) => ({
                category: s.category,
                items: s.items.map((i) => (i.detail ? `${i.tools}: ${clip(i.detail, 120)}` : i.tools))
            }))
        };
    }

    if (category === 'ai_models' || category === 'coding_harnesses') {
        const ranked = category === 'ai_models' ? stack.models : stack.harnesses;
        const mentions = category === 'ai_models' ? stack.modelMentions : stack.harnessMentions;
        const { slice, meta } = paginate(ranked, page, RANKINGS_PAGE_SIZE);
        if (slice.length === 0) {
            return fail('PAGE_OUT_OF_RANGE', `Page ${page} is past the last page (${meta.total_pages}).`, { ...meta });
        }
        return {
            rankings: slice.map((r) => ({
                rank: Number(r.rank),
                name: r.name,
                good_for: r.tags.join(', '),
                why: clip(r.summary, 260),
                pros: r.pros.slice(0, 2).map((x) => clip(x, 90)),
                cons: r.cons.slice(0, 1).map((x) => clip(x, 90))
            })),
            ...(meta.has_more ? {} : { honorable_mentions: mentions.map((m) => `${m.name}: ${clip(m.use, 110)}`) }),
            ...meta,
            disclaimer: 'Personal opinions, not benchmarks.'
        };
    }

    return fail('INVALID_CATEGORY', `Unknown category "${category}".`, {
        suggestion: 'Use software, ai_models, or coding_harnesses, or omit category.'
    });
}

const STATIC_PAGES: Record<string, string> = {
    home: '/',
    projects: '/projects/',
    about: '/about/',
    stack: '/stack/',
    contact: '/contact/'
};

async function openPage(args: Args, signal: AbortSignal) {
    const page = str(args.page);
    const item = str(args.item);
    let url: string | undefined = page ? STATIC_PAGES[page] : undefined;
    let externalUrl: string | undefined;

    if (page === 'bookshelf') {
        const shelf = item && norm(item).startsWith('leis') ? 'leisure' : 'technical';
        url = `/reads/shelf/${shelf}/`;
    } else if (page === 'project' || page === 'read') {
        // A read opens the bookshelf it sits on; its own URL is an external link the agent can share.
        if (!item) {
            return fail('MISSING_ITEM', `Opening a ${page} needs item.`, {
                suggestion: `Ask the user which ${page === 'project' ? 'project' : 'book or article'} to open.`
            });
        }
        const data = await loadData(signal);
        const items: { title: string }[] = page === 'project' ? data.projects : data.reads;
        const found = page === 'project' ? resolveEntry(data.projects, item, describeProject) : resolveEntry(data.reads, item, describeRead);
        if ('candidates' in found) return notFound(page, item, found.candidates, items);
        url = found.entry.url;
        if ('externalUrl' in found.entry && found.entry.externalUrl) externalUrl = found.entry.externalUrl;
    }

    if (!url) {
        return fail('INVALID_PAGE', `Unknown page "${page ?? ''}".`, {
            suggestion: 'Use one of: home, projects, project, bookshelf, read, about, stack, contact.'
        });
    }

    if (signal.aborted) return fail('CANCELLED', 'Navigation was cancelled.');
    // Resolves once the view transition has swapped in the new page.
    await navigate(url);
    const landed = location.pathname.replace(/\/?$/, '/') === url.replace(/\/?$/, '/');
    if (!landed) {
        return fail('NAVIGATION_FAILED', `Could not open ${url}; the browser is still on ${location.pathname}.`, {
            retryable: true,
            suggestion: 'Retry once, or give the user the link to open themselves.'
        });
    }
    return {
        status: 'navigated',
        url: location.pathname,
        page_title: document.title,
        ...(externalUrl ? { external_link: externalUrl } : {})
    };
}

const handlers: Record<string, Handler> = {
    get_profile: getProfile,
    get_experience: getExperience,
    list_projects: listProjects,
    get_project: getProject,
    list_reads: listReads,
    get_tech_stack: getTechStack,
    open_page: openPage
};

// ── registration ─────────────────────────────────────────────────────────

/** Wraps a handler so data-load failures and bugs come back as actionable payloads, not UnknownError. */
function safe(name: string, handler: Handler): WebMCP.ToolExecuteCallback {
    return async (args, { signal }) => {
        try {
            return await handler(args ?? {}, signal);
        } catch (err) {
            if (signal.aborted) return fail('CANCELLED', `${name} was cancelled.`);
            const message = err instanceof Error ? err.message : String(err);
            return fail('UNAVAILABLE', `Site data could not be loaded (${message}).`, {
                retryable: true,
                suggestion: 'Retry once; if it fails again, tell the user the site data is temporarily unavailable.'
            });
        }
    };
}

export function registerSiteTools(): AbortController | undefined {
    const ctx = document.modelContext;
    if (!ctx || typeof ctx.registerTool !== 'function') return undefined;

    const controller = new AbortController();
    for (const def of schema.tools) {
        const handler = handlers[def.name];
        if (!handler) {
            console.warn(`[webmcp] no handler for tool "${def.name}"`);
            continue;
        }
        ctx.registerTool(
            {
                name: def.name,
                description: def.description,
                inputSchema: def.inputSchema,
                ...('annotations' in def && def.annotations ? { annotations: def.annotations } : {}),
                execute: safe(def.name, handler)
            },
            { signal: controller.signal }
        ).catch((err) => console.warn(`[webmcp] failed to register "${def.name}"`, err));
    }
    return controller;
}
