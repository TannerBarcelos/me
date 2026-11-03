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

## WebMCP tools (in-browser AI agents)

The site registers [WebMCP](https://webmachinelearning.github.io/webmcp/) tools on `document.modelContext` so browser agents can query it without scraping.

- **Tool contract:** [`webmcp/schema.json`](webmcp/schema.json) — names, descriptions, input schemas, annotations. The client imports this file directly, so edit tool metadata **here only**. Evals live next to it in [`webmcp/evals.json`](webmcp/evals.json) (`npx webmcp-evals local -t webmcp/schema.json -e webmcp/evals.json`).
- **Handlers:** [`src/webmcp/register-tools.ts`](src/webmcp/register-tools.ts), loaded once from `BaseLayout.astro` (persists across `ClientRouter` navigations).
- **Data:** [`src/pages/webmcp.json.ts`](src/pages/webmcp.json.ts) emits `/webmcp.json` at build time from the content collections, `about.md`, `site-config.ts`, and [`src/data/stack.ts`](src/data/stack.ts) (Stack page content lives there now, not inline in `stack.astro`).
- **Tests:** `npm test` runs the deterministic tool tests in [`src/webmcp/register-tools.test.ts`](src/webmcp/register-tools.test.ts) (mocks `registerTool`, calls each `execute`). Run `npm run build` first to include the output-budget checks against the real `dist/webmcp.json`.
- **Rules:** keep every tool response ≤ 1,500 chars (paginate / clip), resolve errors as `{ error, code, retryable, suggestion }` instead of throwing, only set annotations that are `true`, and match search words as whole words (never substrings: "go" must not match "mongodb"). Adding a new content field? Expose it in `webmcp.json.ts` + `site-data.ts` if agents should see it.
