import { getTheme } from "@/lib/actions/theme";
import { ThemeEditor } from "@/components/admin/theme/theme-editor";
import { Palette } from "lucide-react";

export const metadata = {
  title: "Theme & Appearance | Ready-Go Admin",
};

export default async function ThemePage() {
  await getTheme(); // Fetch it on the server to ensure it's in the cache / DB is warm

  return (
    <div className="max-w-6xl mx-auto w-full space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-(--border-radius)">
            <Palette className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Theme & Appearance</h1>
            <p className="text-muted-foreground text-lg">
              Changes preview instantly. Click Save to apply to your portfolio.
            </p>
          </div>
        </div>
      </div>

      <ThemeEditor />
    </div>
  );
}
