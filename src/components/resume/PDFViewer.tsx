'use client'

import dynamic from 'next/dynamic'
import { ResumeData, ResumeTemplate } from '@/types/resume'

// PDFViewer and BlobProvider must be dynamically imported
// because react-pdf uses browser APIs not available in SSR
const PDFViewerComponent = dynamic<{
  template: ResumeTemplate
  data: ResumeData
}>(
  () => import('./PDFViewerInner'),
  {
    ssr: false,
    loading: () => (
      <div 
        className="w-full max-w-[840px] mx-auto bg-surface rounded-(--border-radius) border border-app-text/10 animate-pulse flex items-center justify-center p-8 text-app-text/30"
        style={{ aspectRatio: '1 / 1.4142' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="font-heading font-medium">Generating Resume Preview...</p>
          <p className="font-body text-xs">Standard A4 Layout</p>
        </div>
      </div>
    ),
  }
)

export default function PDFViewer({
  template,
  data,
}: {
  template: ResumeTemplate
  data: ResumeData
}) {
  return <PDFViewerComponent template={template} data={data} />
}
