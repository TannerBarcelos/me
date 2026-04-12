import { getCollection, type CollectionEntry } from 'astro:content';
import { READ_KINDS, type ReadKind } from '../data/read-kinds';
import type { ReadShelf } from '../data/read-shelves';
import { slugifyTopic } from './slugify';
import { sortReadsByAddedDesc } from './data-utils';
export type LoadReadsBrowseOptions = {
    /** When set, topic counts and lists only include reads on this shelf. */
    shelf?: ReadShelf;
};

export type TopicBrowseItem = { slug: string; label: string; count: number };

/** Format tabs in READ_KINDS order, only for kinds that appear in `reads`. */
export function kindsFromReads(reads: CollectionEntry<'reads'>[]): ReadKind[] {
    const present = new Set<ReadKind>();
    for (const r of reads) {
        present.add(r.data.kind);
    }
    return READ_KINDS.filter((k) => present.has(k));
}

/** Topic chips for a shelf — derive from the same read list you render so filters never pull in the other shelf. */
export function topicsFromReads(reads: CollectionEntry<'reads'>[]): TopicBrowseItem[] {
    const topicMap = new Map<string, { label: string; count: number }>();
    for (const r of reads) {
        for (const raw of r.data.topics) {
            const slug = slugifyTopic(raw);
            if (!slug) continue;
            const prev = topicMap.get(slug);
            const label = prev?.label ?? raw.trim();
            topicMap.set(slug, { label, count: (prev?.count ?? 0) + 1 });
        }
    }
    return [...topicMap.entries()]
        .map(([slug, { label, count }]) => ({ slug, label, count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export async function loadReadsBrowseData(options?: LoadReadsBrowseOptions): Promise<{
    readsSorted: CollectionEntry<'reads'>[];
    topics: TopicBrowseItem[];
}> {
    let reads = await getCollection('reads');
    if (options?.shelf) {
        reads = reads.filter((r) => r.data.shelf === options.shelf);
    }
    const readsSorted = reads.sort(sortReadsByAddedDesc);
    const topics = topicsFromReads(readsSorted);
    return { readsSorted, topics };
}

export type BrowseActive = { type: 'all' } | { type: 'topic'; slug: string };
