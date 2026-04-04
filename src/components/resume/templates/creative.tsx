import React from 'react';
import { ResumeData } from '@/types/resume';

interface CreativeTemplateProps {
  data: ResumeData;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data }) => {
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

  // Theme variables
  const primaryColor = isAtsMode ? '#1e293b' : '#f97316';
  const headerBg = isAtsMode 
    ? '#1e293b' 
    : 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)';
  const sectionHeadingStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: primaryColor,
    marginBottom: '12px',
    paddingBottom: '4px',
    borderBottom: `2px solid ${primaryColor}`,
  };

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return '🔗';
    if (p.includes('github')) return '🐙';
    if (p.includes('twitter') || p.includes('x')) return '🐦';
    return '🌐';
  };

  return (
    <div
      id="resume-creative"
      style={{
        width: '794px',
        minHeight: '1123px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '11px',
        color: '#1e293b',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        position: 'relative',
        margin: '0 auto',
      }}
    >
      <link 
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" 
        rel="stylesheet" 
      />

      {/* HEADER */}
      <header
        style={{
          background: headerBg,
          padding: '32px 36px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          color: '#ffffff',
        }}
      >
        {includePhoto && profile.avatar_url && (
          <img
            src={profile.avatar_url}
            alt={profile.full_name || 'Profile'}
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid rgba(255,255,255,0.4)',
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '30px',
              fontWeight: '800',
              margin: '0 0 4px 0',
              letterSpacing: '-0.5px',
              color: '#ffffff',
            }}
          >
            {profile.full_name || 'Your Name'}
          </h1>
          {hero?.headline && (
            <p
              style={{
                fontSize: '13px',
                opacity: '0.9',
                margin: '0 0 12px 0',
                fontWeight: '500',
              }}
            >
              {hero.headline}
            </p>
          )}

          {/* CONTACT INFO */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {profile.email && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  opacity: '0.85',
                  marginRight: '16px',
                }}
              >
                <span>📧</span>
                <a
                  href={`mailto:${profile.email}`}
                  style={{ color: '#ffffff', textDecoration: 'none' }}
                >
                  {profile.email}
                </a>
              </div>
            )}
            {about?.location && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  opacity: '0.85',
                  marginRight: '16px',
                }}
              >
                <span>📍</span>
                <span>{about.location}</span>
              </div>
            )}
            {socialLinks.map((link, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  opacity: '0.85',
                  marginRight: '16px',
                }}
              >
                <span>{getSocialIcon(link.platform)}</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#ffffff', textDecoration: 'none' }}
                >
                  {link.platform}
                </a>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: 'flex', flex: '1' }}>
        {/* LEFT COLUMN (60%) */}
        <div style={{ width: '60%', padding: '24px 20px 24px 28px' }}>
          {/* EXPERIENCE */}
          {experiences && experiences.length > 0 && (
            <section style={{ marginBottom: '28px' }}>
              <h2 style={sectionHeadingStyle}>Work Experience</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {experiences.map((exp, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', fontSize: '12px' }}>{exp.role}</span>
                      <span style={{ color: '#64748b', fontSize: '10px', fontWeight: '500' }}>
                        {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                      </span>
                    </div>
                    <div style={{ color: primaryColor, fontWeight: '600', marginBottom: '8px' }}>
                      {exp.company_name}
                    </div>
                    {exp.description && (
                      <p style={{ margin: '0 0 8px 0', lineHeight: '1.5', color: '#475569', fontSize: '10.5px' }}>
                        {exp.description}
                      </p>
                    )}
                    {exp.tech_stack && exp.tech_stack.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {exp.tech_stack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              backgroundColor: isAtsMode ? 'transparent' : '#fff7ed',
                              color: primaryColor,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '9px',
                              fontWeight: '600',
                              border: isAtsMode ? '1px solid #e2e8f0' : 'none',
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
            <section style={{ marginBottom: '28px' }}>
              <h2 style={sectionHeadingStyle}>Featured Projects</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {projects.map((project, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <a
                        href={project.live_url || project.github_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontWeight: '700', fontSize: '12px', color: primaryColor, textDecoration: 'none' }}
                      >
                        {project.title}
                      </a>
                    </div>
                    {project.description && (
                      <p style={{ margin: '0 0 6px 0', lineHeight: '1.5', color: '#475569', fontSize: '10.5px' }}>
                        {project.description}
                      </p>
                    )}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {project.tech_stack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              color: '#64748b',
                              fontSize: '9px',
                              fontWeight: '500',
                            }}
                          >
                            #{tech}{tIdx < project.tech_stack!.length - 1 ? ' ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN (40%) */}
        <div style={{ width: '40%', padding: '24px 20px', backgroundColor: '#fafafa', borderLeft: '1px solid #f1f5f9' }}>
          {/* SKILLS */}
          {skills && skills.length > 0 && (
            <section style={{ marginBottom: '28px' }}>
              <h2 style={sectionHeadingStyle}>Expertise</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {skills.map((skill, idx) => (
                  <div key={idx} style={{ marginBottom: isAtsMode ? '2px' : '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '600' }}>{skill.name}</span>
                    </div>
                    {!isAtsMode && skill.proficiency !== null && (
                      <div style={{ height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '4px',
                            width: `${(skill.proficiency / 5) * 100}%`,
                            backgroundColor: primaryColor,
                            borderRadius: '2px',
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {education && education.length > 0 && (
            <section style={{ marginBottom: '28px' }}>
              <h2 style={sectionHeadingStyle}>Education</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{ fontWeight: '700', fontSize: '11px', marginBottom: '2px' }}>
                      {edu.institution}
                    </div>
                    <div style={{ color: '#475569', fontSize: '10px' }}>
                      {edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '9px', marginTop: '2px' }}>
                      {edu.start_year} — {edu.end_year || 'Present'}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS */}
          {certifications && certifications.length > 0 && (
            <section style={{ marginBottom: '28px' }}>
              <h2 style={sectionHeadingStyle}>Certifications</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {certifications.map((cert, idx) => (
                  <div key={idx}>
                    <div style={{ fontWeight: '600', fontSize: '10.5px' }}>{cert.name}</div>
                    <div style={{ color: '#64748b', fontSize: '9.5px' }}>
                      {cert.issuer} • {cert.issue_date}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* AWARDS */}
          {awards && awards.length > 0 && (
            <section>
              <h2 style={sectionHeadingStyle}>Awards</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {awards.map((award, idx) => (
                  <div key={idx}>
                    <div style={{ fontWeight: '600', fontSize: '10.5px' }}>{award.title}</div>
                    <div style={{ color: '#64748b', fontSize: '9.5px' }}>
                      {award.issuer} • {award.date}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
