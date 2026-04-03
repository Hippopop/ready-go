'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteSkill } from '@/lib/actions/skill';
import { SkillForm } from './skill-form';
import { Button } from '@/components/ui/button';
import type { Database } from '@/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type SkillRow = Database['public']['Tables']['skills']['Row'];

interface SkillListProps {
  skills: SkillRow[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Render a row of filled/empty stars for a proficiency value (1–5). */
function ProficiencyStars({ value }: { value: number | null }) {
  const level = value ?? 0;
  return (
    <span
      aria-label={`Proficiency: ${level} out of 5`}
      className="flex items-center gap-0.5"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          aria-hidden="true"
          className={star <= level ? 'text-amber-400' : 'text-muted-foreground/30'}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/** Group an array of skills by category, returning an ordered Map. */
function groupByCategory(skills: SkillRow[]): Map<string, SkillRow[]> {
  const map = new Map<string, SkillRow[]>();
  for (const skill of skills) {
    const key = skill.category ?? 'Uncategorised';
    const group = map.get(key) ?? [];
    group.push(skill);
    map.set(key, group);
  }
  return map;
}

// ---------------------------------------------------------------------------
// SkillList
// ---------------------------------------------------------------------------
export function SkillList({ skills }: SkillListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /** ID of the skill currently being deleted (used to show loading state). */
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /** ID of the skill currently being edited (shows inline form). */
  const [editingId, setEditingId] = useState<string | null>(null);

  /** Whether the "add" form is visible. */
  const [showAddForm, setShowAddForm] = useState(false);

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // -------------------------------------------------------------------------
  // Delete handler
  // -------------------------------------------------------------------------
  function handleDelete(id: string) {
    setFeedback(null);
    setDeletingId(id);

    startTransition(async () => {
      const result = await deleteSkill(id);

      if (result.success) {
        setFeedback({ type: 'success', message: 'Skill deleted.' });
        router.refresh();
      } else {
        setFeedback({
          type: 'error',
          message: result.error ?? 'Failed to delete skill',
        });
      }

      setDeletingId(null);
    });
  }

  // -------------------------------------------------------------------------
  // Group skills
  // -------------------------------------------------------------------------
  const grouped = groupByCategory(skills);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Top bar: "Add skill" button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {skills.length === 0
            ? 'No skills added yet.'
            : `${skills.length} skill${skills.length > 1 ? 's' : ''} across ${grouped.size} ${
                grouped.size > 1 ? 'categories' : 'category'
              }`}
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setShowAddForm((prev) => !prev);
            setEditingId(null);
          }}
        >
          {showAddForm ? 'Cancel' : '+ Add Skill'}
        </Button>
      </div>

      {/* Global feedback banner */}
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

      {/* Add form */}
      {showAddForm && (
        <SkillForm
          onSuccess={() => {
            setShowAddForm(false);
            setFeedback(null);
            router.refresh();
          }}
        />
      )}

      {/* Skills grouped by category */}
      {skills.length === 0 && !showAddForm ? (
        <div className="rounded-[var(--border-radius)] border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Click &ldquo;+ Add Skill&rdquo; to add your first skill.
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([category, categorySkills]) => (
            <section key={category}>
              {/* Category heading */}
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {category}
              </h2>

              <ul className="divide-y divide-border rounded-[var(--border-radius)] border border-border">
                {categorySkills.map((skill) => (
                  <li key={skill.id}>
                    {/* Skill row */}
                    {editingId === skill.id ? (
                      <div className="px-4 py-3">
                        <SkillForm
                          id={skill.id}
                          defaultValues={{
                            name: skill.name,
                            category: skill.category ?? '',
                            icon_url: skill.icon_url ?? '',
                            proficiency: skill.proficiency ?? 3,
                            years_of_experience:
                              skill.years_of_experience ?? undefined,
                          }}
                          onSuccess={() => {
                            setEditingId(null);
                            setFeedback(null);
                            router.refresh();
                          }}
                        />
                        <div className="mt-2 flex justify-start">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 px-4 py-3">
                        {/* Optional icon */}
                        {skill.icon_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={skill.icon_url}
                            alt=""
                            aria-hidden="true"
                            width={24}
                            height={24}
                            className="h-6 w-6 shrink-0 object-contain"
                          />
                        )}

                        {/* Name + meta */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {skill.name}
                          </p>
                          {skill.years_of_experience !== null && (
                            <p className="text-xs text-muted-foreground">
                              {skill.years_of_experience} yr
                              {skill.years_of_experience !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>

                        {/* Proficiency stars */}
                        <ProficiencyStars value={skill.proficiency} />

                        {/* Action buttons or Deletion confirmation */}
                        <div className="flex shrink-0 items-center gap-2">
                          {deletingId === skill.id ? (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                              <span className="text-xs font-medium text-destructive">
                                Delete?
                              </span>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                disabled={isPending}
                                onClick={() => handleDelete(skill.id)}
                              >
                                {isPending ? '...' : 'Yes'}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingId(null)}
                              >
                                No
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingId(skill.id);
                                  setShowAddForm(false);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeletingId(skill.id)}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
