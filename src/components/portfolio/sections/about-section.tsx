import React from 'react'
import { SectionHeading } from '../section-heading'
import { User, Milestone } from 'lucide-react'
import { Tables } from '@/types/database'

type About = Tables<'about'>
type Profile = Tables<'profiles'>

interface AboutSectionProps {
  about: About | null
  profile: Profile | null
}

export default function AboutSection({ about, profile }: AboutSectionProps) {
  if (!about) return null

  const getStatusConfig = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'open to work':
      case 'open':
        return {
          label: 'Open to Work',
          colorClass: 'bg-green-500/10 text-green-500',
        }
      case 'busy':
        return {
          label: 'Currently Busy',
          colorClass: 'bg-yellow-500/10 text-yellow-500',
        }
      case 'not available':
        return {
          label: 'Not Available',
          colorClass: 'bg-gray-500/10 text-gray-500',
        }
      default:
        return {
          label: status || 'Available',
          colorClass: 'bg-primary/10 text-primary',
        }
    }
  }

  const statusConfig = getStatusConfig(about.availability_status)

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-[var(--spacing-unit)]">
        <SectionHeading title="About Me" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
          {/* Left: Decorative Experience Card */}
          <div className="flex justify-center md:justify-end">
            <div className="w-64 h-64 bg-surface border border-primary/20 rounded-[var(--border-radius)] flex flex-col items-center justify-center p-8 shadow-xl relative overflow-hidden group">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10 transition-transform duration-[var(--transition-speed)] group-hover:scale-150" />
              
              <div className="text-primary mb-4">
                <Milestone className="w-12 h-12" />
              </div>
              <div className="text-center">
                <span className="block font-heading text-6xl font-bold text-primary leading-none">
                  {about.years_of_experience || '0'}
                </span>
                <span className="block font-body text-app-text/60 mt-2 font-medium uppercase tracking-wider text-sm">
                  Years Experience
                </span>
              </div>
            </div>
          </div>
          
          {/* Right: Bio and Status */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <User className="w-5 h-5" />
              </div>
              <p className="font-heading text-xl font-semibold text-app-text">
                Hi, I&rsquo;m {profile?.full_name?.split(' ')[0] || 'there'}!
              </p>
            </div>
            
            <p className="font-body text-lg text-app-text/80 leading-relaxed whitespace-pre-wrap">
              {about.bio}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className={`text-xs font-body font-semibold px-4 py-1.5 rounded-full ${statusConfig.colorClass}`}>
                {statusConfig.label}
              </span>
              
              {about.location && (
                <span className="text-xs font-body text-app-text/60 bg-surface px-4 py-1.5 rounded-full border border-app-text/10">
                  {about.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
