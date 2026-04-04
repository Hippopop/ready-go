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
- **Framework**: Next.js 16, App Router, TypeScript — strict mode always on
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database + Auth + Storage**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
- **State management**: Zustand — for theme state and live preview sync
- **Forms**: React Hook Form + Zod — all forms must have Zod schema validation
- **PDF generation**: Puppeteer (server-side, Next.js API route)
- **Deployment**: Vercel
- **Package manager**: npm

## Theme Engine — Rules every agent must follow

The theme engine is the core differentiator of this product. Every UI element in both
the admin panel and the portfolio website must consume the theme CSS variables.
Never use hardcoded colors, fonts, or border radius values anywhere.

### CSS variables available on `:root`
```
--color-primary        → primary brand color
--color-accent         → secondary/accent color
--color-background     → page background
--color-surface        → card and panel backgrounds
--color-text           → body text color
--font-heading         → heading font family (Google Font)
--font-body            → body font family (Google Font)
--border-radius        → global border radius (0px / 4px / 8px / 16px / 9999px)
--border-radius-sm     → same value, used on smaller elements
--spacing-unit         → base spacing (0.75rem / 1rem / 1.5rem)
--transition-speed     → animation duration (0ms / 200ms / 400ms)
--transition-easing    → animation easing curve
```

### Tailwind classes that map to CSS variables (always use these)
```
bg-primary             → var(--color-primary)
bg-accent              → var(--color-accent)
bg-background          → var(--color-background)
bg-surface             → var(--color-surface)
text-app-text          → var(--color-text)
font-heading           → var(--font-heading)
font-body              → var(--font-body)
rounded-[var(--border-radius)]     → theme border radius
p-[var(--spacing-unit)]            → theme spacing
transition-all duration-[var(--transition-speed)] ease-[var(--transition-easing)]
```

### Rules
- NEVER use hardcoded Tailwind color classes like `bg-indigo-600`, `text-gray-900`,
  `bg-white`, `bg-gray-50` on any visible UI element. Always use the theme variables above.
- NEVER use hardcoded `rounded-md`, `rounded-lg`, `rounded-xl` on cards, buttons,
  inputs, or panels. Use `rounded-[var(--border-radius)]` instead.
  Exceptions: `rounded-full` is allowed ONLY for avatars, radio buttons, and badge pills.
- NEVER use hardcoded font families. Use `font-heading` for headings (h1–h4)
  and `font-body` for everything else.
- ALL hover/focus transitions must use `duration-[var(--transition-speed)]`
  and `ease-[var(--transition-easing)]` so animation style is respected.
- Dark mode is handled via Tailwind's `dark:` prefix + the `dark` class on `<html>`.
  The ThemeProvider sets this class automatically based on `color_mode`.
  Use `dark:` variants where needed for dark mode support.
- The `<body>` tag must always have: `bg-background text-app-text font-body`
- Every new page layout wrapper must have: `bg-background min-h-screen`
- Every new card/panel must have: `bg-surface rounded-[var(--border-radius)]`
- Every new primary button must have:
  `bg-primary text-white rounded-[var(--border-radius)]
   transition-all duration-[var(--transition-speed)] ease-[var(--transition-easing)]
   hover:opacity-90 active:scale-95`
- Every new input/textarea must have:
  `bg-surface border border-app-text/20 rounded-[var(--border-radius)]
   text-app-text font-body focus:border-primary`

### Where the theme is initialized
- Server-side: `src/app/layout.tsx` injects a `<style id="ready-go-theme">` tag
  with `:root { ... }` CSS variables on every page load (zero flash)
- Client-side: `src/components/theme-provider.tsx` hydrates the Zustand store
  and keeps the style tag in sync with live changes
- Zustand store: `src/stores/theme-store.ts`
  - `setTheme(theme)` — silent initialization, does NOT mark dirty
  - `updateTheme(partial)` — user-triggered change, marks isDirty = true
  - `applyPreset(name)` — applies a full preset, marks isDirty = true

### Portfolio pages must also consume the theme
When building the public portfolio (`/portfolio/[uid]`), fetch the user's theme
using `getThemeByUserId(uid)` (server action, no auth required) and inject it
the same way as the admin — via a `<style>` tag scoped to `:root` on that page.
This ensures the visitor sees the portfolio owner's chosen theme.

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

## Routing
- `/` — product landing page (marketing)
- `/login` — auth: login
- `/signup` — auth: signup
- `/admin` — admin dashboard (protected)
- `/admin/[section]` — each content section editor (protected)
- `/portfolio/[uid]` — public portfolio for a specific user (public, no auth)

## Rules the agent must always follow
- Never hardcode secrets, API keys, or credentials — always use env variables
- Always use server components by default; only add "use client" when interaction requires it
- All database access must go through server actions or API routes — never expose Supabase keys to the client (use the anon key only on client, service role key only on server)
- Every form must have Zod validation on both client and server
- All images go through Supabase Storage — never store binary in the database
- The theme engine must use CSS custom properties (--color-primary, --font-heading, etc.) so both admin and portfolio share the same design tokens
- Never install a new package without explaining why in a comment or message first
- Use `src/proxy.ts` (not `middleware.ts`) for request interception — Next.js 16 convention. Export a named `proxy` function, not `middleware`

## Environment variables needed (never commit these)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=

## Current phase
Phase 3 — Public portfolio website (single scrolling page).
Admin panel, theme engine, and section settings are complete.
Section settings auto-initialize on signup via Supabase trigger.
Portfolio data fetched via getPortfolioData() using Promise.all.

## Accounts and services used
- Supabase: free tier (database + auth + storage)
- Vercel: free tier (deployment)
- GitHub: version control