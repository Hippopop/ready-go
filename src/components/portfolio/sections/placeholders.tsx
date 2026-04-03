const Placeholder = ({ name }: { name: string }) => (
  <div className="py-12 border-2 border-dashed border-app-text/10 rounded-xl flex items-center justify-center text-app-text/40 font-body">
    {name} Section Placeholder (Agent A is building this...)
  </div>
);

export const SkillsSection = () => <Placeholder name="Skills" />;
export const EducationSection = () => <Placeholder name="Education" />;
export const CertificationsSection = () => <Placeholder name="Certifications" />;
export const TestimonialsSection = () => <Placeholder name="Testimonials" />;
export const BlogSection = () => <Placeholder name="Blog" />;
export const AwardsSection = () => <Placeholder name="Awards" />;
export const OpenSourceSection = () => <Placeholder name="Open Source" />;
