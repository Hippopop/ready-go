'use client'

import { useState } from 'react'
import { ResumeData, ResumeTemplate } from '@/types/resume'
import { updateResumeSettings } from '@/lib/actions/resume'
import dynamic from 'next/dynamic'

const PDFViewer = dynamic(() => import('@/components/resume/PDFViewer'), { ssr: false })

const TEMPLATES: { id: ResumeTemplate; label: string; desc: string }[] = [
  { id: 'executive', label: 'Executive',  desc: 'Two-column with sidebar' },
  { id: 'minimal',   label: 'Minimal',    desc: 'Single-column monospace' },
  { id: 'creative',  label: 'Creative',   desc: 'Bold header with gradients' },
]

interface Props {
  data: ResumeData
  initialTemplate: ResumeTemplate
  initialAts: boolean
  initialPhoto: boolean
}

export default function ResumeBuilderPanel({
  data,
  initialTemplate,
  initialAts,
  initialPhoto,
}: Props) {
  const [template, setTemplate]     = useState<ResumeTemplate>(initialTemplate)
  const [ats, setAts]               = useState(initialAts)
  const [includePhoto, setPhoto]    = useState(initialPhoto)
  const [saving, setSaving]         = useState(false)

  // Merge current settings into the data object for live preview
  const previewData: ResumeData = {
    ...data,
    resumeSettings: {
      ...data.resumeSettings,
      ats_mode: ats,
      include_photo: includePhoto,
      default_template: template,
    },
  }

  const handleTemplateSelect = async (t: ResumeTemplate) => {
    setTemplate(t)
    setSaving(true)
    await updateResumeSettings({ default_template: t })
    setSaving(false)
  }

  const handleAtsToggle = async (checked: boolean) => {
    setAts(checked)
    setSaving(true)
    await updateResumeSettings({ ats_mode: checked })
    setSaving(false)
  }

  const handlePhotoToggle = async (checked: boolean) => {
    setPhoto(checked)
    setSaving(true)
    await updateResumeSettings({ include_photo: checked })
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Controls bar */}
      <div className="bg-surface rounded-(--border-radius) border border-app-text/10 p-4 flex flex-wrap items-center gap-6">
        
        {/* ATS toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={ats}
              onChange={e => handleAtsToggle(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${ats ? 'bg-primary' : 'bg-app-text/20'}`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${ats ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
          </div>
          <div>
            <p className="font-body text-sm font-medium text-app-text">ATS Mode</p>
            <p className="font-body text-xs text-app-text/50">Removes colors for scanner compatibility</p>
          </div>
        </label>

        {/* Include photo toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={includePhoto}
              onChange={e => handlePhotoToggle(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${includePhoto ? 'bg-primary' : 'bg-app-text/20'}`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${includePhoto ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
          </div>
          <div>
            <p className="font-body text-sm font-medium text-app-text">Include Photo</p>
            <p className="font-body text-xs text-app-text/50">Add profile photo to supported templates</p>
          </div>
        </label>

        {saving && (
          <p className="font-body text-xs text-app-text/40 ml-auto">Saving...</p>
        )}
      </div>

      {/* Template selector */}
      <div>
        <h2 className="font-heading text-base font-semibold text-app-text mb-3">
          Select Template
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => handleTemplateSelect(t.id)}
              className={`p-3 rounded-(--border-radius) border-2 text-left transition-all duration-(--transition-speed) ${
                template === t.id
                  ? 'border-primary bg-primary/5'
                  : 'border-app-text/10 bg-surface hover:border-primary/40'
              }`}
            >
              <p className={`font-heading text-sm font-semibold ${template === t.id ? 'text-primary' : 'text-app-text'}`}>
                {t.label}
              </p>
              <p className="font-body text-xs text-app-text/50 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Live PDF preview + download */}
      <div>
        <h2 className="font-heading text-base font-semibold text-app-text mb-3">
          Live Preview — {template}
          <span className="font-body text-xs text-app-text/40 font-normal ml-2">
            (what you see is what downloads)
          </span>
        </h2>
        <PDFViewer template={template} data={previewData} />
      </div>

    </div>
  )
}
