import { getSkills } from '@/lib/actions/skill';
import { SkillList } from '@/components/admin/skills/skill-list';

export default async function SkillsPage() {
  const result = await getSkills();
  const skills = result.success ? (result.data ?? []) : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Skills &amp; Technologies
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the skills and tools that appear on your portfolio.
        </p>
      </div>

      {/* Error state */}
      {!result.success && (
        <div
          role="alert"
          className="rounded-[var(--border-radius-sm)] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {result.error ?? 'Failed to load skills. Please refresh the page.'}
        </div>
      )}

      {/* Skills list */}
      <SkillList skills={skills} />
    </div>
  );
}
