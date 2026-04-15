/**
 * Valid project lane ids for the “Things I’ve built” tabs (Apps vs AI & agents).
 * To add a lane: append an id here and a label in `projectLaneTabLabel`, extend the projects schema,
 * then add a matching tab link in `ProjectsLaneToggle.astro`.
 */
export const PROJECT_LANES = ['apps', 'ai-agents'] as const;

export type ProjectLane = (typeof PROJECT_LANES)[number];

export const DEFAULT_PROJECT_LANE: ProjectLane = 'apps';

const laneSet = new Set<string>(PROJECT_LANES);

export function parseProjectLaneFromParam(value: string | undefined): ProjectLane {
    if (value != null && laneSet.has(value)) return value as ProjectLane;
    return DEFAULT_PROJECT_LANE;
}

/** Short labels for tab controls (sharp / mono styling applied in components). */
export const projectLaneTabLabel: Record<ProjectLane, string> = {
    apps: 'Apps',
    'ai-agents': 'AI & agents'
};

export function projectLanePath(lane: ProjectLane): string {
    return `/projects/lane/${lane}/`;
}
