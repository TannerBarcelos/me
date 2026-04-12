import type { ReadKind } from '../data/read-kinds';
import type { ReadShelf } from '../data/read-shelves';

const READ_LINK_BASE = 'https://reads-link.invalid';

/** Normalize path for bookshelf URLs (trailing slash on paths other than `/`). */
export function normalizeReadsPathname(pathname: string): string {
    if (!pathname || pathname === '/') return '/';
    return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export type ReadsBrowseQuery = {
    shelf?: ReadShelf;
    /** When set, adds `kind=`; when omitted, removes `kind` from the query string. */
    kind?: ReadKind;
};

/**
 * Build `pathname` + `?shelf=` + optional `kind=` (replaces existing values; omits `kind` when not in `query`).
 */
export function withReadsBrowseQuery(pathname: string, query: ReadsBrowseQuery): string {
    const u = new URL(normalizeReadsPathname(pathname), READ_LINK_BASE);
    if (query.shelf !== undefined) {
        u.searchParams.set('shelf', query.shelf);
    }
    if (query.kind !== undefined) {
        u.searchParams.set('kind', query.kind);
    } else {
        u.searchParams.delete('kind');
    }
    return u.pathname + u.search + u.hash;
}

/**
 * Set or replace `shelf` on a path-style href (preserves other query keys except when rebuilding).
 * Prefer `withReadsBrowseQuery` when also controlling `kind`.
 */
export function withReadsShelfQuery(href: string, shelf?: ReadShelf): string {
    if (!shelf) return href;
    const u = new URL(href, READ_LINK_BASE);
    u.searchParams.set('shelf', shelf);
    return u.pathname + u.search + u.hash;
}
