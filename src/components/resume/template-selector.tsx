'use client';

import React from 'react';
import { ResumeData, ResumeTemplate } from '@/types/resume';
import ResumePreview from './resume-preview';

interface TemplateSelectorProps {
  currentTemplate: ResumeTemplate;
  data: ResumeData;
  onSelect: (template: ResumeTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  currentTemplate,
  data,
  onSelect,
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      width: '100%',
    }}>
      {(['executive', 'minimal', 'creative'] as ResumeTemplate[]).map((t) => (
        <div
          key={t}
          onClick={() => onSelect(t)}
          style={{
            cursor: 'pointer',
            border: t === currentTemplate
              ? '3px solid var(--color-primary)'
              : '1px solid var(--color-border, #e2e8f0)',
            borderRadius: 'var(--border-radius)',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: t === currentTemplate
              ? 'var(--color-primary, #6366f1)10'
              : 'var(--color-surface)',
            transition: 'all var(--transition-speed, 200ms)',
          }}
        >
          <ResumePreview template={t} data={data} scale={0.3} />
          <p style={{
            marginTop: '8px',
            fontSize: '11px',
            fontWeight: '600',
            color: t === currentTemplate ? 'var(--color-primary)' : 'var(--color-text)',
            fontFamily: 'var(--font-body)',
            textAlign: 'center',
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </p>
          <p style={{
            fontSize: '10px',
            color: 'var(--color-text)',
            opacity: 0.5,
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            lineHeight: '1.3',
            marginTop: '2px',
          }}>
            {t === 'executive' && 'Two-column with sidebar'}
            {t === 'minimal'   && 'Single-column monospace'}
            {t === 'creative'  && 'Bold header with gradients'}
          </p>
        </div>
      ))}
    </div>

  );
};

export default TemplateSelector;
