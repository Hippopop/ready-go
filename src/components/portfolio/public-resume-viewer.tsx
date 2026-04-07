'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ResumeData, ResumeTemplate } from '@/types/resume'
import { createClient } from '@/lib/supabase/client'

const PDFViewer = dynamic(() => import('@/components/resume/PDFViewer'), { ssr: false })

export default function PublicResumeViewer({ uid }: { uid: string }) {
  const [data, setData] = useState<ResumeData | null>(null)
  const [template, setTemplate] = useState<ResumeTemplate>('executive')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [profile, hero, about, socialLinks, experiences, projects,
             skills, education, certifications, awards, resumeSettings] =
        await Promise.all([
          supabase.from('profiles').select('*').eq('id', uid).single(),
          supabase.from('hero').select('*').eq('user_id', uid).single(),
          supabase.from('about').select('*').eq('user_id', uid).single(),
          supabase.from('social_links').select('*').eq('user_id', uid).order('display_order'),
          supabase.from('experiences').select('*').eq('user_id', uid).order('display_order'),
          supabase.from('projects').select('*').eq('user_id', uid).eq('is_featured', true).limit(3),
          supabase.from('skills').select('*').eq('user_id', uid).order('display_order'),
          supabase.from('education').select('*').eq('user_id', uid).order('display_order'),
          supabase.from('certifications').select('*').eq('user_id', uid).order('display_order'),
          supabase.from('awards').select('*').eq('user_id', uid).order('display_order'),
          supabase.from('resume_settings').select('*').eq('user_id', uid).single(),
        ])

      if (!profile.data) return

      setTemplate((resumeSettings.data?.default_template as ResumeTemplate) ?? 'executive')
      setData({
        profile: profile.data,
        hero: hero.data,
        about: about.data,
        socialLinks: socialLinks.data ?? [],
        experiences: experiences.data ?? [],
        projects: projects.data ?? [],
        skills: skills.data ?? [],
        education: education.data ?? [],
        certifications: certifications.data ?? [],
        awards: awards.data ?? [],
        resumeSettings: resumeSettings.data,
      })
      setLoading(false)
    }
    load()
  }, [uid])

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="font-body text-app-text/40">Loading resume...</p>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="font-body text-app-text/40">Resume not found.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-[840px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold text-app-text">
            {data.profile.full_name}&apos;s Resume
          </h1>
          <div className="flex items-center gap-2 text-app-text/50">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <p className="font-body text-sm">Live Preview (Standard A4 Layout)</p>
          </div>
        </div>
        
        <PDFViewer template={template} data={data} />
      </div>
    </div>
  )
}
