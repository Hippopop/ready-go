"use server";

'use server'

import { createClient } from '@/lib/supabase/server'

export async function getPortfolioData(uid: string) {
  const supabase = await createClient()
  
  const [
    profile,
    hero,
    about,
    socialLinks,
    experiences,
    projects,
    skills,
    education,
    certifications,
    testimonials,
    blogPosts,
    awards,
    openSource,
    sectionSettings,
    theme,
    resumeSettings,
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', uid).single(),
    supabase.from('hero').select('*').eq('user_id', uid).single(),
    supabase.from('about').select('*').eq('user_id', uid).single(),
    supabase.from('social_links').select('*').eq('user_id', uid).order('display_order'),
    supabase.from('experiences').select('*').eq('user_id', uid).order('display_order'),
    supabase.from('projects').select('*').eq('user_id', uid).order('display_order'),
    supabase.from('skills').select('*').eq('user_id', uid).order('display_order'),
    supabase.from('education').select('*').eq('user_id', uid).order('display_order'),
    supabase.from('certifications').select('*').eq('user_id', uid).order('display_order'),
    supabase.from('testimonials').select('*').eq('user_id', uid).order('display_order'),
    supabase.from('blog_posts').select('*').eq('user_id', uid).order('published_at', { ascending: false }),
    supabase.from('awards').select('*').eq('user_id', uid).order('display_order'),
    supabase.from('open_source_contributions').select('*').eq('user_id', uid).order('display_order'),
    supabase.from('section_settings').select('*').eq('user_id', uid).order('display_order'),
    supabase.from('themes').select('*').eq('user_id', uid).single(),
    supabase.from('resume_settings').select('*').eq('user_id', uid).single(),
  ])

  return {
    profile: profile.data,
    hero: hero.data,
    about: about.data,
    socialLinks: socialLinks.data ?? [],
    experiences: experiences.data ?? [],
    projects: projects.data ?? [],
    skills: skills.data ?? [],
    education: education.data ?? [],
    certifications: certifications.data ?? [],
    testimonials: testimonials.data ?? [],
    blogPosts: blogPosts.data ?? [],
    awards: awards.data ?? [],
    openSource: openSource.data ?? [],
    sectionSettings: sectionSettings.data ?? [],
    theme: theme.data,
    resumeSettings: resumeSettings.data,
  }
}

export type PortfolioData = Awaited<ReturnType<typeof getPortfolioData>>
