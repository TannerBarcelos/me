import { defineCollection, z } from 'astro:content';
import { READ_KINDS, type ReadKind } from '../data/read-kinds';
import { READ_SHELVES, type ReadShelf } from '../data/read-shelves';
import { PROJECT_LANES, type ProjectLane } from '../data/project-lanes';
import { PROJECT_TAG_IDS, type ProjectTagId } from '../data/project-tags';

const readKindSchema = z.enum(READ_KINDS as [ReadKind, ...ReadKind[]]);
const readShelfSchema = z.enum(READ_SHELVES as [ReadShelf, ...ReadShelf[]]);
const readProgressSchema = z.enum(['reading', 'finished', 'queued']);

const projectLaneSchema = z.enum(PROJECT_LANES as [ProjectLane, ...ProjectLane[]]);
const projectTagIdSchema = z.enum(PROJECT_TAG_IDS as [ProjectTagId, ...ProjectTagId[]]);

const seoSchema = z.object({
    title: z.string().min(5).max(120).optional(),
    description: z.string().min(15).max(160).optional(),
    image: z
        .object({
            src: z.string(),
            alt: z.string().optional()
        })
        .optional(),
    pageType: z.enum(['website', 'article']).default('website')
});

const pages = defineCollection({
    schema: z.object({
        title: z.string(),
        seo: seoSchema.optional()
    })
});

const projects = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        publishDate: z.coerce.date(),
        isFeatured: z.boolean().default(false),
        /** Apps vs AI & agents — drives the two lane tabs on the projects page. */
        lane: projectLaneSchema.default('apps'),
        tags: z.array(projectTagIdSchema).min(1).default(['planned']),
        seo: seoSchema.optional()
    })
});

const reads = defineCollection({
    schema: z.object({
        title: z.string(),
        authors: z.array(z.string()).min(1),
        kind: readKindSchema,
        /** Technical vs leisure — drives the two shelf tabs on the bookshelf. */
        shelf: readShelfSchema.default('technical'),
        /** Canonical / purchase / original link */
        url: z.string().url().optional(),
        /** Venue or publisher, e.g. O'Reilly, ACM Queue */
        source: z.string().optional(),
        publicationYear: z.number().int().min(1000).max(2100).optional(),
        /** When you added it to this list (used for default sort) */
        addedDate: z.coerce.date(),
        /** Free-form facets for browsing at scale */
        topics: z.array(z.string()).default([]),
        description: z.string().optional(),
        /** Leisure (or any) progress chip on the shelf — optional. */
        readProgress: readProgressSchema.optional(),
        /** Show on homepage under “what I’m reading”. */
        readingNow: z.boolean().default(false),
        /** Lower numbers first; ties fall back to added date (newer first). */
        readingNowOrder: z.number().int().optional(),
        seo: seoSchema.optional()
    })
});

export const collections = { pages, projects, reads };
