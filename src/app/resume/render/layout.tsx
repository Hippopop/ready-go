// Completely isolated layout for Puppeteer rendering
// No ThemeProvider, no auth check, no global nav
export default function ResumeRenderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body style={{ margin: 0, padding: 0, background: 'white' }}>
        {children}
      </body>
    </html>
  )
}
