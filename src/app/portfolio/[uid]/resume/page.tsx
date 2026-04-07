// Public page that shows the PDF for download
// This is what the "Download Resume" button on the portfolio links to
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PublicResumeViewer from '@/components/portfolio/public-resume-viewer'

export default async function PublicResumePage({
  params
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params

  // Verify user exists
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', uid)
    .single()

  if (!profile) redirect('/404')

  // Render a client page that shows the PDF viewer
  return <PublicResumeViewer uid={uid} />
}
