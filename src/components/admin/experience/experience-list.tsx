'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteExperience } from '@/lib/actions/experience';
import { ExperienceForm } from './experience-form';
import { Tables } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ExperienceRow = Tables<'experiences'>;

interface ExperienceListProps {
  experiences: ExperienceRow[];
}

// ---------------------------------------------------------------------------
// Helper — format a YYYY-MM-DD date string to e.g. "Jan 2023"
// ---------------------------------------------------------------------------

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00'); // avoid TZ shift
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// ---------------------------------------------------------------------------
// Single experience card
// ---------------------------------------------------------------------------

interface ExperienceCardProps {
  experience: ExperienceRow;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDeleted: () => void;
}

function ExperienceCard({
  experience,
  isEditing,
  onEdit,
  onCancelEdit,
  onDeleted,
}: ExperienceCardProps) {
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const dateRange = [
    formatDate(experience.start_date),
    experience.is_current ? 'Present' : formatDate(experience.end_date),
  ]
    .filter(Boolean)
    .join(' – ');

  const [isDeleting, setIsDeleting] = useState(false);

  function handleDelete() {
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteExperience(experience.id);
      if ('error' in result) {
        setDeleteError(result.error);
        setIsDeleting(false);
      } else {
        onDeleted();
      }
    });
  }

  return (
    <div className="rounded-[var(--border-radius)] border border-border bg-card overflow-hidden text-card-foreground">
      {/* Card header */}
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold truncate">
              {experience.role}
            </h3>
            {experience.is_current && (
              <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600 dark:text-green-400">
                Current
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{experience.company_name}</p>
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            {dateRange && (
              <span className="text-xs text-muted-foreground">{dateRange}</span>
            )}
            {experience.employment_type && (
              <>
                <span className="text-xs text-muted-foreground/40">·</span>
                <span className="text-xs capitalize text-muted-foreground">
                  {experience.employment_type}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isDeleting ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
              <span className="text-[10px] font-medium text-destructive">Delete?</span>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="inline-flex h-8 items-center justify-center rounded-[var(--border-radius)] bg-destructive px-3 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                {isPending ? '...' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleting(false)}
                className="inline-flex h-8 items-center justify-center rounded-[var(--border-radius)] border border-input bg-background px-3 text-xs font-medium hover:bg-accent transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={isEditing ? onCancelEdit : onEdit}
                className="inline-flex h-8 items-center justify-center rounded-[var(--border-radius)] border border-input bg-background px-3 text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleting(true)}
                className="inline-flex h-8 items-center justify-center rounded-[var(--border-radius)] border border-destructive/30 bg-destructive/5 px-3 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Delete error */}
      {deleteError && (
        <div className="mx-5 mb-3 rounded-[var(--border-radius)] bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {deleteError}
        </div>
      )}

      {/* Inline edit form */}
      {isEditing && (
        <div className="border-t border-border px-5 py-5">
          <ExperienceForm
            experience={experience}
            onSuccess={onCancelEdit}
            onCancel={onCancelEdit}
          />
        </div>
       )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main list component
// ---------------------------------------------------------------------------

export function ExperienceList({ experiences: initialExperiences }: ExperienceListProps) {
  const router = useRouter();
  const [experiences, setExperiences] = useState<ExperienceRow[]>(initialExperiences);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Keep state in sync with props when they change (e.g. after router.refresh)
  useEffect(() => {
    setExperiences(initialExperiences);
  }, [initialExperiences]);

  function handleDeleted(id: string) {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) setEditingId(null);
    router.refresh();
  }

  function handleAddSuccess() {
    setShowAddForm(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {experiences.length === 0
            ? 'No experience entries yet.'
            : `${experiences.length} entr${experiences.length === 1 ? 'y' : 'ies'}`}
        </p>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => {
              setShowAddForm(true);
              setEditingId(null);
            }}
            className="inline-flex h-9 items-center justify-center rounded-[var(--border-radius)] bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            + Add Experience
          </button>
        )}
      </div>

      {/* Add experience form */}
      {showAddForm && (
        <div className="rounded-[var(--border-radius)] border border-border bg-card px-5 py-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">New Experience</h3>
          <ExperienceForm
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Experience cards */}
      {experiences.length === 0 && !showAddForm ? (
        <div className="rounded-[var(--border-radius)] border border-dashed border-border bg-muted/20 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Add your first work experience to get started.
          </p>
        </div>
      ) : (
        <ul className="space-y-3" role="list">
          {experiences.map((exp) => (
            <li key={exp.id}>
              <ExperienceCard
                experience={exp}
                isEditing={editingId === exp.id}
                onEdit={() => {
                  setEditingId(exp.id);
                  setShowAddForm(false);
                }}
                onCancelEdit={() => setEditingId(null)}
                onDeleted={() => handleDeleted(exp.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
