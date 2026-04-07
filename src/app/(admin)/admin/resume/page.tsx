import { getMyResumeData } from '@/lib/actions/resume'
import { createClient } from '@/lib/supabase/server'
import ResumeBuilderPanel from '@/components/admin/resume/resume-builder-panel'
import { ResumeTemplate } from '@/types/resume'

export default async function ResumePage() {
  const data = await getMyResumeData()
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch resume settings separately for initial state
  const { data: settings } = await supabase
    .from('resume_settings')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  if (!data) return null

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-app-text">Resume Builder</h1>
        <p className="font-body text-app-text/60 mt-1">
          Your resume auto-updates when you edit any section.
          What you see in the preview is exactly what downloads.
        </p>
      </div>

      <ResumeBuilderPanel
        data={data}
        initialTemplate={(settings?.default_template as ResumeTemplate) ?? 'executive'}
        initialAts={settings?.ats_mode ?? false}
        initialPhoto={settings?.include_photo ?? true}
      />
    </div>
  )
}
