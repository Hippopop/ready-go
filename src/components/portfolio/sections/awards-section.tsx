import React from 'react'
import { SectionHeading } from '../section-heading'
import { Trophy, Calendar, ExternalLink } from 'lucide-react'
import { Tables } from '@/types/database'
import Link from 'next/link'
import { format } from 'date-fns'

type Award = Tables<'awards'>

interface AwardsSectionProps {
  awards: Award[]
}

export default function AwardsSection({ awards }: AwardsSectionProps) {
  if (awards.length === 0) return null

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    try {
      return format(new Date(dateString), 'MMM yyyy')
    } catch {
      return dateString
    }
  }

  return (
    <section id="awards" className="py-24 bg-background">
      <div className="container mx-auto px-(--spacing-unit)">
        <SectionHeading 
          title="Awards & Recognition" 
          subtitle="Honors, awards and competitive achievements"
        />
        
        <div className="mt-16 max-w-4xl mx-auto space-y-6">
          {awards.map((award) => (
            <div 
              key={award.id}
              className="bg-surface rounded-[var(--border-radius)] p-6 border border-app-text/10 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-6 group"
            >
              <div className="flex-shrink-0">
                <div className="p-3 bg-primary/10 rounded-[var(--border-radius-sm)] text-primary group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8" />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-xl font-bold text-app-text leading-tight group-hover:text-primary transition-colors">
                      {award.title}
                    </h3>
                    {award.url && (
                      <Link 
                        href={award.url}
                        target="_blank"
                        className="text-app-text/40 hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                  <p className="font-body text-primary font-semibold text-sm">
                    {award.issuer}
                  </p>
                  {award.description && (
                    <p className="font-body text-app-text/70 text-sm mt-2 leading-relaxed">
                      {award.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-1.5 text-app-text/60 font-body text-sm bg-background px-3 py-1 rounded-full border border-app-text/5 h-fit whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(award.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
