# Project: Ready-Go

## What this product is
A full-stack SaaS portfolio website generator for software engineers.
It has two surfaces:
1. **Admin panel** — where the user manages all their content, theme, and resume
2. **Portfolio website** — the public-facing site generated from that content

## Current phase
**Phase 4 — Refinement & Polish.**
All core features are built and deployed on Vercel.
Focus is on: bug fixes, UI polish, performance, missing edge cases,
and incremental feature additions. Do NOT rewrite working systems.
Make surgical, targeted changes only.

## What is complete (do not rebuild these)
- Auth flow (signup, email confirmation, login, signout)
- All 11 content section editors with full CRUD
- Section settings (visibility + drag-to-reorder)
- Full theme engine (6 presets, all tokens, live preview, persists to DB)
- Public portfolio website (single-scroll, themed, responsive)
- Portfolio navigation (sticky, IntersectionObserver, mobile hamburger)
- Resume builder (3 templates: Executive, Minimal, Creative)
- PDF generation via @react-pdf/renderer (client-side, works on Vercel free)
- Mobile-responsive admin panel (drawer sidebar via AdminShell)
- Contact form system (API route, rate limiting, admin inbox)
- Deployed on Vercel (free tier)

## What is not done yet
- Product landing page at /
- Image upload UI (currently URL input only)
- Scroll-triggered animations on portfolio
- Username-based portfolio URLs
- Analytics

## Tech stack — do not deviate from this
- **Framework**: Next.js 16, App Router, TypeScript — strict mode always on
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database + Auth + Storage**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
- **State management**: Zustand — theme store only
- **Forms**: React Hook Form + Zod — all forms must have Zod schema validation
- **PDF generation**: @react-pdf/renderer — client-side only, NO Puppeteer
- **Deployment**: Vercel (free tier)
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
rounded-[var(--border-radius)]
p-[var(--spacing-unit)]
transition-all duration-[var(--transition-speed)] ease-[var(--transition-easing)]
```

### Rules
- NEVER use hardcoded Tailwind color classes on any visible UI element
- NEVER use hardcoded rounded-md / rounded-lg on cards, buttons, inputs, panels
  Exception: rounded-full is allowed ONLY for avatars, radio buttons, badge pills
- NEVER hardcode font families — use font-heading for h1–h4, font-body for everything else
- ALL hover/focus transitions must use duration-[var(--transition-speed)]
- Dark mode: Tailwind dark: prefix + dark class on <html> toggled by ThemeProvider
- Body tag must always have: bg-background text-app-text font-body
- Every new page layout wrapper must have: bg-background min-h-screen
- Every new card/panel: bg-surface rounded-[var(--border-radius)]
- Every primary button:
  bg-primary text-white rounded-[var(--border-radius)]
  transition-all duration-[var(--transition-speed)] ease-[var(--transition-easing)]
  hover:opacity-90 active:scale-95
- Every input/textarea:
  bg-surface border border-app-text/20 rounded-[var(--border-radius)]
  text-app-text font-body focus:border-primary

### Where the theme lives
- Server-side: src/app/layout.tsx injects <style id="ready-go-theme">:root{...}</style>
- Client-side: src/components/theme-provider.tsx (Zustand store → DOM sync)
- Zustand store: src/stores/theme-store.ts
  - setTheme(theme) — silent init, does NOT mark dirty
  - updateTheme(partial) — user action, marks isDirty = true
  - applyPreset(name) — full preset replace, marks isDirty = true
- Portfolio pages: inject theme via getThemeByUserId(uid) → same :root style tag

## PDF resume rules (react-pdf only)
- Library: @react-pdf/renderer — NO Puppeteer, NO html-to-pdf, NO jsPDF
- Templates use react-pdf JSX primitives only: Document, Page, View, Text, Link, Image
- ALL styles inside templates are StyleSheet.create() objects — NO Tailwind inside templates
- Fonts registered in src/lib/resume-fonts.ts via Font.register()
- PDFViewerInner.tsx uses BlobProvider + <embed> on desktop, card + buttons on mobile
- Mobile detection: navigator.userAgent in useEffect (no hydration mismatch)
- Templates must support ats_mode (strip colors) and include_photo flags

## Admin panel responsiveness rules
- AdminShell (src/components/admin/layout/admin-shell.tsx) is the responsive wrapper
- Mobile: drawer sidebar with hamburger in sticky top bar
- Desktop: static sidebar always visible
- All page content: max-w-4xl mx-auto wrapper
- All grids: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 (never fixed columns)
- All forms: full-width inputs on mobile, side-by-side on sm:
- Touch targets: minimum min-h-[44px] on all interactive elements

## Folder structure to follow
src/
  app/
    (admin)/              ← admin panel route group, protected
    portfolio/[uid]/      ← public portfolio
    api/contact/[uid]/    ← contact form API
    login/, signup/       ← auth pages
    page.tsx              ← product landing (placeholder)
  components/
    admin/
      layout/             ← AdminShell
      sidebar/            ← SidebarNav, NavItem, InboxNavItem
      [section]/          ← one folder per content section
      theme/              ← ThemeEditor and sub-components
      resume/             ← ResumeBuilderPanel
      inbox/              ← InboxList, MessageCard
    portfolio/
      sections/           ← one component per portfolio section
    resume/
      templates/          ← ExecutivePDF, MinimalPDF, CreativePDF
      PDFViewer.tsx, PDFViewerInner.tsx
    theme-provider.tsx
    ui/                   ← shadcn/ui components
  lib/
    supabase/             ← client.ts, server.ts, middleware.ts
    actions/              ← one file per domain
    validations/          ← one file per domain
    theme-presets.ts, theme-utils.ts, resume-fonts.ts
  stores/theme-store.ts
  types/database.ts, index.ts, resume.ts
  proxy.ts                ← Next.js 16 convention (not middleware.ts)

## Routing
- /                         → product landing (placeholder)
- /login                    → auth login
- /signup                   → auth signup
- /admin                    → dashboard (protected)
- /admin/[section]          → content editors (protected)
- /admin/sections           → section visibility + order manager
- /admin/theme              → theme customizer
- /admin/resume             → resume builder
- /admin/inbox              → contact submissions inbox
- /portfolio/[uid]          → public portfolio
- /portfolio/[uid]/resume   → public resume viewer + download
- /api/contact/[uid]        → POST contact form submissions

## Rules the agent must always follow
- Server components by default — 'use client' only when interaction is required
- All database access via server actions or API routes
- NEXT_PUBLIC_SUPABASE_ANON_KEY on client, SUPABASE_SERVICE_ROLE_KEY only on server
- Every form: React Hook Form + Zod on both client and server
- All images via Supabase Storage (/{user_id}/filename)
- Use src/proxy.ts not middleware.ts — export named function proxy, not middleware
- Never commit .env files — all secrets in .env.local only
- Never install a new package without explaining why first
- Never rewrite a working system — surgical fixes only
- Run npm run build before declaring anything done

## Environment variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=        ← publishable key (new Supabase format sb_publishable_...)
SUPABASE_SERVICE_ROLE_KEY=            ← secret key (new Supabase format sb_secret_...)
NEXT_PUBLIC_APP_URL=                  ← Vercel deployment URL

## Accounts and services
- Supabase: free tier (database + auth + storage)
- Vercel: free tier (deployment) — no Puppeteer, 10s function timeout limit
- GitHub: private repo, version control
- Google AntiGravity: AI coding agent (GEMINI.md is its memory file)