# PhysioAI

A clinical-first physiotherapy practice management platform built to eliminate admin overhead and let physios focus on patient care.

## Features

- **AI-Powered SOAP Notes** — Fill in Subjective + Objective, AI generates Assessment & Plan with streaming typewriter effect. Ghost text auto-suggest, condition templates, and clinical terminology autocomplete.
- **Treatment Plan Builder** — Multi-phase drag-and-drop programme builder with cross-phase reordering, exercise search via command palette, AI progression suggestions, and Home Exercise Program (HEP) generation.
- **Progress Tracking & Outcome Measures** — VAS pain scores, ROM measurements, functional outcome trends with interactive charts. AI-generated progress summaries and discharge readiness tracking.
- **Clinical Documentation** — CPT code auto-suggestions with 8-minute rule calculator, Medicare-compliant progress report generation, discharge planning with criteria checklists, and digital intake forms with interactive body map.
- **Smart Dashboard** — Proactive AI clinical insights, upcoming patient strip, KPI cards, and schedule recommendations.
- **Secure Messaging** — Patient communication with read receipts, typing indicators, and AI-assisted message drafting.
- **Scheduling** — Weekly/daily calendar view with appointment management, smart gap-fill suggestions, and attendance pattern analysis.
- **Referral Management** — AI-powered referral letter parsing that auto-extracts patient data and creates records.
- **Command Palette** — Global `Cmd+K` search across patients, exercises, and quick actions.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with oklch color system
- **State**: Zustand
- **UI Components**: shadcn/ui, Radix primitives, cmdk
- **Charts**: Recharts
- **Calendar**: FullCalendar
- **AI**: Google Gemini API
- **Fonts**: Inter (body) + DM Sans (display)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
  app/           # Next.js App Router pages and API routes
  components/    # React components organized by feature
  stores/        # Zustand state stores
  data/          # Mock data for development
  lib/           # Utilities and AI context helpers
  types/         # TypeScript type definitions
```
