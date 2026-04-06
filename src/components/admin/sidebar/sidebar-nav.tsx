"use client";
 
import {
  LayoutDashboard,
  Palette,
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
  LayoutList,
  FileText,
  Inbox,
} from "lucide-react";
import { NavItem } from "./nav-item";
 
const coreNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/sections", label: "Sections", icon: LayoutList },
  { href: "/admin/theme", label: "Theme", icon: Palette },
  { href: "/admin/hero", label: "Hero", icon: User },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/skills", label: "Skills", icon: Code },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
];
 
const secondaryNavItems = [
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/blog", label: "Blog", icon: PenSquare },
  { href: "/admin/awards", label: "Awards", icon: Trophy },
  { href: "/admin/open-source", label: "Open Source", icon: GitBranch },
  { href: "/admin/resume", label: "Resume", icon: FileText },
];
 
interface SidebarNavProps {
  unreadCount?: number;
}
 
export function SidebarNav({ unreadCount = 0 }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1 py-4 flex-1 overflow-y-auto no-scrollbar pr-2">
      <div className="flex flex-col gap-1">
        {coreNavItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>
      <div className="my-4 border-t border-border mx-2" />
      <div className="flex flex-col gap-1">
        {secondaryNavItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
        {/* Inbox with dynamic count */}
        <NavItem 
          href="/admin/inbox" 
          label="Inbox" 
          icon={Inbox} 
          badge={unreadCount > 0 ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-surface animate-in zoom-in duration-(--transition-speed)">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : null}
        />
      </div>
    </nav>
  );
}


