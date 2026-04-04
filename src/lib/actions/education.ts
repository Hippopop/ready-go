"use server";

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { educationSchema, type EducationFormValues } from '@/lib/validations/education';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActionResult = { success: true } | { error: string };

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetches all education rows for the currently authenticated user, ordered by display_order. */
export async function getEducation() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('[getEducation]', error.message);
    return [];
  }

  return data ?? [];
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Validates and inserts a new education row for the currently authenticated user. */
export async function createEducation(
  formData: EducationFormValues,
): Promise<ActionResult> {
  const parsed = educationSchema.safeParse(formData);

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
    .from('education')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const displayOrder = (count ?? 0) + 1;

  const { error } = await supabase.from('education').insert({
    user_id: user.id,
    institution: parsed.data.institution,
    institution_logo_url: parsed.data.institution_logo_url || null,
    degree: parsed.data.degree || null,
    field_of_study: parsed.data.field_of_study || null,
    start_year: parsed.data.start_year || null,
    end_year: parsed.data.end_year || null,
    gpa: parsed.data.gpa || null,
    honors: parsed.data.honors || null,
    description: parsed.data.description || null,
    display_order: displayOrder,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('[createEducation]', error.message);
    return { error: 'Failed to create education entry. Please try again.' };
  }

  revalidatePath('/admin/education');
  return { success: true };
}

/** Validates and updates an existing education row, verifying ownership. */
export async function updateEducation(
  id: string,
  formData: EducationFormValues,
): Promise<ActionResult> {
  const parsed = educationSchema.safeParse(formData);

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
    .from('education')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !existing) {
    return { error: 'Education entry not found or access denied' };
  }

  const { error } = await supabase
    .from('education')
    .update({
      institution: parsed.data.institution,
      institution_logo_url: parsed.data.institution_logo_url || null,
      degree: parsed.data.degree || null,
      field_of_study: parsed.data.field_of_study || null,
      start_year: parsed.data.start_year || null,
      end_year: parsed.data.end_year || null,
      gpa: parsed.data.gpa || null,
      honors: parsed.data.honors || null,
      description: parsed.data.description || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[updateEducation]', error.message);
    return { error: 'Failed to update education entry. Please try again.' };
  }

  revalidatePath('/admin/education');
  return { success: true };
}

/** Deletes an education row by id, verifying ownership first. */
export async function deleteEducation(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to delete records' };
  }

  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[deleteEducation]', error.message);
    return { error: 'Failed to delete education entry. Please try again.' };
  }

  revalidatePath('/admin/education');
  return { success: true };
}
