---
title: 'RoleMark'
description: RoleMark is an AI-powered resume scoring and tailoring SaaS that helps job seekers optimize resumes for specific roles, beat applicant tracking systems, and generate tailored versions and cover letters.
publishDate: 'Mar 29 2025'
lane: ai-agents
tags:
  - in-progress
seo:
  image:
    src: '/rolemark.png'
    alt: RoleMark dashboard showing resume scoring and tailoring workflow
---

![Project preview](/rolemark.png)

**Project Overview:**
RoleMark is built around a simple idea: every role deserves the right resume. Job seekers upload a resume and job description to get an instant compatibility score with actionable feedback, then generate role-specific resume versions tuned for ATS systems and hiring managers. The product also includes AI-assisted cover letters, a rich editing experience, and workflow tools to stay organized across applications.

Learn more at [app.rolemark.io](https://app.rolemark.io).

## Objectives

1. **Fast, honest fit scoring** — Give users a clear read on how well a resume matches a job description in seconds, with suggestions they can act on.
2. **Tailored outputs** — Produce versions of a resume aligned to a specific role without starting from scratch each time.
3. **End-to-end job search support** — Combine scoring, tailoring, cover letters, and organization (companies, versions) in one product.
4. **Sustainable SaaS** — Subscription and one-time purchase options via Stripe, with a clear free tier for discovery.

## Features

1. **AI resume scoring** — Upload a resume and job description for an instant compatibility score and detailed feedback.
2. **Resume tailoring** — Generate role-specific resume versions optimized for ATS parsing and relevance.
3. **Cover letter generation** — AI-generated cover letters with tone customization.
4. **Rich text editor** — Tiptap-based WYSIWYG editing with inline AI assistance.
5. **Version management** — Track multiple versions of resumes over time.
6. **Company organization** — Group and manage applications by company.
7. **Command bar** — Spotlight-style search (Cmd+K) for quick navigation across the app.

## Technology Stack

- **Frontend:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend / data:** Supabase (PostgreSQL, Auth, Storage)
- **Payments:** Stripe (subscriptions and one-time purchases)
- **AI:** Vercel AI SDK 6 with Vercel AI Gateway
- **Editor:** Tiptap (ProseMirror)

## Outcome

RoleMark ships as a production SaaS with a defined free tier (including AI scoring), paid tailoring and cover-letter flows, and billing integrated through Stripe—giving job seekers a single place to score, refine, and package their applications for specific roles.
