import { getSectionSettings } from '@/lib/actions/section-settings'
import { SectionsManager } from '@/components/admin/sections/sections-manager'
 
export const metadata = {
  title: 'Sections | Ready-Go Admin',
  description: 'Control which sections appear on your portfolio and in what order.',
}
 
export default async function SectionsPage() {
  const sections = await getSectionSettings()
 
  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-app-text font-heading">Sections</h1>
        <p className="text-app-text/60 font-body">
          Control which sections appear on your portfolio and in what order.
        </p>
      </div>
 
      {sections.length === 0 ? (
        <div className="bg-surface rounded-(--border-radius) border border-app-text/10 p-8 text-center">
          <p className="text-app-text/60 font-body">
            No sections found. Please contact support.
          </p>
        </div>
      ) : (
        <div className="max-w-2xl">
          <SectionsManager sections={sections} />
        </div>
      )}
    </div>
  )
}
