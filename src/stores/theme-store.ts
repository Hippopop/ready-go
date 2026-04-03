"use client";

import { create } from "zustand";
import { ThemeConfig } from "@/lib/validations/theme";
import { THEME_PRESETS, DEFAULT_THEME } from "@/lib/theme-presets";

interface ThemeStore {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  applyPreset: (presetName: string) => void;
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: DEFAULT_THEME,
  isDirty: false,
  setTheme: (themeUpdate) =>
    set((state) => ({
      theme: { ...state.theme, ...themeUpdate },
    })),
  updateTheme: (themeUpdate) =>
    set((state) => ({
      theme: { ...state.theme, ...themeUpdate },
      isDirty: true,
    })),
  applyPreset: (presetName) => {
    const preset = THEME_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      set({
        theme: preset.config,
        isDirty: true,
      });
    }
  },
  setDirty: (dirty) => set({ isDirty: dirty }),
}));
