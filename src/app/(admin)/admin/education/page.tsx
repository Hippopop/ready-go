import { Metadata } from 'next';
import { getEducation } from '@/lib/actions/education';
import { EducationList } from '@/components/admin/education/education-list';

export const metadata: Metadata = {
  title: 'Education | Admin',
};

export default async function EducationPage() {
  const educationList = await getEducation();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Education</h1>
        <p className="text-sm text-muted-foreground">
          Manage your academic background and honors.
        </p>
      </div>

      <div className="rounded-[var(--border-radius)] border bg-card p-6 shadow-sm">
        <EducationList educationList={educationList} />
      </div>
    </div>
  );
}
