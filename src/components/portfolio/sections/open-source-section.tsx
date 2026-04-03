import React from 'react'
import { SectionHeading } from '../section-heading'
import { GitBranch, Star, Heart, Terminal, ExternalLink } from 'lucide-react'
import { Tables } from '@/types/database'
import Link from 'next/link'

type OpenSource = Tables<'open_source_contributions'>

interface OpenSourceSectionProps {
  openSource: OpenSource[]
}

export default function OpenSourceSection({ openSource }: OpenSourceSectionProps) {
  if (openSource.length === 0) return null

  return (
    <section id="open-source" className="py-24 bg-background">
      <div className="container mx-auto px-(--spacing-unit)">
        <SectionHeading 
          title="Open Source" 
          subtitle="Contributing to the community and building tools for everyone"
        />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {openSource.map((repo) => (
            <div 
              key={repo.id}
              className="bg-surface rounded-[var(--border-radius)] p-6 border border-app-text/10 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/5 rounded-[var(--border-radius-sm)] text-primary">
                  <GitBranch className="w-5 h-5" />
                </div>
                
                <div className="flex items-center gap-3">
                  {repo.stars !== null && (
                    <div className="flex items-center gap-1 text-app-text/60 text-xs font-bold bg-background px-2 py-1 rounded-full border border-app-text/5">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>{repo.stars.toLocaleString()}</span>
                    </div>
                  )}
                  {repo.repo_url && (
                    <Link 
                      href={repo.repo_url} 
                      target="_blank"
                      className="text-app-text/40 hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-heading text-xl font-bold text-primary mb-3">
                  {repo.repo_url ? (
                    <Link href={repo.repo_url} target="_blank" className="hover:underline">
                      {repo.repo_name}
                    </Link>
                  ) : (
                    repo.repo_name
                  )}
                </h3>
                <p className="font-body text-app-text/70 text-sm leading-relaxed mb-6">
                  {repo.description}
                </p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-app-text/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {repo.language && (
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="font-body text-xs text-app-text/60 font-medium">
                        {repo.language}
                      </span>
                    </div>
                  )}
                </div>
                
                {repo.role && (
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full">
                    {repo.role.toLowerCase() === 'owner' ? (
                      <Terminal className="w-3 h-3" />
                    ) : (
                      <Heart className="w-3 h-3" />
                    )}
                    {repo.role}
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
