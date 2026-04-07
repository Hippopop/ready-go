'use client'

import React from 'react'
import {
  Document, Page, View, Text, Image, Link, StyleSheet
} from '@react-pdf/renderer'
import { registerResumeFonts } from '@/lib/resume-fonts'
import { ResumeData } from '@/types/resume'

registerResumeFonts()

const C = {
  primary:  '#4F46E5',
  surface:  '#f8fafc',
  border:   '#e2e8f0',
  muted:    '#64748b',
  light:    '#94a3b8',
  chipBg:   '#EEF2FF',
  chipText: '#4F46E5',
}

const s = StyleSheet.create({
  page: {
    flexDirection: 'column',
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 22,
    gap: 16,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    border: '3px solid rgba(255,255,255,0.3)',
  },
  headerText: { flex: 1 },
  name: {
    fontSize: 22,
    fontWeight: 700,
    color: '#ffffff',
    fontFamily: 'Inter',
    marginBottom: 3,
  },
  headline: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 2,
  },
  tagline: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
  },
  body: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 190,
    backgroundColor: C.surface,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRightWidth: 1,
    borderRightColor: C.border,
  },
  main: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 18,
  },
  sidebarSectionTitle: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: C.primary,
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 1.5,
    borderBottomColor: C.primary,
    fontFamily: 'Inter',
  },
  mainSectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
    fontFamily: 'Inter',
  },
  sectionBlock: { marginBottom: 16 },
  itemBlock: { marginBottom: 10 },
  roleLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  role: { fontSize: 10, fontWeight: 700, fontFamily: 'Inter' },
  company: { fontSize: 10, color: C.primary, fontFamily: 'Inter' },
  dates: { fontSize: 8, color: C.light, fontFamily: 'Inter' },
  description: { fontSize: 9, color: C.muted, lineHeight: 1.5, marginTop: 3 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  chip: {
    fontSize: 8,
    backgroundColor: C.chipBg,
    color: C.chipText,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 3,
    marginTop: 2,
    fontFamily: 'Inter',
  },
  contactItem: {
    fontSize: 9,
    color: C.muted,
    marginBottom: 5,
    fontFamily: 'Inter',
  },
  contactLink: {
    fontSize: 9,
    color: C.primary,
    marginBottom: 5,
    textDecoration: 'none',
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillName: { fontSize: 9, fontFamily: 'Inter' },
  dotRow: { flexDirection: 'row' },
  dotFilled: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: C.primary, marginRight: 2,
  },
  dotEmpty: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: C.border, marginRight: 2,
  },
  eduInstitution: { fontSize: 9, fontWeight: 700, fontFamily: 'Inter' },
  eduDegree: { fontSize: 9, color: C.muted, fontFamily: 'Inter' },
  eduYears: { fontSize: 8, color: C.light, fontFamily: 'Inter' },
})

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch { return dateStr }
}

export default function ExecutivePDF({ data }: { data: ResumeData }) {
  const ats = data.resumeSettings?.ats_mode
  const showPhoto = data.resumeSettings?.include_photo &&
    (data.hero?.profile_image_url || data.profile.avatar_url)
  const photoUrl = data.hero?.profile_image_url || data.profile.avatar_url



  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={[s.header, ats ? { backgroundColor: '#1e293b' } : {}]}>
          {showPhoto && photoUrl && (
            <Image src={photoUrl} style={s.photo} />
          )}
          <View style={s.headerText}>
            <Text style={s.name}>{data.profile.full_name ?? 'Your Name'}</Text>
            {data.hero?.headline && (
              <Text style={s.headline}>{data.hero.headline}</Text>
            )}
            {data.hero?.tagline && (
              <Text style={s.tagline}>{data.hero.tagline}</Text>
            )}
          </View>
        </View>

        {/* Body */}
        <View style={s.body}>

          {/* Sidebar */}
          <View style={s.sidebar}>

            {/* Contact */}
            <View style={s.sectionBlock}>
              <Text style={s.sidebarSectionTitle}>Contact</Text>
              {data.profile.email && (
                <Link src={`mailto:${data.profile.email}`} style={s.contactLink}>
                  {data.profile.email}
                </Link>
              )}
              {data.about?.location && (
                <Text style={s.contactItem}>{data.about.location}</Text>
              )}
              {data.socialLinks.map((link, i) => (
                <Link key={i} src={link.url} style={s.contactLink}>
                  {link.platform}
                </Link>
              ))}
            </View>

            {/* Skills */}
            {data.skills.length > 0 && (
              <View style={s.sectionBlock}>
                <Text style={s.sidebarSectionTitle}>Skills</Text>
                {data.skills.slice(0, 12).map((skill, i) => (
                  <View key={i} style={s.skillRow}>
                    <Text style={s.skillName}>{skill.name}</Text>
                    {!ats && (
                      <View style={s.dotRow}>
                        {[1,2,3,4,5].map(n => (
                          <View
                            key={n}
                            style={n <= (skill.proficiency ?? 3) ? s.dotFilled : s.dotEmpty}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <View style={s.sectionBlock}>
                <Text style={s.sidebarSectionTitle}>Education</Text>
                {data.education.map((edu, i) => (
                  <View key={i} style={s.itemBlock}>
                    <Text style={s.eduInstitution}>{edu.institution}</Text>
                    {edu.degree && (
                      <Text style={s.eduDegree}>
                        {edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
                      </Text>
                    )}
                    {(edu.start_year || edu.end_year) && (
                      <Text style={s.eduYears}>
                        {edu.start_year ?? ''} – {edu.end_year ?? 'Present'}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

          </View>

          {/* Main content */}
          <View style={s.main}>

            {/* Summary */}
            {data.about?.bio && (
              <View style={s.sectionBlock}>
                <Text style={s.mainSectionTitle}>Summary</Text>
                <Text style={s.description}>{data.about.bio}</Text>
              </View>
            )}

            {/* Experience */}
            {data.experiences.length > 0 && (
              <View style={s.sectionBlock}>
                <Text style={s.mainSectionTitle}>Experience</Text>
                {data.experiences.map((exp, i) => (
                  <View key={i} style={s.itemBlock}>
                    <View style={s.roleLine}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.role}>{exp.role}</Text>
                        <Text style={[s.company, ats ? { color: '#0f172a' } : {}]}>
                          {exp.company_name}
                        </Text>
                      </View>
                      <Text style={s.dates}>
                        {formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                      </Text>
                    </View>
                    {exp.description && (
                      <Text style={s.description}>{exp.description}</Text>
                    )}
                    {exp.tech_stack && exp.tech_stack.length > 0 && (
                      <View style={s.chipRow}>
                        {exp.tech_stack.slice(0, 8).map((t, j) => (
                          <Text key={j} style={[s.chip, ats ? { backgroundColor: '#f1f5f9', color: '#475569' } : {}]}>
                            {t}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
              <View style={s.sectionBlock}>
                <Text style={s.mainSectionTitle}>Projects</Text>
                {data.projects.slice(0, 3).map((proj, i) => (
                  <View key={i} style={s.itemBlock}>
                    <View style={s.roleLine}>
                      {proj.live_url || proj.github_url ? (
                        <Link
                          src={proj.live_url ?? proj.github_url ?? ''}
                          style={[s.role, s.company, ats ? { color: '#0f172a' } : {}]}
                        >
                          {proj.title}
                        </Link>
                      ) : (
                        <Text style={s.role}>{proj.title}</Text>
                      )}
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        {proj.github_url && (
                          <Link src={proj.github_url} style={[s.dates, { color: C.primary }]}>
                            GitHub
                          </Link>
                        )}
                        {proj.live_url && (
                          <Link src={proj.live_url} style={[s.dates, { color: C.primary }]}>
                            Live
                          </Link>
                        )}
                      </View>
                    </View>
                    {proj.description && (
                      <Text style={s.description}>{proj.description}</Text>
                    )}
                    {proj.tech_stack && proj.tech_stack.length > 0 && (
                      <View style={s.chipRow}>
                        {proj.tech_stack.slice(0, 6).map((t, j) => (
                          <Text key={j} style={[s.chip, ats ? { backgroundColor: '#f1f5f9', color: '#475569' } : {}]}>
                            {t}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <View style={s.sectionBlock}>
                <Text style={s.mainSectionTitle}>Certifications</Text>
                {data.certifications.map((cert, i) => (
                  <View key={i} style={[s.itemBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <View>
                      {cert.credential_url ? (
                        <Link src={cert.credential_url} style={[s.role, { fontSize: 9, color: C.primary, textDecoration: 'none' }]}>
                          {cert.name}
                        </Link>
                      ) : (
                        <Text style={[s.role, { fontSize: 9 }]}>{cert.name}</Text>
                      )}
                      {cert.issuer && <Text style={s.description}>{cert.issuer}</Text>}
                    </View>
                    {cert.issue_date && (
                      <Text style={s.dates}>{formatDate(cert.issue_date)}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

          </View>
        </View>
      </Page>
    </Document>
  )
}
