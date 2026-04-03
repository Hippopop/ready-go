import { ThemeConfig } from "./validations/theme";

const BORDER_RADIUS_MAP = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "16px",
  full: "9999px",
};

const SPACING_MAP = {
  compact: "0.75rem",
  default: "1rem",
  spacious: "1.5rem",
};

const TRANSITION_SPEED_MAP = {
  none: "0ms",
  subtle: "200ms",
  lively: "400ms",
};

const TRANSITION_EASING_MAP = {
  none: "linear",
  subtle: "ease",
  lively: "cubic-bezier(0.34,1.56,0.64,1)",
};

export function themeToCssVars(theme: ThemeConfig): string {
  const vars = {
    "--color-primary": theme.color_primary,
    "--color-accent": theme.color_accent,
    "--color-background": theme.color_background,
    "--color-surface": theme.color_surface,
    "--color-text": theme.color_text,
    "--font-heading": `'${theme.font_heading}', sans-serif`,
    "--font-body": `'${theme.font_body}', sans-serif`,
    "--border-radius": BORDER_RADIUS_MAP[theme.border_radius],
    "--border-radius-sm": BORDER_RADIUS_MAP[theme.border_radius],
    "--spacing-unit": SPACING_MAP[theme.spacing],
    "--transition-speed": TRANSITION_SPEED_MAP[theme.animation_style],
    "--transition-easing": TRANSITION_EASING_MAP[theme.animation_style],
  };

  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n");
}

export function getGoogleFontsUrl(fonts: string[]): string {
  const uniqueFonts = Array.from(new Set(fonts)).map((f) => f.replace(/\s+/g, "+"));
  const fontStrings = uniqueFonts.map((f) => `family=${f}:wght@400;500;600;700`);
  return `https://fonts.googleapis.com/css2?${fontStrings.join("&")}&display=swap`;
}
