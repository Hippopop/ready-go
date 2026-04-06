'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  experienceSchema,
  EMPLOYMENT_TYPES,
  type ExperienceFormValues,
} from '@/lib/validations/experience';
import { createExperience, updateExperience } from '@/lib/actions/experience';
import { Tables } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ExperienceRow = Tables<'experiences'>;

interface ExperienceFormProps {
  /** When provided, the form operates in edit mode */
  experience?: ExperienceRow;
  onSuccess: () => void;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Label helpers
// ---------------------------------------------------------------------------

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
};

// ---------------------------------------------------------------------------
// TechStack tag input sub-component
// ---------------------------------------------------------------------------

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

function TagInput({ tags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(raw: string) {
    const trimmed = raw.trim().replace(/,$/, '').trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }

  function handleBlur() {
    if (inputValue.trim()) addTag(inputValue);
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, i) => i !== index));
  }

  return (
    <div
      className="flex min-h-10 flex-wrap gap-1.5 rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1 rounded-(--border-radius) bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={(e) => {
              e.stopPropagation();
              removeTag(i);
            }}
            className="hover:text-destructive transition-colors"
          >
            ✕
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? 'Type skill and press Enter or comma…' : ''}
        className="flex-1 min-w-[140px] bg-transparent outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main form component
// ---------------------------------------------------------------------------

export function ExperienceForm({ experience, onSuccess, onCancel }: ExperienceFormProps) {
  const isEditing = !!experience;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company_name: experience?.company_name ?? '',
      company_url: experience?.company_url ?? '',
      company_logo_url: experience?.company_logo_url ?? '',
      role: experience?.role ?? '',
      employment_type: (experience?.employment_type as ExperienceFormValues['employment_type']) ?? 'full-time',
      start_date: experience?.start_date ?? '',
      end_date: experience?.end_date ?? '',
      is_current: experience?.is_current ?? false,
      description: experience?.description ?? '',
      tech_stack: experience?.tech_stack ?? [],
    },
  });

  const isCurrent = watch('is_current');
  const techStack = watch('tech_stack') ?? [];

  // When toggling isCurrent on, clear end_date
  useEffect(() => {
    if (isCurrent) {
      setValue('end_date', '');
    }
  }, [isCurrent, setValue]);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  async function onSubmit(data: ExperienceFormValues) {
    setFeedback(null);

    const result = isEditing && experience
      ? await updateExperience(experience.id, data)
      : await createExperience(data);

    if ('error' in result) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }

    setFeedback({ type: 'success', message: isEditing ? 'Experience updated!' : 'Experience added!' });
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

      {/* Row 1 — Role & Company */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="exp-role" className="text-sm font-medium text-foreground">
            Role / Title <span className="text-destructive">*</span>
          </label>
          <input
            id="exp-role"
            type="text"
            autoComplete="off"
            placeholder="e.g. Senior Frontend Engineer"
            {...register('role')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.role && (
            <p className="text-xs text-destructive">{errors.role.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="exp-company" className="text-sm font-medium text-foreground">
            Company Name <span className="text-destructive">*</span>
          </label>
          <input
            id="exp-company"
            type="text"
            autoComplete="organization"
            placeholder="e.g. Acme Corp"
            {...register('company_name')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.company_name && (
            <p className="text-xs text-destructive">{errors.company_name.message}</p>
          )}
        </div>
      </div>

      {/* Row 2 — Employment type & Company URL */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="exp-employment-type" className="text-sm font-medium text-foreground">
            Employment Type <span className="text-destructive">*</span>
          </label>
          <select
            id="exp-employment-type"
            {...register('employment_type')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {EMPLOYMENT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          {errors.employment_type && (
            <p className="text-xs text-destructive">{errors.employment_type.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="exp-company-url" className="text-sm font-medium text-foreground">
            Company Website
          </label>
          <input
            id="exp-company-url"
            type="url"
            autoComplete="off"
            placeholder="https://company.com"
            {...register('company_url')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.company_url && (
            <p className="text-xs text-destructive">{errors.company_url.message}</p>
          )}
        </div>
      </div>

      {/* Row 3 — Dates & is_current */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="exp-start-date" className="text-sm font-medium text-foreground">
            Start Date <span className="text-destructive">*</span>
          </label>
          <input
            id="exp-start-date"
            type="date"
            {...register('start_date')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.start_date && (
            <p className="text-xs text-destructive">{errors.start_date.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="exp-end-date"
            className={`text-sm font-medium ${isCurrent ? 'text-muted-foreground' : 'text-foreground'}`}
          >
            End Date
          </label>
          {isCurrent ? (
            <div className="flex h-10 items-center rounded-(--border-radius) border border-input bg-muted/40 px-3 text-sm text-muted-foreground select-none">
              Present
            </div>
          ) : (
            <input
              id="exp-end-date"
              type="date"
              {...register('end_date')}
              className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          )}
          {errors.end_date && (
            <p className="text-xs text-destructive">{errors.end_date.message}</p>
          )}
        </div>
      </div>

      {/* is_current checkbox */}
      <label className="flex items-center gap-2.5 cursor-pointer w-fit">
        <input
          type="checkbox"
          id="exp-is-current"
          {...register('is_current')}
          className="h-4 w-4 rounded border-input accent-primary"
        />
        <span className="text-sm text-foreground">I currently work here</span>
      </label>

      {/* Company logo URL */}
      <div className="space-y-1.5">
        <label htmlFor="exp-logo-url" className="text-sm font-medium text-foreground">
          Company Logo URL
        </label>
        <input
          id="exp-logo-url"
          type="url"
          autoComplete="off"
          placeholder="https://company.com/logo.png"
          {...register('company_logo_url')}
          className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.company_logo_url && (
          <p className="text-xs text-destructive">{errors.company_logo_url.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="exp-description" className="text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          id="exp-description"
          rows={4}
          placeholder="Describe your responsibilities, achievements, and impact…"
          {...register('description')}
          className="flex w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y min-h-[96px]"
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Tech stack */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Tech Stack</label>
        <TagInput
          tags={techStack}
          onChange={(tags) => setValue('tech_stack', tags, { shouldDirty: true })}
        />
        <p className="text-xs text-muted-foreground">
          Press <kbd className="rounded border border-border px-1 py-0.5 font-mono text-[10px]">Enter</kbd> or{' '}
          <kbd className="rounded border border-border px-1 py-0.5 font-mono text-[10px]">,</kbd> to add a tag.
        </p>
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
          {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Experience'}
        </button>
      </div>
    </form>
  );
}
