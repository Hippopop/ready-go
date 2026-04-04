"use server";

'use server'
 
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database'
 
type SectionSetting = Database['public']['Tables']['section_settings']['Row']
 
async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
 
  if (!user) {
    throw new Error('Not authenticated')
  }
 
  return user.id
}
 
/** Fetch all section_settings rows for current user ordered by display_order */
export async function getSectionSettings(): Promise<SectionSetting[]> {
  try {
    const userId = await getAuthenticatedUserId()
    const supabase = await createClient()
 
    const { data, error } = await supabase
      .from('section_settings')
      .select('*')
      .eq('user_id', userId)
      .order('display_order', { ascending: true })
 
    if (error) throw new Error(error.message)
    return data || []
  } catch (error) {
    console.error('Failed to fetch section settings:', error)
    return []
  }
}
 
/** Update a single row's is_visible */
export async function updateSectionVisibility(sectionKey: string, isVisible: boolean) {
  try {
    const userId = await getAuthenticatedUserId()
    const supabase = await createClient()
 
    const { error } = await supabase
      .from('section_settings')
      .update({ is_visible: isVisible })
      .eq('section_key', sectionKey)
      .eq('user_id', userId)
 
    if (error) throw new Error(error.message)
 
    revalidatePath('/admin/sections')
    return { success: true }
  } catch (error) {
    console.error('Failed to update section visibility:', error)
    return { success: false, error: 'Failed to update visibility' }
  }
}
 
/** Batch update display_order for all sections. */
export async function updateSectionOrder(sections: { section_key: string, display_order: number }[]) {
  try {
    const userId = await getAuthenticatedUserId()
    const supabase = await createClient()
 
    // Supabase doesn't easily support bulk updates with different values per row, 
    // so we handle it with a loop as requested. Each update verifies ownership.
    for (const section of sections) {
      const { error } = await supabase
        .from('section_settings')
        .update({ display_order: section.display_order })
        .eq('section_key', section.section_key)
        .eq('user_id', userId)
 
      if (error) throw new Error(error.message)
    }
 
    revalidatePath('/admin/sections')
    return { success: true }
  } catch (error) {
    console.error('Failed to update section order:', error)
    return { success: false, error: 'Failed to update section order' }
  }
}
