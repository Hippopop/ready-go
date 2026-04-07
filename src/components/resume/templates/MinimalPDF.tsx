'use client'

import React from 'react'
import {
  Document, Page, View, Text, Link, StyleSheet
} from '@react-pdf/renderer'
import { registerResumeFonts } from '@/lib/resume-fonts'
import { ResumeData } from '@/types/resume'

registerResumeFonts()

const C = {
  primary: '#6366f1',
  muted:   '#64748b',
  light:   '#94a3b8',
  border:  '#e2e8f0',
  chipBg:  '#f1f5f9',
  dark:    '#1a1a2e',
}

const s = StyleSheet.create({
  page: {
    fontFamily: 'DM Mono',
    fontSize: 10,
    color: C.dark,
    backgroundColor: '#ffffff',
    paddingHorizontal: 44,
    paddingVertical: 36,
  },
  name: {
    fontSize: 24,
    fontWeight: 500,
    color: C.dark,
    fontFamily: 'DM Mono',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  contactText: { fontSize: 9, color: C.muted, fontFamily: 'DM Mono' },
  contactLink: { fontSize: 9, color: C.primary, textDecoration: 'none', fontFamily: 'DM Mono' },
  divider: { borderBottomWidth: 0.5, borderBottomColor: C.border, marginVertical: 12 },
  sectionLabel: {
    fontSize: 8,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: C.primary,
    marginBottom: 8,
    fontFamily: 'DM Mono',
  },
  sectionLabelAts: {
    fontSize: 8,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: C.dark,
    marginBottom: 8,
    fontFamily: 'DM Mono',
  },
  sectionBlock: { marginBottom: 14 },
  itemBlock: { marginBottom: 9 },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  roleBold: { fontSize: 10, fontWeight: 500, fontFamily: 'DM Mono' },
  companyAccent: { fontSize: 10, color: C.primary, fontFamily: 'DM Mono' },
  dates: { fontSize: 8, color: C.light, fontFamily: 'DM Mono' },
  bulletLine: { fontSize: 9, color: C.muted, marginBottom: 2, fontFamily: 'DM Mono' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  chip: {
    fontSize: 8,
    backgroundColor: C.chipBg,
    color: C.muted,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
    marginRight: 4,
    marginTop: 3,
    fontFamily: 'DM Mono',
  },
  skillCategoryLine: { fontSize: 9, color: C.dark, marginBottom: 4, fontFamily: 'DM Mono' },
  skillCategoryLabel: { fontWeight: 500, color: C.primary },
})

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch { return dateStr }
}

function toBullets(text: string): string[] {
  return text
    .split(/\n|(?<=\w)\.\s+(?=[A-Z])/)
    .map(s => s.trim())
    .filter(s => s.length > 4)
    .slice(0, 4)
}

export default function MinimalPDF({ data }: { data: ResumeData }) {
  const ats = data.resumeSettings?.ats_mode

  const skillsByCategory = data.skills.reduce((acc, skill) => {
    const cat = skill.category ?? 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill.name)
    return acc
  }, {} as Record<string, string[]>)

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Name */}
        <Text style={s.name}>{data.profile.full_name ?? 'Your Name'}</Text>

        {/* Contact row */}
        <View style={s.contactRow}>
          {data.profile.email && (
            <Link src={`mailto:${data.profile.email}`} style={s.contactLink}>
              {data.profile.email}
            </Link>
          )}
          {data.about?.location && (
            <Text style={s.contactText}>{data.about.location}</Text>
          )}
          {data.socialLinks.slice(0, 3).map((link, i) => (
            <Link key={i} src={link.url} style={s.contactLink}>
              {link.platform}
            </Link>
          ))}
        </View>

        <View style={s.divider} />

        {/* Summary */}
        {data.about?.bio && (
          <>
            <Text style={[s.bulletLine, { color: '#334155', lineHeight: 1.5 }]}>
              {data.about.bio}
            </Text>
            <View style={s.divider} />
          </>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <View style={s.sectionBlock}>
            <Text style={ats ? s.sectionLabelAts : s.sectionLabel}>Experience</Text>
            {data.experiences.map((exp, i) => (
              <View key={i} style={s.itemBlock}>
                <View style={s.expHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.roleBold}>
                      {exp.role}{' '}
                      <Text style={[s.companyAccent, ats ? { color: '#334155' } : {}]}>
                        @ {exp.company_name}
                      </Text>
                    </Text>
                  </View>
                  <Text style={s.dates}>
                    {formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                  </Text>
                </View>
                {exp.description && toBullets(exp.description).map((line, j) => (
                  <Text key={j} style={s.bulletLine}>· {line}</Text>
                ))}
                {exp.tech_stack && exp.tech_stack.length > 0 && (
                  <View style={s.chipRow}>
                    {exp.tech_stack.slice(0, 8).map((t, j) => (
                      <Text key={j} style={s.chip}>{t}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
            <View style={s.divider} />
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={s.sectionBlock}>
            <Text style={ats ? s.sectionLabelAts : s.sectionLabel}>Skills</Text>
            {Object.entries(skillsByCategory).map(([cat, skills], i) => (
              <Text key={i} style={s.skillCategoryLine}>
                <Text style={[s.skillCategoryLabel, ats ? { color: '#334155' } : {}]}>
                  {cat}:{' '}
                </Text>
                {skills.join(', ')}
              </Text>
            ))}
            <View style={s.divider} />
          </View>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <View style={s.sectionBlock}>
            <Text style={ats ? s.sectionLabelAts : s.sectionLabel}>Projects</Text>
            {data.projects.slice(0, 3).map((proj, i) => (
              <View key={i} style={s.itemBlock}>
                <View style={s.expHeader}>
                  {proj.live_url || proj.github_url ? (
                    <Link
                      src={proj.live_url ?? proj.github_url ?? ''}
                      style={[s.roleBold, { color: ats ? '#334155' : '#6366f1', textDecoration: 'none' }]}
                    >
                      {proj.title}
                    </Link>
                  ) : (
                    <Text style={s.roleBold}>{proj.title}</Text>
                  )}
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {proj.github_url && (
                      <Link src={proj.github_url} style={s.contactLink}>GitHub</Link>
                    )}
                    {proj.live_url && (
                      <Link src={proj.live_url} style={s.contactLink}>Live</Link>
                    )}
                  </View>
                </View>
                {proj.description && (
                  <Text style={[s.bulletLine, { marginBottom: 3 }]}>{proj.description}</Text>
                )}
              </View>
            ))}
            <View style={s.divider} />
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={s.sectionBlock}>
            <Text style={ats ? s.sectionLabelAts : s.sectionLabel}>Education</Text>
            {data.education.map((edu, i) => (
              <View key={i} style={[s.expHeader, { marginBottom: 6 }]}>
                <View>
                  <Text style={s.roleBold}>{edu.institution}</Text>
                  {edu.degree && (
                    <Text style={s.bulletLine}>
                      {edu.degree}{edu.field_of_study ? ` · ${edu.field_of_study}` : ''}
                    </Text>
                  )}
                </View>
                <Text style={s.dates}>
                  {edu.start_year ?? ''} – {edu.end_year ?? 'Present'}
                </Text>
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  )
}
