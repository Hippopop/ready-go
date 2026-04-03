import React from 'react'
import { SectionHeading } from '../section-heading'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ArrowUpRight } from 'lucide-react'
import { Tables } from '@/types/database'
import { format } from 'date-fns'

type BlogPost = Tables<'blog_posts'>

interface BlogSectionProps {
  blogPosts: BlogPost[]
}

export default function BlogSection({ blogPosts }: BlogSectionProps) {
  if (blogPosts.length === 0) return null

  return (
    <section id="blog" className="py-24 bg-background">
      <div className="container mx-auto px-[var(--spacing-unit)]">
        <SectionHeading 
          title="From the Blog" 
          subtitle="Thoughts, tutorials and technical deep dives"
        />
        
        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="mt-16 overflow-x-auto pb-8 scrollbar-hide">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-w-[300px] md:min-w-0">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={post.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-shrink-0 w-[85vw] md:w-full bg-surface rounded-[var(--border-radius)] overflow-hidden border border-app-text/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary/5">
                  {post.cover_image_url ? (
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-primary/10">
                      <span className="font-heading text-6xl font-bold opacity-10 italic">BLOG</span>
                    </div>
                  )}
                  
                  {/* Date badge */}
                  <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-app-text/5 flex items-center gap-1.5 shadow-sm">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span className="font-body text-[10px] font-bold text-app-text/80 uppercase tracking-wider">
                      {post.published_at ? format(new Date(post.published_at), 'MMM dd, yyyy') : 'Recently'}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    {post.reading_time_minutes && (
                      <div className="flex items-center gap-1 text-app-text/60 font-body text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.reading_time_minutes} min read</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-heading text-xl font-bold text-app-text group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-4">
                    {post.title}
                  </h3>
                  
                  <p className="font-body text-app-text/70 text-sm line-clamp-3 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto flex flex-wrap gap-2 mb-6">
                    {post.tags?.slice(0, 3).map((tag) => (
                      <span 
                        key={tag}
                        className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-app-text/5">
                    <span className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Article
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
