'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { heroSchema, type HeroFormValues } from '@/lib/validations/hero';
import { upsertHero } from '@/lib/actions/hero';
import { Button } from '@/components/ui/button';

interface HeroFormProps {
  defaultValues: HeroFormValues | null;
}

export function HeroForm({ defaultValues }: HeroFormProps) {
  const [status, setStatus] = useState<
    { type: 'idle' } | { type: 'success' } | { type: 'error'; message: string }
  >({ type: 'idle' });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: defaultValues ?? {
      headline: '',
      subheadline: '',
      tagline: '',
      profile_image_url: '',
      cta_primary_text: 'Hire Me',
      cta_primary_url: '',
      cta_secondary_text: 'View Resume',
      is_typing_animation: true,
      typing_texts: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // useFieldArray expects objects, so we use a wrapper
    name: 'typing_texts' as never,
  });

  const onSubmit = async (data: HeroFormValues) => {
    setStatus({ type: 'idle' });

    const result = await upsertHero(data);

    if ('error' in result) {
      setStatus({ type: 'error', message: result.error });
      return;
    }

    setStatus({ type: 'success' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Status messages */}
      {status.type === 'success' && (
        <p className="rounded-(--border-radius) bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Hero section saved!
        </p>
      )}

      {status.type === 'error' && (
        <p className="rounded-(--border-radius) bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {status.message}
        </p>
      )}

      {/* Headline */}
      <div className="space-y-1.5">
        <label
          htmlFor="headline"
          className="block text-sm font-medium text-foreground"
        >
          Headline <span className="text-destructive">*</span>
        </label>
        <input
          id="headline"
          type="text"
          placeholder="Hi, I'm Jane — a Full-Stack Developer"
          className="w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          {...register('headline')}
        />
        {errors.headline && (
          <p className="text-xs text-destructive">{errors.headline.message}</p>
        )}
        <p className="text-xs text-muted-foreground">Max 100 characters</p>
      </div>

      {/* Subheadline */}
      <div className="space-y-1.5">
        <label
          htmlFor="subheadline"
          className="block text-sm font-medium text-foreground"
        >
          Subheadline
        </label>
        <input
          id="subheadline"
          type="text"
          placeholder="Building modern web experiences"
          className="w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          {...register('subheadline')}
        />
        {errors.subheadline && (
          <p className="text-xs text-destructive">
            {errors.subheadline.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">Max 150 characters</p>
      </div>

      {/* Tagline */}
      <div className="space-y-1.5">
        <label
          htmlFor="tagline"
          className="block text-sm font-medium text-foreground"
        >
          Tagline
        </label>
        <input
          id="tagline"
          type="text"
          placeholder="Turning caffeine into code since 2015"
          className="w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          {...register('tagline')}
        />
        {errors.tagline && (
          <p className="text-xs text-destructive">{errors.tagline.message}</p>
        )}
        <p className="text-xs text-muted-foreground">Max 200 characters</p>
      </div>

      {/* Profile image URL */}
      <div className="space-y-1.5">
        <label
          htmlFor="profile_image_url"
          className="block text-sm font-medium text-foreground"
        >
          Profile Image URL
        </label>
        <input
          id="profile_image_url"
          type="url"
          placeholder="https://example.com/your-photo.jpg"
          className="w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          {...register('profile_image_url')}
        />
        {errors.profile_image_url && (
          <p className="text-xs text-destructive">
            {errors.profile_image_url.message}
          </p>
        )}
      </div>

      {/* CTA primary text */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="cta_primary_text"
            className="block text-sm font-medium text-foreground"
          >
            Primary CTA Text
          </label>
          <input
            id="cta_primary_text"
            type="text"
            placeholder="Hire Me"
            className="w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            {...register('cta_primary_text')}
          />
          {errors.cta_primary_text && (
            <p className="text-xs text-destructive">
              {errors.cta_primary_text.message}
            </p>
          )}
        </div>

        {/* CTA primary URL */}
        <div className="space-y-1.5">
          <label
            htmlFor="cta_primary_url"
            className="block text-sm font-medium text-foreground"
          >
            Primary CTA URL
          </label>
          <input
            id="cta_primary_url"
            type="url"
            placeholder="https://calendly.com/you"
            className="w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            {...register('cta_primary_url')}
          />
          {errors.cta_primary_url && (
            <p className="text-xs text-destructive">
              {errors.cta_primary_url.message}
            </p>
          )}
        </div>
      </div>

      {/* CTA secondary text */}
      <div className="space-y-1.5">
        <label
          htmlFor="cta_secondary_text"
          className="block text-sm font-medium text-foreground"
        >
          Secondary CTA Text
        </label>
        <input
          id="cta_secondary_text"
          type="text"
          placeholder="View Resume"
          className="w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          {...register('cta_secondary_text')}
        />
        {errors.cta_secondary_text && (
          <p className="text-xs text-destructive">
            {errors.cta_secondary_text.message}
          </p>
        )}
      </div>

      <hr className="border-border" />

      {/* Typing animation toggle */}
      <div className="flex items-center gap-3">
        <input
          id="is_typing_animation"
          type="checkbox"
          className="size-4 rounded border-input accent-primary"
          {...register('is_typing_animation')}
        />
        <label
          htmlFor="is_typing_animation"
          className="text-sm font-medium text-foreground"
        >
          Enable typing animation
        </label>
      </div>

      {/* Typing texts — dynamic list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-foreground">
            Typing Texts
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append('' as never)}
          >
            <Plus data-icon="inline-start" className="size-3.5" />
            Add
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          These phrases cycle as a typing animation in your hero section.
        </p>

        {fields.length === 0 && (
          <p className="rounded-(--border-radius) border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
            No typing texts yet. Click &quot;Add&quot; to create one.
          </p>
        )}

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Typing text ${index + 1}`}
                className="flex-1 rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                {...register(`typing_texts.${index}` as const)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => remove(index)}
                aria-label={`Remove typing text ${index + 1}`}
              >
                <Trash2 className="size-3.5 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>

        {errors.typing_texts && (
          <p className="text-xs text-destructive">
            {errors.typing_texts.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting && (
          <Loader2 data-icon="inline-start" className="size-4 animate-spin" />
        )}
        {isSubmitting ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  );
}
