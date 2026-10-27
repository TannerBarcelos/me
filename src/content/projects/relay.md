---
title: 'Relay'
description: 'A native macOS control plane for agentic software. Relay turns scattered agent sessions into a single prioritized inbox: what finished, what failed, what is blocked, and what needs your approval.'
publishDate: 'Aug 04 2026'
lane: apps
tags:
  - in-progress
github: 'https://github.com/tannerbarcelos/relay'
technologies:
  - Swift
  - SwiftUI
  - AppKit
seo:
  description: 'Relay — a native macOS control plane for running, reviewing, and approving coding agents, organized around an agent inbox.'
---

**Note:** Relay is in **early development**—architecture and first vertical slice. It is not ready for production use.

**Project Overview:**
Coding agents keep getting more capable, but operating them is still fragmented across terminal windows, editor extensions, isolated sessions, shell scripts, provider-specific UIs, and half a dozen repositories and branches. The developer ends up as the scheduler: remembering what each agent is doing, which project it belongs to, what completed, what failed, what is blocked, what needs approval, and what should happen next.

Relay removes that mental burden. It does not replace coding agents—it is the system for operating them.

## The Agent Inbox

Relay organizes agent activity around one question:

> **What needs my attention right now?**

When an agent finishes work, hits a failure, requests approval, becomes blocked, or needs direction, Relay creates a durable inbox item explaining what happened, which project and session it belongs to, why you're being pulled in, what changed, and which actions are available.

Inbox items cover completed work ready for review, approval requests, failed tasks, blocked sessions, questions from agents, validation results, and sessions waiting on another instruction. Available actions include open session, review summary, open diff, approve, reject, retry, continue, and archive.

The inbox is not a chronological stream of every event—it's a prioritized queue of unresolved human attention. Operating many agents should feel calmer than operating one manually.

## Product Principles

1. **Attention over activity** — Most agent events don't need a human. Keep routine work in the background and surface only what requires awareness, judgment, or action.
2. **Local first** — Meaningful value without an account or hosted service. Repositories, sessions, process output, and execution history stay local unless remote capabilities are explicitly enabled.
3. **Agent agnostic** — No dependence on a single model provider, coding agent, or orchestration framework. Agents integrate through adapters that map their execution into a shared Relay model while preserving provider-specific capabilities.
4. **Human control** — Agents stay interruptible and reviewable: approve, reject, pause, cancel, retry, redirect, continue. Automation increases leverage without removing authority.
5. **Minimal interface** — Complexity is exposed progressively. The primary structure stays `Inbox → Projects → Sessions → Active Work`, with advanced controls behind native menus, keyboard commands, inspectors, and context menus.

## Native by Design

Relay is built with Swift, SwiftUI, and AppKit—not a web app packaged in a desktop shell. That means fast startup, responsive interaction, native menus, keyboard-first workflows, platform-standard navigation, predictable window behavior, accessibility, native text handling, and restrained animation. It should feel closer to Apple Notes, Finder, or Xcode than to a browser-based control panel.

## Roadmap

The build is sequenced so each phase is usable on its own:

1. **Native application shell** — windows, navigation, project and session lists, local state.
2. **Single-agent execution** — one end-to-end workflow: configure an agent, connect a repository, stream output, preserve session history.
3. **Structured execution** — turn raw terminal output into execution events that separate messages, tool activity, and failures.
4. **Agent inbox** — convert execution results into actionable, prioritized items.
5. **Repository awareness** — modified files, diffs, and repo state alongside session activity.
6. **Human approval** — approval workflows, execution pausing, configurable policies for consequential actions.
7. **Multiple sessions and agents** — concurrency, resource supervision, cross-project inbox aggregation.
8. **Attention refinement** — deduplication, snoozing, priority rules, summarization to cut noise.
9. **Remote access** — authenticated pairing and encrypted event streaming from iPhone and iPad.
10. **Headless runtime** — execution separated from the desktop UI, for background and remote-machine operation.

## Non-Goals

Relay is deliberately not a code editor or IDE, a model provider, an agent framework, a hosted cloud platform, a general-purpose workflow engine, an autonomous development system, an org-wide governance platform, a cross-platform desktop app, a replacement for Git or existing coding agents, or a universal developer notification center.

## Technology Stack

- **Platform:** macOS (local-first, macOS-only for the initial release)
- **Language & UI:** Swift, SwiftUI, AppKit
- **Concurrency:** Swift Concurrency
- **Tooling:** Swift Package Manager
- **Persistence:** Local storage

## Outcome

_Early implementation. APIs, internal structures, integrations, and product scope are all expected to change._
