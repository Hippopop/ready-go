import Link from 'next/link';
import { 
  Rocket, 
  Monitor, 
  Palette, 
  FileText, 
  ChevronRight,
  CheckCircle2,
  Mail,
  Terminal
} from 'lucide-react';

const UserIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CodeIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const FolderIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
  </svg>
);

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--border-radius-sm)] bg-linear-to-br from-primary to-primary/60 text-primary-foreground shadow-lg shadow-primary/20">
              <Rocket size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Ready-Go
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#templates" className="text-muted-foreground hover:text-primary transition-colors">Templates</Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-all duration-200"
            >
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="hidden sm:inline-flex px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-[var(--border-radius)] hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-40">
            <div className="absolute top-[-10%] left-[10%] w-[40%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute bottom-0 right-[5%] w-[35%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--border-radius-sm)] bg-primary/5 border border-primary/10 text-primary text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v1.0 is now live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 italic!">
              Build a portfolio that <br className="hidden md:block" /> 
              <span className="bg-linear-to-r from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent italic!">gets you hired.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
              Ready-Go is the all-in-one portfolio generator designed specifically for software engineers. 
              Manage your career content, choose a theme, and hit deploy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Link 
                href="/signup" 
                className="group w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-[var(--border-radius)] text-lg font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start building for free
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#demo" 
                className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground border border-border rounded-[var(--border-radius)] text-lg font-semibold hover:bg-accent transition-all duration-300"
              >
                View Live Demo
              </Link>
            </div>

            {/* Mockup Preview */}
            <div className="mt-16 md:mt-24 relative mx-auto max-w-5xl rounded-[var(--border-radius)] border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-1000 delay-500">
               <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/30" />
                    <div className="w-3 h-3 rounded-full bg-warning/30" />
                    <div className="w-3 h-3 rounded-full bg-success/30" />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">ready-go preview</div>
                  <div className="w-12 h-2 rounded bg-border" />
               </div>
               <div className="aspect-video bg-linear-to-br from-card to-muted flex items-center justify-center p-8 group">
                  <div className="text-center">
                    <p className="text-sm font-medium text-primary mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Interactive Preview</p>
                    <div className="flex items-center justify-center gap-4 scale-110">
                      <div className="p-4 rounded-[var(--border-radius-sm)] bg-background border border-border shadow-md">
                        <UserIcon size={32} className="text-primary" />
                      </div>
                      <div className="p-4 rounded-[var(--border-radius-sm)] bg-background border border-border shadow-md">
                        <CodeIcon size={32} className="text-primary" />
                      </div>
                      <div className="p-4 rounded-[var(--border-radius-sm)] bg-background border border-border shadow-md">
                        <FolderIcon size={32} className="text-primary" />
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Everything you need to showcase your talent</h2>
              <p className="text-muted-foreground">Focus on your code. We handle the presentation and SEO infrastructure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-[var(--border-radius)] border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Monitor size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Sleek Dashboard</h3>
                <p className="text-muted-foreground leading-relaxed">A specialized admin panel to manage every pixel of your site without writing a single line of CSS.</p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-[var(--border-radius)] border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Palette size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Theme Engine</h3>
                <p className="text-muted-foreground leading-relaxed">Customize colors, typography, and spacing with live previews. Switch between dark and light modes instantly.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-[var(--border-radius)] border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Resume Sync</h3>
                <p className="text-muted-foreground leading-relaxed">Generate PDF resumes directly from your portfolio content. Keep your site and CV synced perfectly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* List items section */}
        <section className="py-24 container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                 <h2 className="text-4xl font-bold mb-8 italic!">Built for the modern <br /> software engineer.</h2>
                 <ul className="space-y-4">
                    {[
                      "Dynamic Project Showcases",
                      "Skill Proficiency Visualization",
                      "Automated PDF Resume Generation",
                      "Open Source Contribution Tracking",
                      "Built-in Blogging Engine",
                      "SEO Optimized out of the box"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                         <div className="shrink-0 text-primary">
                            <CheckCircle2 size={20} />
                         </div>
                         <span className="text-foreground font-medium">{item}</span>
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="relative aspect-square rounded-[var(--border-radius)] bg-linear-to-br from-primary/20 to-primary/5 overflow-hidden border border-border p-8">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)] opacity-10" />
                 <div className="h-full w-full rounded-[var(--border-radius)] bg-card border border-border shadow-xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                       <h4 className="font-bold text-lg">Live Preview</h4>
                       <div className="flex gap-2">
                       <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground"><Terminal size={16} /></div>
                       <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground"><Mail size={16} /></div>
                    </div>
                    </div>
                    <div className="space-y-4 flex-1">
                       <div className="h-2 w-2/3 bg-primary/20 rounded" />
                       <div className="h-2 w-full bg-muted rounded" />
                       <div className="h-2 w-full bg-muted rounded" />
                       <div className="h-2 w-4/5 bg-muted rounded" />
                       <div className="h-2 w-2/3 bg-primary/20 rounded-[var(--border-radius-sm)]" />
                       <div className="h-2 w-full bg-muted rounded-[var(--border-radius-sm)]" />
                       <div className="h-2 w-full bg-muted rounded-[var(--border-radius-sm)]" />
                       <div className="h-2 w-4/5 bg-muted rounded-[var(--border-radius-sm)]" />
                       
                       <div className="pt-8 grid grid-cols-3 gap-3">
                          {[1, 2, 3].map(i => <div key={i} className="aspect-square bg-muted rounded-[var(--border-radius)] animate-pulse" />)}
                       </div>
                    </div>
                    <div className="mt-auto flex justify-end">
                       <div className="px-4 py-2 bg-primary text-primary-foreground rounded-[var(--border-radius)] text-xs font-bold">Contact Me</div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="flex items-center gap-2">
                <Rocket size={20} className="text-primary" />
                <span className="font-bold tracking-tight">Ready-Go</span>
             </div>
             <div className="flex gap-8 text-sm text-muted-foreground">
                <Link href="#" className="hover:text-primary">Twitter</Link>
                <Link href="#" className="hover:text-primary">GitHub</Link>
                <Link href="#" className="hover:text-primary">Privacy</Link>
                <Link href="#" className="hover:text-primary">Terms</Link>
             </div>
             <p className="text-sm text-muted-foreground opacity-70">
                © {new Date().getFullYear()} Ready-Go. Built for engineers.
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
