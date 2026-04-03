import React from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A consistent wrapper for portfolio sections.
 * This ensures all sections have the same max-width and vertical spacing.
 */
export default function SectionWrapper({ id, children, className }: SectionWrapperProps) {
  return (
    <section 
      id={id} 
      className={cn(
        "py-20 px-6 md:px-12 lg:px-24 w-full",
        className
      )}
    >
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </section>
  );
}
