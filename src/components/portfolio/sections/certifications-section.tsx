import React from 'react';
import type { Database } from '@/types/database';

type Certifications = Database['public']['Tables']['certifications']['Row'][];

export default function CertificationsSection({ certifications }: { certifications: Certifications }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {certifications.map((cert) => (
        <div key={cert.id} className="p-6 bg-surface rounded-[var(--border-radius)] border border-app-text/5">
          <h4 className="font-heading font-bold text-lg text-app-text">{cert.name}</h4>
          <p className="font-body text-primary">{cert.issuer}</p>
          <p className="text-sm text-app-text/60 font-body">Issued {cert.issue_date}</p>
        </div>
      ))}
    </div>
  );
}
