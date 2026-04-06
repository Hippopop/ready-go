"use client";

import React from "react";
import { THEME_PRESETS } from "@/lib/theme-presets";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

export function PresetSelector() {
  const { theme, applyPreset } = useThemeStore();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {THEME_PRESETS.map((preset) => (
        <button
          key={preset.name}
          onClick={() => applyPreset(preset.name)}
          className={cn(
            "group relative flex flex-col gap-2 p-3 rounded-(--border-radius) border-2 text-left transition-all hover:bg-muted/50",
            theme.preset_name === preset.name 
              ? "border-primary bg-primary/5" 
              : "border-border"
          )}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
            {preset.name}
          </span>
          <div className="flex gap-1 h-6 rounded overflow-hidden border border-border/50">
            <div 
              className="flex-1" 
              style={{ backgroundColor: preset.config.color_primary }} 
            />
            <div 
              className="flex-1" 
              style={{ backgroundColor: preset.config.color_accent }} 
            />
            <div 
              className="flex-1" 
              style={{ backgroundColor: preset.config.color_background }} 
            />
          </div>
          {theme.preset_name === preset.name && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
