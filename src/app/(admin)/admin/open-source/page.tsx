import { getOpenSourceContributions } from '@/lib/actions/open-source';
import { ContributionList } from '@/components/admin/open-source/contribution-list';

export const metadata = {
  title: 'Open Source | Admin',
};

export default async function OpenSourcePage() {
  const contributions = await getOpenSourceContributions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Open Source</h1>
        <p className="text-sm text-muted-foreground">
          Manage your open source contributions and repositories.
        </p>
      </div>

      <ContributionList contributions={contributions} />
    </div>
  );
}
