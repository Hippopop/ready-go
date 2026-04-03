import { getAbout, getSocialLinks } from '@/lib/actions/about';
import { AboutForm } from '@/components/admin/about/about-form';
import { SocialLinksManager } from '@/components/admin/about/social-links-manager';

export default async function AboutPage() {
  const [aboutResult, socialLinksResult] = await Promise.all([
    getAbout(),
    getSocialLinks(),
  ]);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">About</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your bio, availability, and social links.
        </p>
      </div>

      {/* About form */}
      <AboutForm initialData={aboutResult.data ?? null} />

      {/* Social links manager */}
      <SocialLinksManager socialLinks={socialLinksResult.data ?? []} />
    </div>
  );
}
