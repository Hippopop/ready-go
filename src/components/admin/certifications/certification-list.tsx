'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCertification } from '@/lib/actions/certification';
import { CertificationForm } from './certification-form';
import { Tables } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CertificationRow = Tables<'certifications'>;

interface CertificationListProps {
  certifications: CertificationRow[];
}

// ---------------------------------------------------------------------------
// Single certification card
// ---------------------------------------------------------------------------

interface CertificationCardProps {
  certification: CertificationRow;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDeleted: () => void;
}

function CertificationCard({
  certification,
  isEditing,
  onEdit,
  onCancelEdit,
  onDeleted,
}: CertificationCardProps) {
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  function handleDelete() {
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteCertification(certification.id);
      if ('error' in result) {
        setDeleteError(result.error);
        setIsDeleting(false);
      } else {
        onDeleted();
      }
    });
  }

  const dateInfo = [
    certification.issue_date && `Issued: ${new Date(certification.issue_date).toLocaleDateString()}`,
    certification.expiry_date && `Expires: ${new Date(certification.expiry_date).toLocaleDateString()}`,
  ].filter(Boolean).join(' · ');

  return (
    <div className="rounded-(--border-radius) border border-border bg-card overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div className="min-w-0 flex-1 space-y-0.5">
          <h3 className="text-sm font-semibold text-card-foreground truncate">
            {certification.name}
          </h3>
          <p className="text-sm text-foreground truncate">
            {certification.issuer || 'No issuer specified'}
          </p>
          {dateInfo && (
            <p className="text-xs text-muted-foreground pt-0.5">{dateInfo}</p>
          )}
          {certification.credential_url && (
            <a 
              href={certification.credential_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-xs text-primary hover:underline mt-1"
            >
              View Credential →
            </a>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isDeleting ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
              <span className="text-[10px] font-medium text-destructive">Delete?</span>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="inline-flex h-8 items-center justify-center rounded-(--border-radius) bg-destructive px-3 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                {isPending ? '...' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleting(false)}
                className="inline-flex h-8 items-center justify-center rounded-(--border-radius) border border-input bg-background px-3 text-xs font-medium hover:bg-accent transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={isEditing ? onCancelEdit : onEdit}
                className="inline-flex h-8 items-center justify-center rounded-(--border-radius) border border-input bg-background px-3 text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleting(true)}
                className="inline-flex h-8 items-center justify-center rounded-(--border-radius) border border-destructive/30 bg-destructive/5 px-3 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Delete error */}
      {deleteError && (
        <div className="mx-5 mb-3 rounded-(--border-radius) bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {deleteError}
        </div>
      )}

      {/* Inline edit form */}
      {isEditing && (
        <div className="border-t border-border px-5 py-5">
          <CertificationForm
            certification={certification}
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

export function CertificationList({ certifications: initialCertifications }: CertificationListProps) {
  const router = useRouter();
  const [certItems, setCertItems] = useState<CertificationRow[]>(initialCertifications);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Sync state when props change
  useEffect(() => {
    setCertItems(initialCertifications);
  }, [initialCertifications]);

  function handleDeleted(id: string) {
    setCertItems((prev) => prev.filter((c) => c.id !== id));
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
          {certItems.length === 0
            ? 'No certifications yet.'
            : `${certItems.length} certification${certItems.length === 1 ? '' : 's'}`}
        </p>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => {
              setShowAddForm(true);
              setEditingId(null);
            }}
            className="inline-flex h-9 items-center justify-center rounded-(--border-radius) bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            + Add Certification
          </button>
        )}
      </div>

      {/* Add certification form */}
      {showAddForm && (
        <div className="rounded-(--border-radius) border border-border bg-card px-5 py-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">New Certification</h3>
          <CertificationForm
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Certification cards */}
      {certItems.length === 0 && !showAddForm ? (
        <div className="rounded-(--border-radius) border border-dashed border-border bg-muted/20 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Add your certifications to showcase your achievements.
          </p>
        </div>
      ) : (
        <ul className="space-y-3" role="list">
          {certItems.map((cert) => (
            <li key={cert.id}>
              <CertificationCard
                certification={cert}
                isEditing={editingId === cert.id}
                onEdit={() => {
                  setEditingId(cert.id);
                  setShowAddForm(false);
                }}
                onCancelEdit={() => setEditingId(null)}
                onDeleted={() => handleDeleted(cert.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
