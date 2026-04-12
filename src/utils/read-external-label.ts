/** Human-readable site name for “View on …” from a read’s external URL. */
const HOST_LABELS: Record<string, string> = {
    'amazon.com': 'Amazon',
    'www.amazon.com': 'Amazon',
    'goodreads.com': 'Goodreads',
    'github.com': 'GitHub',
    'raw.githubusercontent.com': 'GitHub'
};

export function externalLinkSiteLabel(url: string): string {
    try {
        const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
        if (HOST_LABELS[host]) return HOST_LABELS[host];
        const first = host.split('.')[0];
        if (first && first !== 'www') return first.charAt(0).toUpperCase() + first.slice(1);
        return host;
    } catch {
        return 'link';
    }
}
