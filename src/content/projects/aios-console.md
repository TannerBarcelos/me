---
title: 'AIOS Console'
description: 'The web app that runs Visa''s ML platform: deploy, monitor, roll back, and switch traffic between fraud models across multiple data centers, all from one place.'
publishDate: '2026-10-27'
isFeatured: true
featuredOrder: 3
lane: ai
isWorkProject: true
technologies:
  - React
  - TypeScript
  - Go
tags:
  - live
---

**Note:** I built this at Visa, so some details are left out or kept general for confidentiality.

AIOS Console is the web app that operates Visa's AI platform (AIOS). The fraud models on that platform score more than **10 million transactions a day** across multiple data centers. AIOS Console is where every change to those models in production starts, gets approved, and gets watched.

## The problem

Getting a new fraud model version into production took about **45 minutes** of coordinated work across several teams. Data scientists had the model, platform engineers ran the deployment, operations watched the systems, and change management had to sign off. Each group worked from its own tools and view of the platform. At this scale, a slow or unclear change is a risk on its own: rolling back or shifting traffic away from a misbehaving model has to be fast and certain.

## What it does

AIOS Console puts the whole lifecycle in one web app, so every team sees the same platform:

- **Deploy and roll back:** Push a model version to one or more data centers and roll it back in a single step if it misbehaves.
- **Traffic switching:** Move traffic between model versions and data centers with canary releases, percentage splits, and failover.
- **Monitoring:** Live dashboards for model and service health, including latency, throughput, and alerts, next to the deployment that caused any change.
- **Registry and audit trail:** Every model version, who changed what and when, and the approvals behind each production change.

## Who uses it

- **Data scientists** promote new model versions and check how they perform once live.
- **ML platform engineers** run deployments, rollbacks, and capacity changes.
- **SRE and operations** watch health and move traffic during incidents.
- **Change management** reviews and approves production changes, with the audit trail as the record.

## My role

I was the **tech lead**. I owned the architecture and a large share of the code, and I led the team through end-to-end delivery: a React and TypeScript frontend on a Go backend that brings release automation, monitoring, and traffic switching into one deployment workflow.

## Outcome

Deployments went from **45 minutes to 5**, a reduction of about 90%. Teams that used to coordinate across separate tools now work from one shared view of the platform, and moving traffic or rolling back a model is a routine action in the app rather than an incident runbook.
