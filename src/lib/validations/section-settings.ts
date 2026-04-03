import { z } from 'zod'
 
export const sectionSettingSchema = z.object({
  section_key: z.string(),
  is_visible: z.boolean(),
  display_order: z.number().int().min(1),
})
 
export const updateSectionSettingsSchema = z.array(sectionSettingSchema)
