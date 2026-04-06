'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { testimonialSchema, type TestimonialFormValues } from '@/lib/validations/testimonial';
import { createTestimonial, updateTestimonial } from '@/lib/actions/testimonial';
import { Tables } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TestimonialRow = Tables<'testimonials'>;

interface TestimonialFormProps {
  /** When provided, the form operates in edit mode */
  testimonial?: TestimonialRow;
  onSuccess: () => void;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Main form component
// ---------------------------------------------------------------------------

export function TestimonialForm({ testimonial, onSuccess, onCancel }: TestimonialFormProps) {
  const isEditing = !!testimonial;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      author_name: testimonial?.author_name ?? '',
      author_title: testimonial?.author_title ?? '',
      author_company: testimonial?.author_company ?? '',
      author_avatar_url: testimonial?.author_avatar_url ?? '',
      content: testimonial?.content ?? '',
      linkedin_url: testimonial?.linkedin_url ?? '',
    },
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  async function onSubmit(data: TestimonialFormValues) {
    setFeedback(null);

    const result = isEditing && testimonial
      ? await updateTestimonial(testimonial.id, data)
      : await createTestimonial(data);

    if ('error' in result) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }

    setFeedback({
      type: 'success',
      message: isEditing ? 'Testimonial updated!' : 'Testimonial added!',
    });
    reset();
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

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Row 1 — Author Name */}
        <div className="space-y-1.5">
          <label htmlFor="test-name" className="text-sm font-medium text-foreground">
            Author Name <span className="text-destructive">*</span>
          </label>
          <input
            id="test-name"
            type="text"
            autoComplete="off"
            placeholder="e.g. Jane Doe"
            {...register('author_name')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.author_name && (
            <p className="text-xs text-destructive">{errors.author_name.message}</p>
          )}
        </div>

        {/* Row 1 — Linkedin URL */}
        <div className="space-y-1.5">
          <label htmlFor="test-linkedin" className="text-sm font-medium text-foreground">
            LinkedIn URL
          </label>
          <input
            id="test-linkedin"
            type="url"
            autoComplete="off"
            placeholder="https://linkedin.com/in/username"
            {...register('linkedin_url')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.linkedin_url && (
            <p className="text-xs text-destructive">{errors.linkedin_url.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Row 2 — Title */}
        <div className="space-y-1.5">
          <label htmlFor="test-title" className="text-sm font-medium text-foreground">
            Author Title
          </label>
          <input
            id="test-title"
            type="text"
            autoComplete="off"
            placeholder="e.g. Senior Software Engineer"
            {...register('author_title')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.author_title && (
            <p className="text-xs text-destructive">{errors.author_title.message}</p>
          )}
        </div>

        {/* Row 2 — Company */}
        <div className="space-y-1.5">
          <label htmlFor="test-company" className="text-sm font-medium text-foreground">
            Company
          </label>
          <input
            id="test-company"
            type="text"
            autoComplete="off"
            placeholder="e.g. Google"
            {...register('author_company')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.author_company && (
            <p className="text-xs text-destructive">{errors.author_company.message}</p>
          )}
        </div>
      </div>

      {/* Row 3 — Avatar URL */}
      <div className="space-y-1.5">
        <label htmlFor="test-avatar" className="text-sm font-medium text-foreground">
          Avatar URL
        </label>
        <input
          id="test-avatar"
          type="url"
          autoComplete="off"
          placeholder="https://example.com/avatar.jpg"
          {...register('author_avatar_url')}
          className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.author_avatar_url && (
          <p className="text-xs text-destructive">{errors.author_avatar_url.message}</p>
        )}
      </div>

      {/* Row 4 — Content */}
      <div className="space-y-1.5">
        <label htmlFor="test-content" className="text-sm font-medium text-foreground">
          Testimonial Content <span className="text-destructive">*</span>
        </label>
        <textarea
          id="test-content"
          rows={4}
          placeholder="Jane is an exceptional engineer who delivered…"
          {...register('content')}
          className="flex w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y min-h-[100px]"
        />
        {errors.content && (
          <p className="text-xs text-destructive">{errors.content.message}</p>
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
          {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Testimonial'}
        </button>
      </div>
    </form>
  );
}
