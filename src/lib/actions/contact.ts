'use server'
 
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
 
export async function getContactSubmissions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
 
  const { data } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('portfolio_owner_id', user.id)
    .order('created_at', { ascending: false })
 
  return data ?? []
}
 
export async function markAsRead(id: string) {
  const supabase = await createClient()
  await supabase
    .from('contact_submissions')
    .update({ is_read: true })
    .eq('id', id)
  revalidatePath('/admin/inbox')
}
 
export async function deleteSubmission(id: string) {
  const supabase = await createClient()
  await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', id)
  revalidatePath('/admin/inbox')
}
 
export async function getUnreadCount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0
 
  const { count } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('portfolio_owner_id', user.id)
    .eq('is_read', false)
 
  return count ?? 0
}
