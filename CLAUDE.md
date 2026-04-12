# CLAUDE.md — agent notes for this repo

Personal site (Astro): projects, reads, pages.

## UI: sharp badge / status language

Categorical tags (project **status**, read **kind**, secondary **topic** chips on reads) use a **sharp-edged** system—not rounded pills.

**Pattern** (match existing implementations before inventing new styles):

- **Typography:** `font-mono text-xs` (topic row may use `text-[0.65rem]` + uppercase for topics only).
- **Box:** `px-1.5 py-0.5 leading-tight` — **no `rounded` / `rounded-*`** on these chips.
- **Look:** `border` + low-opacity background + semantic `text-*` / `border-*`, with **dark:** variants mirroring project tags (see [`src/data/project-tags.ts`](src/data/project-tags.ts)).
- **Read formats** (book, article, …): use [`src/data/read-kinds.ts`](src/data/read-kinds.ts) — same structural classes as project statuses, distinct hue per kind.
- **Browse / filter links** on reads ([`src/components/ReadsBrowseStrip.astro`](src/components/ReadsBrowseStrip.astro)): same sharp treatment (`leading-tight`, no rounded) for consistency.

When adding a new badge type, **copy the pattern from `projectTagConfig` or `kindBadgeConfig`** (border width/fractions, bg opacity, dark mode) instead of introducing `rounded`, soft fills, or ad-hoc Tailwind.

## Content collections

- Projects: [`src/content/projects/`](src/content/projects/), tags in [`src/data/project-tags.ts`](src/data/project-tags.ts).
- Reads: [`src/content/reads/`](src/content/reads/), kinds in [`src/data/read-kinds.ts`](src/data/read-kinds.ts).
