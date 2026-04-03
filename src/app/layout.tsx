import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getTheme } from "@/lib/actions/theme";
import { themeToCssVars, getGoogleFontsUrl } from "@/lib/theme-utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ready-Go — Portfolio Builder",
  description: "A full-stack SaaS portfolio website generator for software engineers",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();
  const initialStyles = themeToCssVars(theme);
  const fontUrl = getGoogleFontsUrl([theme.font_heading, theme.font_body]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <style
          id="ready-go-theme"
          dangerouslySetInnerHTML={{ __html: `:root {\n${initialStyles}\n}` }}
        />
        <link id="ready-go-fonts" rel="stylesheet" href={fontUrl} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-app-text font-body transition-colors duration-[var(--transition-speed)]">
        <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
