---
title: About
seo:
  title: About — Tanner Barcelos
  description: Senior full-stack engineer at Visa building ML platform software, plus tools for coding agents and native Apple apps.
about:
  headline: I build the software that ML teams use to ship models to production.
  intro:
    - |
      I'm Tanner, a **senior full-stack engineer** on the **AI Studio** team at **Visa**. I work across the whole stack: React frontends, GraphQL and REST APIs, and Go services that run deployments across multiple data centers. The people I build for are data scientists and ML engineers who need to get fraud models into production quickly and safely.
    - |
      Outside of Visa I build developer tools for coding agents and native apps for iPhone, iPad, and Mac. I read a lot, both technical books and fiction, and I keep the list on my [bookshelf](/reads/shelf/technical/).
  facts:
    - label: Role
      value: Senior Full Stack Engineer
    - label: Team
      value: AI Studio, Visa
    - label: Based in
      value: San Jose, CA
    - label: Shipping since
      value: '2021'
  metrics:
    - value: 10M+
      label: transactions a day scored by the fraud models Control Plane manages
    - value: 45 → 5 min
      label: time to get a model version into production
    - value: 200+
      label: data scientists and ML engineers on the platform I lead
    - value: 8s → 1.2s
      label: page loads after the GraphQL federation gateway
  focus:
    - title: ML platform engineering
      body: At Visa I own the Control Plane for our ML platform and lead the team building Nexus AI, which brings five internal systems into one platform. Most of my work is turning slow, multi-team processes into a single tool everyone trusts.
      projects:
        - control-plane
        - bi-secretary
    - title: Tools for coding agents
      body: I use coding agents every day, and I build tools for the gaps I run into, like keeping track of many agent sessions at once or cutting noisy command output before it fills an agent's context.
      projects:
        - relay
        - compressor
        - kiln
    - title: Native Apple apps
      body: On the side I build Swift and SwiftUI apps that work offline and don't need an account, starting with a camping trip planner and a podcast player.
      projects:
        - roamready
        - seeker
  principles:
    - title: Own the whole path
      body: Schema, API, interface, deploy pipeline. Holding the full picture is how I find the fix that one layer alone would miss.
    - title: Measure before and after
      body: Deploy time, page load, time to recover from incidents. If I can't say what improved and by how much, I'm not finished.
    - title: Write it down
      body: Design reviews, migration guides, and clear standards scale further than I can. They're how six teams moved to TanStack and Vite together.
    - title: Build with agents, carefully
      body: AI is part of how I design, review, and ship every day. I hold the output to the same bar as my own code. My current setup is on the [stack page](/stack).
  experience:
    - company: Visa
      role: Senior Full Stack Engineer · AI Studio
      period: Feb 2022 – Present
      location: Foster City, CA
      highlights:
        - Own the ML platform Control Plane, which deploys, monitors, and rolls back fraud models across data centers. Cut deployment time from 45 minutes to 5.
        - Lead the team building Nexus AI, a single platform that brings 5 internal systems together for 200+ data scientists and ML engineers.
        - Wrote and maintain the GraphQL federation gateway across 5 microservices. Page loads dropped from 8s to 1.2s.
        - Built Go services that orchestrate Kubernetes and Nomad across data centers. 95% of releases are now automated, and time to recover from incidents fell from 4 hours to 8 minutes.
        - Led the move to TanStack and Vite across 6 teams and built a design system of 80+ accessible components used in 30+ apps.
    - company: Scalable Commerce
      role: Frontend Engineer
      period: Apr 2021 – Feb 2022
      location: Santa Barbara, CA
      highlights:
        - Built a real-time React and TypeScript CRM handling 10K+ support tickets a day.
        - Redesigned onboarding as a multi-step flow, raising retention 18%.
        - Set up CI/CD with GitHub Actions and Docker, moving from weekly to daily deploys.
  education:
    school: California State University, East Bay
    degree: B.S. Computer Science
    year: '2021'
---
