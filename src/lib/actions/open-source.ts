'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { openSourceSchema, type OpenSourceFormValues } from '@/lib/validations/open-source';

type ActionResult = { success: true } | { error: string };

/** Fetches all open source contributions for the current user, ordered by stars desc. */
export async function getOpenSourceContributions() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('open_source_contributions')
    .select('*')
    .eq('user_id', user.id)
    .order('stars', { ascending: false });

  if (error) {
    console.error('[getOpenSourceContributions]', error.message);
    return [];
  }

  return data ?? [];
}

/** Inserts a new open source contribution for the current user. */
export async function createContribution(
  data: OpenSourceFormValues,
): Promise<ActionResult> {
  const parsed = openSourceSchema.safeParse(data);

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

  // Get current count for display_order
  const { count } = await supabase
    .from('open_source_contributions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const displayOrder = (count ?? 0) + 1;

  const { error } = await supabase.from('open_source_contributions').insert({
    user_id: user.id,
    repo_name: parsed.data.repo_name,
    repo_url: parsed.data.repo_url || null,
    description: parsed.data.description || null,
    language: parsed.data.language || null,
    stars: parsed.data.stars,
    role: parsed.data.role,
    display_order: displayOrder,
  });

  if (error) {
    console.error('[createContribution]', error.message);
    return { error: 'Failed to create contribution. Please try again.' };
  }

  revalidatePath('/admin/open-source');
  return { success: true };
}

/** Updates an existing open source contribution, verifying ownership. */
export async function updateContribution(
  id: string,
  data: OpenSourceFormValues,
): Promise<ActionResult> {
  const parsed = openSourceSchema.safeParse(data);

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

  // Verify ownership
  const { data: existing, error: fetchError } = await supabase
    .from('open_source_contributions')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !existing) {
    return { error: 'Contribution not found or access denied' };
  }

  const { error } = await supabase
    .from('open_source_contributions')
    .update({
      repo_name: parsed.data.repo_name,
      repo_url: parsed.data.repo_url || null,
      description: parsed.data.description || null,
      language: parsed.data.language || null,
      stars: parsed.data.stars,
      role: parsed.data.role,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[updateContribution]', error.message);
    return { error: 'Failed to update contribution. Please try again.' };
  }

  revalidatePath('/admin/open-source');
  return { success: true };
}

/** Deletes an open source contribution, verifying ownership. */
export async function deleteContribution(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to delete records' };
  }

  const { error } = await supabase
    .from('open_source_contributions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[deleteContribution]', error.message);
    return { error: 'Failed to delete contribution. Please try again.' };
  }

  revalidatePath('/admin/open-source');
  return { success: true };
}
