# AGENTS.md — instructions for coding agents

## Badge and status styling (required)

This site uses a **sharp-corner** design language for small labels—not rounded pill chips.

1. **Do not** use `rounded`, `rounded-sm`, `rounded-md`, or `rounded-full` on:
   - project status tags,
   - read format (book / article / …) tags,
   - topic chips next to read entries,
   - format/topic filter controls in the reads browse strip (unless an unrelated control explicitly needs radius).

2. **Do** align with existing chips:
   - Wrapper classes: `font-mono text-xs px-1.5 py-0.5 leading-tight`
   - Full border + tinted background + dark-mode pairs, as in [`src/data/project-tags.ts`](src/data/project-tags.ts) and [`src/data/read-kinds.ts`](src/data/read-kinds.ts).

3. **Adding** a new category badge: extend the relevant config object with the same Tailwind structure as an existing entry (e.g. `live` or `book`), including `dark:` rules.

4. **Files to check** when touching reads UI: [`src/components/ReadPreview.astro`](src/components/ReadPreview.astro), [`src/pages/reads/[slug].astro`](src/pages/reads/[slug].astro), [`src/components/ReadsBrowseStrip.astro`](src/components/ReadsBrowseStrip.astro).

5. **Files to check** when touching project UI: [`src/components/ProjectPreview.astro`](src/components/ProjectPreview.astro), [`src/pages/projects/[slug].astro`](src/pages/projects/[slug].astro), [`src/data/project-tags.ts`](src/data/project-tags.ts).

Stack: Astro 5, Tailwind 3, content collections under `src/content/`.
