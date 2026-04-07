'use client'
 
import { useState, useEffect } from 'react'
import { SectionItem } from './section-item'
import { updateSectionOrder } from '@/lib/actions/section-settings'
import { Database } from '@/types/database'
import { cn } from '@/lib/utils'
 
type SectionSetting = Database['public']['Tables']['section_settings']['Row']
 
interface SectionsManagerProps {
  sections: SectionSetting[]
}
 
export function SectionsManager({ sections: initialSections }: SectionsManagerProps) {
  const [sections, setSections] = useState<SectionSetting[]>(initialSections)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [showSaveIndicator, setShowSaveIndicator] = useState(false)
 
  useEffect(() => {
    setSections(initialSections)
  }, [initialSections])
 
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }
 
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
 
  const handleDrop = async (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return
 
    const newSections = [...sections]
    const [draggedItem] = newSections.splice(draggedIndex, 1)
    newSections.splice(index, 0, draggedItem)
 
    // Update display_order based on new position (1-indexed)
    const updatedSections = newSections.map((s, i) => ({
      ...s,
      display_order: i + 1,
    }))
 
    setSections(updatedSections)
    setDraggedIndex(null)
 
    // Batch update the server
    const result = await updateSectionOrder(
      updatedSections.map((s) => ({
        section_key: s.section_key,
        display_order: s.display_order,
      }))
    )
 
    if (result.success) {
      setShowSaveIndicator(true)
      setTimeout(() => setShowSaveIndicator(false), 2000)
    }
  }
 
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="hidden md:block text-app-text/40 text-xs uppercase tracking-wider font-medium">
          Drag to reorder
        </p>
        
        <div className={cn(
          "transition-opacity duration-300",
          showSaveIndicator ? "opacity-100" : "opacity-0"
        )}>
          <span className="text-primary text-sm font-medium">Order saved ✓</span>
        </div>
      </div>
 
      <div className="flex flex-col gap-2">
        {sections.map((section, index) => (
          <div
            key={section.section_key}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className="cursor-move"
          >
            <SectionItem section={section} />
          </div>
        ))}
      </div>
    </div>
  )
}
