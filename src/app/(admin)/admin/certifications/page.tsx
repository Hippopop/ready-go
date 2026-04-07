import { Metadata } from 'next';
import { getCertifications } from '@/lib/actions/certification';
import { CertificationList } from '@/components/admin/certifications/certification-list';

export const metadata: Metadata = {
  title: 'Certifications | Admin Panel',
  description: 'Manage your professional certifications and achievements.',
};

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Certifications</h1>
        <p className="mt-2 text-muted-foreground">
          Showcase your professional growth, licenses, and official certifications.
        </p>
      </div>

      <div className="space-y-8">
        <CertificationList certifications={certifications} />
      </div>
    </div>
  );
}
