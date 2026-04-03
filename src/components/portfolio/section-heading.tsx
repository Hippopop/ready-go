import React from 'react'

interface SectionHeadingProps {
  title: string
  subtitle?: string | null
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="font-heading text-4xl font-bold text-app-text">
        {title}
      </h2>
      <div className="w-16 h-1 bg-primary mx-auto mt-3 rounded-full" />
      {subtitle && (
        <p className="mt-4 text-app-text/60 font-body max-w-2xl mx-auto">
          {subtitle}
        </        p>
      )}
    </div>
  )
}
