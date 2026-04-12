import { getCollection, type CollectionEntry } from 'astro:content';
import type { ReadShelf } from '../data/read-shelves';
import { slugifyTopic } from './slugify';
import { sortReadsByAddedDesc } from './data-utils';
export type LoadReadsBrowseOptions = {
    /** When set, topic counts and lists only include reads on this shelf. */
    shelf?: ReadShelf;
};

export type TopicBrowseItem = { slug: string; label: string; count: number };

export async function loadReadsBrowseData(options?: LoadReadsBrowseOptions): Promise<{
    readsSorted: CollectionEntry<'reads'>[];
    topics: TopicBrowseItem[];
}> {
    let reads = await getCollection('reads');
    if (options?.shelf) {
        reads = reads.filter((r) => r.data.shelf === options.shelf);
    }
    const readsSorted = reads.sort(sortReadsByAddedDesc);

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

    const topics = [...topicMap.entries()]
        .map(([slug, { label, count }]) => ({ slug, label, count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

    return { readsSorted, topics };
}

export type BrowseActive = { type: 'all' } | { type: 'topic'; slug: string };
