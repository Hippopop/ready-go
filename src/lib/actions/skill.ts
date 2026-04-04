"use server";

'use server';

import { createClient } from '@/lib/supabase/server';
import { skillSchema, type SkillFormValues } from '@/lib/validations/skill';
import type { Database } from '@/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type SkillRow = Database['public']['Tables']['skills']['Row'];

interface ActionResult<T = null> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// Helper — get authenticated user ID or throw
// ---------------------------------------------------------------------------
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
// Read
// ---------------------------------------------------------------------------

/**
 * Fetch all skills for the current user ordered by category then display_order.
 */
export async function getSkills(): Promise<ActionResult<SkillRow[]>> {
  try {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', userId)
      .order('category', { ascending: true, nullsFirst: false })
      .order('display_order', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data ?? [] };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch skills';
    return { success: false, error: message };
  }
}

/** Fetch all skills for any user ID (public-facing). */
export async function getSkillsPublic(
  userId: string,
): Promise<ActionResult<SkillRow[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', userId)
      .order('category', { ascending: true, nullsFirst: false })
      .order('display_order', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data ?? [] };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to fetch public skills';
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

/** Insert a new skill for the current user. */
export async function createSkill(
  formData: SkillFormValues,
): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    // Server-side validation
    const parsed = skillSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((e) => e.message).join(', '),
      };
    }

    const supabase = await createClient();

    // Determine the next display_order within the same category
    const { data: existing } = await supabase
      .from('skills')
      .select('display_order')
      .eq('user_id', userId)
      .order('display_order', { ascending: false })
      .limit(1);

    const nextOrder =
      existing && existing.length > 0 && existing[0].display_order !== null
        ? existing[0].display_order + 1
        : 0;

    const { error } = await supabase.from('skills').insert({
      user_id: userId,
      name: parsed.data.name,
      category: parsed.data.category || null,
      icon_url: parsed.data.icon_url || null,
      proficiency: parsed.data.proficiency,
      years_of_experience: parsed.data.years_of_experience ?? null,
      display_order: nextOrder,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create skill';
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

/** Update an existing skill (verifies ownership via user_id). */
export async function updateSkill(
  id: string,
  formData: SkillFormValues,
): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();

    // Server-side validation
    const parsed = skillSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((e) => e.message).join(', '),
      };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('skills')
      .update({
        name: parsed.data.name,
        category: parsed.data.category || null,
        icon_url: parsed.data.icon_url || null,
        proficiency: parsed.data.proficiency,
        years_of_experience: parsed.data.years_of_experience ?? null,
      })
      .eq('id', id)
      .eq('user_id', userId); // ownership check

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update skill';
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

/** Delete a skill by ID (verifies ownership via user_id). */
export async function deleteSkill(id: string): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId();
    const supabase = await createClient();

    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // ownership check

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete skill';
    return { success: false, error: message };
  }
}
