import { type CollectionEntry } from 'astro:content';

export function sortItemsByDateDesc(itemA: CollectionEntry<'projects'>, itemB: CollectionEntry<'projects'>) {
    return new Date(itemB.data.publishDate).getTime() - new Date(itemA.data.publishDate).getTime();
}

export function sortReadsByAddedDesc(itemA: CollectionEntry<'reads'>, itemB: CollectionEntry<'reads'>) {
    return new Date(itemB.data.addedDate).getTime() - new Date(itemA.data.addedDate).getTime();
}

/** Homepage “reading now” strip: explicit order, then newer addedDate first. */
export function sortReadsReadingNow(itemA: CollectionEntry<'reads'>, itemB: CollectionEntry<'reads'>) {
    const oa = itemA.data.readingNowOrder ?? 999;
    const ob = itemB.data.readingNowOrder ?? 999;
    if (oa !== ob) return oa - ob;
    return sortReadsByAddedDesc(itemA, itemB);
}

