import type { ReadKind } from '../data/read-kinds';
import type { ReadShelf } from '../data/read-shelves';

const READ_LINK_BASE = 'https://reads-link.invalid';

/** Normalize path for bookshelf URLs (trailing slash on paths other than `/`). */
export function normalizeReadsPathname(pathname: string): string {
    if (!pathname || pathname === '/') return '/';
    return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function readsShelfPath(shelf: ReadShelf): string {
    return `/reads/shelf/${shelf}/`;
}

/** When pathname is `/reads/shelf/<shelf>/`, returns that shelf (for query-free URLs). */
export function readsPathShelf(pathname: string): ReadShelf | undefined {
    const base = pathname.replace(/\/+$/, '') || '/';
    const m = base.match(/^\/reads\/shelf\/(technical|leisure)$/);
    return m ? (m[1] as ReadShelf) : undefined;
}

export type ReadsBrowseQuery = {
    /** Only applied when pathname is not already `/reads/shelf/<shelf>/`. */
    shelf?: ReadShelf;
    /** When set, adds `kind=`; when omitted, removes `kind` from the query string. */
    kind?: ReadKind;
    /** Topic slug; when set adds `topic=`; when omitted, removes `topic`. */
    topic?: string;
};

/**
 * Build `pathname` + query for browse filters. On `/reads/shelf/<shelf>/`, `shelf` is not * duplicated in the query string; use `?kind=` and `?topic=` only.
 */
export function withReadsBrowseQuery(pathname: string, query: ReadsBrowseQuery): string {
    const u = new URL(normalizeReadsPathname(pathname), READ_LINK_BASE);
    const pathShelf = readsPathShelf(pathname);

    if (pathShelf === undefined && query.shelf !== undefined) {
        u.searchParams.set('shelf', query.shelf);
    }

    if (query.kind !== undefined) {
        u.searchParams.set('kind', query.kind);
    } else {
        u.searchParams.delete('kind');
    }

    if (query.topic !== undefined && query.topic !== '') {
        u.searchParams.set('topic', query.topic);
    } else {
        u.searchParams.delete('topic');
    }

    return u.pathname + u.search + u.hash;
}

/**
 * Set or replace `shelf` on a path-style href (preserves other query keys except when rebuilding).
 * Prefer `withReadsBrowseQuery` when also controlling `kind` / `topic`.
 */
export function withReadsShelfQuery(href: string, shelf?: ReadShelf): string {
    if (!shelf) return href;
    const u = new URL(href, READ_LINK_BASE);
    if (readsPathShelf(u.pathname) !== undefined) {
        u.pathname = readsShelfPath(shelf);
        return u.pathname + u.search + u.hash;
    }
    u.searchParams.set('shelf', shelf);
    return u.pathname + u.search + u.hash;
}
