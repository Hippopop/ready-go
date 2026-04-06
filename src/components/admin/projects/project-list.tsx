'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectForm } from './project-form';
import { deleteProject } from '@/lib/actions/project';
import { Tables } from '@/types';
import { ExternalLink, GitBranch, Pencil, Plus, Trash2, Star } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProjectRow = Tables<'projects'>;

interface ProjectListProps {
  projects: ProjectRow[];
}

// ---------------------------------------------------------------------------
// Main list component
// ---------------------------------------------------------------------------

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    const result = await deleteProject(id);
    if ('error' in result) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setIsDeletingId(null);
  }

  return (
    <div className="space-y-6">
      {/* Header — Add Project button */}
      {!isAdding && !editingId && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Manage Projects</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-(--border-radius) bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        </div>
      )}

      {/* Adding form */}
      {isAdding && (
        <div className="rounded-(--border-radius) border border-primary/20 bg-primary/[0.02] p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <h3 className="font-semibold text-foreground">Add New Project</h3>
          </div>
          <ProjectForm
            onSuccess={() => {
              setIsAdding(false);
              router.refresh();
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      {/* List / Grid of projects */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const isEditing = editingId === project.id;

          if (isEditing) {
            return (
              <div
                key={project.id}
                className="col-span-full rounded-(--border-radius) border border-primary/20 bg-primary/[0.02] p-6 shadow-sm"
              >
                <div className="mb-6 flex items-center justify-between border-b pb-4">
                  <h3 className="font-semibold text-foreground">Edit Project</h3>
                </div>
                <ProjectForm
                  project={project}
                  onSuccess={() => {
                    setEditingId(null);
                    router.refresh();
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            );
          }

          return (
            <div
              key={project.id}
              className="group relative flex flex-col overflow-hidden rounded-(--border-radius) border bg-card text-card-foreground shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              {/* Cover Image Placeholder or Preview */}
              <div className="aspect-video w-full bg-muted overflow-hidden">
                {project.cover_image_url ? (
                   // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={project.cover_image_url} 
                    alt="" 
                    aria-hidden="true"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                    No cover image
                  </div>
                )}
              </div>

              {/* Badges — Featured */}
              {project.is_featured && (
                <div className="absolute top-2 right-2 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  Featured
                </div>
              )}

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-foreground line-clamp-1">{project.title}</h4>
                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <GitBranch className="h-4 w-4" />
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                  {project.description || 'No description provided.'}
                </p>

                {/* Tech Stack Tags */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tech_stack.slice(0, 4).map((tech, idx) => (
                      <span
                        key={`${tech}-${idx}`}
                        className="inline-flex rounded-(--border-radius) bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 4 && (
                      <span className="text-[10px] text-muted-foreground flex items-center">
                        +{project.tech_stack.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Footer — Edit / Delete buttons */}
                <div className="mt-auto flex items-center justify-end gap-2 pt-5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => setEditingId(project.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-(--border-radius) border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsDeletingId(project.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-(--border-radius) border border-input bg-background text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Delete confirmation overlay */}
              {isDeletingId === project.id && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/95 p-4 text-center animate-in fade-in zoom-in duration-200">
                  <p className="text-sm font-medium text-foreground">
                    Delete &quot;{project.title}&quot;?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsDeletingId(null)}
                      className="inline-flex h-8 items-center justify-center rounded-(--border-radius) px-3 text-xs font-medium hover:bg-accent"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="inline-flex h-8 items-center justify-center rounded-(--border-radius) bg-destructive px-3 text-xs font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {projects.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-(--border-radius)">
             No projects added yet. Click &quot;Add Project&quot; to get started.
          </div>
        )}
      </div>
    </div>
  );
}
