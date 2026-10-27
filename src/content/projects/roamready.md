---
title: 'RoamReady'
description: 'An offline-first camping trip planner for iPhone, iPad, and Mac.'
publishDate: '2026-10-27'
isFeatured: true
featuredOrder: 1
lane: apps
github: 'https://github.com/TannerBarcelos/RoamReady'
technologies:
  - Swift
  - SwiftUI
  - SwiftData
tags:
  - in-progress
seo:
  image:
    src: '/roamready-home.png'
    alt: RoamReady Home screen showing the next trip, checklist progress, and upcoming trips
---

<img src="/roamready-home.png" alt="RoamReady Home screen showing the next trip, checklist progress, and upcoming trips" width="552" height="1200" style="width: 100%; max-width: 300px; height: auto; margin-inline: auto;" />

RoamReady keeps the practical details of camping together: your rig, the next trip, the checklist before you leave, and the paperwork you need when you arrive. It's a native app for iPhone, iPad, and Mac, with core workflows available offline and no account required.

**Status:** RoamReady is an in-progress development build. It has not been released on the App Store. Live weather and iCloud sync require Apple capability configuration, and physical-device acceptance remains outstanding.

[View the source on GitHub](https://github.com/TannerBarcelos/RoamReady).

## Planning a trip

Save trips, reservation details, and campground site notes alongside rig information. RoamReady records booking information; it does not make reservations. Reusable setup and teardown checklists can be edited and adapted for individual trips, with priorities and notes to keep the important steps visible.

## Everything you need at camp

- **Documents:** Import manuals and paperwork, keep them available offline, and export them when needed.
- **Memories:** Save trip photos, captions, and return-or-avoid ratings for future planning.
- **Campground discovery:** Explore campgrounds and RV parks through MapKit and save places for later. Fresh search results require a connection.
- **Weather:** Forecast views and caching are implemented; live WeatherKit access still needs Apple capability setup and validation.
- **Camping assistance:** On-device guidance uses Apple Foundation Models on supported devices.

## Built for Apple platforms

RoamReady uses Swift 6, SwiftUI, and SwiftData, with shared Swift Package modules for core logic, campground discovery, documents, and persistence. MapKit, WeatherKit, and Foundation Models provide platform integrations, while Mac Catalyst brings the app to Mac.
