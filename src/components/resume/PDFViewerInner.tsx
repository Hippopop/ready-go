'use client'

import { PDFViewer as ReactPDFViewer, BlobProvider } from '@react-pdf/renderer'
import { ResumeData, ResumeTemplate } from '@/types/resume'
import { cn } from '@/lib/utils'
import ExecutivePDF from './templates/ExecutivePDF'
import MinimalPDF from './templates/MinimalPDF'
import CreativePDF from './templates/CreativePDF'

function getDocument(template: ResumeTemplate, data: ResumeData) {
  if (template === 'executive') return <ExecutivePDF data={data} />
  if (template === 'minimal')   return <MinimalPDF   data={data} />
  return                               <CreativePDF  data={data} />
}

export default function PDFViewerInner({
  template,
  data,
}: {
  template: ResumeTemplate
  data: ResumeData
}) {
  const doc = getDocument(template, data)
  const name = (data.profile.full_name ?? 'resume').replace(/\s+/g, '_')

  return (
    <div className="flex flex-col gap-8">
      {/* Responsive A4 Container */}
      <div 
        className="w-full max-w-[840px] mx-auto bg-white rounded-(--border-radius) shadow-2xl overflow-hidden border border-app-text/10"
        style={{ aspectRatio: '1 / 1.4142' }}
      >
        <ReactPDFViewer
          className="w-full h-full border-none"
          showToolbar={false}
        >
          {doc}
        </ReactPDFViewer>
      </div>

      {/* Download Action */}
      <div className="flex flex-col items-center gap-3">
        <BlobProvider document={doc}>
          {({ blob, loading, error }) => (
            <button
              disabled={loading || !!error}
              onClick={() => {
                if (!blob) return
                const url = URL.createObjectURL(blob)
                
                // Create a temporary link and set attributes for better mobile support
                const a = document.createElement('a')
                a.href = url
                a.download = `${name}_resume.pdf`
                a.target = '_blank'
                a.rel = 'noopener noreferrer'
                
                // Append to body and trigger click
                document.body.appendChild(a)
                a.click()
                
                // Cleanup: remove fixed element and delay revocation for mobile browsers
                document.body.removeChild(a)
                setTimeout(() => {
                  URL.revokeObjectURL(url)
                }, 1000)
              }}
              className={cn(
                "flex items-center gap-2 px-10 py-4 font-heading font-bold text-white rounded-(--border-radius) transition-all duration-(--transition-speed) ease-(--transition-easing) active:scale-95 shadow-lg",
                loading ? "bg-app-text/20 cursor-not-allowed" : "bg-primary hover:opacity-90 cursor-pointer hover:shadow-primary/20"
              )}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating PDF...
                </>
              ) : error ? (
                'Error generating PDF — try again'
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download My Resume (PDF)
                </>
              )}
            </button>
          )}
        </BlobProvider>
        <p className="font-body text-xs text-app-text/40">
          Standard A4 format • Optimized for ATS
        </p>
      </div>
    </div>
  )
}
