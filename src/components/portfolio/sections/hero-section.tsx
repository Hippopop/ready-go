'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Mail, 
  Globe, 
  FileDown,
  ArrowRight
} from 'lucide-react'
import { 
  GithubIcon, 
  LinkedInIcon, 
  TwitterIcon, 
  YoutubeIcon, 
  InstagramIcon 
} from '../social-icons'
import { Tables } from '@/types/database'

type Hero = Tables<'hero'>
type Profile = Tables<'profiles'>
type SocialLink = Tables<'social_links'>

interface HeroSectionProps {
  hero: Hero | null
  profile: Profile | null
  socialLinks: SocialLink[]
  uid: string
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Github: GithubIcon,
  LinkedIn: LinkedInIcon,
  Twitter: TwitterIcon,
  Youtube: YoutubeIcon,
  Email: Mail,
  Website: Globe,
  Instagram: InstagramIcon,
}

export default function HeroSection({ 
  hero, 
  profile, 
  socialLinks, 
  uid
}: HeroSectionProps) {
  const [typingIndex, setTypingIndex] = useState(0)
  const typingTexts = hero?.typing_texts ?? []
  const isTypingEnabled = hero?.is_typing_animation && typingTexts.length > 0

  useEffect(() => {
    if (!isTypingEnabled) return

    const interval = setInterval(() => {
      setTypingIndex((prev) => (prev + 1) % typingTexts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isTypingEnabled, typingTexts.length])

  if (!hero) return null

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background radial gradient */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, var(--color-primary) 0%, transparent 70%)',
          opacity: 0.05
        }}
      />
      
      <div className="container mx-auto px-[var(--spacing-unit)] z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="flex flex-col space-y-6 text-center md:text-left">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-app-text leading-tight">
            {hero.headline}
          </h1>
          
          <div className="h-10">
            {isTypingEnabled ? (
              <h2 className="font-heading text-2xl text-primary font-semibold animate-pulse">
                {typingTexts[typingIndex]}
              </h2>
            ) : (
              <h2 className="font-heading text-2xl text-app-text/70 font-semibold">
                {hero.subheadline}
              </h2>
            )}
          </div>
          
          <p className="font-body text-lg text-app-text/70 max-w-lg">
            {hero.tagline}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
            {hero.cta_primary_text && (
              <Link
                href={hero.cta_primary_url || '#projects'}
                className="bg-primary text-white px-8 py-3 rounded-[var(--border-radius)] font-body font-medium transition-all duration-[var(--transition-speed)] ease-[var(--transition-easing)] hover:opacity-90 active:scale-95 flex items-center gap-2"
              >
                {hero.cta_primary_text}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            
            {hero.cta_secondary_text && (
              <Link
                href={`/api/resume/${uid}/download`}
                download
                className="border-2 border-primary text-primary px-8 py-3 rounded-[var(--border-radius)] font-body font-medium transition-all duration-[var(--transition-speed)] ease-[var(--transition-easing)] hover:bg-primary/5 active:scale-95 flex items-center gap-2"
              >
                {hero.cta_secondary_text}
                <FileDown className="w-4 h-4" />
              </Link>
            )}
          </div>
          
          {/* Social Links */}
          <div className="flex gap-5 justify-center md:justify-start pt-6">
            {socialLinks.map((link) => {
              const Icon = ICON_MAP[link.platform] || Globe
              return (
                <Link
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-app-text/60 hover:text-primary transition-colors duration-[var(--transition-speed)]"
                >
                  <Icon className="w-6 h-6" />
                </Link>
              )
            })}
          </div>
        </div>
        
        {/* Right Content - Profile Image */}
        <div className="hidden md:flex justify-center items-center relative">
          <div className="w-80 h-80 relative">
            {/* Decorative shape background */}
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-blob filter blur-xl" />
            
            <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-surface shadow-2xl">
              {hero.profile_image_url ? (
                <Image
                  src={hero.profile_image_url}
                  alt={profile?.full_name || 'Profile'}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <span className="font-heading text-6xl text-primary font-bold">
                    {profile?.full_name?.charAt(0) || '?'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
