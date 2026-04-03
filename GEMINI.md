# Project: Ready-Go

## What this product is
A full-stack SaaS portfolio website generator for software engineers.
It has two surfaces:
1. **Admin panel** — where the user manages all their content, theme, and resume
2. **Portfolio website** — the public-facing site generated from that content

## Core features (build in this order)
1. Content management — all portfolio sections (hero, experience, projects, skills, education, etc.)
2. Theme engine — full visual customization (colors, fonts, radius, spacing) with presets
3. Resume builder — 3 dynamic templates, auto-synced from content, PDF export with clickable links
4. Resume download — visitors can download the selected resume template as PDF

## Tech stack — do not deviate from this
- **Framework**: Next.js 15, App Router, TypeScript — strict mode always on
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database + Auth + Storage**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
- **State management**: Zustand — for theme state and live preview sync
- **Forms**: React Hook Form + Zod — all forms must have Zod schema validation
- **PDF generation**: Puppeteer (server-side, Next.js API route)
- **Deployment**: Vercel
- **Package manager**: npm

## Folder structure to follow
src/
  app/
    (admin)/         ← admin panel route group
    (portfolio)/     ← public portfolio route group
    api/             ← API routes (including PDF generation)
  components/
    admin/           ← admin-only components
    portfolio/       ← portfolio-only components
    resume/          ← resume templates (3 of them)
    ui/              ← shadcn/ui components live here
  lib/
    supabase/        ← supabase client (server + browser)
    validations/     ← all Zod schemas
  hooks/             ← custom React hooks
  stores/            ← Zustand stores
  types/             ← TypeScript types and interfaces

## Rules the agent must always follow
- Never hardcode secrets, API keys, or credentials — always use env variables
- Always use server components by default; only add "use client" when interaction requires it
- All database access must go through server actions or API routes — never expose Supabase keys to the client (use the anon key only on client, service role key only on server)
- Every form must have Zod validation on both client and server
- All images go through Supabase Storage — never store binary in the database
- The theme engine must use CSS custom properties (--color-primary, --font-heading, etc.) so both admin and portfolio share the same design tokens
- Never install a new package without explaining why in a comment or message first

## Environment variables needed (never commit these)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=

## Current phase
Phase 1 — Foundation. We are setting up the project structure, Supabase connection, and auth.
We have NOT started building UI yet.

## Accounts and services used
- Supabase: free tier (database + auth + storage)
- Vercel: free tier (deployment)
- GitHub: version control