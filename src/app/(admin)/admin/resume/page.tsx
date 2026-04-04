import { Metadata } from 'next'
import { getMyResumeData } from '@/lib/actions/resume'
import ResumeBuilderPanel from '@/components/admin/resume/resume-builder-panel'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Resume Builder | Ready-Go Admin',
  description: 'Manage your resume templates and download as PDF.',
}

export default async function AdminResumePage() {
  const data = await getMyResumeData()
  
  if (!data) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div>
        <h1 className="font-heading text-3xl font-bold text-app-text">Resume Builder</h1>
        <p className="text-app-text/60 mt-1">
          Your resume auto-updates when you edit any section. Click a template to select it, then download.
        </p>
      </div>

      <ResumeBuilderPanel data={data} settings={data.resumeSettings} />
    </div>
  )
}
