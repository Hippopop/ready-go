'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Quote, User, ExternalLink } from 'lucide-react';
import { TestimonialForm } from './testimonial-form';
import { deleteTestimonial } from '@/lib/actions/testimonial';
import { Tables } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TestimonialRow = Tables<'testimonials'>;

interface TestimonialListProps {
  initialTestimonials: TestimonialRow[];
}

// ---------------------------------------------------------------------------
// Main list component
// ---------------------------------------------------------------------------

export function TestimonialList({ initialTestimonials }: TestimonialListProps) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>(initialTestimonials);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Sync state when props change
  useEffect(() => {
    setTestimonials(initialTestimonials);
  }, [initialTestimonials]);

  // Handle successful form submission
  function handleSuccess() {
    setIsAdding(false);
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    setIsPending(true);
    const result = await deleteTestimonial(id);
    if ('success' in result) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setDeletingId(null);
      router.refresh();
    } else {
      alert(result.error);
    }
    setIsPending(false);
  }

  const editingTestimonial = testimonials.find((t) => t.id === editingId);

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Manage Testimonials</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 rounded-[var(--border-radius)] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Testimonial
          </button>
        )}
      </div>

      {/* Form — Add Mode */}
      {isAdding && (
        <div className="rounded-[var(--border-radius)] border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-foreground">Add New Testimonial</h3>
          <TestimonialForm
            onSuccess={handleSuccess}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      {/* Form — Edit Mode */}
      {editingId && editingTestimonial && (
        <div className="rounded-[var(--border-radius)] border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-foreground">Edit Testimonial</h3>
          <TestimonialForm
            testimonial={editingTestimonial}
            onSuccess={handleSuccess}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {/* Empty State */}
      {!isAdding && !editingId && testimonials.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[var(--border-radius)] border-2 border-dashed border-border py-12 text-center">
          <Quote className="mb-4 h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">No testimonials added yet.</p>
          <p className="text-sm text-muted-foreground/60">
            Showcase what others have to say about your work.
          </p>
        </div>
      )}

      {/* Grid of Testimonials */}
      {!isAdding && !editingId && testimonials.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--border-radius)] border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted border border-border">
                      {testimonial.author_avatar_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={testimonial.author_avatar_url}
                          alt=""
                          aria-hidden="true"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                        {testimonial.author_name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {testimonial.author_title}
                        {testimonial.author_title && testimonial.author_company && ' @ '}
                        {testimonial.author_company}
                      </p>
                    </div>
                  </div>
                  
                  {testimonial.linkedin_url && (
                    <a
                      href={testimonial.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="LinkedIn Profile"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <div className="relative">
                  <Quote className="absolute -top-1 -left-1 h-4 w-4 text-primary/10" />
                  <p className="text-sm text-muted-foreground line-clamp-4 italic leading-relaxed pt-1">
                    &quot;{testimonial.content}&quot;
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-border pt-4">
                {deletingId === testimonial.id ? (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                    <span className="text-[10px] font-medium text-destructive">Delete?</span>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      disabled={isPending}
                      className="inline-flex h-8 items-center justify-center rounded-[var(--border-radius)] bg-destructive px-3 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    >
                      {isPending ? '...' : 'Yes'}
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="inline-flex h-8 items-center justify-center rounded-[var(--border-radius)] border border-input bg-background px-3 text-xs font-medium hover:bg-accent transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => setEditingId(testimonial.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--border-radius)] border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(testimonial.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--border-radius)] border border-input bg-background text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
