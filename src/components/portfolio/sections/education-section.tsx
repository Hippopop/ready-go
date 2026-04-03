import React from 'react';
import type { Database } from '@/types/database';

type Education = Database['public']['Tables']['education']['Row'][];

export default function EducationSection({ education }: { education: Education }) {
  return (
    <div className="space-y-8">
      {education.map((edu) => (
        <div key={edu.id} className="p-6 bg-surface rounded-[var(--border-radius)] border border-app-text/5">
          <h4 className="font-heading font-bold text-lg text-app-text">{edu.institution}</h4>
          <p className="font-body text-primary">{edu.degree} in {edu.field_of_study}</p>
          <p className="text-sm text-app-text/60 font-body">{edu.start_year} - {edu.end_year || 'Present'}</p>
        </div>
      ))}
    </div>
  );
}
