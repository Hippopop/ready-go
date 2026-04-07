import { getHero } from '@/lib/actions/hero';
import { HeroForm } from '@/components/admin/hero/hero-form';
import type { HeroFormValues } from '@/lib/validations/hero';

export default async function HeroPage() {
  const heroData = await getHero();

  /** Map the database row to the form shape (coerce nulls → defaults). */
  const formValues: HeroFormValues | null = heroData
    ? {
        headline: heroData.headline ?? '',
        subheadline: heroData.subheadline ?? '',
        tagline: heroData.tagline ?? '',
        profile_image_url: heroData.profile_image_url ?? '',
        cta_primary_text: heroData.cta_primary_text ?? 'Hire Me',
        cta_primary_url: heroData.cta_primary_url ?? '',
        cta_secondary_text: heroData.cta_secondary_text ?? 'View Resume',
        is_typing_animation: heroData.is_typing_animation ?? true,
        typing_texts: heroData.typing_texts ?? [],
      }
    : null;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hero Section</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This is the first thing visitors see
        </p>
      </div>

      {/* Form */}
      <HeroForm defaultValues={formValues} />
    </div>
  );
}
