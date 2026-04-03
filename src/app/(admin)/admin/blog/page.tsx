import { getBlogPosts } from '@/lib/actions/blog-post';
import { BlogPostList } from '@/components/admin/blog/blog-post-list';

export const metadata = {
  title: 'Blog Posts — Ready-Go Admin',
};

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your external blog posts. Share your expertise with your portfolio visitors.
        </p>
      </div>

      {/* List + forms */}
      <BlogPostList blogPosts={blogPosts} />
    </div>
  );
}
