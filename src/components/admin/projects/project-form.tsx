'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormValues } from '@/lib/validations/project';
import { createProject, updateProject } from '@/lib/actions/project';
import { Tables } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProjectRow = Tables<'projects'>;

interface ProjectFormProps {
  /** When provided, the form operates in edit mode */
  project?: ProjectRow;
  onSuccess: () => void;
  onCancel: () => void;
}

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
        placeholder={tags.length === 0 ? 'Type tech stack and press Enter or comma…' : ''}
        className="flex-1 min-w-[140px] bg-transparent outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main form component
// ---------------------------------------------------------------------------

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? '',
      description: project?.description ?? '',
      cover_image_url: project?.cover_image_url ?? '',
      live_url: project?.live_url ?? '',
      github_url: project?.github_url ?? '',
      tech_stack: project?.tech_stack ?? [],
      is_featured: project?.is_featured ?? false,
    },
  });

  const techStack = watch('tech_stack') ?? [];

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  async function onSubmit(data: ProjectFormValues) {
    setFeedback(null);

    const result = isEditing && project
      ? await updateProject(project.id, data)
      : await createProject(data);

    if ('error' in result) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }

    setFeedback({ type: 'success', message: isEditing ? 'Project updated!' : 'Project added!' });
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
        <label htmlFor="project-title" className="text-sm font-medium text-foreground">
          Project Title <span className="text-destructive">*</span>
        </label>
        <input
          id="project-title"
          type="text"
          autoComplete="off"
          placeholder="e.g. My Awesome Portfolio"
          {...register('title')}
          className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="project-description" className="text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          id="project-description"
          rows={4}
          placeholder="Describe your project, features, and your role…"
          {...register('description')}
          className="flex w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y min-h-[96px]"
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Rows — URLs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="project-live-url" className="text-sm font-medium text-foreground">
            Live URL
          </label>
          <input
            id="project-live-url"
            type="url"
            placeholder="https://myproject.com"
            {...register('live_url')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.live_url && (
            <p className="text-xs text-destructive">{errors.live_url.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="project-github-url" className="text-sm font-medium text-foreground">
            GitHub URL
          </label>
          <input
            id="project-github-url"
            type="url"
            placeholder="https://github.com/user/repo"
            {...register('github_url')}
            className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {errors.github_url && (
            <p className="text-xs text-destructive">{errors.github_url.message}</p>
          )}
        </div>
      </div>

      {/* Cover Image URL */}
      <div className="space-y-1.5">
        <label htmlFor="project-image-url" className="text-sm font-medium text-foreground">
          Cover Image URL
        </label>
        <input
          id="project-image-url"
          type="url"
          placeholder="https://myproject.com/cover.png"
          {...register('cover_image_url')}
          className="flex h-10 w-full rounded-(--border-radius) border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {errors.cover_image_url && (
          <p className="text-xs text-destructive">{errors.cover_image_url.message}</p>
        )}
      </div>

      {/* is_featured checkbox */}
      <label className="flex items-center gap-2.5 cursor-pointer w-fit">
        <input
          type="checkbox"
          id="project-is-featured"
          {...register('is_featured')}
          className="h-4 w-4 rounded border-input accent-primary"
        />
        <span className="text-sm text-foreground">Feature this project</span>
      </label>

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
          {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Project'}
        </button>
      </div>
    </form>
  );
}
