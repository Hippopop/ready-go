export interface ResumeData {
  profile: {
    full_name: string | null
    email: string | null
    avatar_url: string | null
  }
  hero: {
    headline: string | null
    tagline: string | null
    profile_image_url: string | null
    cta_primary_url: string | null
  } | null
  about: {
    bio: string | null
    location: string | null
    availability_status: string | null
    years_of_experience: number | null
  } | null
  socialLinks: Array<{
    platform: string
    url: string
  }>
  experiences: Array<{
    company_name: string
    role: string
    employment_type: string | null
    start_date: string | null
    end_date: string | null
    is_current: boolean | null
    description: string | null
    tech_stack: string[] | null
  }>
  projects: Array<{
    title: string
    description: string | null
    live_url: string | null
    github_url: string | null
    tech_stack: string[] | null
    is_featured: boolean | null
  }>
  skills: Array<{
    name: string
    category: string | null
    proficiency: number | null
  }>
  education: Array<{
    institution: string
    degree: string | null
    field_of_study: string | null
    start_year: number | null
    end_year: number | null
    gpa: string | null
    honors: string | null
  }>
  certifications: Array<{
    name: string
    issuer: string | null
    issue_date: string | null
    credential_url: string | null
  }>
  awards: Array<{
    title: string
    issuer: string | null
    date: string | null
  }>
  resumeSettings: {
    include_photo: boolean | null
    ats_mode: boolean | null
    default_template: string | null
  } | null
}

export type ResumeTemplate = 'executive' | 'minimal' | 'creative'
