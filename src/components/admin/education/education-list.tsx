'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteEducation } from '@/lib/actions/education';
import { EducationForm } from './education-form';
import { Tables } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EducationRow = Tables<'education'>;

interface EducationListProps {
  educationList: EducationRow[];
}

// ---------------------------------------------------------------------------
// Single education card
// ---------------------------------------------------------------------------

interface EducationCardProps {
  education: EducationRow;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDeleted: () => void;
}

function EducationCard({
  education,
  isEditing,
  onEdit,
  onCancelEdit,
  onDeleted,
}: EducationCardProps) {
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const yearRange = [
    education.start_year,
    education.end_year,
  ]
    .filter(Boolean)
    .join(' – ');

  const [isDeleting, setIsDeleting] = useState(false);

  function handleDelete() {
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteEducation(education.id);
      if ('error' in result) {
        setDeleteError(result.error);
        setIsDeleting(false);
      } else {
        onDeleted();
      }
    });
  }

  return (
    <div className="rounded-[var(--border-radius)] border border-border bg-card overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div className="min-w-0 flex-1 space-y-0.5">
          <h3 className="text-sm font-semibold text-card-foreground truncate">
            {education.institution}
          </h3>
          <p className="text-sm text-foreground truncate">
            {[education.degree, education.field_of_study].filter(Boolean).join(', ')}
          </p>
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            {yearRange && (
              <span className="text-xs text-muted-foreground">{yearRange}</span>
            )}
            {education.gpa && (
              <>
                <span className="text-xs text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground">GPA: {education.gpa}</span>
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
          <EducationForm
            education={education}
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

export function EducationList({ educationList: initialEducation }: EducationListProps) {
  const router = useRouter();
  const [educationItems, setEducationItems] = useState<EducationRow[]>(initialEducation);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Keep state in sync with props when they change (e.g. after router.refresh)
  useEffect(() => {
    setEducationItems(initialEducation);
  }, [initialEducation]);

  function handleDeleted(id: string) {
    setEducationItems((prev) => prev.filter((e) => e.id !== id));
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
          {educationItems.length === 0
            ? 'No education entries yet.'
            : `${educationItems.length} entr${educationItems.length === 1 ? 'y' : 'ies'}`}
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
            + Add Education
          </button>
        )}
      </div>

      {/* Add education form */}
      {showAddForm && (
        <div className="rounded-[var(--border-radius)] border border-border bg-card px-5 py-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">New Education</h3>
          <EducationForm
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Education cards */}
      {educationItems.length === 0 && !showAddForm ? (
        <div className="rounded-[var(--border-radius)] border border-dashed border-border bg-muted/20 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Add your education details to get started.
          </p>
        </div>
      ) : (
        <ul className="space-y-3" role="list">
          {educationItems.map((edu) => (
            <li key={edu.id}>
              <EducationCard
                education={edu}
                isEditing={editingId === edu.id}
                onEdit={() => {
                  setEditingId(edu.id);
                  setShowAddForm(false);
                }}
                onCancelEdit={() => setEditingId(null)}
                onDeleted={() => handleDeleted(edu.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
