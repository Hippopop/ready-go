import { getProjects } from '@/lib/actions/project';
import { ProjectList } from '@/components/admin/projects/project-list';

export const metadata = {
  title: 'Projects | Admin',
  description: 'Manage your projects and portfolio showcase.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-10 flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Projects
        </h1>
        <p className="text-muted-foreground">
          Showcase your best work. Featured projects will appear first on your portfolio.
        </p>
      </div>

      <ProjectList projects={projects} />
    </div>
  );
}
