'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type SectionSetting = Database['public']['Tables']['section_settings']['Row'];

interface PortfolioNavProps {
  profile: Profile | null;
  sectionSettings: SectionSetting[];
  uid: string;
  hasResume: boolean;
}

const SECTION_LABELS: Record<string, string> = {
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  education: 'Education',
  certifications: 'Certifications',
  testimonials: 'Testimonials',
  blog: 'Blog',
  awards: 'Awards',
  open_source: 'Open Source',
};

export default function PortfolioNav({ profile, sectionSettings, uid, hasResume }: PortfolioNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);

  // Visible sections in order
  const navLinks = sectionSettings
    .filter(s => s.is_visible)
    .sort((a, b) => a.display_order - b.display_order)
    .map(s => ({
      id: s.section_key === 'open_source' ? 'open-source' : s.section_key,
      label: SECTION_LABELS[s.section_key] || s.section_key,
    }));

  // Add contact section manually as it's always last
  navLinks.push({ id: 'contact', label: 'Contact' });

  // Handle scroll behavior (sticky, hide/show)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Sticky background
      setIsScrolled(currentScrollY > 20);

      // Hide/Show on scroll
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false); // Scrolling down
      } else {
        setVisible(true); // Scrolling up
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Always observe hero if we can find it (it doesn't have an ID in the wrapper but we'll manually watch it)
    const sections = ['hero', ...navLinks.map(l => l.id)];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navLinks]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Adjust for sticky header height
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-(--transition-speed) ease-(--transition-easing) px-4 md:px-8 lg:px-16",
          isScrolled ? "bg-background/80 backdrop-blur-md border-b border-app-text/10 py-3" : "bg-transparent py-6",
          visible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Name */}
          <Link 
            href={`/portfolio/${uid}`}
            className="font-heading font-bold text-xl text-app-text hover:text-primary transition-colors"
          >
            {profile?.full_name || 'Portfolio'}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={cn(
                  "font-body text-sm transition-all duration-(--transition-speed) ease-(--transition-easing) hover:text-primary",
                  activeSection === link.id ? "text-primary font-semibold" : "text-app-text/70"
                )}
              >
                {link.label}
              </button>
            ))}

            {hasResume && (
              <Link
                href={`/api/resume/${uid}/download`}
                className="flex items-center gap-2 border border-primary text-primary rounded-[var(--border-radius)] px-4 py-2 text-sm font-body hover:bg-primary/5 transition-all duration-[var(--transition-speed)] ease-[var(--transition-easing)]"
              >
                <Download className="w-4 h-4" />
                Resume
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-app-text"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center transition-all duration-[var(--transition-speed)] ease-[var(--transition-easing)]",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <button
          className="absolute top-6 right-6 p-2 text-app-text"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="flex flex-col items-center gap-8 pt-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={cn(
                "font-heading text-3xl font-bold transition-all",
                activeSection === link.id ? "text-primary" : "text-app-text/70 hover:text-primary"
              )}
            >
              {link.label}
            </button>
          ))}
          
          {hasResume && (
            <Link
              href={`/api/resume/${uid}/download`}
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 flex items-center gap-2 bg-primary text-white rounded-[var(--border-radius)] px-8 py-4 text-xl font-body hover:opacity-90 transition-all duration-[var(--transition-speed)]"
            >
              <Download className="w-6 h-6" />
              Download Resume
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
