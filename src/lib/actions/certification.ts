"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { certificationSchema, type CertificationFormValues } from '@/lib/validations/certification';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActionResult = { success: true } | { error: string };

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetches all certification rows for the currently authenticated user, ordered by display_order. */
export async function getCertifications() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('[getCertifications]', error.message);
    return [];
  }

  return data ?? [];
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Validates and inserts a new certification row for the currently authenticated user. */
export async function createCertification(
  formData: CertificationFormValues,
): Promise<ActionResult> {
  const parsed = certificationSchema.safeParse(formData);

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
    .from('certifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const displayOrder = (count ?? 0) + 1;

  const { error } = await supabase.from('certifications').insert({
    user_id: user.id,
    name: parsed.data.name,
    issuer: parsed.data.issuer || null,
    issue_date: parsed.data.issue_date || null,
    expiry_date: parsed.data.expiry_date || null,
    credential_url: parsed.data.credential_url || null,
    badge_image_url: parsed.data.badge_image_url || null,
    display_order: displayOrder,
  });

  if (error) {
    console.error('[createCertification]', error.message);
    return { error: 'Failed to create certification. Please try again.' };
  }

  revalidatePath('/admin/certifications');
  return { success: true };
}

/** Validates and updates an existing certification row, verifying ownership. */
export async function updateCertification(
  id: string,
  formData: CertificationFormValues,
): Promise<ActionResult> {
  const parsed = certificationSchema.safeParse(formData);

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
    .from('certifications')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !existing) {
    return { error: 'Certification not found or access denied' };
  }

  const { error } = await supabase
    .from('certifications')
    .update({
      name: parsed.data.name,
      issuer: parsed.data.issuer || null,
      issue_date: parsed.data.issue_date || null,
      expiry_date: parsed.data.expiry_date || null,
      credential_url: parsed.data.credential_url || null,
      badge_image_url: parsed.data.badge_image_url || null,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[updateCertification]', error.message);
    return { error: 'Failed to update certification. Please try again.' };
  }

  revalidatePath('/admin/certifications');
  return { success: true };
}

/** Deletes a certification row by id, verifying ownership first. */
export async function deleteCertification(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to delete records' };
  }

  const { error } = await supabase
    .from('certifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[deleteCertification]', error.message);
    return { error: 'Failed to delete certification. Please try again.' };
  }

  revalidatePath('/admin/certifications');
  return { success: true };
}
