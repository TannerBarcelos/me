/**
 * Deterministic WebMCP tool tests: mock `document.modelContext.registerTool`, capture each tool,
 * and call its `execute` directly. No browser or model involved.
 */
import { existsSync, readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { navigate } from 'astro:transitions/client';
import schema from '../../webmcp/schema.json';
import type { SiteData } from './site-data';

vi.mock('astro:transitions/client', () => ({
    navigate: vi.fn(async (url: string) => {
        (globalThis as unknown as { location: { pathname: string } }).location.pathname = url;
    })
}));

type Tool = WebMCP.ModelContextTool;
type Result = Record<string, any>;

const project = (p: Partial<SiteData['projects'][number]> & { slug: string; title: string }): SiteData['projects'][number] => ({
    description: '',
    url: `/projects/${p.slug}/`,
    lane: 'apps',
    statuses: ['live'],
    technologies: [],
    isWorkProject: false,
    isFeatured: false,
    featuredOrder: null,
    github: null,
    published: '2026-01-01',
    sections: [{ heading: 'Overview', text: `${p.title} overview.` }],
    ...p
});

const LONG_SECTION = Array.from({ length: 300 }, (_, i) => `word${i}`).join(' ');

const fixture: SiteData = {
    profile: {
        name: 'Tanner Barcelos',
        headline: 'I build AI-powered products.',
        summary: ['Senior engineer.'],
        facts: [{ label: 'Role', value: 'Senior Full Stack Engineer' }],
        focus: [{ title: 'AI products', body: '…', projects: ['aios-console'] }],
        principles: [{ title: 'Own the whole stack', body: '…' }],
        links: [{ label: 'Email', url: 'mailto:test@example.com' }]
    },
    experience: [
        { company: 'Visa', role: 'Senior Full Stack Engineer', period: '2022 – Present', location: null, highlights: ['a', 'b', 'c'] },
        { company: 'Scalable Commerce', role: 'Frontend Engineer', period: '2021 – 2022', location: null, highlights: ['d'] }
    ],
    metrics: [{ value: '10M+', label: 'daily transactions' }],
    education: null,
    projects: [
        project({
            slug: 'aios-console',
            title: 'AIOS Console',
            lane: 'ai',
            isWorkProject: true,
            technologies: ['React', 'TypeScript', 'Go'],
            description: 'Runs an ML platform for fraud models.'
        }),
        project({
            slug: 'coffee-connection',
            title: 'Coffee Connection',
            technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
            description: 'Connects coffee fans with local shops.'
        }),
        project({
            slug: 'relay',
            title: 'Relay',
            statuses: ['in-progress'],
            technologies: ['Swift', 'SwiftUI'],
            description: 'An inbox for coding agents: what finished, what failed, what is blocked.',
            sections: [
                { heading: 'Overview', text: 'Relay overview.' },
                { heading: 'Roadmap', text: LONG_SECTION }
            ]
        }),
        project({
            slug: 'seeker',
            title: 'Seeker',
            statuses: ['in-progress'],
            technologies: ['Swift', 'SwiftData'],
            description: 'A native iOS podcast player with semantic search and a listening inbox.'
        }),
        project({ slug: 'spendaro', title: 'Spendaro', technologies: ['Next.js', 'React Native'], description: 'Budgeting with email receipts.' })
    ],
    reads: [
        {
            slug: 'ddia',
            title: 'Designing Data-Intensive Applications',
            authors: ['Martin Kleppmann'],
            kind: 'book',
            shelf: 'technical',
            progress: null,
            readingNow: true,
            readingNowOrder: 1,
            year: 2026,
            source: null,
            topics: ['Distributed systems'],
            description: 'Storage, replication, and streams.',
            notes: '',
            url: '/reads/shelf/technical/',
            externalUrl: 'https://example.com/ddia',
            added: '2026-01-01'
        },
        {
            slug: 'nuclear-war',
            title: 'Nuclear War: A Scenario',
            authors: ['Annie Jacobsen'],
            kind: 'book',
            shelf: 'leisure',
            progress: 'finished',
            readingNow: false,
            readingNowOrder: null,
            year: 2024,
            source: null,
            topics: ['History'],
            description: 'Detailed, plain, and sourced like a briefing.',
            notes: '',
            url: '/reads/shelf/leisure/',
            externalUrl: null,
            added: '2026-01-01'
        }
    ],
    stack: {
        software: [{ category: 'Languages', summary: '…', items: [{ tools: 'TypeScript · Go', detail: 'App code and services.' }] }],
        models: [{ rank: '01', name: 'Model A', tags: ['coding'], summary: 'Default.', pros: ['p'], cons: ['c'] }],
        modelMentions: [],
        harnesses: [{ rank: '01', name: 'Harness A', tags: ['cli'], summary: 'Default.', pros: ['p'], cons: ['c'] }],
        harnessMentions: []
    }
};

const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Fresh module per test so the cached site data and registration start clean. */
async function setup(fetchImpl: () => Promise<Response> = async () => jsonResponse(fixture)) {
    const tools = new Map<string, Tool>();
    const registerOptions: WebMCP.ModelContextRegisterToolOptions[] = [];
    const registerTool = vi.fn(async (tool: Tool, options?: WebMCP.ModelContextRegisterToolOptions) => {
        tools.set(tool.name, tool);
        if (options) registerOptions.push(options);
    });
    const fetchMock = vi.fn(fetchImpl);
    vi.stubGlobal('document', { modelContext: { registerTool }, title: 'Page' });
    vi.stubGlobal('location', { pathname: '/' });
    vi.stubGlobal('fetch', fetchMock);

    vi.resetModules();
    const { registerSiteTools } = await import('./register-tools');
    const controller = registerSiteTools();
    await Promise.resolve();

    const call = async (name: string, args: Record<string, unknown> = {}, signal = new AbortController().signal) => {
        const tool = tools.get(name);
        if (!tool) throw new Error(`tool ${name} was not registered`);
        return (await tool.execute(args, { signal })) as Result;
    };
    return { tools, registerTool, registerOptions, controller, call, fetchMock };
}

beforeEach(() => {
    vi.mocked(navigate).mockClear();
});
afterEach(() => vi.unstubAllGlobals());

describe('registration contract', () => {
    it('registers every schema tool with its exact metadata and an unregister signal', async () => {
        const { tools, registerOptions, controller } = await setup();
        expect([...tools.keys()].sort()).toEqual(schema.tools.map((t) => t.name).sort());
        for (const def of schema.tools) {
            const tool = tools.get(def.name)!;
            expect(tool.description).toBe(def.description);
            expect(tool.inputSchema).toEqual(def.inputSchema);
            expect(tool.annotations).toEqual('annotations' in def ? def.annotations : undefined);
        }
        expect(registerOptions.every((o) => o.signal === controller!.signal)).toBe(true);
    });

    it('skips registration when the browser has no WebMCP support', async () => {
        vi.stubGlobal('document', {});
        vi.resetModules();
        const { registerSiteTools } = await import('./register-tools');
        expect(registerSiteTools()).toBeUndefined();
    });

    it('keeps names and descriptions within budget, with opt-in annotations only', () => {
        for (const def of schema.tools) {
            expect(def.name.length).toBeLessThanOrEqual(30);
            expect(def.description.length).toBeLessThanOrEqual(500);
            for (const [param, spec] of Object.entries(def.inputSchema.properties as Record<string, { description: string }>)) {
                expect(param.length).toBeLessThanOrEqual(30);
                expect(spec.description.length).toBeLessThanOrEqual(150);
            }
            const annotations = ('annotations' in def ? def.annotations : {}) as Record<string, boolean>;
            expect(Object.values(annotations).every((v) => v === true)).toBe(true);
        }
        // Navigation changes what the user sees, so it must not claim to be read-only.
        const openPage = schema.tools.find((t) => t.name === 'open_page')!;
        expect('annotations' in openPage).toBe(false);
    });
});

describe('list_projects', () => {
    it('matches technologies as whole words ("Go" is not "MongoDB")', async () => {
        const { call } = await setup();
        const res = await call('list_projects', { technology: 'Go' });
        expect(res.projects.map((p: Result) => p.title)).toEqual(['AIOS Console']);
    });

    it('accepts the user phrasing of technology names', async () => {
        const { call } = await setup();
        expect((await call('list_projects', { technology: 'node' })).projects.map((p: Result) => p.title)).toEqual(['Coffee Connection']);
        expect((await call('list_projects', { technology: 'nextjs' })).projects.map((p: Result) => p.title)).toEqual(['Spendaro']);
    });

    it('matches query words as words ("ai" is not "failed" or "email"), counting the AI lane', async () => {
        // Only AIOS Console qualifies, through its AI lane; its summary never says "AI".
        const { call } = await setup();
        const res = await call('list_projects', { query: 'ai' });
        expect(res.projects.map((p: Result) => p.title)).toEqual(['AIOS Console']);
        expect(res.match).toBeUndefined();
    });

    it('relaxes an over-constrained query to partial matches and says so', async () => {
        const { call } = await setup();
        const res = await call('list_projects', { query: 'agent observability tools' });
        expect(res.projects.map((p: Result) => p.title)).toEqual(['Relay']);
        expect(res.match).toBe('partial');
    });

    it('combines structured filters and reports pagination fields', async () => {
        const { call } = await setup();
        const res = await call('list_projects', { status: 'in-progress', technology: 'swift' });
        expect(res.projects.map((p: Result) => p.title)).toEqual(['Relay', 'Seeker']);
        expect(res).toMatchObject({ page: 1, page_size: 5, total_count: 2, total_pages: 1, has_more: false });
    });

    it('returns actionable guidance instead of an empty list', async () => {
        const { call } = await setup();
        const res = await call('list_projects', { technology: 'Rust' });
        expect(res).toMatchObject({ code: 'NO_RESULTS', retryable: false });
        expect(res.technologies_used).toContain('Go');
        expect(await call('list_projects', { page: 9 })).toMatchObject({ code: 'PAGE_OUT_OF_RANGE', total_pages: 1 });
    });
});

describe('get_project', () => {
    it('resolves descriptive references to a single project', async () => {
        const { call } = await setup();
        expect((await call('get_project', { project: 'the podcast app' })).title).toBe('Seeker');
        expect((await call('get_project', { project: 'RELAY' })).title).toBe('Relay');
    });

    it('treats a technology name as a technology, never guessing a project', async () => {
        const { call } = await setup();
        // "go" fits exactly one project, but the user almost certainly means the language.
        expect(await call('get_project', { project: 'go' })).toMatchObject({ code: 'TECHNOLOGY_NOT_PROJECT', projects_using: ['AIOS Console'] });
        expect(await call('get_project', { project: 'swift' })).toMatchObject({ code: 'TECHNOLOGY_NOT_PROJECT', projects_using: ['Relay', 'Seeker'] });
        expect(await call('open_page', { page: 'project', item: 'go' })).toMatchObject({ code: 'TECHNOLOGY_NOT_PROJECT' });
        expect(navigate).not.toHaveBeenCalled();
    });

    it('asks for clarification when a description fits several projects', async () => {
        const { call } = await setup();
        expect(await call('get_project', { project: 'inbox' })).toMatchObject({ code: 'AMBIGUOUS', matches: ['Relay', 'Seeker'] });
    });

    it('points unknown employer products to get_experience', async () => {
        const { call } = await setup();
        const res = await call('get_project', { project: 'Nexus' });
        expect(res.code).toBe('NOT_FOUND');
        expect(res.suggestion).toContain('get_experience');
    });

    it('pages long sections on word boundaries until the whole text is read', async () => {
        const { call } = await setup();
        let offset = 0;
        let text = '';
        for (let i = 0; i < 10; i++) {
            const res = await call('get_project', { project: 'relay', section: 'roadmap', offset });
            expect(JSON.stringify(res).length).toBeLessThanOrEqual(1500);
            text += res.text;
            if (!res.truncated) break;
            expect(res.text.endsWith(' ')).toBe(true);
            offset = res.next_offset;
        }
        expect(text).toBe(LONG_SECTION);
    });

    it('lists real section headings when the section is unknown', async () => {
        const { call } = await setup();
        expect(await call('get_project', { project: 'relay', section: 'pricing' })).toMatchObject({
            code: 'SECTION_NOT_FOUND',
            sections: ['Overview', 'Roadmap']
        });
    });
});

describe('get_experience and list_reads', () => {
    it('returns the full record for a named employer and lists real companies otherwise', async () => {
        const { call } = await setup();
        expect(await call('get_experience', { company: 'visa' })).toMatchObject({ company: 'Visa', highlights: ['a', 'b', 'c'] });
        expect(await call('get_experience', { company: 'Google' })).toMatchObject({ code: 'NOT_FOUND', companies: ['Visa', 'Scalable Commerce'] });
    });

    it('treats "reading now" as reading and does not substring-match short words', async () => {
        const { call } = await setup();
        expect((await call('list_reads', { progress: 'reading' })).reads.map((r: Result) => r.title)).toEqual(['Designing Data-Intensive Applications']);
        // "ai" only appears inside words ("detailed", "plain"); there is no AI read in the fixture.
        expect((await call('list_reads', { query: 'ai' })).code).toBe('NO_RESULTS');
    });
});

describe('open_page', () => {
    it('awaits navigation and reports where the browser landed', async () => {
        const { call } = await setup();
        expect(await call('open_page', { page: 'project', item: 'the relay app' })).toMatchObject({ status: 'navigated', url: '/projects/relay/' });
        expect(navigate).toHaveBeenCalledWith('/projects/relay/');
    });

    it('opens the shelf for a read and hands back the external link instead of leaving the site', async () => {
        const { call } = await setup();
        expect(await call('open_page', { page: 'read', item: 'kleppmann' })).toMatchObject({
            url: '/reads/shelf/technical/',
            external_link: 'https://example.com/ddia'
        });
    });

    it('never reports success when navigation did not land', async () => {
        const { call } = await setup();
        vi.mocked(navigate).mockImplementationOnce(async () => {});
        expect(await call('open_page', { page: 'stack' })).toMatchObject({ code: 'NAVIGATION_FAILED', retryable: true });
    });

    it('asks for the missing item rather than guessing', async () => {
        const { call } = await setup();
        expect(await call('open_page', { page: 'project' })).toMatchObject({ code: 'MISSING_ITEM' });
        expect(navigate).not.toHaveBeenCalled();
    });
});

describe('failures resolve with guidance instead of rejecting', () => {
    it('reports a retryable error when site data fails to load, then recovers on retry', async () => {
        let attempt = 0;
        const { call, fetchMock } = await setup(async () => (++attempt === 1 ? jsonResponse({}, 503) : jsonResponse(fixture)));
        expect(await call('get_profile')).toMatchObject({ code: 'UNAVAILABLE', retryable: true });
        expect((await call('get_profile')).name).toBe('Tanner Barcelos');
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('reports cancellation when the agent aborts the call', async () => {
        const { call } = await setup();
        const controller = new AbortController();
        controller.abort();
        expect(await call('list_projects', {}, controller.signal)).toMatchObject({ code: 'CANCELLED' });
    });
});

const BUILT_DATA = new URL('../../dist/webmcp.json', import.meta.url);

describe.skipIf(!existsSync(BUILT_DATA))('output budget on the real built site data (run `npm run build` first)', () => {
    const cases: [string, Record<string, unknown>][] = [
        ['get_profile', {}],
        ['get_experience', {}],
        ['get_experience', { company: 'Visa' }],
        ['list_projects', {}],
        ['list_projects', { page: 2 }],
        ['list_projects', { page: 3 }],
        ['list_projects', { technology: 'Rust' }],
        ['list_projects', { query: 'agent observability tools' }],
        ['list_reads', {}],
        ['list_reads', { page: 2 }],
        ['list_reads', { page: 3 }],
        ['list_reads', { query: 'zzz' }],
        ['get_tech_stack', {}],
        ['get_tech_stack', { category: 'software' }],
        ['get_tech_stack', { category: 'ai_models' }],
        ['get_tech_stack', { category: 'ai_models', page: 2 }],
        ['get_tech_stack', { category: 'coding_harnesses' }],
        ['get_tech_stack', { category: 'coding_harnesses', page: 2 }]
    ];

    it.each(cases)('%s %j stays within 1,500 characters', async (name, args) => {
        const data = JSON.parse(readFileSync(BUILT_DATA, 'utf8')) as SiteData;
        const { call } = await setup(async () => jsonResponse(data));
        const res = await call(name, args);
        expect(JSON.stringify(res).length).toBeLessThanOrEqual(1500);
    });

    it('every section of every real project stays within budget when paged', async () => {
        const data = JSON.parse(readFileSync(BUILT_DATA, 'utf8')) as SiteData;
        const { call } = await setup(async () => jsonResponse(data));
        for (const p of data.projects) {
            for (const s of p.sections) {
                let offset = 0;
                for (let i = 0; i < 20; i++) {
                    const res = await call('get_project', { project: p.slug, section: s.heading, offset });
                    expect(res.error, `${p.slug} / ${s.heading}`).toBeUndefined();
                    expect(JSON.stringify(res).length, `${p.slug} / ${s.heading} @${offset}`).toBeLessThanOrEqual(1500);
                    if (!res.truncated) break;
                    offset = res.next_offset;
                }
            }
            const overview = await call('get_project', { project: p.slug });
            expect(JSON.stringify(overview).length, `${p.slug} overview`).toBeLessThanOrEqual(1500);
        }
    });
});
