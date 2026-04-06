import React from 'react';
import { ResumeData } from '@/types/resume';

interface MinimalTemplateProps {
  data: ResumeData;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data }) => {
  const {
    profile,
    about,
    socialLinks,
    experiences,
    projects,
    skills,
    education,
    resumeSettings,
  } = data;

  const isAtsMode = resumeSettings?.ats_mode ?? false;

  // Theme colors
  const primaryColor = isAtsMode ? '#000000' : '#6366f0';
  const textColor = '#1a1a2e';
  const mutedTextColor = '#64748b';
  const borderColor = '#e2e8f0';
  const chipBg = isAtsMode ? 'transparent' : '#f1f5f9';
  const chipTextColor = isAtsMode ? textColor : '#475569';

  // Helper to split description into bullets
  const getBullets = (text: string | null) => {
    if (!text) return [];
    return text.split(/\. |\n/).filter(Boolean);
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div
      id="resume-minimal"
      style={{
        width: '794px',
        minHeight: '1123px',
        fontFamily: "'DM Mono', 'Courier New', monospace",
        fontSize: '11px',
        color: textColor,
        backgroundColor: '#ffffff',
        padding: '40px 48px',
        boxSizing: 'border-box',
        margin: '0 auto',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* HEADER */}
      <header style={{ marginBottom: '20px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: textColor,
            margin: '0 0 4px 0',
            letterSpacing: '-1px',
          }}
        >
          {profile.full_name || 'Your Name'}
        </h1>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            fontSize: '10px',
            color: mutedTextColor,
            flexWrap: 'wrap',
          }}
        >
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              style={{ color: primaryColor, textDecoration: 'none' }}
            >
              {profile.email}
            </a>
          )}
          {about?.location && <span>{about.location}</span>}
          {socialLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: primaryColor, textDecoration: 'none' }}
            >
              {link.platform}
            </a>
          ))}
        </div>
      </header>

      <div style={{ height: '1px', backgroundColor: borderColor, margin: '14px 0' }} />

      {/* BIO */}
      {about?.bio && (
        <>
          <section style={{ marginBottom: '20px' }}>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '11px' }}>
              {about.bio}
            </p>
          </section>
          <div style={{ height: '1px', backgroundColor: borderColor, margin: '14px 0' }} />
        </>
      )}

      {/* EXPERIENCE */}
      {experiences && experiences.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2
            style={{
              fontSize: '10px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: primaryColor,
              marginBottom: '12px',
            }}
          >
            Experience
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {experiences.map((exp, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <div
                  style={{
                    float: 'right',
                    color: '#94a3b8',
                    fontSize: '10px',
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                </div>
                <div style={{ fontWeight: '700', fontSize: '12px', color: textColor }}>
                  {exp.role}{' '}
                  <span style={{ color: primaryColor, fontWeight: '500' }}>
                    @ {exp.company_name}
                  </span>
                </div>
                <div style={{ marginTop: '6px', clear: 'both' }}>
                  {getBullets(exp.description).map((bullet, bIdx) => (
                    <div
                      key={bIdx}
                      style={{
                        marginBottom: '3px',
                        display: 'flex',
                        gap: '8px',
                        color: textColor,
                        lineHeight: '1.4',
                      }}
                    >
                      <span>·</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
                {exp.tech_stack && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                      marginTop: '6px',
                    }}
                  >
                    {exp.tech_stack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          backgroundColor: chipBg,
                          color: chipTextColor,
                          padding: '1px 6px',
                          borderRadius: '3px',
                          fontSize: '9px',
                          fontFamily: 'monospace',
                          display: 'inline-block',
                          border: isAtsMode ? '1px solid #000' : 'none',
                        }}
                      >
                        [{tech}]
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ height: '1px', backgroundColor: borderColor, margin: '14px 0' }} />
        </section>
      )}

      {/* SKILLS */}
      {Object.keys(skillsByCategory).length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2
            style={{
              fontSize: '10px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: primaryColor,
              marginBottom: '10px',
            }}
          >
            Skills
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.entries(skillsByCategory).map(([category, names], idx) => (
              <div key={idx} style={{ lineHeight: '1.4' }}>
                <span style={{ fontWeight: '600' }}>{category}:</span>{' '}
                {names.join(', ')}
              </div>
            ))}
          </div>
          <div style={{ height: '1px', backgroundColor: borderColor, margin: '14px 0' }} />
        </section>
      )}

      {/* PROJECTS */}
      {projects && projects.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2
            style={{
              fontSize: '10px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: primaryColor,
              marginBottom: '12px',
            }}
          >
            Projects
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {projects.map((project, idx) => (
              <div key={idx}>
                <div style={{ fontWeight: '700', fontSize: '11px', color: textColor }}>
                  {project.title}{' '}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: primaryColor,
                        textDecoration: 'none',
                        fontSize: '9px',
                        marginLeft: '8px',
                        fontWeight: '500',
                      }}
                    >
                      [Live]
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: primaryColor,
                        textDecoration: 'none',
                        fontSize: '9px',
                        marginLeft: '8px',
                        fontWeight: '500',
                      }}
                    >
                      [GitHub]
                    </a>
                  )}
                </div>
                {project.description && (
                  <p
                    style={{
                      margin: '4px 0',
                      color: textColor,
                      lineHeight: '1.4',
                    }}
                  >
                    {project.description}
                  </p>
                )}
                {project.tech_stack && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {project.tech_stack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          backgroundColor: chipBg,
                          color: chipTextColor,
                          padding: '1px 6px',
                          borderRadius: '3px',
                          fontSize: '9px',
                          fontFamily: 'monospace',
                          display: 'inline-block',
                          border: isAtsMode ? '1px solid #000' : 'none',
                        }}
                      >
                        [{tech}]
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ height: '1px', backgroundColor: borderColor, margin: '14px 0' }} />
        </section>
      )}

      {/* EDUCATION */}
      {education && education.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2
            style={{
              fontSize: '10px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: primaryColor,
              marginBottom: '10px',
            }}
          >
            Education
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {education.map((edu, idx) => (
              <div key={idx}>
                <div style={{ fontWeight: '700' }}>
                  {edu.institution}{' '}
                  <span
                    style={{
                      float: 'right',
                      color: '#94a3b8',
                      fontSize: '10px',
                      fontWeight: 'normal',
                    }}
                  >
                    {edu.start_year} – {edu.end_year || 'Present'}
                  </span>
                </div>
                <div style={{ color: primaryColor }}>
                  {edu.degree} {edu.field_of_study ? `· ${edu.field_of_study}` : ''}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
