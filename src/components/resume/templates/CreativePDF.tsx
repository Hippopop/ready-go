'use client'

import React from 'react'
import {
  Document, Page, View, Text, Image, Link, StyleSheet
} from '@react-pdf/renderer'
import { registerResumeFonts } from '@/lib/resume-fonts'
import { ResumeData } from '@/types/resume'

registerResumeFonts()

const C = {
  orange:   '#f97316',
  pink:     '#ec4899',
  dark:     '#1e293b',
  muted:    '#64748b',
  light:    '#94a3b8',
  surface:  '#fafafa',
  border:   '#f1f5f9',
}

const s = StyleSheet.create({
  page: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    color: C.dark,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 26,
    gap: 20,
    // gradient approximated — react-pdf doesn't support CSS gradients
    // use a solid color from the gradient midpoint
    backgroundColor: '#f45392',
  },
  headerAts: {
    backgroundColor: C.dark,
  },
  photo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    border: '4px solid rgba(255,255,255,0.4)',
  },
  headerText: { flex: 1 },
  name: {
    fontSize: 24,
    fontWeight: 800,
    color: '#ffffff',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: 3,
  },
  headline: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginBottom: 6 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  contactChip: { fontSize: 9, color: 'rgba(255,255,255,0.8)' },
  contactLink: { fontSize: 9, color: 'rgba(255,255,255,0.9)', textDecoration: 'none' },
  body: { flexDirection: 'row', flex: 1 },
  left: {
    flex: 0.58,
    paddingHorizontal: 22,
    paddingVertical: 18,
  },
  right: {
    flex: 0.42,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: C.surface,
    borderLeftWidth: 1,
    borderLeftColor: C.border,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: C.orange,
    marginBottom: 10,
    paddingBottom: 3,
    borderBottomWidth: 1.5,
    borderBottomColor: C.orange,
    fontFamily: 'Plus Jakarta Sans',
  },
  sectionTitleAts: {
    color: C.dark,
    borderBottomColor: C.dark,
  },
  sectionBlock: { marginBottom: 16 },
  itemBlock: { marginBottom: 10 },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  role: { fontSize: 10, fontWeight: 700, fontFamily: 'Plus Jakarta Sans' },
  company: { fontSize: 10, color: C.orange, fontWeight: 600, fontFamily: 'Plus Jakarta Sans' },
  companyAts: { color: C.dark },
  dates: { fontSize: 8, color: C.light },
  description: { fontSize: 9, color: C.muted, lineHeight: 1.5 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  chip: {
    fontSize: 8,
    backgroundColor: '#fff7ed',
    color: C.orange,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 3,
    marginTop: 2,
  },
  chipAts: { backgroundColor: '#f1f5f9', color: C.muted },
  // Skill bar
  skillItem: { marginBottom: 8 },
  skillLabel: { fontSize: 9, fontWeight: 500, marginBottom: 3, fontFamily: 'Plus Jakarta Sans' },
  skillBarBg: {
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
  },
  skillBarFill: {
    height: 4,
    backgroundColor: C.orange,
    borderRadius: 2,
  },
  skillBarFillAts: { backgroundColor: C.dark },
  eduInstitution: { fontSize: 9, fontWeight: 700, fontFamily: 'Plus Jakarta Sans' },
  eduSub: { fontSize: 9, color: C.muted },
})

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch { return dateStr }
}

export default function CreativePDF({ data }: { data: ResumeData }) {
  const ats = data.resumeSettings?.ats_mode
  const showPhoto = data.resumeSettings?.include_photo &&
    (data.hero?.profile_image_url || data.profile.avatar_url)
  const photoUrl = data.hero?.profile_image_url || data.profile.avatar_url

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={[s.header, ats ? s.headerAts : {}]}>
          {showPhoto && photoUrl && (
            <Image src={photoUrl} style={s.photo} />
          )}
          <View style={s.headerText}>
            <Text style={s.name}>{data.profile.full_name ?? 'Your Name'}</Text>
            {data.hero?.headline && (
              <Text style={s.headline}>{data.hero.headline}</Text>
            )}
            <View style={s.contactRow}>
              {data.profile.email && (
                <Link src={`mailto:${data.profile.email}`} style={s.contactLink}>
                  {data.profile.email}
                </Link>
              )}
              {data.about?.location && (
                <Text style={s.contactChip}>{data.about.location}</Text>
              )}
              {data.socialLinks.slice(0, 2).map((link, i) => (
                <Link key={i} src={link.url} style={s.contactLink}>{link.platform}</Link>
              ))}
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={s.body}>

          {/* Left column */}
          <View style={s.left}>

            {/* Summary */}
            {data.about?.bio && (
              <View style={s.sectionBlock}>
                <Text style={[s.sectionTitle, ats ? s.sectionTitleAts : {}]}>Summary</Text>
                <Text style={s.description}>{data.about.bio}</Text>
              </View>
            )}

            {/* Experience */}
            {data.experiences.length > 0 && (
              <View style={s.sectionBlock}>
                <Text style={[s.sectionTitle, ats ? s.sectionTitleAts : {}]}>Experience</Text>
                {data.experiences.map((exp, i) => (
                  <View key={i} style={s.itemBlock}>
                    <View style={s.expHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.role}>{exp.role}</Text>
                        <Text style={[s.company, ats ? s.companyAts : {}]}>
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
                        {exp.tech_stack.slice(0, 6).map((t, j) => (
                          <Text key={j} style={[s.chip, ats ? s.chipAts : {}]}>{t}</Text>
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
                <Text style={[s.sectionTitle, ats ? s.sectionTitleAts : {}]}>Projects</Text>
                {data.projects.slice(0, 3).map((proj, i) => (
                  <View key={i} style={s.itemBlock}>
                    <View style={s.expHeader}>
                      {proj.live_url || proj.github_url ? (
                        <Link
                          src={proj.live_url ?? proj.github_url ?? ''}
                          style={[s.role, { color: ats ? C.dark : C.orange, textDecoration: 'none' }]}
                        >
                          {proj.title}
                        </Link>
                      ) : (
                        <Text style={s.role}>{proj.title}</Text>
                      )}
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        {proj.github_url && (
                          <Link src={proj.github_url} style={[s.dates, { color: ats ? C.muted : C.orange }]}>
                            GitHub
                          </Link>
                        )}
                        {proj.live_url && (
                          <Link src={proj.live_url} style={[s.dates, { color: ats ? C.muted : C.orange }]}>
                            Live
                          </Link>
                        )}
                      </View>
                    </View>
                    {proj.description && (
                      <Text style={s.description}>{proj.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

          </View>

          {/* Right column */}
          <View style={s.right}>

            {/* Skills with bars */}
            {data.skills.length > 0 && (
              <View style={s.sectionBlock}>
                <Text style={[s.sectionTitle, ats ? s.sectionTitleAts : {}]}>Expertise</Text>
                {data.skills.slice(0, 10).map((skill, i) => (
                  <View key={i} style={s.skillItem}>
                    <Text style={s.skillLabel}>{skill.name}</Text>
                    {!ats ? (
                      <View style={s.skillBarBg}>
                        <View
                          style={[
                            s.skillBarFill,
                            { width: `${((skill.proficiency ?? 3) / 5) * 100}%` },
                          ]}
                        />
                      </View>
                    ) : (
                      <Text style={[s.description, { fontSize: 8 }]}>
                        {'★'.repeat(skill.proficiency ?? 3)}{'☆'.repeat(5 - (skill.proficiency ?? 3))}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <View style={s.sectionBlock}>
                <Text style={[s.sectionTitle, ats ? s.sectionTitleAts : {}]}>Education</Text>
                {data.education.map((edu, i) => (
                  <View key={i} style={[s.itemBlock]}>
                    <Text style={s.eduInstitution}>{edu.institution}</Text>
                    {edu.degree && (
                      <Text style={s.eduSub}>
                        {edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
                      </Text>
                    )}
                    <Text style={[s.dates, { marginTop: 2 }]}>
                      {edu.start_year ?? ''} – {edu.end_year ?? 'Present'}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <View style={s.sectionBlock}>
                <Text style={[s.sectionTitle, ats ? s.sectionTitleAts : {}]}>Certifications</Text>
                {data.certifications.map((cert, i) => (
                  <View key={i} style={s.itemBlock}>
                    {cert.credential_url ? (
                      <Link
                        src={cert.credential_url}
                        style={[s.eduInstitution, { color: ats ? C.dark : C.orange, fontSize: 9, textDecoration: 'none' }]}
                      >
                        {cert.name}
                      </Link>
                    ) : (
                      <Text style={[s.eduInstitution, { fontSize: 9 }]}>{cert.name}</Text>
                    )}
                    {cert.issuer && <Text style={s.eduSub}>{cert.issuer}</Text>}
                  </View>
                ))}
              </View>
            )}

            {/* Awards */}
            {data.awards.length > 0 && (
              <View style={s.sectionBlock}>
                <Text style={[s.sectionTitle, ats ? s.sectionTitleAts : {}]}>Awards</Text>
                {data.awards.map((award, i) => (
                  <View key={i} style={s.itemBlock}>
                    <Text style={[s.eduInstitution, { fontSize: 9 }]}>{award.title}</Text>
                    {award.issuer && <Text style={s.eduSub}>{award.issuer}</Text>}
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
