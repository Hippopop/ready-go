"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { testimonialSchema, type TestimonialFormValues } from '@/lib/validations/testimonial';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActionResult = { success: true } | { error: string };

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetches all testimonials for the currently authenticated user, ordered by display_order. */
export async function getTestimonials() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('[getTestimonials]', error.message);
    return [];
  }

  return data ?? [];
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Validates and inserts a new testimonial for the currently authenticated user. */
export async function createTestimonial(
  formData: TestimonialFormValues,
): Promise<ActionResult> {
  const parsed = testimonialSchema.safeParse(formData);

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
    .from('testimonials')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const displayOrder = (count ?? 0) + 1;

  const { error } = await supabase.from('testimonials').insert({
    user_id: user.id,
    author_name: parsed.data.author_name,
    author_title: parsed.data.author_title || null,
    author_company: parsed.data.author_company || null,
    author_avatar_url: parsed.data.author_avatar_url || null,
    content: parsed.data.content,
    linkedin_url: parsed.data.linkedin_url || null,
    display_order: displayOrder,
  });

  if (error) {
    console.error('[createTestimonial]', error.message);
    return { error: 'Failed to create testimonial. Please try again.' };
  }

  revalidatePath('/admin/testimonials');
  return { success: true };
}

/** Validates and updates an existing testimonial, verifying ownership. */
export async function updateTestimonial(
  id: string,
  formData: TestimonialFormValues,
): Promise<ActionResult> {
  const parsed = testimonialSchema.safeParse(formData);

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
    .from('testimonials')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !existing) {
    return { error: 'Testimonial not found or access denied' };
  }

  const { error } = await supabase
    .from('testimonials')
    .update({
      author_name: parsed.data.author_name,
      author_title: parsed.data.author_title || null,
      author_company: parsed.data.author_company || null,
      author_avatar_url: parsed.data.author_avatar_url || null,
      content: parsed.data.content,
      linkedin_url: parsed.data.linkedin_url || null,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[updateTestimonial]', error.message);
    return { error: 'Failed to update testimonial. Please try again.' };
  }

  revalidatePath('/admin/testimonials');
  return { success: true };
}

/** Deletes a testimonial by id, verifying ownership first. */
export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to delete records' };
  }

  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[deleteTestimonial]', error.message);
    return { error: 'Failed to delete testimonial. Please try again.' };
  }

  revalidatePath('/admin/testimonials');
  return { success: true };
}
