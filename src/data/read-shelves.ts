/**
 * Valid `?shelf=` values wherever the bookshelf tabs appear. To add a shelf:
 * append an id here and a label in `readShelfTabLabel`, extend the reads schema if needed,
 * then add a matching `<BookshelfShelfPanel shelf="…">` on each bookshelf page.
 */
export const READ_SHELVES = ['technical', 'leisure'] as const;

export type ReadShelf = (typeof READ_SHELVES)[number];

/** Default when `?shelf=` is missing or invalid — keep in sync with the first tab you want as the landing view. */
export const DEFAULT_READ_SHELF: ReadShelf = 'technical';

const shelfSet = new Set<string>(READ_SHELVES);

/** Parse `?shelf=` for bookshelf UI (static pages; use on the client or when building links). */
export function parseShelfFromQuery(value: string | null | undefined): ReadShelf {
    if (value != null && shelfSet.has(value)) return value as ReadShelf;
    return DEFAULT_READ_SHELF;
}

/** Short labels for tab controls (sharp / mono styling applied in components). */
export const readShelfTabLabel: Record<ReadShelf, string> = {
    technical: 'Technical',
    leisure: 'Leisure'
};
