'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  skillSchema,
  SKILL_CATEGORIES,
  type SkillFormValues,
} from '@/lib/validations/skill';
import { createSkill, updateSkill } from '@/lib/actions/skill';
import { Button } from '@/components/ui/button';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SkillFormProps {
  /** When provided the form runs updateSkill instead of createSkill. */
  id?: string;
  defaultValues?: Partial<SkillFormValues>;
  onSuccess?: () => void;
}

// ---------------------------------------------------------------------------
// Star rating sub-component
// ---------------------------------------------------------------------------
interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function StarRating({ value, onChange, disabled }: StarRatingProps) {
  const [hovered, setHovered] = useState<number>(0);

  return (
    <div
      role="group"
      aria-label="Proficiency rating (1–5 stars)"
      className="flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            aria-pressed={star === value}
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={[
              'rounded p-0.5 text-2xl leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              filled ? 'text-amber-400' : 'text-muted-foreground/40',
            ].join(' ')}
          >
            ★
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-1 text-sm text-muted-foreground">{value}/5</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skill Form
// ---------------------------------------------------------------------------
export function SkillForm({ id, defaultValues, onSuccess }: SkillFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const isEditing = Boolean(id);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      category: defaultValues?.category ?? '',
      icon_url: defaultValues?.icon_url ?? '',
      proficiency: defaultValues?.proficiency ?? 3,
      years_of_experience: defaultValues?.years_of_experience ?? undefined,
    },
  });

  // -------------------------------------------------------------------------
  // Submit handler
  // -------------------------------------------------------------------------
  function onSubmit(data: SkillFormValues) {
    setFeedback(null);

    startTransition(async () => {
      const result = isEditing
        ? await updateSkill(id!, data)
        : await createSkill(data);

      if (result.success) {
        setFeedback({
          type: 'success',
          message: isEditing ? 'Skill updated!' : 'Skill added!',
        });
        if (!isEditing) reset();
        router.refresh();
        onSuccess?.();
      } else {
        setFeedback({
          type: 'error',
          message: result.error ?? 'Something went wrong',
        });
      }
    });
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-(--border-radius) border border-border bg-muted/30 p-4"
    >
      <p className="text-sm font-semibold text-foreground">
        {isEditing ? 'Edit Skill' : 'Add a Skill'}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-1">
          <label
            htmlFor="skill-name"
            className="block text-sm font-medium text-foreground"
          >
            Skill Name <span className="text-destructive">*</span>
          </label>
          <input
            id="skill-name"
            type="text"
            placeholder="e.g. TypeScript"
            className="w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label
            htmlFor="skill-category"
            className="block text-sm font-medium text-foreground"
          >
            Category
          </label>
          <input
            id="skill-category"
            type="text"
            list="skill-category-options"
            placeholder="e.g. Frontend"
            autoComplete="off"
            className="w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
            {...register('category')}
          />
          <datalist id="skill-category-options">
            {SKILL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          {errors.category && (
            <p className="text-xs text-destructive">{errors.category.message}</p>
          )}
        </div>

        {/* Icon URL */}
        <div className="space-y-1">
          <label
            htmlFor="skill-icon-url"
            className="block text-sm font-medium text-foreground"
          >
            Icon URL
          </label>
          <input
            id="skill-icon-url"
            type="url"
            placeholder="https://cdn.example.com/icon.svg"
            className="w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
            {...register('icon_url')}
          />
          {errors.icon_url && (
            <p className="text-xs text-destructive">{errors.icon_url.message}</p>
          )}
        </div>

        {/* Years of experience */}
        <div className="space-y-1">
          <label
            htmlFor="skill-years"
            className="block text-sm font-medium text-foreground"
          >
            Years of Experience
          </label>
          <input
            id="skill-years"
            type="number"
            min={0}
            step={0.5}
            placeholder="e.g. 3"
            className="w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
            {...register('years_of_experience', { valueAsNumber: true })}
          />
          {errors.years_of_experience && (
            <p className="text-xs text-destructive">
              {errors.years_of_experience.message}
            </p>
          )}
        </div>
      </div>

      {/* Proficiency — star rating */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          Proficiency <span className="text-destructive">*</span>
        </p>
        <Controller
          name="proficiency"
          control={control}
          render={({ field }) => (
            <StarRating
              value={field.value}
              onChange={field.onChange}
              disabled={isPending}
            />
          )}
        />
        {errors.proficiency && (
          <p className="text-xs text-destructive">{errors.proficiency.message}</p>
        )}
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          role="alert"
          className={`rounded-(--border-radius) px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'border border-destructive/30 bg-destructive/10 text-destructive'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? 'Saving…'
              : 'Adding…'
            : isEditing
            ? 'Save Changes'
            : 'Add Skill'}
        </Button>
      </div>
    </form>
  );
}
