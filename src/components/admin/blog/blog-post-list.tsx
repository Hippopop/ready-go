'use client';

import { useState, useTransition } from 'react';
import { deleteBlogPost } from '@/lib/actions/blog-post';
import { BlogPostForm } from './blog-post-form';
import { Tables } from '@/types';
import { useRouter } from 'next/navigation';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BlogPostRow = Tables<'blog_posts'>;

interface BlogPostListProps {
  blogPosts: BlogPostRow[];
}

// ---------------------------------------------------------------------------
// Helper — format a YYYY-MM-DD date string
// ---------------------------------------------------------------------------

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

// ---------------------------------------------------------------------------
// Single blog post card
// ---------------------------------------------------------------------------

interface BlogPostCardProps {
  blogPost: BlogPostRow;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDeleted: () => void;
}

function BlogPostCard({
  blogPost,
  isEditing,
  onEdit,
  onCancelEdit,
  onDeleted,
}: BlogPostCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleDelete() {
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteBlogPost(blogPost.id);
      if ('error' in result) {
        setDeleteError(result.error);
        setIsDeleting(false);
      } else {
        onDeleted();
      }
    });
  }

  return (
    <div className="rounded-(--border-radius) border border-border bg-card overflow-hidden">
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-sm font-semibold text-card-foreground truncate">
            {blogPost.title}
          </h3>
          {blogPost.excerpt && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {blogPost.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 pt-1">
            {blogPost.published_at && (
              <span className="text-[10px] text-muted-foreground font-medium">
                {formatDate(blogPost.published_at)}
              </span>
            )}
            {blogPost.reading_time_minutes && (
              <span className="text-[10px] text-muted-foreground">
                {blogPost.reading_time_minutes} min read
              </span>
            )}
            <a 
              href={blogPost.url ?? undefined} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-primary hover:underline font-medium"
            >
              View Post ↗
            </a>
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

      {deleteError && (
        <div className="mx-5 mb-3 rounded-(--border-radius) bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {deleteError}
        </div>
      )}

      {isEditing && (
        <div className="border-t border-border px-5 py-5">
          <BlogPostForm
            blogPost={blogPost}
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

export function BlogPostList({ blogPosts: initialBlogPosts }: BlogPostListProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  function handleAddSuccess() {
    setShowAddForm(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {initialBlogPosts.length === 0
            ? 'No blog posts yet.'
            : `${initialBlogPosts.length} post${initialBlogPosts.length === 1 ? '' : 's'}`}
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
            + Add Post
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="rounded-(--border-radius) border border-border bg-card px-5 py-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Add New Blog Post</h3>
          <BlogPostForm
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {initialBlogPosts.length === 0 && !showAddForm ? (
        <div className="rounded-(--border-radius) border border-dashed border-border bg-muted/20 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Share your thoughts and expertise by adding your first blog post.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3" role="list">
          {initialBlogPosts.map((post) => (
            <li key={post.id}>
              <BlogPostCard
                blogPost={post}
                isEditing={editingId === post.id}
                onEdit={() => {
                  setEditingId(post.id);
                  setShowAddForm(false);
                }}
                onCancelEdit={() => setEditingId(null)}
                onDeleted={() => {
                  setEditingId(null);
                  router.refresh();
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
