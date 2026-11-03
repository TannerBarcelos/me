/**
 * Build-time JSON snapshot consumed by the in-browser WebMCP tools (`src/webmcp/register-tools.ts`).
 * Static output: regenerated on every build, so tools always reflect the published content.
 */
import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import siteConfig from '../data/site-config';
import { software, modelRankings, modelHonorableMentions, harnessRankings, harnessHonorableMentions } from '../data/stack';
import type { ContentSection, ProjectRecord, ReadRecord, SiteData } from '../webmcp/site-data';
import { sortFeaturedProjects, sortReadsByAddedDesc } from '../utils/data-utils';
import { readsShelfPath } from '../utils/reads-links';

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Drop images and collapse whitespace; markdown links/emphasis are kept since agents read them fine. */
function cleanMarkdown(src: string): string {
    return src
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/** Split a markdown body on `##`/`###` headings so tools can return one section at a time. */
function toSections(body: string): ContentSection[] {
    const sections: ContentSection[] = [];
    let heading = 'Overview';
    let buf: string[] = [];
    const flush = () => {
        const text = cleanMarkdown(buf.join('\n'));
        if (text) sections.push({ heading, text });
    };
    for (const line of body.split('\n')) {
        const m = /^#{2,3}\s+(.+?)\s*#*$/.exec(line);
        if (m) {
            flush();
            heading = m[1].trim();
            buf = [];
        } else {
            buf.push(line);
        }
    }
    flush();
    return sections;
}

export const GET: APIRoute = async () => {
    const about = (await getEntry('pages', 'about'))?.data.about;
    if (!about) throw new Error('pages/about.md must define an `about` block');

    const contact = await getEntry('pages', 'contact');
    const email = contact?.body.match(/mailto:([^)\s]+)/)?.[1];

    const links: SiteData['profile']['links'] = [
        ...(email ? [{ label: 'Email', url: `mailto:${email}` }] : []),
        ...(siteConfig.socialLinks ?? []).map((l) => ({ label: l.text, url: l.href })),
        ...(siteConfig.footerNavLinks ?? []).filter((l) => l.text === 'Resume').map((l) => ({ label: l.text, url: l.href })),
        ...(siteConfig.headerNavLinks ?? []).filter((l) => l.text === 'Blog').map((l) => ({ label: l.text, url: l.href }))
    ];

    const projects: ProjectRecord[] = (await getCollection('projects')).sort(sortFeaturedProjects).map((p) => ({
        slug: p.slug,
        title: p.data.title,
        description: p.data.description ?? '',
        url: `/projects/${p.slug}/`,
        lane: p.data.lane,
        statuses: p.data.tags,
        technologies: p.data.technologies,
        isWorkProject: p.data.isWorkProject,
        isFeatured: p.data.isFeatured,
        featuredOrder: p.data.featuredOrder ?? null,
        github: p.data.isWorkProject ? null : (p.data.github ?? null),
        published: isoDate(p.data.publishDate),
        sections: toSections(p.body)
    }));

    const reads: ReadRecord[] = (await getCollection('reads')).sort(sortReadsByAddedDesc).map((r) => ({
        slug: r.slug,
        title: r.data.title,
        authors: r.data.authors,
        kind: r.data.kind,
        shelf: r.data.shelf,
        progress: r.data.readProgress ?? null,
        readingNow: r.data.readingNow,
        readingNowOrder: r.data.readingNowOrder ?? null,
        year: r.data.publicationYear ?? null,
        source: r.data.source ?? null,
        topics: r.data.topics,
        description: (r.data.description ?? '').trim(),
        notes: cleanMarkdown(r.body),
        // Per-read pages are redirects to the external source; the shelf is the on-site home for a read.
        url: readsShelfPath(r.data.shelf),
        externalUrl: r.data.url ?? null,
        added: isoDate(r.data.addedDate)
    }));

    const ranking = (items: typeof modelRankings) =>
        items.map((i) => ({
            rank: i.rank,
            name: i.name,
            tags: i.tags.map((t) => t.label),
            summary: i.body,
            pros: i.pros ?? [],
            cons: i.cons ?? []
        }));

    const data: SiteData = {
        profile: {
            name: siteConfig.title,
            headline: about.headline,
            summary: about.intro.map(cleanMarkdown),
            facts: about.facts,
            focus: about.focus,
            principles: about.principles,
            links
        },
        experience: about.experience.map((e) => ({ ...e, location: e.location ?? null })),
        metrics: about.metrics,
        education: about.education ?? null,
        projects,
        reads,
        stack: {
            software: software.map((s) => ({
                category: s.title,
                summary: s.intro,
                items: s.rows.map((r) => ({ tools: r.label, detail: r.detail ?? '' }))
            })),
            models: ranking(modelRankings),
            modelMentions: modelHonorableMentions.map((m) => ({ name: m.name, use: m.use })),
            harnesses: ranking(harnessRankings),
            harnessMentions: harnessHonorableMentions.map((m) => ({ name: m.name, use: m.use }))
        }
    };

    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};
