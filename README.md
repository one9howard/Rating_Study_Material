# Rating Study Guide

A React/Vite study application containing flashcards, knowledge checks, rhythm matching, technical diagrams, and a Rules Karaoke video for Rules 1–31.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm ci
npm run build
npm run start
```

The `start` command uses Railway's `PORT` environment variable. The Rules Karaoke video is served from `public/media/` and is included in production builds.

## Rules Karaoke

The player supports mobile-friendly inline playback, full-screen browser controls, exact section jumps, playback-speed controls, downloading, and automatic resume-position storage on the current device.
