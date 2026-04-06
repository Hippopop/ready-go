'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogPostSchema, type BlogPostFormValues } from '@/lib/validations/blog-post';
import { createBlogPost, updateBlogPost } from '@/lib/actions/blog-post';
import { Tables } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BlogPostRow = Tables<'blog_posts'>;

interface BlogPostFormProps {
  /** When provided, the form operates in edit mode */
  blogPost?: BlogPostRow;
  onSuccess: () => void;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Tag input sub-component (mirrors the one in experience-form)
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
        placeholder={tags.length === 0 ? 'Type tag and press Enter or comma…' : ''}
        className="flex-1 min-w-[140px] bg-transparent outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main form component
// ---------------------------------------------------------------------------

export function BlogPostForm({ blogPost, onSuccess, onCancel }: BlogPostFormProps) {
  const isEditing = !!blogPost;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: blogPost?.title ?? '',
      excerpt: blogPost?.excerpt ?? '',
      url: blogPost?.url ?? '',
      cover_image_url: blogPost?.cover_image_url ?? '',
      published_at: blogPost?.published_at ?? '',
      reading_time_minutes: blogPost?.reading_time_minutes ?? undefined,
      tags: blogPost?.tags ?? [],
    },
  });

  const tags = watch('tags') ?? [];

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  async function onSubmit(data: BlogPostFormValues) {
    setFeedback(null);

    const result = isEditing && blogPost
      ? await updateBlogPost(blogPost.id, data)
      : await createBlogPost(data);

    if ('error' in result) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }

    setFeedback({ type: 'success', message: isEditing ? 'Post updated!' : 'Post added!' });
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

      {/* Title */}
      <div className="space-y-1.5">
        <label htmlFor="blog-title" className="text-sm font-medium text-foreground">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="blog-title"
          type="text"
          autoComplete="off"
          placeholder="e.g. My Thoughts on AI in 2024"
          {...register('title')}
          className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* URL */}
      <div className="space-y-1.5">
        <label htmlFor="blog-url" className="text-sm font-medium text-foreground">
          Post URL <span className="text-destructive">*</span>
        </label>
        <input
          id="blog-url"
          type="url"
          placeholder="https://medium.com/@user/post-title"
          {...register('url')}
          className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.url && (
          <p className="text-xs text-destructive">{errors.url.message}</p>
        )}
      </div>

      {/* Excerpt */}
      <div className="space-y-1.5">
        <label htmlFor="blog-excerpt" className="text-sm font-medium text-foreground">
          Excerpt
        </label>
        <textarea
          id="blog-excerpt"
          rows={3}
          placeholder="A brief summary of your blog post…"
          {...register('excerpt')}
          className="flex w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y min-h-[80px]"
        />
        {errors.excerpt && (
          <p className="text-xs text-destructive">{errors.excerpt.message}</p>
        )}
      </div>

      {/* Grid: Date & Reading Time */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="blog-published-at" className="text-sm font-medium text-foreground">
            Published Date
          </label>
          <input
            id="blog-published-at"
            type="date"
            {...register('published_at')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.published_at && (
            <p className="text-xs text-destructive">{errors.published_at.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="blog-reading-time" className="text-sm font-medium text-foreground">
            Reading Time (minutes)
          </label>
          <input
            id="blog-reading-time"
            type="number"
            placeholder="5"
            {...register('reading_time_minutes', { valueAsNumber: true })}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.reading_time_minutes && (
            <p className="text-xs text-destructive">{errors.reading_time_minutes.message}</p>
          )}
        </div>
      </div>

      {/* Cover Image URL */}
      <div className="space-y-1.5">
        <label htmlFor="blog-cover-url" className="text-sm font-medium text-foreground">
          Cover Image URL
        </label>
        <input
          id="blog-cover-url"
          type="url"
          placeholder="https://example.com/cover.png"
          {...register('cover_image_url')}
          className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.cover_image_url && (
          <p className="text-xs text-destructive">{errors.cover_image_url.message}</p>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Tags</label>
        <TagInput
          tags={tags}
          onChange={(newTags) => setValue('tags', newTags, { shouldDirty: true })}
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
          {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Blog Post'}
        </button>
      </div>
    </form>
  );
}
