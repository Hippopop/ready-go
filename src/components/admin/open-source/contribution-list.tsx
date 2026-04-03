'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteContribution } from '@/lib/actions/open-source';
import { ContributionForm } from './contribution-form';
import { Button } from '@/components/ui/button';
import { Tables } from '@/types';

type ContributionRow = Tables<'open_source_contributions'>;

interface ContributionListProps {
  contributions: ContributionRow[];
}

export function ContributionList({ contributions }: ContributionListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteContribution(id);
      if ('error' in result) {
        alert(result.error);
      } else {
        router.refresh();
      }
      setDeletingId(null);
    });
  };

  const getRoleBadgeClass = (role: string | null) => {
    switch (role) {
      case 'owner':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'maintainer':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'contributor':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-muted text-muted-foreground border-transparent';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {contributions.length === 0
            ? 'No open source contributions added yet.'
            : `Showing ${contributions.length} contribution${contributions.length > 1 ? 's' : ''}, sorted by stars.`}
        </p>
        <Button onClick={() => setShowAddForm(true)} disabled={showAddForm || !!editingId}>
          + Add Contribution
        </Button>
      </div>

      {showAddForm && (
        <div className="rounded-[var(--border-radius)] border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Add New Contribution</h3>
          <ContributionForm
            onSuccess={() => {
              setShowAddForm(false);
              router.refresh();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contributions.map((contribution) => (
          <div
            key={contribution.id}
            className="group relative flex flex-col rounded-[var(--border-radius)] border border-border bg-card p-5 transition-all hover:shadow-md dark:hover:bg-muted/10"
          >
            {editingId === contribution.id ? (
              <div className="col-span-full">
                <ContributionForm
                  contribution={contribution}
                  onSuccess={() => {
                    setEditingId(null);
                    router.refresh();
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-start justify-between">
                  <div className="min-w-0">
                    <h4 className="truncate text-base font-semibold text-foreground">
                      {contribution.repo_name}
                    </h4>
                    {contribution.language && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {contribution.language}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5 text-xs font-medium text-foreground">
                    <span className="text-amber-400 text-sm">★</span>
                    {contribution.stars ?? 0}
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {contribution.description || 'No description provided.'}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize transition-colors ${getRoleBadgeClass(
                      contribution.role,
                    )}`}
                  >
                    {contribution.role}
                  </span>

                  <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 relative z-10">
                    {deletingId === contribution.id ? (
                      <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-1 duration-200">
                        <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">Confirm?</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(contribution.id);
                          }}
                          disabled={isPending}
                          className="rounded-[var(--border-radius-sm)] bg-destructive px-1.5 py-0.5 text-[10px] font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
                        >
                          {isPending ? '...' : 'Yes'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeletingId(null);
                          }}
                          className="rounded-[var(--border-radius-sm)] bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground hover:bg-muted/80 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditingId(contribution.id);
                          }}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeletingId(contribution.id);
                          }}
                          className="text-xs font-medium text-destructive hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {contribution.repo_url && (
                  <a
                    href={contribution.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-0"
                    aria-label={`View ${contribution.repo_name} on repository host`}
                  />
                )}
                {/* Ensure buttons are clickable even with the link overlay */}
                <div className="absolute right-5 bottom-5 z-10 flex gap-2" pointer-events="none">
                   {/* This is a trick to make buttons clickable above the overlay */}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {contributions.length === 0 && !showAddForm && (
        <div className="flex flex-col items-center justify-center rounded-[var(--border-radius)] border border-dashed border-border py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
             <span className="text-3xl">🏗️</span>
          </div>
          <h3 className="text-lg font-medium text-foreground">No contributions yet</h3>
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">
            Start showcasing your open source work by adding your first repository.
          </p>
        </div>
      )}
    </div>
  );
}
