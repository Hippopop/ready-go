'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  aboutSchema,
  AVAILABILITY_STATUSES,
  type AboutFormValues,
} from '@/lib/validations/about';
import { upsertAbout } from '@/lib/actions/about';
import { Button } from '@/components/ui/button';
import type { Database } from '@/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type AboutRow = Database['public']['Tables']['about']['Row'];

interface AboutFormProps {
  initialData: AboutRow | null;
}

// ---------------------------------------------------------------------------
// Human-readable labels for availability statuses
// ---------------------------------------------------------------------------
const STATUS_LABELS: Record<(typeof AVAILABILITY_STATUSES)[number], string> = {
  open: 'Open to work',
  busy: 'Busy',
  not_available: 'Not available',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function AboutForm({ initialData }: AboutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      bio: initialData?.bio ?? '',
      location: initialData?.location ?? '',
      availability_status:
        (initialData?.availability_status as AboutFormValues['availability_status']) ?? 'open',
      years_of_experience: initialData?.years_of_experience ?? undefined,
    },
  });

  const bioValue = watch('bio');

  function onSubmit(data: AboutFormValues) {
    setFeedback(null);

    startTransition(async () => {
      const result = await upsertAbout(data);

      if (result.success) {
        setFeedback({ type: 'success', message: 'About section saved successfully!' });
        router.refresh();
      } else {
        setFeedback({
          type: 'error',
          message: result.error ?? 'Something went wrong',
        });
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-[var(--border-radius)] border border-border bg-card p-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-card-foreground">
          About You
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell visitors about yourself — this appears in the About section of
          your portfolio.
        </p>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label
          htmlFor="about-bio"
          className="block text-sm font-medium text-foreground"
        >
          Bio <span className="text-destructive">*</span>
        </label>
        <textarea
          id="about-bio"
          rows={5}
          placeholder="Write a brief bio about yourself…"
          className="w-full resize-y rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          {...register('bio')}
        />
        <div className="flex items-center justify-between">
          {errors.bio && (
            <p className="text-xs text-destructive">{errors.bio.message}</p>
          )}
          <p className="ml-auto text-xs text-muted-foreground">
            {bioValue?.length ?? 0}/1000
          </p>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label
          htmlFor="about-location"
          className="block text-sm font-medium text-foreground"
        >
          Location
        </label>
        <input
          id="about-location"
          type="text"
          placeholder="e.g. San Francisco, CA"
          className="w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          {...register('location')}
        />
        {errors.location && (
          <p className="text-xs text-destructive">{errors.location.message}</p>
        )}
      </div>

      {/* Availability Status */}
      <div className="space-y-2">
        <label
          htmlFor="about-availability"
          className="block text-sm font-medium text-foreground"
        >
          Availability Status <span className="text-destructive">*</span>
        </label>
        <select
          id="about-availability"
          className="w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          {...register('availability_status')}
        >
          {AVAILABILITY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        {errors.availability_status && (
          <p className="text-xs text-destructive">
            {errors.availability_status.message}
          </p>
        )}
      </div>

      {/* Years of Experience */}
      <div className="space-y-2">
        <label
          htmlFor="about-experience"
          className="block text-sm font-medium text-foreground"
        >
          Years of Experience
        </label>
        <input
          id="about-experience"
          type="number"
          min={0}
          max={60}
          placeholder="e.g. 5"
          className="w-full rounded-[var(--border-radius)] border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          {...register('years_of_experience')}
        />
        {errors.years_of_experience && (
          <p className="text-xs text-destructive">
            {errors.years_of_experience.message}
          </p>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          role="alert"
          className={`rounded-[var(--border-radius)] px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'border border-destructive/30 bg-destructive/10 text-destructive'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save About'}
        </Button>
      </div>
    </form>
  );
}
