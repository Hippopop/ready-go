"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-[var(--border-radius)] px-3 py-[calc(var(--spacing-unit)*0.5)] text-sm font-medium transition-all duration-[var(--transition-speed)] ease-[var(--transition-easing)] hover:bg-accent hover:text-accent-foreground",
        isActive 
          ? "bg-accent text-accent-foreground font-semibold" 
          : "text-muted-foreground"
      )}
    >
      <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground/70")} />
      {label}
    </Link>
  );
}
