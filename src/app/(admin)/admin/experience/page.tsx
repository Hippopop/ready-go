import { getExperiences } from '@/lib/actions/experience';
import { ExperienceList } from '@/components/admin/experience/experience-list';

export const metadata = {
  title: 'Work Experience — Ready-Go Admin',
};

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Work Experience</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your professional experience history. Changes are reflected on your portfolio immediately.
        </p>
      </div>

      {/* List + forms */}
      <ExperienceList experiences={experiences} />
    </div>
  );
}
