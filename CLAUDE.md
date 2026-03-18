# CLAUDE.md

## Project Overview

SuperYou Rewards Demo — a gamified protein tracking and rewards dashboard for the SuperYou brand (superyou.in). Single-page Next.js app with no backend; all state is client-side.

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4 (using `@theme inline` for design tokens)
- Framer Motion for animations
- Lucide React for icons
- TypeScript

## Key Files

- `src/app/page.tsx` — Entire app UI (welcome, claim points, rewards vault, leaderboard, achievements)
- `src/app/globals.css` — Brand theme tokens, font declarations, `hard-shadow` utilities
- `src/app/layout.tsx` — Root layout with Archivo + Roboto fonts via `next/font/google`
- `public/logo.svg` — SuperYou brand logo

## Brand Guidelines

- Primary red: `#ef1400`
- Dark text: `#151515`
- Background: `#ffffff` / `#f7f7f7`
- Heading font: Archivo (bold, extrabold, uppercase)
- Body font: Roboto
- Cards use `rounded-[19px]` with `border-brand-red` and `hard-shadow`
- Buttons use `rounded-[4px]` (sharp corners) — matches superyou.in
- No dark mode

## Commands

```bash
npm run dev    # Start dev server (Turbopack)
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Architecture Notes

- Everything is in a single `page.tsx` — no component splitting yet
- Demo codes are hardcoded: `SUPER100` (+100 pts), `HERO500` (+500 pts)
- AI Scanner is simulated (auto-detects after 3.5s, awards 250 pts)
- Leaderboard uses static mock data
- No persistence — points reset on page refresh
- The `@fontsource/*` packages in `package.json` are unused; fonts load via `next/font/google` in `layout.tsx`
