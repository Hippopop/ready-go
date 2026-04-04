import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params
  const searchParams = request.nextUrl.searchParams

  try {
    // Dynamic import to avoid build errors when chromium is not available
    const puppeteer = (await import('puppeteer-core')).default
    const chromium = (await import('@sparticuz/chromium-min')).default

    // Get resume data to determine default template
    const { getResumeData } = await import('@/lib/actions/resume')
    const data = await getResumeData(uid)

    if (!data || !data.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const template = searchParams.get('template')
      ?? data.resumeSettings?.default_template
      ?? 'executive'

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const renderUrl = `${baseUrl}/resume/render/${uid}?template=${template}`

    // Determine executable path
    const isProduction = process.env.NODE_ENV === 'production'
    const executablePath = isProduction
      ? await chromium.executablePath(
          `https://github.com/Sparticuz/chromium/releases/download/v130.0.0/chromium-v130.0.0-pack.tar`
        )
      : process.env.PUPPETEER_EXECUTABLE_PATH
        ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

    const browser = await puppeteer.launch({
      args: isProduction ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 794, height: 1123 },
      executablePath,
      headless: true,
    })

    try {
      const page = await browser.newPage()
      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 })
      await page.goto(renderUrl, { waitUntil: 'networkidle0', timeout: 30000 })

      // Wait for fonts
      await page.evaluateHandle('document.fonts.ready')

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      })

      const name = (data.profile.full_name ?? 'resume').replace(/\s+/g, '_')

      return new NextResponse(pdf as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${name}_resume.pdf"`,
          'Cache-Control': 'no-store',
        },
      })
    } finally {
      await browser.close()
    }
  } catch (error) {
    console.error('PDF generation failed:', error)
    return NextResponse.json(
      { error: 'PDF generation failed', detail: String(error) },
      { status: 500 }
    )
  }
}

