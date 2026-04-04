"use server";

import { createClient } from '@/lib/supabase/server';
import { ResumeData } from '@/types/resume';
import { revalidatePath } from 'next/cache';

/**
 * Fetch all data needed to render any resume template for a given user ID.
 * Uses the anon client (public read) - similar to portfolio data.
 */
export async function getResumeData(uid: string): Promise<ResumeData | null> {
  const supabase = await createClient();

  const [
    { data: profile },
    { data: hero },
    { data: about },
    { data: socialLinks },
    { data: experiences },
    { data: projects },
    { data: skills },
    { data: education },
    { data: certifications },
    { data: awards },
    { data: resumeSettings },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name, email, avatar_url').eq('id', uid).single(),
    supabase.from('hero').select('headline, tagline, profile_image_url, cta_primary_url').eq('user_id', uid).single(),
    supabase.from('about').select('bio, location, availability_status, years_of_experience').eq('user_id', uid).single(),
    supabase.from('social_links').select('platform, url').eq('user_id', uid).order('display_order'),
    supabase.from('experiences').select('*').eq('user_id', uid).order('start_date', { ascending: false }),
    supabase.from('projects').select('*').eq('user_id', uid).eq('is_featured', true).order('display_order').limit(3),
    supabase.from('skills').select('name, category, proficiency').eq('user_id', uid).order('display_order'),
    supabase.from('education').select('*').eq('user_id', uid).order('start_year', { ascending: false }),
    supabase.from('certifications').select('*').eq('user_id', uid).order('issue_date', { ascending: false }),
    supabase.from('awards').select('*').eq('user_id', uid).order('date', { ascending: false }),
    supabase.from('resume_settings').select('include_photo, ats_mode, default_template').eq('user_id', uid).single(),
  ]);

  if (!profile) return null;

  return {
    profile: {
      full_name: profile.full_name,
      email: profile.email,
      avatar_url: profile.avatar_url,
    },
    hero: hero || null,
    about: about || null,
    socialLinks: socialLinks || [],
    experiences: experiences || [],
    projects: projects || [],
    skills: skills || [],
    education: education || [],
    certifications: certifications || [],
    awards: awards || [],
    resumeSettings: resumeSettings || null,
  };
}

/**
 * Fetch resume data for the currently logged-in user (admin context).
 * Uses server client with auth.
 */
export async function getMyResumeData(): Promise<ResumeData | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return getResumeData(user.id);
}

/**
 * Update resume settings for the currently logged-in user.
 * Upserts into resume_settings with onConflict: 'user_id'.
 */
export async function updateResumeSettings(data: {
  default_template?: string;
  include_photo?: boolean;
  ats_mode?: boolean;
}): Promise<{ success: true } | { error: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'You must be signed in to update settings' };
    }

    const { error } = await supabase.from('resume_settings').upsert(
      {
        user_id: user.id,
        ...data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      console.error('[updateResumeSettings]', error.message);
      return { error: 'Failed to update resume settings' };
    }

    revalidatePath('/admin/resume');
    return { success: true };
  } catch (err) {
    console.error('[updateResumeSettings]', err);
    return { error: 'An unexpected error occurred' };
  }
}
