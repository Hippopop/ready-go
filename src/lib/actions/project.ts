"use server";

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { projectSchema, type ProjectFormValues } from '@/lib/validations/project';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActionResult = { success: true } | { error: string };

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetches all projects for the currently authenticated user, ordered by display_order. */
export async function getProjects() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('[getProjects]', error.message);
    return [];
  }

  return data ?? [];
}

/** Fetches all projects for any user ID (public-facing), ordered by display_order. */
export async function getProjectsPublic(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('[getProjectsPublic]', error.message);
    return [];
  }

  return data ?? [];
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Validates and inserts a new project for the currently authenticated user. */
export async function createProject(
  formData: ProjectFormValues,
): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(formData);

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
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const displayOrder = (count ?? 0) + 1;

  const { error } = await supabase.from('projects').insert({
    user_id: user.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    cover_image_url: parsed.data.cover_image_url || null,
    live_url: parsed.data.live_url || null,
    github_url: parsed.data.github_url || null,
    tech_stack: parsed.data.tech_stack || [],
    is_featured: parsed.data.is_featured,
    display_order: displayOrder,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('[createProject]', error.message);
    return { error: 'Failed to create project. Please try again.' };
  }

  revalidatePath('/admin/projects');
  return { success: true };
}

/** Validates and updates an existing project, verifying ownership. */
export async function updateProject(
  id: string,
  formData: ProjectFormValues,
): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(formData);

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
    .from('projects')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !existing) {
    return { error: 'Project not found or access denied' };
  }

  const { error } = await supabase
    .from('projects')
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      cover_image_url: parsed.data.cover_image_url || null,
      live_url: parsed.data.live_url || null,
      github_url: parsed.data.github_url || null,
      tech_stack: parsed.data.tech_stack || [],
      is_featured: parsed.data.is_featured,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[updateProject]', error.message);
    return { error: 'Failed to update project. Please try again.' };
  }

  revalidatePath('/admin/projects');
  return { success: true };
}

/** Deletes a project by id, verifying ownership first. */
export async function deleteProject(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to delete records' };
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[deleteProject]', error.message);
    return { error: 'Failed to delete project. Please try again.' };
  }

  revalidatePath('/admin/projects');
  return { success: true };
}
