"use client";

import React, { useEffect } from "react";
import { useThemeStore } from "@/stores/theme-store";
import { themeToCssVars, getGoogleFontsUrl } from "@/lib/theme-utils";
import type { ThemeConfig } from "@/lib/validations/theme";

interface ThemeProviderProps {
  initialTheme: ThemeConfig;
  children: React.ReactNode;
}

export function ThemeProvider({ initialTheme, children }: ThemeProviderProps) {
  const { theme, setTheme } = useThemeStore();

  // Initialize store with server-fetched theme on mount
  useEffect(() => {
    setTheme(initialTheme);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Inject CSS variables to :root for live preview
  useEffect(() => {
    let style = document.getElementById("ready-go-theme") as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = "ready-go-theme";
      document.head.appendChild(style);
    }
    // Always update innerHTML so live changes propagate
    style.innerHTML = `:root {\n${themeToCssVars(theme)}\n}`;
  }, [theme]);

  // Handle live font updates — update href instead of remove+recreate to avoid FOUC
  useEffect(() => {
    const fonts = Array.from(new Set([theme.font_heading, theme.font_body]));
    const url = getGoogleFontsUrl(fonts);

    let link = document.getElementById("ready-go-fonts") as HTMLLinkElement | null;
    if (link) {
      link.href = url;
    } else {
      link = document.createElement("link");
      link.id = "ready-go-fonts";
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    }
  }, [theme.font_heading, theme.font_body]);

  // Handle color mode specifically for the document element
  useEffect(() => {
    const root = document.documentElement
    
    if (theme.color_mode === 'dark') {
      root.classList.add('dark')
    } else if (theme.color_mode === 'light') {
      root.classList.remove('dark')
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }, [theme.color_mode]);

  return <>{children}</>;
}
