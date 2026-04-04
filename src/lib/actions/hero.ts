"use server";

'use server';

import { createClient } from '@/lib/supabase/server';
import { heroSchema, type HeroFormValues } from '@/lib/validations/hero';

/** Fetches the hero row for the currently authenticated user, or null. */
export async function getHero() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('hero')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = row not found — that's expected for new users
    console.error('[getHero]', error.message);
    return null;
  }

  return data;
}

/** Fetches the hero row for any user ID (public-facing). */
export async function getHeroPublic(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('hero')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[getHeroPublic]', error.message);
    return null;
  }

  return data;
}

/** Validates and upserts hero data for the currently authenticated user. */
export async function upsertHero(
  formData: HeroFormValues,
): Promise<{ success: true } | { error: string }> {
  const parsed = heroSchema.safeParse(formData);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { error: firstIssue?.message ?? 'Validation failed' };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to save changes' };
  }

  const { error } = await supabase.from('hero').upsert(
    {
      user_id: user.id,
      headline: parsed.data.headline,
      subheadline: parsed.data.subheadline || null,
      tagline: parsed.data.tagline || null,
      profile_image_url: parsed.data.profile_image_url || null,
      cta_primary_text: parsed.data.cta_primary_text,
      cta_primary_url: parsed.data.cta_primary_url || null,
      cta_secondary_text: parsed.data.cta_secondary_text,
      is_typing_animation: parsed.data.is_typing_animation,
      typing_texts: parsed.data.typing_texts ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    console.error('[upsertHero]', error.message);
    return { error: 'Failed to save hero section. Please try again.' };
  }

  return { success: true };
}
