export const READ_PROGRESS_IDS = ['reading', 'finished', 'queued'] as const;

export type ReadProgress = (typeof READ_PROGRESS_IDS)[number];

/** Sharp chips — same language as kind / project tags. */
const readProgressBadgeConfig: Record<ReadProgress, { label: string; classes: string }> = {
    reading: {
        label: 'Reading',
        classes:
            'border border-emerald-600/35 bg-emerald-500/[0.06] text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-400/[0.06] dark:text-emerald-300'
    },
    finished: {
        label: 'Finished',
        classes:
            'border border-slate-500/35 bg-slate-400/[0.06] text-slate-800 dark:border-slate-400/25 dark:bg-slate-400/[0.06] dark:text-slate-300'
    },
    queued: {
        label: 'Up next',
        classes:
            'border border-amber-600/35 bg-amber-500/[0.06] text-amber-900 dark:border-amber-400/25 dark:bg-amber-400/[0.08] dark:text-amber-200'
    }
};

export function readProgressToBadge(progress: ReadProgress | undefined): { label: string; classes: string } | null {
    if (!progress) return null;
    return readProgressBadgeConfig[progress];
}
