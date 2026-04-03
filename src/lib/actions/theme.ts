"use server";

import { createClient } from "@/lib/supabase/server";
import { themeConfigSchema, type ThemeConfig } from "@/lib/validations/theme";
import { DEFAULT_THEME } from "@/lib/theme-presets";
import { revalidatePath } from "next/cache";

export async function getTheme() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return DEFAULT_THEME;

  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return DEFAULT_THEME;
  }

  return data as ThemeConfig;
}

export async function upsertTheme(data: ThemeConfig) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const validated = themeConfigSchema.safeParse(data);
  if (!validated.success) {
    return { error: "Invalid theme data" };
  }

  const { error } = await supabase
    .from("themes")
    .upsert({
      ...validated.data,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  if (error) {
    console.error("Error upserting theme:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/theme");
  revalidatePath("/"); // Revalidate portfolio if it's the home page or similar
  
  return { success: true, data: validated.data };
}

export async function getThemeByUserId(userId: string) {
  // Use anon client for public access as instructed, but actions run server-side
  // In Next.js server actions, createClient from server.ts is better for server-side
  // but if it's purely public, we can just use the server client without auth check.
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return DEFAULT_THEME;
  }

  return data as ThemeConfig;
}
