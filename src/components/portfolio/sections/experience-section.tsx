import React from 'react'
import { SectionHeading } from '../section-heading'
import Link from 'next/link'
import { ExternalLink, Calendar, Briefcase } from 'lucide-react'
import { Tables } from '@/types/database'
import { format } from 'date-fns'

type Experience = Tables<'experiences'>

interface ExperienceSectionProps {
  experiences: Experience[]
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (experiences.length === 0) return null

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    try {
      return format(new Date(dateString), 'MMM yyyy')
    } catch {
      return dateString
    }
  }

  return (
    <section id="experience" className="py-24 bg-background">
      <div className="container mx-auto px-[var(--spacing-unit)]">
        <SectionHeading 
          title="Work Experience" 
          subtitle="My professional journey and career highlights"
        />
        
        <div className="mt-16 max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative pl-10 pb-12 group last:pb-0">
              {/* Timeline Line */}
              <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-primary/20 group-last:bottom-8" />
              
              {/* Timeline Dot */}
              <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-surface border-4 border-primary z-10 transition-transform duration-[var(--transition-speed)] group-hover:scale-125" />
              
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-app-text">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {exp.company_url ? (
                        <Link 
                          href={exp.company_url} 
                          target="_blank" 
                          className="flex items-center gap-1 text-primary hover:underline font-heading font-semibold"
                        >
                          {exp.company_name}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-primary font-heading font-semibold">
                          {exp.company_name}
                        </span>
                      )}
                      
                      {exp.employment_type && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {exp.employment_type}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-app-text/60 font-body text-sm bg-surface px-3 py-1 rounded-full border border-app-text/10">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formatDate(exp.start_date)} — {exp.is_current ? (
                        <span className="text-primary font-bold">Present</span>
                      ) : (
                        formatDate(exp.end_date)
                      )}
                    </span>
                  </div>
                </div>
                
                <p className="font-body text-app-text/70 leading-relaxed max-w-2xl whitespace-pre-wrap">
                  {exp.description}
                </p>
                
                {exp.tech_stack && exp.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {exp.tech_stack.map((tech) => (
                      <span 
                        key={tech}
                        className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-body font-medium transition-colors hover:bg-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
