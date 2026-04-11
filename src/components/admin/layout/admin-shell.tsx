'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { SidebarNav } from '@/components/admin/sidebar/sidebar-nav'
import { SignOutButton } from '@/components/admin/sign-out-button'

interface AdminShellProps {
  children: React.ReactNode
  userEmail: string | null
  unreadCount?: number
}

export default function AdminShell({ children, userEmail, unreadCount = 0 }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change (user tapped a nav link)
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setSidebarOpen(false)
    })
    return () => cancelAnimationFrame(handle)
  }, [pathname])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <div className="h-screen overflow-hidden bg-background flex">

      {/* ── BACKDROP (mobile only) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 w-64 flex flex-col
          bg-surface border-r border-app-text/10
          transition-transform duration-(--transition-speed) ease-(--transition-easing)
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-app-text/10">
          <span className="font-heading font-bold text-lg text-primary">Ready-Go</span>
          {/* Close button — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-(--border-radius) text-app-text/50 hover:text-app-text hover:bg-app-text/5 transition-all duration-(--transition-speed)"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items — scrollable */}
        <div className="flex-1 overflow-y-auto py-3 no-scrollbar">
          <SidebarNav unreadCount={unreadCount} />
        </div>

        {/* Sidebar footer */}
        <div className="px-4 py-4 border-t border-app-text/10">
          {userEmail && (
            <p className="font-body text-xs text-app-text/40 truncate mb-3 px-1">
              {userEmail}
            </p>
          )}
          <SignOutButton />
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── TOP BAR (mobile only) ── */}
        <header className="lg:hidden sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-app-text/10 px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-(--border-radius) text-app-text/60 hover:text-app-text hover:bg-app-text/5 transition-all duration-(--transition-speed)"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="font-heading font-bold text-base text-primary">Ready-Go</span>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          {children}
        </main>

      </div>
    </div>
  )
}
