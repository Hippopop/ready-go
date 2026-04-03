'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationSchema, type EducationFormValues } from '@/lib/validations/education';
import { createEducation, updateEducation } from '@/lib/actions/education';
import { Tables } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EducationRow = Tables<'education'>;

interface EducationFormProps {
  /** When provided, the form operates in edit mode */
  education?: EducationRow;
  onSuccess: () => void;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Main form component
// ---------------------------------------------------------------------------

export function EducationForm({ education, onSuccess, onCancel }: EducationFormProps) {
  const isEditing = !!education;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: education?.institution ?? '',
      institution_logo_url: education?.institution_logo_url ?? '',
      degree: education?.degree ?? '',
      field_of_study: education?.field_of_study ?? '',
      start_year: education?.start_year ?? undefined,
      end_year: education?.end_year ?? undefined,
      gpa: education?.gpa ?? '',
      honors: education?.honors ?? '',
      description: education?.description ?? '',
    },
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  async function onSubmit(data: EducationFormValues) {
    setFeedback(null);

    const result = isEditing && education
      ? await updateEducation(education.id, data)
      : await createEducation(data);

    if ('error' in result) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }

    setFeedback({ type: 'success', message: isEditing ? 'Education updated!' : 'Education added!' });
    reset();
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

      {/* Row 1 — Institution */}
      <div className="space-y-1.5">
        <label htmlFor="edu-institution" className="text-sm font-medium text-foreground">
          Institution <span className="text-destructive">*</span>
        </label>
        <input
          id="edu-institution"
          type="text"
          autoComplete="off"
          placeholder="e.g. Stanford University"
          {...register('institution')}
          className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.institution && (
          <p className="text-xs text-destructive">{errors.institution.message}</p>
        )}
      </div>

      {/* Row 2 — Degree & Field of Study */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="edu-degree" className="text-sm font-medium text-foreground">
            Degree
          </label>
          <input
            id="edu-degree"
            type="text"
            autoComplete="off"
            placeholder="e.g. Bachelor of Science"
            {...register('degree')}
            className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.degree && (
            <p className="text-xs text-destructive">{errors.degree.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="edu-field" className="text-sm font-medium text-foreground">
            Field of Study
          </label>
          <input
            id="edu-field"
            type="text"
            autoComplete="off"
            placeholder="e.g. Computer Science"
            {...register('field_of_study')}
            className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.field_of_study && (
            <p className="text-xs text-destructive">{errors.field_of_study.message}</p>
          )}
        </div>
      </div>

      {/* Row 3 — Start Year & End Year */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="edu-start-year" className="text-sm font-medium text-foreground">
            Start Year
          </label>
          <input
            id="edu-start-year"
            type="number"
            placeholder="YYYY"
            {...register('start_year')}
            className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.start_year && (
            <p className="text-xs text-destructive">{errors.start_year.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="edu-end-year" className="text-sm font-medium text-foreground">
            End Year (or Expected)
          </label>
          <input
            id="edu-end-year"
            type="number"
            placeholder="YYYY"
            {...register('end_year')}
            className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.end_year && (
            <p className="text-xs text-destructive">{errors.end_year.message}</p>
          )}
        </div>
      </div>

      {/* Row 4 — GPA & Honors */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="edu-gpa" className="text-sm font-medium text-foreground">
            GPA
          </label>
          <input
            id="edu-gpa"
            type="text"
            autoComplete="off"
            placeholder="e.g. 3.9/4.0"
            {...register('gpa')}
            className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.gpa && (
            <p className="text-xs text-destructive">{errors.gpa.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="edu-honors" className="text-sm font-medium text-foreground">
            Honors / Awards
          </label>
          <input
            id="edu-honors"
            type="text"
            autoComplete="off"
            placeholder="e.g. Dean's List"
            {...register('honors')}
            className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.honors && (
            <p className="text-xs text-destructive">{errors.honors.message}</p>
          )}
        </div>
      </div>

      {/* Row 5 — Institution Logo URL */}
      <div className="space-y-1.5">
        <label htmlFor="edu-logo-url" className="text-sm font-medium text-foreground">
          Institution Logo URL
        </label>
        <input
          id="edu-logo-url"
          type="url"
          autoComplete="off"
          placeholder="https://univ.edu/logo.png"
          {...register('institution_logo_url')}
          className="flex h-10 w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.institution_logo_url && (
          <p className="text-xs text-destructive">{errors.institution_logo_url.message}</p>
        )}
      </div>

      {/* Row 6 — Description */}
      <div className="space-y-1.5">
        <label htmlFor="edu-description" className="text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          id="edu-description"
          rows={3}
          placeholder="Relevant coursework, clubs, or research…"
          {...register('description')}
          className="flex w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y min-h-[80px]"
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
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
          {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Education'}
        </button>
      </div>
    </form>
  );
}
