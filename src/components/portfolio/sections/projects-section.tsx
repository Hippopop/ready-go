import React from 'react'
import { SectionHeading } from '../section-heading'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ArrowUpRight } from 'lucide-react'
import { GithubIcon } from '../social-icons'
import { Tables } from '@/types/database'

type Project = Tables<'projects'>

interface ProjectsSectionProps {
  projects: Project[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (projects.length === 0) return null

  const featuredProjects = projects.filter((p) => p.is_featured)
  const regularProjects = projects.filter((p) => !p.is_featured)

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container mx-auto px-[var(--spacing-unit)]">
        <SectionHeading 
          title="Featured Projects" 
          subtitle="A selection of my best work and open source contributions"
        />
        
        {/* Featured Projects Grid */}
        {featuredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 mb-16">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} isFeatured />
            ))}
          </div>
        )}
        
        {/* Regular Projects Grid */}
        {regularProjects.length > 0 && (
          <>
            {featuredProjects.length > 0 && (
              <div className="flex items-center gap-4 mb-10">
                <h3 className="font-heading text-2xl font-bold text-app-text whitespace-nowrap">
                  More Projects
                </h3>
                <div className="w-full h-[1px] bg-primary/10" />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project, isFeatured = false }: { project: Project, isFeatured?: boolean }) {
  return (
    <div className="group bg-surface rounded-[var(--border-radius)] border border-app-text/10 overflow-hidden flex flex-col transition-all duration-[var(--transition-speed)] ease-[var(--transition-easing)] hover:shadow-xl hover:-translate-y-2">
      {/* Cover Image */}
      <div className={`relative ${isFeatured ? 'aspect-video' : 'aspect-video'} w-full bg-primary/5 overflow-hidden`}>
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-primary/20">
            <span className="font-heading text-4xl font-bold opacity-20">{project.title.charAt(0)}</span>
          </div>
        )}
        
        {/* Overlays/Badges */}
        <div className="absolute top-4 left-4">
          {isFeatured && (
            <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              Featured
            </span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h4 className="font-heading text-xl font-bold text-app-text mb-3 group-hover:text-primary transition-colors">
          {project.title}
        </h4>
        
        <p className="font-body text-app-text/70 text-sm mb-5 line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        
        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech_stack.map((tech) => (
              <span 
                key={tech}
                className="text-[10px] bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-app-text/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {project.github_url && (
              <Link 
                href={project.github_url} 
                target="_blank"
                className="text-app-text/60 hover:text-primary transition-colors"
                title="View Source on GitHub"
              >
                <GithubIcon className="w-5 h-5" />
              </Link>
            )}
            {project.live_url && (
              <Link 
                href={project.live_url} 
                target="_blank"
                className="text-app-text/60 hover:text-primary transition-colors"
                title="View Live Demo"
              >
                <ExternalLink className="w-5 h-5" />
              </Link>
            )}
          </div>
          
          {project.live_url && (
            <Link 
              href={project.live_url} 
              target="_blank"
              className="text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1 group/link link-hover"
            >
              Demo
              <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
