/** Lowercase slug for URL segments (topics, filters). */
export function slugifyTopic(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
