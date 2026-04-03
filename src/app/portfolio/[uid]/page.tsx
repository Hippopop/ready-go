import { notFound } from 'next/navigation'
import { getPortfolioData, PortfolioData } from '@/lib/actions/portfolio'
import { themeToCssVars } from '@/lib/theme-utils'
import { THEME_PRESETS } from '@/lib/theme-presets'
import { ThemeConfig } from '@/lib/validations/theme'

// Import all section components
import HeroSection from '@/components/portfolio/sections/hero-section'
import AboutSection from '@/components/portfolio/sections/about-section'
import ExperienceSection from '@/components/portfolio/sections/experience-section'
import ProjectsSection from '@/components/portfolio/sections/projects-section'
import SkillsSection from '@/components/portfolio/sections/skills-section'
import EducationSection from '@/components/portfolio/sections/education-section'
import CertificationsSection from '@/components/portfolio/sections/certifications-section'
import TestimonialsSection from '@/components/portfolio/sections/testimonials-section'
import BlogSection from '@/components/portfolio/sections/blog-section'
import AwardsSection from '@/components/portfolio/sections/awards-section'
import OpenSourceSection from '@/components/portfolio/sections/open-source-section'

// Import layout components
import PortfolioNav from '@/components/portfolio/portfolio-nav'
import ScrollToTop from '@/components/portfolio/scroll-to-top'
import SectionWrapper from '@/components/portfolio/section-wrapper'
import ContactSection from '@/components/portfolio/contact-section'
import { SectionHeading } from '@/components/portfolio/section-heading'

export default async function PortfolioPage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params
  const data: PortfolioData = await getPortfolioData(uid)

  if (!data.profile) notFound()

  // Use theme from DB or fall back to Minimal preset
  const theme = data.theme
    ? {
      ...data.theme,
      // Ensure required fields are present if DB row is partial
      color_primary: data.theme.color_primary || THEME_PRESETS[0].config.color_primary,
      color_accent: data.theme.color_accent || THEME_PRESETS[0].config.color_accent,
      color_background: data.theme.color_background || THEME_PRESETS[0].config.color_background,
      color_surface: data.theme.color_surface || THEME_PRESETS[0].config.color_surface,
      color_text: data.theme.color_text || THEME_PRESETS[0].config.color_text,
      font_heading: data.theme.font_heading || THEME_PRESETS[0].config.font_heading,
      font_body: data.theme.font_body || THEME_PRESETS[0].config.font_body,
      border_radius: data.theme.border_radius || THEME_PRESETS[0].config.border_radius,
      spacing: data.theme.spacing || THEME_PRESETS[0].config.spacing,
      animation_style: data.theme.animation_style || THEME_PRESETS[0].config.animation_style,
    }
    : THEME_PRESETS.find(p => p.name === 'Minimal')!.config

  // Determine visible sections in order
  const visibleSections = (data.sectionSettings ?? [])
    .filter(s => s.is_visible)
    .sort((a, b) => a.display_order - b.display_order)
    .map(s => s.section_key)

  const hasResume = !!data.resumeSettings?.default_template
  return (
    <>
      {/* Inject theme CSS variables for this user's portfolio */}
      <style id="ready-go-theme">{`:root { ${themeToCssVars(theme as ThemeConfig)} }`}</style>

      <div className="bg-background min-h-screen text-app-text font-body selection:bg-primary/20 selection:text-primary">

        <PortfolioNav
          profile={data.profile}
          sectionSettings={data.sectionSettings}
          uid={uid}
          hasResume={hasResume}
        />

        <main>
          {/* Hero is always first and full-screen, no SectionWrapper */}
          <HeroSection
            hero={data.hero}
            profile={data.profile}
            socialLinks={data.socialLinks}
            resumeSettings={data.resumeSettings}
            uid={uid}
          />
          {/* Render sections based on visibility + order */}
          {visibleSections.map(sectionKey => {
            switch (sectionKey) {
              case 'about':
                return data.about ? (
                  <SectionWrapper key="about" id="about">
                    <SectionHeading title="About Me" />
                    <AboutSection about={data.about} profile={data.profile} />
                  </SectionWrapper>
                ) : null

              case 'experience':
                return data.experiences.length > 0 ? (
                  <SectionWrapper key="experience" id="experience" className="bg-surface/30">
                    <SectionHeading title="Work Experience" />
                    <ExperienceSection experiences={data.experiences} />
                  </SectionWrapper>
                ) : null

              case 'projects':
                return data.projects.length > 0 ? (
                  <SectionWrapper key="projects" id="projects">
                    <SectionHeading title="Projects" subtitle="Things I&rsquo;ve built" />
                    <ProjectsSection projects={data.projects} />
                  </SectionWrapper>
                ) : null

              case 'skills':
                return data.skills.length > 0 ? (
                  <SectionWrapper key="skills" id="skills" className="bg-surface/30">
                    <SectionHeading title="Skills & Technologies" />
                    <SkillsSection skills={data.skills} />
                  </SectionWrapper>
                ) : null

              case 'education':
                return data.education.length > 0 ? (
                  <SectionWrapper key="education" id="education">
                    <SectionHeading title="Education" />
                    <EducationSection education={data.education} />
                  </SectionWrapper>
                ) : null

              case 'certifications':
                return data.certifications.length > 0 ? (
                  <SectionWrapper key="certifications" id="certifications" className="bg-surface/30">
                    <SectionHeading title="Certifications" />
                    <CertificationsSection certifications={data.certifications} />
                  </SectionWrapper>
                ) : null

              case 'testimonials':
                return data.testimonials.length > 0 ? (
                  <SectionWrapper key="testimonials" id="testimonials">
                    <SectionHeading title="Testimonials" subtitle="What people say" />
                    <TestimonialsSection testimonials={data.testimonials} />
                  </SectionWrapper>
                ) : null

              case 'blog':
                return data.blogPosts.length > 0 ? (
                  <SectionWrapper key="blog" id="blog" className="bg-surface/30">
                    <SectionHeading title="Blog" subtitle="My writing" />
                    <BlogSection blogPosts={data.blogPosts} />
                  </SectionWrapper>
                ) : null

              case 'awards':
                return data.awards.length > 0 ? (
                  <SectionWrapper key="awards" id="awards">
                    <SectionHeading title="Awards & Achievements" />
                    <AwardsSection awards={data.awards} />
                  </SectionWrapper>
                ) : null

              case 'open_source':
                return data.openSource.length > 0 ? (
                  <SectionWrapper key="open-source" id="open-source" className="bg-surface/30">
                    <SectionHeading title="Open Source" subtitle="My contributions" />
                    <OpenSourceSection openSource={data.openSource} />
                  </SectionWrapper>
                ) : null

              default:
                return null
            }
          })}

          {/* Contact is always last and always visible if settings exist */}
          <SectionWrapper id="contact">
            <SectionHeading title="Get In Touch" subtitle="Let&rsquo;s work together" />
            <ContactSection about={data.about} profile={data.profile} />
          </SectionWrapper>

        </main>

        {/* Footer */}
        <footer className="py-12 text-center border-t border-app-text/10">
          <p className="font-body text-app-text/40 text-sm">
            &copy; {new Date().getFullYear()} {data.profile.full_name}. Built with Ready-Go.
          </p>
        </footer>

        <ScrollToTop />
      </div>
    </>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params
  const data = await getPortfolioData(uid)
  if (!data.profile) return { title: 'Portfolio Not Found' }

  const siteTitle = `${data.profile.full_name ?? 'Portfolio'} — Developer Portfolio`
  const siteDesc = data.about?.bio?.slice(0, 160) ?? `Portfolio of ${data.profile.full_name}. Explore my experience, projects, and skills.`

  return {
    title: siteTitle,
    description: siteDesc,
    openGraph: {
      title: siteTitle,
      description: siteDesc,
      images: data.hero?.profile_image_url ? [data.hero.profile_image_url] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDesc,
      images: data.hero?.profile_image_url ? [data.hero.profile_image_url] : [],
    },
  }
}
