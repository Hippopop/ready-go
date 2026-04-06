'use client'

import { GripVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { updateSectionVisibility } from '@/lib/actions/section-settings'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'

interface SectionItemProps {
  section: {
    section_key: string
    is_visible: boolean | null
    display_order: number
  }
}

export function SectionItem({ section }: SectionItemProps) {
  const router = useRouter()

  const formattedName = section.section_key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const handleVisibilityChange = async (checked: boolean) => {
    const result = await updateSectionVisibility(section.section_key, checked)
    if (result.success) {
      router.refresh()
    }
  }

  return (
    <div
      className={cn(
        "bg-surface rounded-(--border-radius) border border-app-text/10 px-4 py-3 flex items-center gap-3 transition-opacity duration-(--transition-speed) ease-(--transition-easing)",
        !section.is_visible && "opacity-50"
      )}
    >
      <div className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-app-text/30" />
      </div>

      <span className="flex-1 font-medium text-app-text font-body">
        {formattedName}
      </span>

      <Switch
        checked={!!section.is_visible}
        onCheckedChange={handleVisibilityChange}
      />
    </div>
  )
}
