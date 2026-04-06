'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { awardSchema, type AwardFormValues } from '@/lib/validations/award';
import { createAward, updateAward } from '@/lib/actions/award';
import { Tables } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AwardRow = Tables<'awards'>;

interface AwardFormProps {
  /** When provided, the form operates in edit mode */
  award?: AwardRow;
  onSuccess: () => void;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Main form component
// ---------------------------------------------------------------------------

export function AwardForm({ 
  award, 
  onSuccess, 
  onCancel 
}: AwardFormProps) {
  const isEditing = !!award;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AwardFormValues>({
    resolver: zodResolver(awardSchema),
    defaultValues: {
      title: award?.title ?? '',
      issuer: award?.issuer ?? '',
      date: award?.date ?? '',
      description: award?.description ?? '',
      url: award?.url ?? '',
    },
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  async function onSubmit(data: AwardFormValues) {
    setFeedback(null);

    const result = isEditing && award
      ? await updateAward(award.id, data)
      : await createAward(data);

    if ('error' in result) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }

    setFeedback({ 
      type: 'success', 
      message: isEditing ? 'Award updated!' : 'Award added!' 
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
          className={`rounded-(--border-radius) px-4 py-3 text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Row 1 — Title */}
      <div className="space-y-1.5">
        <label htmlFor="award-title" className="text-sm font-medium text-foreground">
          Award Title <span className="text-destructive">*</span>
        </label>
        <input
          id="award-title"
          type="text"
          autoComplete="off"
          placeholder="e.g. Employee of the Year"
          {...register('title')}
          className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Row 2 — Issuer */}
      <div className="space-y-1.5">
        <label htmlFor="award-issuer" className="text-sm font-medium text-foreground">
          Issuer
        </label>
        <input
          id="award-issuer"
          type="text"
          autoComplete="off"
          placeholder="e.g. Acme Corporation"
          {...register('issuer')}
          className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.issuer && (
          <p className="text-xs text-destructive">{errors.issuer.message}</p>
        )}
      </div>

      {/* Row 3 — Date */}
      <div className="space-y-1.5">
        <label htmlFor="award-date" className="text-sm font-medium text-foreground">
          Date
        </label>
        <input
          id="award-date"
          type="date"
          {...register('date')}
          className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.date && (
          <p className="text-xs text-destructive">{errors.date.message}</p>
        )}
      </div>

      {/* Row 4 — Description */}
      <div className="space-y-1.5">
        <label htmlFor="award-description" className="text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          id="award-description"
          placeholder="Briefly describe the award and why you received it"
          {...register('description')}
          className="flex min-h-[100px] w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Row 5 — URL */}
      <div className="space-y-1.5">
        <label htmlFor="award-url" className="text-sm font-medium text-foreground">
          URL
        </label>
        <input
          id="award-url"
          type="url"
          autoComplete="off"
          placeholder="https://example.com/award"
          {...register('url')}
          className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.url && (
          <p className="text-xs text-destructive">{errors.url.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-9 items-center justify-center rounded-(--border-radius) border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-9 items-center justify-center rounded-(--border-radius) bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Award'}
        </button>
      </div>
    </form>
  );
}
