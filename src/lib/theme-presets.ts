import { ThemeConfig } from "./validations/theme";

export const THEME_PRESETS: { name: string; config: ThemeConfig }[] = [
  {
    name: "Minimal",
    config: {
      color_primary: "#18181b", // Zinc 900
      color_accent: "#71717a", // Zinc 500
      color_background: "#ffffff",
      color_surface: "#fafafa",
      color_text: "#09090b", // Zinc 950
      font_heading: "Inter",
      font_body: "Inter",
      border_radius: "md",
      spacing: "default",
      color_mode: "light",
      animation_style: "none",
      preset_name: "Minimal",
    },
  },
  {
    name: "Cyberpunk",
    config: {
      color_primary: "#00ff9f", // Neon Green
      color_accent: "#ff00ff", // Neon Pink
      color_background: "#0d0d0d",
      color_surface: "#1a1a2e",
      color_text: "#e0e0e0",
      font_heading: "Share Tech Mono",
      font_body: "Share Tech Mono",
      border_radius: "none",
      spacing: "default",
      color_mode: "dark",
      animation_style: "lively",
      preset_name: "Cyberpunk",
    },
  },
  {
    name: "shadcn",
    config: {
      color_primary: "#18181b",
      color_accent: "#3f3f46",
      color_background: "#ffffff",
      color_surface: "#fafafa",
      color_text: "#18181b",
      font_heading: "Inter",
      font_body: "Inter",
      border_radius: "md",
      spacing: "default",
      color_mode: "light",
      animation_style: "subtle",
      preset_name: "shadcn",
    },
  },
  {
    name: "Ocean",
    config: {
      color_primary: "#0ea5e9", // Sky 500
      color_accent: "#06b6d4", // Cyan 500
      color_background: "#f0f9ff", // Sky 50
      color_surface: "#ffffff",
      color_text: "#0c4a6e", // Sky 900
      font_heading: "Inter",
      font_body: "Inter",
      border_radius: "lg",
      spacing: "default",
      color_mode: "light",
      animation_style: "subtle",
      preset_name: "Ocean",
    },
  },
  {
    name: "Sunset",
    config: {
      color_primary: "#f97316", // Orange 500
      color_accent: "#ec4899", // Pink 500
      color_background: "#fff7ed", // Orange 50
      color_surface: "#ffffff",
      color_text: "#7c2d12", // Orange 900
      font_heading: "Plus Jakarta Sans",
      font_body: "Plus Jakarta Sans",
      border_radius: "lg",
      spacing: "default",
      color_mode: "light",
      animation_style: "subtle",
      preset_name: "Sunset",
    },
  },
  {
    name: "Forest",
    config: {
      color_primary: "#16a34a", // Green 600
      color_accent: "#15803d", // Green 700
      color_background: "#f0fdf4", // Green 50
      color_surface: "#ffffff",
      color_text: "#14532d", // Green 900
      font_heading: "DM Sans",
      font_body: "DM Sans",
      border_radius: "md",
      spacing: "default",
      color_mode: "light",
      animation_style: "subtle",
      preset_name: "Forest",
    },
  },
];

export const DEFAULT_THEME = THEME_PRESETS[0].config;
