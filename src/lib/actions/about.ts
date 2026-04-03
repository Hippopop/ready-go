'use server';

import { createClient } from '@/lib/supabase/server';
import { aboutSchema, socialLinkSchema } from '@/lib/validations/about';
import type { AboutFormValues, SocialLinkFormValues } from '@/lib/validations/about';
import type { Database } from '@/types/database';

// ---------------------------------------------------------------------------
// Helper — get authenticated user or throw
// ---------------------------------------------------------------------------
type AboutRow = Database['public']['Tables']['about']['Row'];
type SocialLinkRow = Database['public']['Tables']['social_links']['Row'];

interface ActionResult<T = null> {
  success: boolean;
  data?: T;
  error?: string;
}

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  return user.id;
}

// ---------------------------------------------------------------------------
// About CRUD
// ---------------------------------------------------------------------------

/** Fetch the about row for the current user */
export async function getAbout(): Promise<ActionResult<AboutRow | null>> {
  try {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('about')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch about data';
    return { success: false, error: message };
  }
}

/** Upsert the about row for the current user */
export async function upsertAbout(
  formData: AboutFormValues,
): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    // Server-side validation
    const parsed = aboutSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors.map((e) => e.message).join(', '),
      };
    }

    const supabase = await createClient();

    const { error } = await supabase.from('about').upsert(
      {
        user_id: userId,
        bio: parsed.data.bio,
        location: parsed.data.location || null,
        availability_status: parsed.data.availability_status,
        years_of_experience:
          parsed.data.years_of_experience === '' || parsed.data.years_of_experience === undefined
            ? null
            : Number(parsed.data.years_of_experience),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save about data';
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Social links CRUD
// ---------------------------------------------------------------------------

/** Fetch all social links for the current user, ordered by display_order */
export async function getSocialLinks(): Promise<ActionResult<SocialLinkRow[]>> {
  try {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('user_id', userId)
      .order('display_order', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data ?? [] };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch social links';
    return { success: false, error: message };
  }
}

/** Add a new social link for the current user */
export async function addSocialLink(
  formData: SocialLinkFormValues,
): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    // Server-side validation
    const parsed = socialLinkSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors.map((e) => e.message).join(', '),
      };
    }

    const supabase = await createClient();

    // Determine the next display_order
    const { data: existing } = await supabase
      .from('social_links')
      .select('display_order')
      .eq('user_id', userId)
      .order('display_order', { ascending: false })
      .limit(1);

    const nextOrder =
      existing && existing.length > 0 && existing[0].display_order !== null
        ? existing[0].display_order + 1
        : 0;

    const { error } = await supabase.from('social_links').insert({
      user_id: userId,
      platform: parsed.data.platform,
      url: parsed.data.url,
      display_order: nextOrder,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to add social link';
    return { success: false, error: message };
  }
}

/** Delete a social link by ID (verifies ownership via user_id) */
export async function deleteSocialLink(id: string): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { error } = await supabase
      .from('social_links')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete social link';
    return { success: false, error: message };
  }
}
