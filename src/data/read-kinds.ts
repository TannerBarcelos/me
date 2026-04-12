export const READ_KINDS = ['book', 'article', 'essay', 'newsletter', 'paper', 'other'] as const;
export type ReadKind = (typeof READ_KINDS)[number];

/**
 * Read format badges — same visual language as project status tags (`project-tags.ts`):
 * sharp corners (no border-radius), font-mono text-xs, px-1.5 py-0.5 leading-tight,
 * bordered + low-opacity fill + paired dark-mode border/text.
 */
const kindBadgeConfig: Record<ReadKind, { label: string; classes: string }> = {
    book: {
        label: 'book',
        classes:
            'border border-sky-600/35 bg-sky-500/[0.06] text-sky-800 dark:border-sky-400/25 dark:bg-sky-400/[0.06] dark:text-sky-300'
    },
    article: {
        label: 'article',
        classes:
            'border border-cyan-600/35 bg-cyan-500/[0.06] text-cyan-800 dark:border-cyan-400/25 dark:bg-cyan-400/[0.06] dark:text-cyan-300'
    },
    essay: {
        label: 'essay',
        classes:
            'border border-indigo-600/35 bg-indigo-500/[0.06] text-indigo-800 dark:border-indigo-400/25 dark:bg-indigo-400/[0.06] dark:text-indigo-300'
    },
    newsletter: {
        label: 'newsletter',
        classes:
            'border border-orange-600/35 bg-orange-500/[0.06] text-orange-800 dark:border-orange-400/25 dark:bg-orange-400/[0.08] dark:text-orange-300'
    },
    paper: {
        label: 'paper',
        classes:
            'border border-violet-600/35 bg-violet-500/[0.06] text-violet-800 dark:border-violet-400/25 dark:bg-violet-400/[0.06] dark:text-violet-300'
    },
    other: {
        label: 'other',
        classes:
            'border border-zinc-500/30 bg-zinc-400/[0.05] text-zinc-600 dark:border-zinc-500/25 dark:bg-zinc-400/[0.04] dark:text-zinc-400'
    }
};

export function readKindToBadge(kind: ReadKind): { label: string; classes: string } {
    return kindBadgeConfig[kind];
}
