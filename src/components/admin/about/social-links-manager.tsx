'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  socialLinkSchema,
  type SocialLinkFormValues,
} from '@/lib/validations/about';
import { addSocialLink, deleteSocialLink } from '@/lib/actions/about';
import { Button } from '@/components/ui/button';
import type { Database } from '@/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type SocialLinkRow = Database['public']['Tables']['social_links']['Row'];

interface SocialLinksManagerProps {
  socialLinks: SocialLinkRow[];
}

// ---------------------------------------------------------------------------
// Common platform suggestions
// ---------------------------------------------------------------------------
const PLATFORM_OPTIONS = [
  'GitHub',
  'LinkedIn',
  'Twitter/X',
  'YouTube',
  'Website',
  'Email',
  'Instagram',
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function SocialLinksManager({ socialLinks }: SocialLinksManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: '',
      url: '',
    },
  });

  // -----------------------------------------------------------------------
  // Add link
  // -----------------------------------------------------------------------
  function onAdd(data: SocialLinkFormValues) {
    setFeedback(null);

    startTransition(async () => {
      const result = await addSocialLink(data);

      if (result.success) {
        setFeedback({ type: 'success', message: 'Social link added!' });
        reset();
        router.refresh();
      } else {
        setFeedback({
          type: 'error',
          message: result.error ?? 'Failed to add social link',
        });
      }
    });
  }

  // -----------------------------------------------------------------------
  // Delete link
  // -----------------------------------------------------------------------
  function handleDelete(id: string) {
    setFeedback(null);
    setDeletingId(id);

    startTransition(async () => {
      const result = await deleteSocialLink(id);

      if (result.success) {
        setFeedback({ type: 'success', message: 'Social link removed.' });
        router.refresh();
      } else {
        setFeedback({
          type: 'error',
          message: result.error ?? 'Failed to delete social link',
        });
      }

      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-6 rounded-(--border-radius) border border-border bg-card p-6">
      <div>
        <h2 className="text-lg font-semibold text-card-foreground">
          Social Links
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add links to your social profiles so visitors can connect with you.
        </p>
      </div>

      {/* Existing links list */}
      {socialLinks.length > 0 ? (
        <ul className="divide-y divide-border rounded-(--border-radius) border border-border">
          {socialLinks.map((link) => (
            <li
              key={link.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {link.platform}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {link.url}
                </p>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isPending && deletingId === link.id}
                onClick={() => handleDelete(link.id)}
              >
                {isPending && deletingId === link.id ? 'Removing…' : 'Delete'}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-(--border-radius) border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No social links added yet. Add your first one below.
        </div>
      )}

      {/* Add link form */}
      <form
        onSubmit={handleSubmit(onAdd)}
        className="space-y-4 rounded-(--border-radius) border border-border bg-muted/30 p-4"
      >
        <p className="text-sm font-medium text-foreground">Add a social link</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Platform */}
          <div className="space-y-2">
            <label
              htmlFor="social-platform"
              className="block text-sm font-medium text-foreground"
            >
              Platform <span className="text-destructive">*</span>
            </label>
            <select
              id="social-platform"
              className="w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
              {...register('platform')}
            >
              <option value="">Select a platform…</option>
              {PLATFORM_OPTIONS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            {errors.platform && (
              <p className="text-xs text-destructive">
                {errors.platform.message}
              </p>
            )}
          </div>

          {/* URL */}
          <div className="space-y-2">
            <label
              htmlFor="social-url"
              className="block text-sm font-medium text-foreground"
            >
              URL <span className="text-destructive">*</span>
            </label>
            <input
              id="social-url"
              type="url"
              placeholder="https://github.com/username"
              className="w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
              {...register('url')}
            />
            {errors.url && (
              <p className="text-xs text-destructive">{errors.url.message}</p>
            )}
          </div>
        </div>

        {/* Feedback */}
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
          <Button type="submit" disabled={isPending && deletingId === null}>
            {isPending && deletingId === null ? 'Adding…' : 'Add Link'}
          </Button>
        </div>
      </form>
    </div>
  );
}
