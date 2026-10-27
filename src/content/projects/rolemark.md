---
title: 'RoleMark'
description: RoleMark is an AI-powered resume scoring and tailoring product that helps job seekers optimize resumes for specific roles, beat applicant tracking systems, and generate tailored versions and cover letters. Currently being rebuilt from the ground up.
publishDate: 'Mar 29 2025'
lane: apps
tags:
  - in-progress
isFeatured: true
featuredOrder: 2
github: 'https://github.com/tannerbarcelos/rolemark'
technologies:
  - TanStack Start
  - React
  - TypeScript
  - Vite
  - Bun
seo:
  image:
    src: '/rolemark.png'
    alt: RoleMark dashboard from the first version — resume scoring and tailoring workflow
---

![RoleMark dashboard from the first version](/rolemark.png)

_The first version's scoring and tailoring dashboard._

**Note:** RoleMark is being **re-architected and rebuilt from scratch**. The first version shipped, is no longer running, and its codebase is archived. The current repository is a ground-up rewrite on a new stack, carrying forward the product thesis below.

**Project Overview:**
RoleMark is built around a simple idea: every role deserves the right resume. Job seekers upload a resume and job description to get an instant compatibility score with actionable feedback, then generate role-specific resume versions tuned for ATS systems and hiring managers. The product also includes AI-assisted cover letters, a rich editing experience, and workflow tools to stay organized across applications.

## Objectives

1. **Fast, honest fit scoring** — Give users a clear read on how well a resume matches a job description in seconds, with suggestions they can act on.
2. **Tailored outputs** — Produce versions of a resume aligned to a specific role without starting from scratch each time.
3. **End-to-end job search support** — Combine scoring, tailoring, cover letters, and organization (companies, versions) in one product.
4. **Sustainable SaaS** — Subscription and one-time purchase options, with a clear free tier for discovery.

## Features

1. **AI resume scoring** — Upload a resume and job description for an instant compatibility score and detailed feedback.
2. **Resume tailoring** — Generate role-specific resume versions optimized for ATS parsing and relevance.
3. **Cover letter generation** — AI-generated cover letters with tone customization.
4. **Rich text editor** — WYSIWYG editing with inline AI assistance.
5. **Version management** — Track multiple versions of resumes over time.
6. **Company organization** — Group and manage applications by company.
7. **Command bar** — Spotlight-style search (Cmd+K) for quick navigation across the app.

## The Rebuild

The first version was a Next.js App Router app on Supabase with Stripe billing and a Tiptap-based editor. It proved the product out, then came down—the rewrite is a re-architecture rather than a refactor, trading that foundation for a lighter, faster one while keeping the parts that earned their place.

## Technology Stack

- **Framework:** TanStack Start with TanStack Router (file-based routing, generated route tree)
- **UI:** React 19, TypeScript
- **Build & tooling:** Vite, Bun, oxlint, oxfmt
- **AI:** LLM-backed scoring, tailoring, and cover letter generation

## Outcome

_The original version shipped with AI scoring, paid tailoring and cover-letter flows, and integrated billing. It is no longer running, and the product is being re-architected and rebuilt on a new foundation._
