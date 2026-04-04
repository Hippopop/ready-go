'use client'

import React, { useState, useEffect } from 'react'
import { ResumeData, ResumeTemplate } from '@/types/resume'
import { updateResumeSettings } from '@/lib/actions/resume'
import TemplateSelector from '@/components/resume/template-selector'
import ResumePreview from '@/components/resume/resume-preview'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ResumeBuilderPanelProps {
  data: ResumeData
  settings: {
    include_photo: boolean | null
    ats_mode: boolean | null
    default_template: string | null
  } | null
}

export default function ResumeBuilderPanel({ data, settings }: ResumeBuilderPanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(
    (settings?.default_template as ResumeTemplate) || 'executive'
  )
  const [atsMode, setAtsMode] = useState(settings?.ats_mode || false)
  const [includePhoto, setIncludePhoto] = useState(settings?.include_photo || false)
  const [loading, setLoading] = useState(false)
  const [uid, setUid] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUid(user.id)
    }
    fetchUser()
  }, [])

  const handleUpdateSetting = async (updates: Partial<{
    default_template: string
    ats_mode: boolean
    include_photo: boolean
  }>) => {
    setLoading(true)
    const result = await updateResumeSettings(updates)
    if ('error' in result) {
      alert(result.error)
    }
    setLoading(false)
  }

  const handleDownload = () => {
    if (!uid) return
    window.open(
      `/api/resume/${uid}/download?template=${selectedTemplate}${atsMode ? '&ats=true' : ''}`,
      '_blank'
    )
  }

  const previewData = {
    ...data,
    resumeSettings: {
      ...data.resumeSettings,
      ats_mode: atsMode,
      include_photo: includePhoto,
      default_template: selectedTemplate
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Top bar — controls */}
      <div className="bg-surface rounded-(--border-radius) border border-app-text/10 p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex items-center space-x-3">
            <Switch
              id="ats-mode"
              checked={atsMode}
              onCheckedChange={(checked) => {
                setAtsMode(checked)
                handleUpdateSetting({ ats_mode: checked })
              }}
              disabled={loading}
            />
            <div className="space-y-0.5">
              <Label htmlFor="ats-mode" className="text-sm font-medium cursor-pointer">ATS Mode</Label>
              <p className="text-[10px] text-app-text/50">Removes colors for scanner compatibility</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              id="include-photo"
              checked={includePhoto}
              onCheckedChange={(checked) => {
                setIncludePhoto(checked)
                handleUpdateSetting({ include_photo: checked })
              }}
              disabled={loading}
            />
            <Label htmlFor="include-photo" className="text-sm font-medium cursor-pointer">Include Photo</Label>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          className="bg-primary text-white hover:opacity-90 min-w-[160px]"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Template selector — full width */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-app-text mb-4">
          Select Template
        </h2>
        <TemplateSelector
          currentTemplate={selectedTemplate}
          data={previewData}
          onSelect={(template) => {
            setSelectedTemplate(template)
            handleUpdateSetting({ default_template: template })
          }}
        />
      </div>

      {/* Live preview — full width, centered */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-app-text mb-4">
          Live Preview — {selectedTemplate}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ResumePreview
            template={selectedTemplate}
            data={previewData}
            scale={0.75}
            showLabel={false}
          />
        </div>
      </div>

    </div>
  )
}

