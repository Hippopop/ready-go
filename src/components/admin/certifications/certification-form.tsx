'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { certificationSchema, type CertificationFormValues } from '@/lib/validations/certification';
import { createCertification, updateCertification } from '@/lib/actions/certification';
import { Tables } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CertificationRow = Tables<'certifications'>;

interface CertificationFormProps {
  /** When provided, the form operates in edit mode */
  certification?: CertificationRow;
  onSuccess: () => void;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Main form component
// ---------------------------------------------------------------------------

export function CertificationForm({ 
  certification, 
  onSuccess, 
  onCancel 
}: CertificationFormProps) {
  const isEditing = !!certification;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: certification?.name ?? '',
      issuer: certification?.issuer ?? '',
      issue_date: certification?.issue_date ?? '',
      expiry_date: certification?.expiry_date ?? '',
      credential_url: certification?.credential_url ?? '',
      badge_image_url: certification?.badge_image_url ?? '',
    },
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  async function onSubmit(data: CertificationFormValues) {
    setFeedback(null);

    const result = isEditing && certification
      ? await updateCertification(certification.id, data)
      : await createCertification(data);

    if ('error' in result) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }

    setFeedback({ 
      type: 'success', 
      message: isEditing ? 'Certification updated!' : 'Certification added!' 
    });
    
    if (!isEditing) reset();
    
    setTimeout(() => onSuccess(), 600);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Feedback banner */}
      {feedback && (
        <div
          role="alert"
          className={`rounded-[var(--border-radius)] px-4 py-3 text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Row 1 — Name */}
      <div className="space-y-1.5">
        <label htmlFor="cert-name" className="text-sm font-medium text-foreground">
          Certification Name <span className="text-destructive">*</span>
        </label>
        <input
          id="cert-name"
          type="text"
          autoComplete="off"
          placeholder="e.g. AWS Certified Solutions Architect"
          {...register('name')}
          className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Row 2 — Issuer */}
      <div className="space-y-1.5">
        <label htmlFor="cert-issuer" className="text-sm font-medium text-foreground">
          Issuer
        </label>
        <input
          id="cert-issuer"
          type="text"
          autoComplete="off"
          placeholder="e.g. Amazon Web Services"
          {...register('issuer')}
          className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.issuer && (
          <p className="text-xs text-destructive">{errors.issuer.message}</p>
        )}
      </div>

      {/* Row 3 — Issue Date & Expiry Date */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="cert-issue-date" className="text-sm font-medium text-foreground">
            Issue Date
          </label>
          <input
            id="cert-issue-date"
            type="date"
            {...register('issue_date')}
            className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.issue_date && (
            <p className="text-xs text-destructive">{errors.issue_date.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="cert-expiry-date" className="text-sm font-medium text-foreground">
            Expiry Date
          </label>
          <input
            id="cert-expiry-date"
            type="date"
            {...register('expiry_date')}
            className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.expiry_date && (
            <p className="text-xs text-destructive">{errors.expiry_date.message}</p>
          )}
        </div>
      </div>

      {/* Row 4 — Credential URL */}
      <div className="space-y-1.5">
        <label htmlFor="cert-credential-url" className="text-sm font-medium text-foreground">
          Credential URL
        </label>
        <input
          id="cert-credential-url"
          type="url"
          autoComplete="off"
          placeholder="https://creds.com/my-cert"
          {...register('credential_url')}
          className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.credential_url && (
          <p className="text-xs text-destructive">{errors.credential_url.message}</p>
        )}
      </div>

      {/* Row 5 — Badge Image URL */}
      <div className="space-y-1.5">
        <label htmlFor="cert-badge-url" className="text-sm font-medium text-foreground">
          Badge Image URL
        </label>
        <input
          id="cert-badge-url"
          type="url"
          autoComplete="off"
          placeholder="https://creds.com/badge.png"
          {...register('badge_image_url')}
          className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.badge_image_url && (
          <p className="text-xs text-destructive">{errors.badge_image_url.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-9 items-center justify-center rounded-[var(--border-radius)] border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-9 items-center justify-center rounded-[var(--border-radius)] bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Certification'}
        </button>
      </div>
    </form>
  );
}
