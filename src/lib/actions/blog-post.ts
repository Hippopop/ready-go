'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { blogPostSchema, type BlogPostFormValues } from '@/lib/validations/blog-post';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActionResult = { success: true } | { error: string };

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetches all blog posts for the currently authenticated user, ordered by published_at DESC. */
export async function getBlogPosts() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[getBlogPosts]', error.message);
    return [];
  }

  return data ?? [];
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Validates and inserts a new blog post for the currently authenticated user. */
export async function createBlogPost(formData: BlogPostFormValues): Promise<ActionResult> {
  const parsed = blogPostSchema.safeParse(formData);

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

  // Determine display_order
  const { count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const displayOrder = (count ?? 0) + 1;

  const { error } = await supabase.from('blog_posts').insert({
    user_id: user.id,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt || null,
    url: parsed.data.url,
    cover_image_url: parsed.data.cover_image_url || null,
    published_at: parsed.data.published_at || null,
    reading_time_minutes: parsed.data.reading_time_minutes ?? null,
    tags: parsed.data.tags ?? null,
    display_order: displayOrder,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('[createBlogPost]', error.message);
    return { error: 'Failed to create blog post. Please try again.' };
  }

  revalidatePath('/admin/blog');
  return { success: true };
}

/** Validates and updates an existing blog post, verifying ownership. */
export async function updateBlogPost(id: string, formData: BlogPostFormValues): Promise<ActionResult> {
  const parsed = blogPostSchema.safeParse(formData);

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
    .from('blog_posts')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !existing) {
    return { error: 'Blog post not found or access denied' };
  }

  const { error } = await supabase
    .from('blog_posts')
    .update({
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      url: parsed.data.url,
      cover_image_url: parsed.data.cover_image_url || null,
      published_at: parsed.data.published_at || null,
      reading_time_minutes: parsed.data.reading_time_minutes ?? null,
      tags: parsed.data.tags ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[updateBlogPost]', error.message);
    return { error: 'Failed to update blog post. Please try again.' };
  }

  revalidatePath('/admin/blog');
  return { success: true };
}

/** Deletes a blog post by id, verifying ownership first. */
export async function deleteBlogPost(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to delete records' };
  }

  const { error } = await supabase.from('blog_posts').delete().eq('id', id).eq('user_id', user.id);

  if (error) {
    console.error('[deleteBlogPost]', error.message);
    return { error: 'Failed to delete blog post. Please try again.' };
  }

  revalidatePath('/admin/blog');
  return { success: true };
}
