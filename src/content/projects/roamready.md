---
title: 'RoamReady'
description: 'A native camping trip planner for iPhone, iPad, and Mac. Rig, checklists, bookings, manuals, and memories in one place, offline and with no account. Now in beta.'
publishDate: '2026-10-27'
isFeatured: true
featuredOrder: 1
lane: apps
github: 'https://github.com/TannerBarcelos/RoamReady'
technologies:
  - Swift
  - SwiftUI
  - SwiftData
  - CloudKit
  - Foundation Models
  - SQLite
tags:
  - beta
seo:
  image:
    src: '/roamready-home.png'
    alt: RoamReady Home screen showing the next trip, checklist progress, and upcoming trips
---

<img src="/roamready-home.png" alt="RoamReady Home screen showing the next trip, checklist progress, and upcoming trips" width="552" height="1200" style="width: 100%; max-width: 300px; height: auto; margin-inline: auto;" />

**Status:** RoamReady is in **beta on TestFlight**, with testers on it now. The App Store release will be a **$4.99 one-time purchase**: no subscription, no in-app purchases, no ads. Want to try it before launch? [Get in touch](/contact) and I'll send you an invite.

## Why I built it

I built RoamReady for my own camping trips. Before every trip, the same details were scattered everywhere: the setup steps for the rig lived in my head or in a notes app, the reservation was buried in an email, and the manual for the water heater was a PDF I couldn't open once I lost signal at camp. Each trip started with digging through all of it again.

RoamReady puts it in one place and keeps it on the device, so it still works at the campsite, where you need it most and where reception often runs out.

## What it does

- **Your rig:** Save your rig's details, setup notes, photo or emoji, and optional VIN and plate. When you replace a rig, past trips still show the one you took.
- **Trips and bookings:** Record the campground, dates, site details, check-in times, booking links, and confirmation paperwork. RoamReady tracks your reservation; it doesn't make bookings.
- **Setup and teardown checklists:** Start from lists tailored to your rig and equipment, with Reminders-style priorities and notes. Each trip gets its own copy, so checking off steps on one trip never changes your defaults.
- **Documents:** Keep manuals, insurance, registration, and confirmations as PDFs or images, available offline.
- **Memories:** Save campsite photos, captions, site notes, and a return-or-avoid rating, so your next visit starts with what you learned last time.
- **Camp Finder and weather:** Search campgrounds and RV parks through Apple Maps, save places to lists, and check trip forecasts from WeatherKit. Saved readings stay available offline.
- **Assistant:** Ask camping and checklist questions, or ask about your own manuals and reservation paperwork. The answers cite the page they came from.

## Under the hood

RoamReady is a fully native Apple app built with Swift 6 (strict concurrency), SwiftUI, and SwiftData, for iPhone, iPad, and Mac through Mac Catalyst, including the full-display iPhone Duo layout. It has no backend, no account, and no external package dependencies.

- **Offline first, sync optional:** The SwiftData library is the source of truth on the device. When iCloud is available, it mirrors to the user's private CloudKit database. Because the models must stay CloudKit-compatible, every attribute is optional or has a default, and the production schema only takes additive changes.
- **Private, on-device AI:** The Assistant runs on Apple's on-device Foundation Models, so questions and documents never leave the phone. It can also call app tools, such as reading a saved trip, to ground its answers in your own data.
- **Hybrid document search:** To answer questions from your manuals, RoamReady keeps a separate, disposable SQLite index that combines FTS5 keyword search with vector search through a vendored, pinned `sqlite-vec`. It uses Apple's on-device embeddings. Documents are indexed in staged generations that go live in one transaction, so a crash mid-index never exposes half a document. Every passage is checked against the document's current checksum before it can be cited, so a replaced or deleted file is never used as evidence.
- **Testable by design:** The business rules live in plain Swift packages (`CampCore`, `CampPersistence`, `DocumentSearch`, and others) covered by `swift test`. A retrieval eval measures the Assistant's document answers, and debug launch flags drive fixture libraries for UI tests.

[View the source on GitHub](https://github.com/TannerBarcelos/RoamReady).
