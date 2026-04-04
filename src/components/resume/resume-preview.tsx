'use client'

import { ResumeTemplate, ResumeData } from '@/types/resume'
import ExecutiveTemplate from './templates/executive'
import MinimalTemplate from './templates/minimal'
import CreativeTemplate from './templates/creative'

interface ResumePreviewProps {
  template: ResumeTemplate
  data: ResumeData
  scale?: number
  label?: string
  showLabel?: boolean
}

export default function ResumePreview({
  template,
  data,
  scale = 0.6,
  showLabel = false,
}: ResumePreviewProps) {
  const W = 794
  const H = 1123

  const scaledW = Math.round(W * scale)
  const scaledH = Math.round(H * scale)

  const labels: Record<ResumeTemplate, string> = {
    executive: 'Executive',
    minimal: 'Minimal',
    creative: 'Creative',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* 
        The outer div reserves EXACTLY the scaled space in the layout.
        The inner div renders at full 794px then scales down visually.
        overflow: hidden clips anything that bleeds out.
      */}
      <div
        style={{
          width: `${scaledW}px`,
          height: `${scaledH}px`,
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: `${W}px`,
            height: `${H}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {template === 'executive' && <ExecutiveTemplate data={data} />}
          {template === 'minimal'   && <MinimalTemplate   data={data} />}
          {template === 'creative'  && <CreativeTemplate  data={data} />}
        </div>
      </div>
      {showLabel && (
        <p style={{
          marginTop: '8px',
          fontSize: '12px',
          fontWeight: '500',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-body)',
        }}>
          {labels[template]}
        </p>
      )}
    </div>
  )
}

