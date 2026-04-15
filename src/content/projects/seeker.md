---
title: 'Seeker'
description: 'A new way to enjoy podcasts. Multi-queue playback so you never lose your place, plus agentic features like natural-language show discovery and queue playground.'
publishDate: 'Apr 14 2026'
tags:
  - planned
seo:
  description: 'Seeker — a podcast player built around multi-queue playback and AI-powered discovery. Switch between unrelated shows without losing your place.'
  image:
    src: '/seeker.jpeg'
    alt: Project preview
---

**Note:** This project is **planned**: design and architecture are underway but development has not started yet.

**Project Overview:**
Seeker is a podcast player that rethinks how listeners manage what they're hearing. Traditional apps force every show into a single now-playing queue—switch from a work podcast to something casual and you lose your spot, your up-next list gets shuffled, and you're left digging through history to pick up where you left off. Seeker solves this with **multi-queue playback**: each queue is an independent lane with its own now-playing, progress, and up-next list, so jumping between unrelated shows is instant and non-destructive.

## The Problem

Every major podcast player—Apple Podcasts, Spotify, Overcast, Pocket Casts—uses a single-queue model. That works fine when you listen to one show at a time, but real listening habits are messier:

- A commuter queues up industry news for the drive, then switches to a comedy show at the gym.
- A student lines up lecture recaps for study sessions but wants a true-crime binge on weekends.
- Anyone who taps play on a new episode mid-queue watches their carefully ordered list get replaced or reordered.

In each case the listener has to manually re-find, re-order, or re-start episodes because the app assumes one queue is enough.

## Core Concepts

### Multi-Queue Playback

- Create named queues (e.g. "Work", "Wind Down", "Road Trip").
- Each queue maintains its own now-playing episode, playback position, and up-next list.
- Switching queues instantly resumes from where you left off—no searching, no re-ordering.
- Queues can be pinned, archived, or set to auto-populate from subscriptions.

### Agentic Capabilities

Seeker layers AI on top of the listening experience:

- **Natural-Language Discovery** — describe what you're in the mood for ("something about the history of bridges" or "a funny interview with a chef") and Seeker surfaces matching episodes across the catalog.
- **Queue Playground** — an interactive sandbox where an agent can suggest, re-order, or remix your queue based on mood, topic, or time budget ("build me a 45-minute commute queue on AI news").
- **Smart Summaries** — get episode digests before you commit to listening, powered by transcript analysis.
- **Cross-Queue Insights** — surface connections between episodes across different queues ("the guest on your Work queue also appeared in this Wind Down episode").

## Planned Features

1. **Queue Management** — create, rename, reorder, pin, and archive independent playback queues.
2. **Seamless Queue Switching** — one tap to jump between queues with full state preservation.
3. **Subscription Routing** — assign shows to default queues so new episodes land in the right lane automatically.
4. **Natural-Language Search** — find shows and episodes by describing what you want, not just by title or keyword.
5. **Queue Playground** — let the AI agent build, remix, or optimize a queue for a given context.
6. **Episode Summaries** — AI-generated digests from transcripts so you can decide what's worth your time.
7. **Playback Sync** — seamless handoff across devices with per-queue state.
8. **Import & Migration** — bring your subscriptions and history from Apple Podcasts, Spotify, and OPML feeds.

## Technology Stack (Planned)

- Frontend: React Native (iOS & Android), Expo
- Backend: Node.js, Hono
- Database: Postgres (Supabase), Vector Store (Supabase)
- AI Integration: OpenAI, Vercel AI SDK
- Audio: Expo AV / custom playback engine

## Outcome

_In the planning phase—architecture and design work is in progress._
