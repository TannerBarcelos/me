/** Allowed project status / phase tags (order in frontmatter controls display order). */
export const PROJECT_TAG_IDS = ['live', 'in-progress', 'paused', 'planned'] as const;
export type ProjectTagId = (typeof PROJECT_TAG_IDS)[number];

export const projectTagConfig: Record<ProjectTagId, { label: string; classes: string }> = {
    live: {
        label: 'live',
        classes:
            'border border-emerald-600/35 bg-emerald-500/[0.06] text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/[0.05] dark:text-emerald-400'
    },
    'in-progress': {
        label: 'in progress',
        classes:
            'border border-violet-600/35 bg-violet-500/[0.06] text-violet-700 dark:border-violet-400/25 dark:bg-violet-400/[0.05] dark:text-violet-400'
    },
    paused: {
        label: 'paused',
        classes:
            'border border-amber-600/35 bg-amber-500/[0.06] text-amber-800 dark:border-amber-400/25 dark:bg-amber-400/[0.08] dark:text-amber-300'
    },
    planned: {
        label: 'planned',
        classes:
            'border border-zinc-500/30 bg-zinc-400/[0.05] text-zinc-500 dark:border-zinc-500/25 dark:bg-zinc-400/[0.04] dark:text-zinc-500'
    }
};

/** Maps tag ids to badge props; dedupes while preserving first-seen order. */
export function projectTagsToBadges(ids: ProjectTagId[]) {
    const seen = new Set<ProjectTagId>();
    const out: { label: string; classes: string }[] = [];
    for (const id of ids) {
        if (seen.has(id)) continue;
        seen.add(id);
        out.push(projectTagConfig[id]);
    }
    return out;
}
