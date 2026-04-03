import { Metadata } from 'next';
import { getAwards } from '@/lib/actions/award';
import { AwardList } from '@/components/admin/awards/award-list';

export const metadata: Metadata = {
  title: 'Awards & Achievements | Admin Panel',
  description: 'Manage your awards, honors, and professional achievements.',
};

export default async function AwardsPage() {
  const awards = await getAwards();

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Awards & Achievements</h1>
        <p className="mt-2 text-muted-foreground">
          Showcase your accolades, contest wins, and professional recognition.
        </p>
      </div>

      <div className="space-y-8">
        <AwardList awards={awards} />
      </div>
    </div>
  );
}
