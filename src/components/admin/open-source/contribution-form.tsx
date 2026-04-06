'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { openSourceSchema, type OpenSourceFormValues } from '@/lib/validations/open-source';
import { createContribution, updateContribution } from '@/lib/actions/open-source';
import { Button } from '@/components/ui/button';
import { Tables } from '@/types';

type ContributionRow = Tables<'open_source_contributions'>;

interface ContributionFormProps {
  contribution?: ContributionRow;
  onSuccess: () => void;
  onCancel: () => void;
}

const ROLES = [
  { label: 'Owner', value: 'owner' },
  { label: 'Maintainer', value: 'maintainer' },
  { label: 'Contributor', value: 'contributor' },
] as const;

export function ContributionForm({ contribution, onSuccess, onCancel }: ContributionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const isEditing = !!contribution;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OpenSourceFormValues>({
    resolver: zodResolver(openSourceSchema),
    defaultValues: {
      repo_name: contribution?.repo_name ?? '',
      repo_url: contribution?.repo_url ?? '',
      description: contribution?.description ?? '',
      language: contribution?.language ?? '',
      stars: contribution?.stars ?? 0,
      role: (contribution?.role as OpenSourceFormValues['role']) ?? 'contributor',
    },
  });

  async function onSubmit(data: OpenSourceFormValues) {
    setFeedback(null);

    startTransition(async () => {
      const result = isEditing
        ? await updateContribution(contribution.id, data)
        : await createContribution(data);

      if ('error' in result) {
        setFeedback({ type: 'error', message: result.error });
        return;
      }

      setFeedback({
        type: 'success',
        message: isEditing ? 'Contribution updated!' : 'Contribution added!',
      });
      
      if (!isEditing) reset();
      
      // Delay success callback slightly to show success message
      setTimeout(() => onSuccess(), 600);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {feedback && (
        <div
          role="alert"
          className={`rounded-(--border-radius) px-4 py-3 text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="repo_name" className="text-sm font-medium text-foreground">
            Repository Name <span className="text-destructive">*</span>
          </label>
          <input
            id="repo_name"
            type="text"
            placeholder="e.g. next.js"
            {...register('repo_name')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.repo_name && <p className="text-xs text-destructive">{errors.repo_name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="repo_url" className="text-sm font-medium text-foreground">
            Repository URL
          </label>
          <input
            id="repo_url"
            type="url"
            placeholder="https://github.com/vercel/next.js"
            {...register('repo_url')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.repo_url && <p className="text-xs text-destructive">{errors.repo_url.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label htmlFor="language" className="text-sm font-medium text-foreground">
            Language
          </label>
          <input
            id="language"
            type="text"
            placeholder="e.g. TypeScript"
            {...register('language')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.language && <p className="text-xs text-destructive">{errors.language.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="stars" className="text-sm font-medium text-foreground">
            Stars
          </label>
          <input
            id="stars"
            type="number"
            {...register('stars', { valueAsNumber: true })}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.stars && <p className="text-xs text-destructive">{errors.stars.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="role" className="text-sm font-medium text-foreground">
            Your Role <span className="text-destructive">*</span>
          </label>
          <select
            id="role"
            {...register('role')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Briefly describe your contribution..."
          {...register('description')}
          className="flex min-h-[80px] w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : isEditing ? 'Update Contribution' : 'Add Contribution'}
        </Button>
      </div>
    </form>
  );
}
