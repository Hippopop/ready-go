import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { contactSchema } from '@/lib/validations/contact'
 
// Rate limiting: simple in-memory store (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
 
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour window
  const maxRequests = 3 // max 3 submissions per hour per IP
 
  const entry = rateLimitMap.get(ip)
 
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
 
  if (entry.count >= maxRequests) {
    return false
  }
 
  entry.count++
  return true
}
 
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params
    
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')
      ?? request.headers.get('x-real-ip')
      ?? 'unknown'
 
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      )
    }
 
    // Parse and validate body
    const body = await request.json()
    const result = contactSchema.safeParse(body)
 
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: result.error.flatten() },
        { status: 400 }
      )
    }
 
    const { name, email, message } = result.data
 
    // Use Admin Client for all operations (public visitors have no session/RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
 
    // Verify the portfolio owner exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', uid)
      .single()
 
    if (profileError || !profile) {
      console.error('Portfolio lookup error:', profileError)
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }
 
    // Insert submission
    const { error: insertError } = await supabaseAdmin
      .from('contact_submissions')
      .insert({
        portfolio_owner_id: uid,
        sender_name: name,
        sender_email: email,
        message,
      })
 
    if (insertError) {
      console.error('Contact insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      )
    }
 
    return NextResponse.json({ success: true })
 
  } catch (error) {
    console.error('Contact route error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}

