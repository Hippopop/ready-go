"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GOOGLE_FONTS = [
  "Inter",
  "Plus Jakarta Sans",
  "DM Sans",
  "Manrope",
  "Outfit",
  "Nunito",
  "Raleway",
  "Poppins",
  "Share Tech Mono",
  "Space Grotesk",
  "Sora",
];

interface FontPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function FontPicker({ label, value, onChange }: FontPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent>
          {GOOGLE_FONTS.map((font) => (
            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
