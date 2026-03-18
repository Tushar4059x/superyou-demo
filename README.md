# SuperYou Rewards Demo

A gamified rewards and protein tracking demo for [SuperYou](https://superyou.in) — built with Next.js, Tailwind CSS, and Framer Motion.

## Features

- **Daily Protein Tracking** — Enter product codes or use the AI scanner to log SuperYou bars and earn points
- **Rewards Vault** — Redeem points for exclusive gear like shaker bottles, whey tubs, gym hoodies, and a meet & greet experience
- **Leaderboard** — See top protein trackers ranked by points and bars consumed
- **Achievements** — Unlock badge tiers (Rookie, Hero, SuperHuman, Legend) as you accumulate points
- **AI Product Scanner** — Camera-based scanner with animated detection UI (simulated)

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** Archivo (headings), Roboto (body) — matching the superyou.in brand

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Codes

| Code | Points |
|------|--------|
| `SUPER100` | +100 |
| `HERO500` | +500 |

You can also use the AI Scanner tab to simulate product detection (+250 points).

## Project Structure

```
src/app/
├── globals.css    # Brand theme (colors, fonts, utilities)
├── layout.tsx     # Root layout with Archivo + Roboto fonts
└── page.tsx       # Main rewards dashboard (all sections)
public/
└── logo.svg       # SuperYou brand logo
```

## Deployment

Deploy on [Vercel](https://vercel.com) for the fastest setup:

```bash
npm run build
```

Or connect the GitHub repo directly to Vercel for automatic deployments.
