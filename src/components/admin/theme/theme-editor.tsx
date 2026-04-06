"use client";

import React, { useState } from "react";
import { PresetSelector } from "./preset-selector";
import { ColorPicker } from "./color-picker";
import { FontPicker } from "./font-picker";
import { useThemeStore } from "@/stores/theme-store";
import { upsertTheme } from "@/lib/actions/theme";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Sparkles, Palette, Type, Layout } from "lucide-react";
import { ThemeConfig } from "@/lib/validations/theme";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ThemeEditorProps {
  initialTheme: ThemeConfig;
}

export function ThemeEditor({ initialTheme: _initialTheme }: ThemeEditorProps) {
  const { theme, updateTheme, isDirty, setDirty } = useThemeStore();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);


  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const freshTheme = useThemeStore.getState().theme;
      console.log('handleSave called with:', freshTheme);
      const result = await upsertTheme(freshTheme);
      console.log('upsertTheme result:', result);
      if (result.success) {
        setMessage({ type: "success", text: "Theme saved successfully!" });
        setDirty(false);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save theme" });
      }
    } catch (err) {
      console.error("Theme save error:", err);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-card p-4 rounded-(--border-radius) border border-border shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold tracking-tight">Theme Customization</h2>
          {isDirty && (
            <Badge variant="secondary" className="animate-pulse bg-primary/10 text-primary border-primary/20">
              Unsaved Changes
            </Badge>
          )}
        </div>
        <Button 
          onClick={handleSave} 
          disabled={!isDirty || isSaving}
          className="rounded-(--border-radius) px-6 shadow-glow"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      {message && (
        <div className={`p-4 rounded-(--border-radius) border ${
          message.type === "success" 
            ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400" 
            : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          {/* Quick Presets */}
          <Section icon={<Sparkles className="w-5 h-5 text-primary" />} title="Quick Presets" description="Start with a professionally designed theme.">
            <PresetSelector />
          </Section>

          {/* Colors */}
          <Section icon={<Palette className="w-5 h-5 text-primary" />} title="Color Palette" description="Customize your brand colors.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ColorPicker 
                label="Primary Color" 
                value={theme.color_primary} 
                onChange={(v) => updateTheme({ color_primary: v, preset_name: undefined })} 
              />
              <ColorPicker 
                label="Accent Color" 
                value={theme.color_accent} 
                onChange={(v) => updateTheme({ color_accent: v, preset_name: undefined })} 
              />
              <ColorPicker 
                label="Background" 
                value={theme.color_background} 
                onChange={(v) => updateTheme({ color_background: v, preset_name: undefined })} 
              />
              <ColorPicker 
                label="Surface/Cards" 
                value={theme.color_surface} 
                onChange={(v) => updateTheme({ color_surface: v, preset_name: undefined })} 
              />
              <ColorPicker 
                label="Text Color" 
                value={theme.color_text} 
                onChange={(v) => updateTheme({ color_text: v, preset_name: undefined })} 
              />
            </div>
          </Section>

          {/* Typography */}
          <Section icon={<Type className="w-5 h-5 text-primary" />} title="Typography" description="Choose fonts that reflect your style.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FontPicker 
                label="Heading Font" 
                value={theme.font_heading} 
                onChange={(v) => updateTheme({ font_heading: v, preset_name: undefined })} 
              />
              <FontPicker 
                label="Body Font" 
                value={theme.font_body} 
                onChange={(v) => updateTheme({ font_body: v, preset_name: undefined })} 
              />
            </div>
          </Section>

          {/* Style Settings */}
          <Section icon={<Layout className="w-5 h-5 text-primary" />} title="Interface Style" description="Fine-tune appearance details.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <Label className="text-sm font-semibold">Border Radius</Label>
                <RadioGroup 
                  value={theme.border_radius} 
                  onValueChange={(v: ThemeConfig["border_radius"]) => updateTheme({ border_radius: v, preset_name: undefined })}
                  className="flex flex-wrap gap-4"
                >
                  <RadioItem value="none" label="Sharp" />
                  <RadioItem value="sm" label="Small" />
                  <RadioItem value="md" label="Medium" />
                  <RadioItem value="lg" label="Large" />
                  <RadioItem value="full" label="Full" />
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold">Spacing</Label>
                <RadioGroup 
                  value={theme.spacing} 
                  onValueChange={(v: ThemeConfig["spacing"]) => updateTheme({ spacing: v, preset_name: undefined })}
                  className="flex flex-wrap gap-4"
                >
                  <RadioItem value="compact" label="Compact" />
                  <RadioItem value="default" label="Default" />
                  <RadioItem value="spacious" label="Spacious" />
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold">Animation Style</Label>
                <RadioGroup 
                  value={theme.animation_style} 
                  onValueChange={(v: ThemeConfig["animation_style"]) => updateTheme({ animation_style: v, preset_name: undefined })}
                  className="flex flex-wrap gap-4"
                >
                  <RadioItem value="none" label="Static" />
                  <RadioItem value="subtle" label="Subtle" />
                  <RadioItem value="lively" label="Lively" />
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold">Default Mode</Label>
                <RadioGroup 
                  value={theme.color_mode} 
                  onValueChange={(v: ThemeConfig["color_mode"]) => updateTheme({ color_mode: v, preset_name: undefined })}
                  className="flex flex-wrap gap-4"
                >
                  <RadioItem value="light" label="Light" />
                  <RadioItem value="dark" label="Dark" />
                  <RadioItem value="system" label="System" />
                </RadioGroup>
              </div>
            </div>
          </Section>
        </div>

        {/* Live Preview Panel */}
        <div className="xl:col-span-4">
          <div className="sticky top-24">
            <Card className="overflow-hidden border-2 border-primary/20 bg-surface shadow-xl rounded-(--border-radius)">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-base font-semibold">Theme Preview</CardTitle>
                <CardDescription>How your portfolio elements look.</CardDescription>
              </CardHeader>
              <CardContent className="p-(--spacing-unit) space-y-6">
                <div className="bg-background p-(--spacing-unit) rounded-(--border-radius) border">
                  {/* Typography preview */}
                  <h3 className="font-heading text-app-text text-lg font-semibold mb-2">
                    Heading Font
                  </h3>
                  <p className="font-body text-app-text/70 text-sm mb-4">
                    Body font — comfortable to read at any size.
                  </p>

                  {/* Button preview — shows primary color + border radius + animation */}
                  <button className="bg-primary text-white px-4 py-2 rounded-(--border-radius) 
                    transition-all duration-(--transition-speed) ease-(--transition-easing)
                    hover:opacity-80 active:scale-95 mb-4 w-full font-body group relative overflow-hidden">
                    <span className="relative z-10">Primary Button</span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-(--transition-speed)" />
                  </button>

                  {/* Surface card — shows surface color + border radius */}
                  <div className="bg-surface rounded-(--border-radius) p-3 border border-app-text/10">
                    <p className="text-xs font-body text-app-text/50 uppercase tracking-wide mb-1">
                      Surface Element
                    </p>
                    <p className="text-sm font-body text-app-text">
                      This box shows your border radius and surface color.
                    </p>
                  </div>

                  {/* Accent color swatch */}
                  <div className="mt-3 flex gap-2">
                    <div className="w-8 h-8 rounded-(--border-radius) bg-primary" />
                    <div className="w-8 h-8 rounded-(--border-radius) bg-accent" />
                    <div className="w-8 h-8 rounded-(--border-radius) bg-surface border" />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground font-body">
                    Hover the button to test animation style
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, description, children }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  children: React.ReactNode 
}) {
  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 bg-muted/20">
        <div className="p-2 rounded-(--border-radius-sm) bg-background border border-border shadow-sm">
          {icon}
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}

function RadioItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center space-x-2 bg-muted/30 px-3 py-2 rounded-(--border-radius) border border-border/50 hover:border-primary/30 transition-colors pointer-cursor">
      <RadioGroupItem value={value} id={value} />
      <Label htmlFor={value} className="cursor-pointer font-medium">{label}</Label>
    </div>
  );
}
