# Step 6 — Parallel Agent Prompts
# Open one Agent in Mission Control per section and paste each prompt separately.
# These are safe to run fully in parallel — no two agents touch the same files.

---

## AGENT 1 — Hero Section

Read GEMINI.md fully before doing anything.

Build the complete Hero section editor for the Ready-Go admin panel. The `hero` table already exists in Supabase with these columns: `id`, `user_id`, `headline`, `subheadline`, `tagline`, `profile_image_url`, `cta_primary_text`, `cta_primary_url`, `cta_secondary_text`, `is_typing_animation`, `typing_texts` (text array), `created_at`, `updated_at`.

Create exactly these files and nothing else:

**`src/lib/validations/hero.ts`**
Zod schema with these fields:
- `headline` — string, max 100 chars
- `subheadline` — string, max 150 chars, optional
- `tagline` — string, max 200 chars, optional
- `profile_image_url` — string url, optional
- `cta_primary_text` — string, default "Hire Me"
- `cta_primary_url` — string url, optional
- `cta_secondary_text` — string, default "View Resume"
- `is_typing_animation` — boolean, default true
- `typing_texts` — array of strings, optional

**`src/lib/actions/hero.ts`**
Two server actions (mark file with `'use server'`):
- `getHero()` — fetches the hero row for the current logged-in user using the server Supabase client. Returns the row or null.
- `upsertHero(data)` — validates with the Zod schema, then does an upsert into the `hero` table with `{ onConflict: 'user_id' }`. Returns `{ success: true }` or `{ error: string }`.

**`src/components/admin/hero/hero-form.tsx`**
Client component (`'use client'`):
- Uses React Hook Form + zodResolver with the hero Zod schema
- Pre-populates all fields from a `defaultValues` prop
- Has a text input for each field
- `typing_texts` field: render as a dynamic list where the user can add/remove strings with an "Add" button
- `is_typing_animation` field: render as a checkbox
- On submit calls the `upsertHero` server action
- Shows a success toast message on save ("Hero section saved!")
- Shows inline error if save fails
- Has a "Save changes" button that shows a loading spinner while submitting

**`src/app/(admin)/admin/hero/page.tsx`**
Server component:
- Calls `getHero()` to fetch existing data
- Renders `<HeroForm defaultValues={heroData} />`
- Has a page title "Hero Section" and a subtitle "This is the first thing visitors see"

Do not create any other files. Do not modify any existing files. Do not install any packages.

---

## AGENT 2 — About + Social Links

Read GEMINI.md fully before doing anything.

Build the complete About section editor for the Ready-Go admin panel. The `about` table has columns: `id`, `user_id`, `bio`, `location`, `availability_status`, `years_of_experience`, `updated_at`. The `social_links` table has: `id`, `user_id`, `platform`, `url`, `display_order`.

Create exactly these files and nothing else:

**`src/lib/validations/about.ts`**
Two Zod schemas:
- `aboutSchema`: `bio` (string, max 1000), `location` (string, optional), `availability_status` (enum: 'open' | 'busy' | 'not_available'), `years_of_experience` (number, optional)
- `socialLinkSchema`: `platform` (string), `url` (string url)

**`src/lib/actions/about.ts`**
Server actions (`'use server'`):
- `getAbout()` — fetches about row for current user
- `upsertAbout(data)` — upserts into `about` table with `{ onConflict: 'user_id' }`
- `getSocialLinks()` — fetches all social links for current user ordered by `display_order`
- `addSocialLink(data)` — inserts a new social link
- `deleteSocialLink(id: string)` — deletes a social link by id (verify ownership via user_id)

**`src/components/admin/about/about-form.tsx`**
Client component:
- React Hook Form + Zod for the about fields
- `availability_status` rendered as a select dropdown with options: Open to work / Busy / Not available
- On submit calls `upsertAbout`
- Shows success/error feedback

**`src/components/admin/about/social-links-manager.tsx`**
Client component:
- Shows a list of existing social links (passed as props)
- Each row shows platform name + URL + a delete button
- Has an "Add social link" form at the bottom with platform and url inputs
- On add calls `addSocialLink` then refreshes using `router.refresh()`
- On delete calls `deleteSocialLink` then refreshes
- Common platforms to suggest in a dropdown: GitHub, LinkedIn, Twitter/X, YouTube, Website, Email, Instagram

**`src/app/(admin)/admin/about/page.tsx`**
Server component:
- Calls `getAbout()` and `getSocialLinks()`
- Renders `<AboutForm>` and `<SocialLinksManager>` on the same page
- Page title: "About"

Do not create any other files. Do not modify any existing files. Do not install any packages.

---

## AGENT 3 — Experience

Read GEMINI.md fully before doing anything.

Build the complete Experience section editor. The `experiences` table has: `id`, `user_id`, `company_name`, `company_url`, `company_logo_url`, `role`, `employment_type`, `start_date`, `end_date`, `is_current`, `description`, `tech_stack` (text array), `display_order`, `created_at`, `updated_at`.

Create exactly these files:

**`src/lib/validations/experience.ts`**
Zod schema:
- `company_name` — string, required
- `company_url` — string url, optional
- `company_logo_url` — string url, optional
- `role` — string, required
- `employment_type` — enum: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
- `start_date` — string (date format YYYY-MM-DD), required
- `end_date` — string (date format YYYY-MM-DD), optional
- `is_current` — boolean, default false
- `description` — string, max 2000, optional
- `tech_stack` — array of strings, optional

**`src/lib/actions/experience.ts`**
Server actions (`'use server'`):
- `getExperiences()` — fetch all for current user ordered by `display_order`
- `createExperience(data)` — insert new row
- `updateExperience(id, data)` — update by id (verify ownership)
- `deleteExperience(id)` — delete by id (verify ownership)

**`src/components/admin/experience/experience-form.tsx`**
Client component:
- React Hook Form + Zod
- When `is_current` checkbox is checked, hide/disable the `end_date` field
- `tech_stack`: dynamic tag input — user types a skill name and presses Enter or comma to add it as a tag, with an X to remove each tag
- `employment_type`: select dropdown
- On submit calls `createExperience` or `updateExperience` depending on whether an `id` prop is passed
- Shows success/error feedback

**`src/components/admin/experience/experience-list.tsx`**
Client component:
- Receives list of experiences as props
- Renders each as a card showing: role, company name, dates, employment type
- Each card has "Edit" and "Delete" buttons
- Edit button opens the `ExperienceForm` in an inline expanded state below the card
- Delete button calls `deleteExperience` with confirmation
- Has an "Add experience" button at the top that shows a new empty form

**`src/app/(admin)/admin/experience/page.tsx`**
Server component:
- Calls `getExperiences()`
- Renders `<ExperienceList experiences={data} />`
- Page title: "Work Experience"

Do not create any other files. Do not modify any existing files. Do not install any packages.

---

## AGENT 4 — Projects

Read GEMINI.md fully before doing anything.

Build the complete Projects section editor. The `projects` table has: `id`, `user_id`, `title`, `description`, `cover_image_url`, `live_url`, `github_url`, `tech_stack` (text array), `is_featured`, `display_order`, `created_at`, `updated_at`.

Create exactly these files:

**`src/lib/validations/project.ts`**
Zod schema:
- `title` — string, required, max 100
- `description` — string, max 1000, optional
- `cover_image_url` — string url, optional
- `live_url` — string url, optional
- `github_url` — string url, optional
- `tech_stack` — array of strings, optional
- `is_featured` — boolean, default false

**`src/lib/actions/project.ts`**
Server actions (`'use server'`):
- `getProjects()` — fetch all for current user ordered by `display_order`
- `createProject(data)` — insert
- `updateProject(id, data)` — update (verify ownership)
- `deleteProject(id)` — delete (verify ownership)

**`src/components/admin/projects/project-form.tsx`**
Client component:
- React Hook Form + Zod
- `tech_stack`: same dynamic tag input pattern as experience (type + Enter to add, X to remove)
- `is_featured`: checkbox — featured projects appear first on the portfolio
- On submit calls create or update depending on `id` prop
- Shows success/error feedback

**`src/components/admin/projects/project-list.tsx`**
Client component:
- List of project cards showing: title, tech stack tags, featured badge if applicable
- Each card: Edit + Delete buttons
- Edit opens inline form
- "Add project" button at top
- Delete with confirmation

**`src/app/(admin)/admin/projects/page.tsx`**
Server component:
- Calls `getProjects()`
- Renders `<ProjectList projects={data} />`
- Page title: "Projects"

Do not create any other files. Do not modify any existing files. Do not install any packages.

---

## AGENT 5 — Skills

Read GEMINI.md fully before doing anything.

Build the complete Skills section editor. The `skills` table has: `id`, `user_id`, `name`, `category`, `icon_url`, `proficiency` (int 1-5), `years_of_experience`, `display_order`.

Create exactly these files:

**`src/lib/validations/skill.ts`**
Zod schema:
- `name` — string, required
- `category` — string, optional (e.g. Frontend, Backend, DevOps, Mobile, Database, Design)
- `icon_url` — string url, optional
- `proficiency` — number, min 1, max 5
- `years_of_experience` — number, optional, min 0

**`src/lib/actions/skill.ts`**
Server actions (`'use server'`):
- `getSkills()` — fetch all for current user ordered by category then display_order
- `createSkill(data)` — insert
- `updateSkill(id, data)` — update (verify ownership)
- `deleteSkill(id)` — delete (verify ownership)

**`src/components/admin/skills/skill-form.tsx`**
Client component:
- React Hook Form + Zod
- `proficiency`: render as a 1-5 star rating selector (5 clickable stars)
- `category`: text input with a datalist suggestion of common categories: Frontend, Backend, DevOps, Mobile, Database, Design, Tools
- On submit calls create or update depending on `id` prop

**`src/components/admin/skills/skill-list.tsx`**
Client component:
- Group skills by category
- Each skill row: name, category, proficiency stars, edit + delete buttons
- "Add skill" button at top
- Delete with confirmation

**`src/app/(admin)/admin/skills/page.tsx`**
Server component:
- Calls `getSkills()`
- Renders `<SkillList skills={data} />`
- Page title: "Skills & Technologies"

Do not create any other files. Do not modify any existing files. Do not install any packages.

---

## AGENT 6 — Education

Read GEMINI.md fully before doing anything.

Build the complete Education section editor. The `education` table has: `id`, `user_id`, `institution`, `institution_logo_url`, `degree`, `field_of_study`, `start_year`, `end_year`, `gpa`, `honors`, `description`, `display_order`.

Create exactly these files:

**`src/lib/validations/education.ts`**
Zod schema:
- `institution` — string, required
- `institution_logo_url` — string url, optional
- `degree` — string, optional
- `field_of_study` — string, optional
- `start_year` — number, optional
- `end_year` — number, optional
- `gpa` — string, optional
- `honors` — string, optional
- `description` — string, max 500, optional

**`src/lib/actions/education.ts`**
Server actions (`'use server'`):
- `getEducation()` — fetch all for current user ordered by `display_order`
- `createEducation(data)` — insert
- `updateEducation(id, data)` — update (verify ownership)
- `deleteEducation(id)` — delete (verify ownership)

**`src/components/admin/education/education-form.tsx`**
Client component:
- React Hook Form + Zod
- `start_year` and `end_year`: number inputs (4 digits)
- On submit calls create or update

**`src/components/admin/education/education-list.tsx`**
Client component:
- Each card shows: institution, degree, field of study, years
- Edit + delete buttons per card
- "Add education" button at top

**`src/app/(admin)/admin/education/page.tsx`**
Server component:
- Calls `getEducation()`
- Renders `<EducationList education={data} />`
- Page title: "Education"

Do not create any other files. Do not modify any existing files. Do not install any packages.

---

## AGENT 7 — Certifications

Read GEMINI.md fully before doing anything.

Build the complete Certifications section editor. The `certifications` table has: `id`, `user_id`, `name`, `issuer`, `issue_date`, `expiry_date`, `credential_url`, `badge_image_url`, `display_order`.

Create exactly these files:

**`src/lib/validations/certification.ts`**
Zod schema:
- `name` — string, required
- `issuer` — string, optional
- `issue_date` — string (YYYY-MM-DD), optional
- `expiry_date` — string (YYYY-MM-DD), optional
- `credential_url` — string url, optional
- `badge_image_url` — string url, optional

**`src/lib/actions/certification.ts`**
Server actions (`'use server'`):
- `getCertifications()` — fetch all for current user
- `createCertification(data)` — insert
- `updateCertification(id, data)` — update (verify ownership)
- `deleteCertification(id)` — delete (verify ownership)

**`src/components/admin/certifications/certification-form.tsx`**
Client component — React Hook Form + Zod, create or update depending on `id` prop.

**`src/components/admin/certifications/certification-list.tsx`**
Client component — cards with name, issuer, dates, edit + delete buttons, "Add" button at top.

**`src/app/(admin)/admin/certifications/page.tsx`**
Server component — fetches and renders. Page title: "Certifications"

Do not create any other files. Do not modify any existing files. Do not install any packages.

---

## AGENT 8 — Testimonials

Read GEMINI.md fully before doing anything.

Build the complete Testimonials section editor. The `testimonials` table has: `id`, `user_id`, `author_name`, `author_title`, `author_company`, `author_avatar_url`, `content`, `linkedin_url`, `display_order`.

Create exactly these files:

**`src/lib/validations/testimonial.ts`**
Zod schema:
- `author_name` — string, required
- `author_title` — string, optional
- `author_company` — string, optional
- `author_avatar_url` — string url, optional
- `content` — string, required, max 1000
- `linkedin_url` — string url, optional

**`src/lib/actions/testimonial.ts`**
Server actions (`'use server'`):
- `getTestimonials()` — fetch all for current user ordered by `display_order`
- `createTestimonial(data)` — insert
- `updateTestimonial(id, data)` — update (verify ownership)
- `deleteTestimonial(id)` — delete (verify ownership)

**`src/components/admin/testimonials/testimonial-form.tsx`**
Client component — React Hook Form + Zod. `content` uses a textarea. Create or update depending on `id` prop.

**`src/components/admin/testimonials/testimonial-list.tsx`**
Client component — cards showing author name, title, company, and a truncated quote. Edit + delete per card. "Add testimonial" at top.

**`src/app/(admin)/admin/testimonials/page.tsx`**
Server component — fetches and renders. Page title: "Testimonials"

Do not create any other files. Do not modify any existing files. Do not install any packages.

---

## AGENT 9 — Blog Posts

Read GEMINI.md fully before doing anything.

Build the complete Blog Posts section editor. The `blog_posts` table has: `id`, `user_id`, `title`, `excerpt`, `url`, `cover_image_url`, `published_at`, `reading_time_minutes`, `tags` (text array), `display_order`.

Create exactly these files:

**`src/lib/validations/blog-post.ts`**
Zod schema:
- `title` — string, required
- `excerpt` — string, max 300, optional
- `url` — string url, required (this links to the external blog post)
- `cover_image_url` — string url, optional
- `published_at` — string (YYYY-MM-DD), optional
- `reading_time_minutes` — number, optional
- `tags` — array of strings, optional

**`src/lib/actions/blog-post.ts`**
Server actions (`'use server'`):
- `getBlogPosts()` — fetch all for current user ordered by `published_at` desc
- `createBlogPost(data)` — insert
- `updateBlogPost(id, data)` — update (verify ownership)
- `deleteBlogPost(id)` — delete (verify ownership)

**`src/components/admin/blog/blog-post-form.tsx`**
Client component — React Hook Form + Zod. `tags`: same dynamic tag input as experience. Create or update depending on `id` prop.

**`src/components/admin/blog/blog-post-list.tsx`**
Client component — cards showing title, excerpt, published date, reading time. Edit + delete. "Add post" at top.

**`src/app/(admin)/admin/blog/page.tsx`**
Server component — fetches and renders. Page title: "Blog Posts"

Do not create any other files. Do not modify any existing files. Do not install any packages.

---

## AGENT 10 — Awards

Read GEMINI.md fully before doing anything.

Build the complete Awards section editor. The `awards` table has: `id`, `user_id`, `title`, `issuer`, `date`, `description`, `url`, `display_order`.

Create exactly these files:

**`src/lib/validations/award.ts`**
Zod schema:
- `title` — string, required
- `issuer` — string, optional
- `date` — string (YYYY-MM-DD), optional
- `description` — string, max 500, optional
- `url` — string url, optional

**`src/lib/actions/award.ts`**
Server actions (`'use server'`):
- `getAwards()` — fetch all for current user ordered by `date` desc
- `createAward(data)` — insert
- `updateAward(id, data)` — update (verify ownership)
- `deleteAward(id)` — delete (verify ownership)

**`src/components/admin/awards/award-form.tsx`**
Client component — React Hook Form + Zod. Create or update depending on `id` prop.

**`src/components/admin/awards/award-list.tsx`**
Client component — cards with title, issuer, date. Edit + delete. "Add award" at top.

**`src/app/(admin)/admin/awards/page.tsx`**
Server component — fetches and renders. Page title: "Awards & Achievements"

Do not create any other files. Do not modify any existing files. Do not install any packages.

---

## AGENT 11 — Open Source Contributions

Read GEMINI.md fully before doing anything.

Build the complete Open Source section editor. The `open_source_contributions` table has: `id`, `user_id`, `repo_name`, `repo_url`, `description`, `language`, `stars`, `role`, `display_order`.

Create exactly these files:

**`src/lib/validations/open-source.ts`**
Zod schema:
- `repo_name` — string, required
- `repo_url` — string url, optional
- `description` — string, max 300, optional
- `language` — string, optional
- `stars` — number, default 0
- `role` — enum: 'owner' | 'maintainer' | 'contributor'

**`src/lib/actions/open-source.ts`**
Server actions (`'use server'`):
- `getOpenSourceContributions()` — fetch all for current user ordered by `stars` desc
- `createContribution(data)` — insert
- `updateContribution(id, data)` — update (verify ownership)
- `deleteContribution(id)` — delete (verify ownership)

**`src/components/admin/open-source/contribution-form.tsx`**
Client component — React Hook Form + Zod. `role`: select dropdown. Create or update depending on `id` prop.

**`src/components/admin/open-source/contribution-list.tsx`**
Client component — cards showing repo name, language, stars count, role badge. Edit + delete. "Add contribution" at top.

**`src/app/(admin)/admin/open-source/page.tsx`**
Server component — fetches and renders. Page title: "Open Source"

Do not create any other files. Do not modify any existing files. Do not install any packages.

---

## AGENT 12 — Admin Sidebar Navigation

Read GEMINI.md fully before doing anything.

The admin layout shell already exists at `src/app/(admin)/layout.tsx`. I need you to upgrade the sidebar to a full working navigation.

Create exactly these files:

**`src/components/admin/sidebar/nav-item.tsx`**
Client component:
- Accepts `href`, `label`, `icon` (Lucide icon component) props
- Uses `usePathname()` to detect the active route
- Active state: slightly highlighted background
- Renders as a Next.js `<Link>`

**`src/components/admin/sidebar/sidebar-nav.tsx`**
Client component:
- Imports `NavItem`
- Renders a vertical nav list with these items in this order:
  - Dashboard → `/admin`
  - Hero → `/admin/hero`
  - About → `/admin/about`
  - Experience → `/admin/experience`
  - Projects → `/admin/projects`
  - Skills → `/admin/skills`
  - Education → `/admin/education`
  - Certifications → `/admin/certifications`
  - Testimonials → `/admin/testimonials`
  - Blog → `/admin/blog`
  - Awards → `/admin/awards`
  - Open Source → `/admin/open-source`
- Use appropriate Lucide icons for each (User, Briefcase, FolderOpen, Code, GraduationCap, Award, MessageSquare, PenSquare, Trophy, GitBranch, LayoutDashboard)
- Add a divider line before Certifications to separate core sections from optional ones

**Update `src/app/(admin)/layout.tsx`**:
- Import and render `<SidebarNav />` inside the sidebar div replacing any placeholder nav
- Keep the "Ready-Go" brand text at the top
- Keep the sign-out button at the bottom
- Sidebar should be scrollable if nav items overflow

Do not create any other files. Do not modify any other existing files. Do not install any packages.
