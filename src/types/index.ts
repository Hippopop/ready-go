export * from './database';

// ---------------------------------------------------------------------------
// Custom application types
// ---------------------------------------------------------------------------

/** All manageable section keys in the portfolio */
export type SectionKey =
  | 'hero'
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'education'
  | 'certifications'
  | 'testimonials'
  | 'blog'
  | 'awards'
  | 'open_source';

/** Shape of the `themes` table — mirrors database columns */
export interface ThemeConfig {
  id: string;
  user_id: string | null;
  preset_name: string | null;
  color_primary: string | null;
  color_accent: string | null;
  color_background: string | null;
  color_surface: string | null;
  color_text: string | null;
  color_mode: string | null;
  font_heading: string | null;
  font_body: string | null;
  border_radius: string | null;
  spacing: string | null;
  animation_style: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Shape of the `profiles` table — mirrors database columns */
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  created_at: string | null;
  updated_at: string | null;
}
