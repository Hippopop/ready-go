import { z } from "zod";

export const themeConfigSchema = z.object({
  color_primary: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid primary hex color"),
  color_accent: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid accent hex color"),
  color_background: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid background hex color"),
  color_surface: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid surface hex color"),
  color_text: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid text hex color"),
  font_heading: z.string().min(1, "Heading font is required"),
  font_body: z.string().min(1, "Body font is required"),
  border_radius: z.enum(["none", "sm", "md", "lg", "full"]),
  spacing: z.enum(["compact", "default", "spacious"]),
  color_mode: z.enum(["light", "dark", "system"]),
  animation_style: z.enum(["none", "subtle", "lively"]),
  preset_name: z.string().optional(),
});

export type ThemeConfig = z.infer<typeof themeConfigSchema>;
