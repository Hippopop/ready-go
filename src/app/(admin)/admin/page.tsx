import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  User,
  Briefcase,
  FolderOpen,
  Code,
  GraduationCap,
  Award,
  MessageSquare,
  PenSquare,
  Trophy,
  GitBranch,
} from 'lucide-react';

const SECTIONS = [
  { href: '/admin/hero', label: 'Hero', icon: User, description: 'Manage your name, title, and tagline.' },
  { href: '/admin/about', label: 'About', icon: User, description: 'Update your bio and social links.' },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase, description: 'Add your work history and achievements.' },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen, description: 'Showcase your best coding projects.' },
  { href: '/admin/skills', label: 'Skills', icon: Code, description: 'List your technical stack and expertise.' },
  { href: '/admin/education', label: 'Education', icon: GraduationCap, description: 'Detail your academic background.' },
  { href: '/admin/certifications', label: 'Certifications', icon: Award, description: 'Show off your professional certifications.' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare, description: 'Add feedback from clients or colleagues.' },
  { href: '/admin/blog', label: 'Blog', icon: PenSquare, description: 'Share links to your external blog posts.' },
  { href: '/admin/awards', label: 'Awards', icon: Trophy, description: 'Highlight your honors and recognitions.' },
  { href: '/admin/open-source', label: 'Open Source', icon: GitBranch, description: 'Display your contributions to OSS projects.' },
] as const;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
      {/* Welcome & Live Link Banner */}
      <div className="relative overflow-hidden rounded-(--border-radius) border border-primary/20 bg-primary/5 p-8 md:p-10 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-heading">
              Welcome back, {user?.email?.split('@')[0] ?? 'User'}
            </h1>
            <p className="text-muted-foreground text-lg font-body max-w-xl">
              Your professional presence is ready. Keep it fresh by updating your latest projects and achievements.
            </p>
          </div>
          <Link 
            href={`/portfolio/${user?.id}`} 
            target="_blank"
            className="inline-flex items-center justify-center gap-2 rounded-(--border-radius) bg-primary px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-(--transition-speed) hover:opacity-90 active:scale-95 whitespace-nowrap"
          >
            View My Portfolio →
          </Link>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>


      {/* Stats / Status Overview (Placeholder for now but looks better) */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-(--border-radius) border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Portfolio Live
          </div>
          <div className="mt-2 text-2xl font-bold">Public View</div>
          <Link href={`/portfolio/${user?.id}`} target="_blank" className="mt-3 inline-flex text-xs font-medium text-primary hover:underline">
            View Live Site →
          </Link>
        </div>
        <div className="rounded-(--border-radius) border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            Resume Status
          </div>
          <div className="mt-2 text-2xl font-bold">Standard PDF</div>
          <Link href="/admin/resume" className="mt-3 inline-flex text-xs font-medium text-primary hover:underline">
            Build Resume →
          </Link>
        </div>
        <div className="rounded-(--border-radius) border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            Theme Active
          </div>
          <div className="mt-2 text-2xl font-bold">Modern Dark</div>
          <Link href="/admin/theme" className="mt-3 inline-flex text-xs font-medium text-primary hover:underline">
            Customize Theme →
          </Link>
        </div>
      </div>

      {/* Section cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Content Management</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex flex-col justify-between rounded-(--border-radius) border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md hover:bg-muted/10"
            >
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-(--border-radius-sm) bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <section.icon size={20} />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {section.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {section.description}
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Go to {section.label} →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
