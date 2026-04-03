'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { experienceSchema, type ExperienceFormValues } from '@/lib/validations/experience';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActionResult = { success: true } | { error: string };

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetches all experience rows for the currently authenticated user, ordered by display_order. */
export async function getExperiences() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('[getExperiences]', error.message);
    return [];
  }

  return data ?? [];
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Validates and inserts a new experience row for the currently authenticated user. */
export async function createExperience(
  formData: ExperienceFormValues,
): Promise<ActionResult> {
  const parsed = experienceSchema.safeParse(formData);

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

  // Determine display_order — place new entries at the end
  const { count } = await supabase
    .from('experiences')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const displayOrder = (count ?? 0) + 1;

  const { error } = await supabase.from('experiences').insert({
    user_id: user.id,
    company_name: parsed.data.company_name,
    company_url: parsed.data.company_url || null,
    company_logo_url: parsed.data.company_logo_url || null,
    role: parsed.data.role,
    employment_type: parsed.data.employment_type,
    start_date: parsed.data.start_date,
    end_date: parsed.data.end_date || null,
    is_current: parsed.data.is_current,
    description: parsed.data.description || null,
    tech_stack: parsed.data.tech_stack ?? null,
    display_order: displayOrder,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('[createExperience]', error.message);
    return { error: 'Failed to create experience. Please try again.' };
  }

  revalidatePath('/admin/experience');
  return { success: true };
}

/** Validates and updates an existing experience row, verifying ownership. */
export async function updateExperience(
  id: string,
  formData: ExperienceFormValues,
): Promise<ActionResult> {
  const parsed = experienceSchema.safeParse(formData);

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

  // Verify ownership before updating
  const { data: existing, error: fetchError } = await supabase
    .from('experiences')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !existing) {
    return { error: 'Experience not found or access denied' };
  }

  const { error } = await supabase
    .from('experiences')
    .update({
      company_name: parsed.data.company_name,
      company_url: parsed.data.company_url || null,
      company_logo_url: parsed.data.company_logo_url || null,
      role: parsed.data.role,
      employment_type: parsed.data.employment_type,
      start_date: parsed.data.start_date,
      end_date: parsed.data.end_date || null,
      is_current: parsed.data.is_current,
      description: parsed.data.description || null,
      tech_stack: parsed.data.tech_stack ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[updateExperience]', error.message);
    return { error: 'Failed to update experience. Please try again.' };
  }

  revalidatePath('/admin/experience');
  return { success: true };
}

/** Deletes an experience row by id, verifying ownership first. */
export async function deleteExperience(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to delete records' };
  }

  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[deleteExperience]', error.message);
    return { error: 'Failed to delete experience. Please try again.' };
  }

  revalidatePath('/admin/experience');
  return { success: true };
}
