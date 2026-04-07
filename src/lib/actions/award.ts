"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { awardSchema, type AwardFormValues } from '@/lib/validations/award';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActionResult = { success: true } | { error: string };

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetches all award rows for the currently authenticated user, ordered by date desc. */
export async function getAwards() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('awards')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) {
    console.error('[getAwards]', error.message);
    return [];
  }

  return data ?? [];
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Validates and inserts a new award row for the currently authenticated user. */
export async function createAward(
  formData: AwardFormValues,
): Promise<ActionResult> {
  const parsed = awardSchema.safeParse(formData);

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
    .from('awards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const displayOrder = (count ?? 0) + 1;

  const { error } = await supabase.from('awards').insert({
    user_id: user.id,
    title: parsed.data.title,
    issuer: parsed.data.issuer || null,
    date: parsed.data.date || null,
    description: parsed.data.description || null,
    url: parsed.data.url || null,
    display_order: displayOrder,
  });

  if (error) {
    console.error('[createAward]', error.message);
    return { error: 'Failed to create award. Please try again.' };
  }

  revalidatePath('/admin/awards');
  return { success: true };
}

/** Validates and updates an existing award row, verifying ownership. */
export async function updateAward(
  id: string,
  formData: AwardFormValues,
): Promise<ActionResult> {
  const parsed = awardSchema.safeParse(formData);

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
    .from('awards')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !existing) {
    return { error: 'Award not found or access denied' };
  }

  const { error } = await supabase
    .from('awards')
    .update({
      title: parsed.data.title,
      issuer: parsed.data.issuer || null,
      date: parsed.data.date || null,
      description: parsed.data.description || null,
      url: parsed.data.url || null,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[updateAward]', error.message);
    return { error: 'Failed to update award. Please try again.' };
  }

  revalidatePath('/admin/awards');
  return { success: true };
}

/** Deletes an award row by id, verifying ownership first. */
export async function deleteAward(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to delete records' };
  }

  const { error } = await supabase
    .from('awards')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[deleteAward]', error.message);
    return { error: 'Failed to delete award. Please try again.' };
  }

  revalidatePath('/admin/awards');
  return { success: true };
}
