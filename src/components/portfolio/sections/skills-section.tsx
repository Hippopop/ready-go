import React from 'react';
import type { Database } from '@/types/database';

type Skills = Database['public']['Tables']['skills']['Row'][];

export default function SkillsSection({ skills }: { skills: Skills }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {skills.map((skill) => (
        <div key={skill.id} className="p-4 bg-surface rounded-[var(--border-radius)] border border-app-text/5">
          <p className="font-heading font-semibold text-app-text">{skill.name}</p>
          <p className="text-sm text-app-text/60 font-body">Proficiency: {skill.proficiency}/5</p>
        </div>
      ))}
    </div>
  );
}
