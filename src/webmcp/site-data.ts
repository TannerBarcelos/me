/**
 * Shape of `/webmcp.json`: a build-time snapshot of the site's content collections
 * that the in-browser WebMCP tools query. Everything here is authored by the site owner.
 */
import type { ProjectLane } from '../data/project-lanes';
import type { ProjectTagId } from '../data/project-tags';
import type { ReadKind } from '../data/read-kinds';
import type { ReadShelf } from '../data/read-shelves';
import type { ReadProgress } from '../data/read-progress';

export type ContentSection = { heading: string; text: string };

export type ProjectRecord = {
    slug: string;
    title: string;
    description: string;
    url: string;
    lane: ProjectLane;
    statuses: ProjectTagId[];
    technologies: string[];
    isWorkProject: boolean;
    isFeatured: boolean;
    featuredOrder: number | null;
    github: string | null;
    published: string;
    /** Markdown body split at `##` / `###` headings; the first section's heading is "Overview". */
    sections: ContentSection[];
};

export type ReadRecord = {
    slug: string;
    title: string;
    authors: string[];
    kind: ReadKind;
    shelf: ReadShelf;
    progress: ReadProgress | null;
    readingNow: boolean;
    readingNowOrder: number | null;
    year: number | null;
    source: string | null;
    topics: string[];
    description: string;
    notes: string;
    /** On-site bookshelf page that lists this read. */
    url: string;
    externalUrl: string | null;
    added: string;
};

export type ExperienceRecord = {
    company: string;
    role: string;
    period: string;
    location: string | null;
    highlights: string[];
};

export type StackRanking = { rank: string; name: string; tags: string[]; summary: string; pros: string[]; cons: string[] };
export type StackMention = { name: string; use: string };

export type SiteData = {
    profile: {
        name: string;
        headline: string;
        summary: string[];
        facts: { label: string; value: string }[];
        focus: { title: string; body: string; projects: string[] }[];
        principles: { title: string; body: string }[];
        links: { label: string; url: string }[];
    };
    experience: ExperienceRecord[];
    metrics: { value: string; label: string }[];
    education: { school: string; degree: string; year: string } | null;
    projects: ProjectRecord[];
    reads: ReadRecord[];
    stack: {
        software: { category: string; summary: string; items: { tools: string; detail: string }[] }[];
        models: StackRanking[];
        modelMentions: StackMention[];
        harnesses: StackRanking[];
        harnessMentions: StackMention[];
    };
};
