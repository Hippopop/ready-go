import { Metadata } from 'next';
import { getTestimonials } from '@/lib/actions/testimonial';
import { TestimonialList } from '@/components/admin/testimonials/testimonial-list';

export const metadata: Metadata = {
  title: 'Testimonials | Admin',
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Testimonials</h1>
        <p className="text-sm text-muted-foreground">
          Manage praise and testimonials from peers, clients, or managers.
        </p>
      </div>

      <div className="rounded-[var(--border-radius)] border bg-card p-6 shadow-sm">
        <TestimonialList initialTestimonials={testimonials} />
      </div>
    </div>
  );
}
