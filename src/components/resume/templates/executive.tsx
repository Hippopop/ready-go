import React from 'react';
import { ResumeData } from '@/types/resume';

interface ExecutiveTemplateProps {
  data: ResumeData;
}

const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({ data }) => {
  const {
    profile,
    hero,
    about,
    socialLinks,
    experiences,
    projects,
    skills,
    education,
    certifications,
    awards,
    resumeSettings,
  } = data;

  const isAtsMode = resumeSettings?.ats_mode ?? false;
  const includePhoto = resumeSettings?.include_photo ?? false;

  // Theme colors
  const primaryColor = isAtsMode ? '#000000' : '#4F46E5';
  const headerBg = isAtsMode ? '#ffffff' : '#4F46E5';
  const headerText = isAtsMode ? '#000000' : '#ffffff';
  const sidebarBg = isAtsMode ? '#ffffff' : '#f8fafc';
  const borderColor = isAtsMode ? '#000000' : '#e2e8f0';
  const textColor = '#0f172a';
  const mutedTextColor = '#64748b';
  const chipBg = isAtsMode ? '#ffffff' : '#EEF2FF';
  const chipBorder = isAtsMode ? '1px solid #000000' : 'none';

  return (
    <div
      id="resume-executive"
      style={{
        width: '794px',
        minHeight: '1123px',
        fontFamily: "'Inter', sans-serif",
        fontSize: '11px',
        color: textColor,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        position: 'relative',
        margin: '0 auto',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* HEADER */}
      <header
        style={{
          backgroundColor: headerBg,
          color: headerText,
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          borderBottom: isAtsMode ? '1px solid #000000' : 'none',
        }}
      >
        {includePhoto && profile.avatar_url && (
          <img
            src={profile.avatar_url}
            alt={profile.full_name || 'Profile'}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: isAtsMode ? '1px solid #000000' : '3px solid rgba(255,255,255,0.3)',
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: '700',
              margin: '0 0 4px 0',
              letterSpacing: '-0.5px',
              color: headerText,
            }}
          >
            {profile.full_name || 'Your Name'}
          </h1>
          {hero?.headline && (
            <p
              style={{
                fontSize: '13px',
                margin: '0 0 4px 0',
                opacity: '0.9',
                fontWeight: '500',
              }}
            >
              {hero.headline}
            </p>
          )}
          {hero?.tagline && (
            <p style={{ fontSize: '11px', opacity: '0.7', margin: '0' }}>
              {hero.tagline}
            </p>
          )}
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: 'flex', flex: '1' }}>
        {/* SIDEBAR */}
        <aside
          style={{
            width: '280px',
            backgroundColor: sidebarBg,
            padding: '24px 20px',
            borderRight: `1px solid ${borderColor}`,
          }}
        >
          {/* CONTACT */}
          <section style={{ marginBottom: '24px' }}>
            <h2
              style={{
                fontSize: '10px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: primaryColor,
                marginBottom: '10px',
                paddingBottom: '4px',
                borderBottom: `2px solid ${primaryColor}`,
              }}
            >
              Contact
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {profile.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '600' }}>Email:</span>
                  <a
                    href={`mailto:${profile.email}`}
                    style={{ color: primaryColor, textDecoration: 'none' }}
                  >
                    {profile.email}
                  </a>
                </div>
              )}
              {about?.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '600' }}>Location:</span>
                  <span>{about.location}</span>
                </div>
              )}
              {socialLinks.map((link, idx) => (
                <div
                  key={idx}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span style={{ fontWeight: '600' }}>{link.platform}:</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: primaryColor, textDecoration: 'none' }}
                  >
                    {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* SKILLS */}
          {skills && skills.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <h2
                style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: primaryColor,
                  marginBottom: '10px',
                  paddingBottom: '4px',
                  borderBottom: `2px solid ${primaryColor}`,
                }}
              >
                Skills
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {skills.map((skill, idx) => (
                  <div key={idx}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontWeight: '500' }}>{skill.name}</span>
                    </div>
                    {skill.proficiency !== null && (
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div
                            key={dot}
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor:
                                dot <= (skill.proficiency || 0)
                                  ? primaryColor
                                  : isAtsMode
                                  ? '#ffffff'
                                  : '#cbd5e1',
                              border: isAtsMode ? '1px solid #000000' : 'none',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {education && education.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <h2
                style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: primaryColor,
                  marginBottom: '10px',
                  paddingBottom: '4px',
                  borderBottom: `2px solid ${primaryColor}`,
                }}
              >
                Education
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{ fontWeight: '700', fontSize: '11px' }}>
                      {edu.institution}
                    </div>
                    <div style={{ color: primaryColor, fontWeight: '500' }}>
                      {edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}
                    </div>
                    <div style={{ color: mutedTextColor, fontSize: '10px' }}>
                      {edu.start_year} — {edu.end_year || 'Present'}
                    </div>
                    {edu.gpa && (
                      <div style={{ fontSize: '10px', marginTop: '2px' }}>
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* MAIN */}
        <main style={{ flex: '1', padding: '24px 24px 24px 28px' }}>
          {/* PROFILE / ABOUT */}
          {about?.bio && (
            <section style={{ marginBottom: '24px' }}>
              <h2
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: textColor,
                  marginBottom: '12px',
                  paddingBottom: '6px',
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                Professional Profile
              </h2>
              <p
                style={{
                  margin: 0,
                  lineHeight: '1.6',
                  color: textColor,
                  fontSize: '11px',
                }}
              >
                {about.bio}
              </p>
            </section>
          )}

          {/* EXPERIENCE */}
          {experiences && experiences.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <h2
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: textColor,
                  marginBottom: '12px',
                  paddingBottom: '6px',
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                Work Experience
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {experiences.map((exp, idx) => (
                  <div key={idx}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '2px',
                      }}
                    >
                      <span style={{ fontWeight: '700', fontSize: '12px' }}>
                        {exp.company_name}
                      </span>
                      <span
                        style={{
                          color: mutedTextColor,
                          fontSize: '10px',
                          fontWeight: '500',
                        }}
                      >
                        {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                      </span>
                    </div>
                    <div
                      style={{
                        color: primaryColor,
                        fontWeight: '600',
                        marginBottom: '6px',
                      }}
                    >
                      {exp.role}
                    </div>
                    {exp.description && (
                      <p
                        style={{
                          margin: '0 0 8px 0',
                          lineHeight: '1.5',
                          color: mutedTextColor,
                          fontSize: '10.5px',
                        }}
                      >
                        {exp.description}
                      </p>
                    )}
                    {exp.tech_stack && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {exp.tech_stack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              backgroundColor: chipBg,
                              color: primaryColor,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '9px',
                              fontWeight: '500',
                              border: chipBorder,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {projects && projects.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <h2
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: textColor,
                  marginBottom: '12px',
                  paddingBottom: '6px',
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                Featured Projects
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {projects.filter(p => !isAtsMode || p.is_featured).map((project, idx) => (
                  <div key={idx}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontWeight: '700', fontSize: '12px' }}>
                        {project.title}
                      </span>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: primaryColor,
                              textDecoration: 'none',
                              fontSize: '10px',
                              fontWeight: '500',
                            }}
                          >
                            Live Demo
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
                              fontSize: '10px',
                              fontWeight: '500',
                            }}
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                    {project.description && (
                      <p
                        style={{
                          margin: '0 0 6px 0',
                          lineHeight: '1.5',
                          color: mutedTextColor,
                          fontSize: '10.5px',
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
                              color: primaryColor,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '9px',
                              fontWeight: '500',
                              border: chipBorder,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* AWARDS & CERTIFICATIONS (Side by Side or stacked) */}
          <div style={{ display: 'flex', gap: '24px' }}>
            {certifications && certifications.length > 0 && (
              <section style={{ flex: 1 }}>
                <h2
                  style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: textColor,
                    marginBottom: '12px',
                    paddingBottom: '6px',
                    borderBottom: `1px solid ${borderColor}`,
                  }}
                >
                  Certifications
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {certifications.map((cert, idx) => (
                    <div key={idx}>
                      <div style={{ fontWeight: '700' }}>{cert.name}</div>
                      <div style={{ color: mutedTextColor, fontSize: '10px' }}>
                        {cert.issuer} • {cert.issue_date}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {awards && awards.length > 0 && (
              <section style={{ flex: 1 }}>
                <h2
                  style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: textColor,
                    marginBottom: '12px',
                    paddingBottom: '6px',
                    borderBottom: `1px solid ${borderColor}`,
                  }}
                >
                  Awards
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {awards.map((award, idx) => (
                    <div key={idx}>
                      <div style={{ fontWeight: '700' }}>{award.title}</div>
                      <div style={{ color: mutedTextColor, fontSize: '10px' }}>
                        {award.issuer} • {award.date}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
