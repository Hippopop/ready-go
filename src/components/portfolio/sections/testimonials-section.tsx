import React from 'react';
import type { Database } from '@/types/database';

type Testimonials = Database['public']['Tables']['testimonials']['Row'][];

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonials }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {testimonials.map((t) => (
        <div key={t.id} className="p-8 bg-surface rounded-[var(--border-radius)] shadow-sm border border-app-text/5 italic">
          <p className="text-app-text/80 mb-6 font-body">&ldquo;{t.content}&rdquo;</p>
          <div>
            <p className="font-heading font-bold text-app-text">{t.author_name}</p>
            <p className="text-sm text-app-text/60 font-body">{t.author_title}, {t.author_company}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
