---
title: 'Compressor'
description: 'Compress noisy command output before it reaches an agent''s context, cutting token waste without losing the signal a coding agent actually needs.'
publishDate: 'Aug 01 2026'
lane: ai
tags:
  - planned
github: 'https://github.com/tannerbarcelos/compressor'
technologies:
  - TypeScript
  - Effect
  - Bun
seo:
  description: 'Compressor — filters noisy command output (tests, builds, installs) down to what a coding agent actually needs, before it spends context.'
---

**Note:** This project is **planned**: the repository is staked out and the problem is scoped, but implementation has not started. The write-up below describes intent, not shipped behavior.

**Project Overview:**
The biggest source of waste in an agentic coding loop isn't the conversation—it's the command output. Every test run, package install, and build spits out hundreds of lines an agent has to read: pass/fail spam, dependency chatter, environment metadata. Somewhere in there are the two or three lines that actually matter—the failing assertion, the exit code, the one warning that's load-bearing. The agent pays full price in tokens to find them, every single time.

Compressor is a CLI: you wrap a command with it, and it sits between that command and the agent reading its output. It doesn't summarize blindly or chop by length—it filters by recognizing the shape of the command that produced the output, so the reduction is targeted at what's actually noise for that command, not a generic truncation that might cut the one line that mattered.

## The Problem

- **Command output dominates waste.** Test runs, installs, and build logs are the single biggest source of redundant tokens in an agent loop—far more than conversation history or file contents.
- **Blind truncation loses the wrong thing.** Cutting output for length alone risks dropping the actual failure or next clue, which sends an agent into repeated, uninformed retries instead of fixing the real problem.
- **Context windows are a budget, not a container.** A large window doesn't help if most of it is filler; effective utilization matters more than raw size.

## Objectives

1. **Cut token waste from command output** — reduce test, install, and build logs to what an agent needs without changing the command being run.
2. **Preserve the signal, not just the length** — failures, summaries, counts, and next clues survive; everything else is safe to drop.
3. **Lower inference cost** — make compression pay for itself against the price of the tokens it removes.
4. **Stay correct under compression** — a filter that quietly drops load-bearing detail is worse than no filter at all.

## Direction

The intended shape is a set of command-aware filters rather than one generic summarizer—recognizing common command output (test runners, package managers, build tools, git) and reducing each to its own shape of signal, with a tunable aggressiveness dial and a way to verify agents don't regress once it's on.

## Technology Stack

- **Language:** TypeScript
- **Structure:** Effect, for typed errors, structured concurrency, and composable pipelines through the compression stages — a chance to use Effect for real rather than just read about it.
- **Distribution:** compiled to a single native binary via `bun build --compile`, no runtime install required on the target machine.

Tools in this space commonly ship as standalone binaries written in Go. Compressor takes the same distribution model—install one binary, wrap your commands, done—while getting there through TypeScript and Effect instead.

## Status

_Planning. Repository initialized; design and benchmarking approach are being worked out._
