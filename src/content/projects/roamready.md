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

## The trip that started it

The dealer's walkthrough took forty minutes. I nodded through all of it: the tongue jack, the breakaway cable, the black tank, the gray tank, the pressure regulator, which switch runs the water heater and why you never flip it on while the tank is empty. I filmed some of it on my phone and drove my new Forest River No Boundaries home convinced I had it handled.

I did not have it handled.

My first trip was to a state park a couple of hours from home. I rolled in at dusk, and the first problem was the ranger station. They wanted the confirmation number, and it was in an email that wouldn't load. There was one bar of signal at the gate and none at the site. I scrolled through a frozen inbox while a line of trucks formed behind me.

The site itself was worse. It sloped, I had no idea how much, and my leveling blocks were buried under the camp chairs. I started unhitching before I chocked the wheels, and the trailer shifted an inch on its own. That inch felt like a mile. I stood there in the dark with a headlamp, trying to remember the order from a dealer video that wouldn't play without a connection. I wasn't sure whether the surge protector went on before or after the power cord, or whether the regulator went at the spigot or at the trailer. I wasn't sure about the water heater either. I had a vague memory of the dealer saying something about it, and the manual was a PDF sitting in that same unreachable inbox. I left it off and took a cold shower.

Packing up the next morning went the same way. I dumped the tanks in the wrong order, and I learned why the order matters. I was pulling out when a neighbor jogged over and waved me down: one stabilizer jack was still down. Two more feet and I'd have bent it.

At a gas station on the drive home, I opened my notes app and typed out everything I'd forgotten, everything I'd done in the wrong order, and everything I couldn't find when I needed it. It was long. Somewhere around "chock the wheels *before* you unhitch," I realized the list was the product. It was a setup checklist and a teardown checklist, written by someone who'd just gotten both of them wrong.

## The trip after that

That list became RoamReady's first checklist.

On the next trip, the booking was already in the app, saved on my phone with the confirmation number, site number, and check-in time. No signal needed. When I pulled into the site, I opened the setup checklist and went down it in order: chock, level, unhitch, stabilizers, surge protector, power, regulator, water. One step at a time, checked off as I went. Nothing got skipped. Nothing rolled.

Then I got to the water heater, and this time the manual was in the app too. I asked the Assistant whether it was safe to turn on the electric element. It answered from the manual itself, citing the exact page, with no signal, and confirmed what the dealer had said: fill the tank first. Hot shower.

Teardown the next morning was boring, which is the highest compliment I can give it. Black tank, then gray, then flush. Every jack up. Hitch checked, lights checked, chocks pulled. Before I left, I took a photo of the site, added a note about which way it sloped, and marked it as a place to return to.

RoamReady is everything I wish I'd had on that first night: the steps in the right order, the paperwork, and the manuals, all on the phone and all working without a signal.

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
