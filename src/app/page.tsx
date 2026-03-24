import Link from "next/link";
import {
  MessageSquare,
  FileSearch,
  ShieldCheck,
  Clock,
  BarChart3,
  FileText,
  ArrowRight,
  CheckCircle2,
  Scale,
  Sword,
  Shield,
  Brain,
  Target,
  Users,
  Gavel,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Legal Intake",
    description:
      "Tell Atticus what happened. Atticus asks the right questions, just like a senior partner would during a first consultation.",
  },
  {
    icon: FileSearch,
    title: "Evidence Analysis & Tagging",
    description:
      "Upload contracts, emails, WhatsApp chats, and documents. Atticus extracts, tags, and organises every key fact automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Forensic Verification",
    description:
      "Every document is forensically checked — dates cross-referenced, signatures verified, technical defects flagged before opposing counsel finds them.",
  },
  {
    icon: Brain,
    title: "Strategic Intelligence",
    description:
      "Atticus doesn\u2019t just build your case \u2014 it analyses the opponent\u2019s position, predicts their strategy, and creates a battle plan.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Strength Rating",
    description:
      "Watch your case strength build as you talk. Get an objective assessment with actionable insights to improve your position.",
  },
  {
    icon: Target,
    title: "Attack & Defence Plans",
    description:
      "Whether you\u2019re serving or being served, Atticus creates a meticulous legal strategy \u2014 down to the timing of every move.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell Your Story",
    description: "Pick your country and start talking. No legal knowledge needed \u2014 Atticus works it out.",
  },
  {
    number: "02",
    title: "Upload Everything",
    description: "Contracts, emails, WhatsApp chats, photos. Connect Gmail. Atticus analyses it all.",
  },
  {
    number: "03",
    title: "Atticus Builds Your Case",
    description: "Atticus analyses evidence, researches case law, identifies causes of action, and rates your strength.",
  },
  {
    number: "04",
    title: "Get Your Documents",
    description: "Receive a professional LBA or defence response, full evidence pack, witness statements, and strategic plan.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Scale className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-primary">Atticus</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-text-light hover:text-text transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-colors"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6">
              <Scale className="h-4 w-4" />
              Your AI Legal Partner
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary tracking-tight leading-[1.1]">
              Meet Atticus.{" "}
              <span className="text-accent">The Smartest Lawyer You&apos;ve Never Met.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-text-light max-w-2xl mx-auto leading-relaxed">
              Whether you&apos;re making a claim or defending one, Atticus builds
              partner-level legal cases at a fraction of the cost. Tell Atticus what
              happened &mdash; Atticus handles the rest.
            </p>

            {/* Two CTAs: Claim or Defend */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
              >
                <Sword className="h-5 w-5" />
                I Want to Claim
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-primary rounded-xl border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <Shield className="h-5 w-5" />
                I Need to Defend
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* Attack vs Defence Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Claim or Defend. Atticus Does Both.
            </h2>
            <p className="mt-4 text-lg text-text-light max-w-2xl mx-auto">
              The same rigorous AI analysis, whether you&apos;re on the attack or building your defence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Attack Mode */}
            <div className="bg-surface rounded-2xl border border-border p-8 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Sword className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text mb-3">&ldquo;I want to serve&rdquo;</h3>
              <p className="text-text-light mb-6">
                You&apos;ve been wronged and want to take action. Atticus builds your
                claim from the ground up.
              </p>
              <ul className="space-y-3">
                {[
                  "Just tell Atticus your story",
                  "Evidence analysis, tagging & forensic checks",
                  "Cause of action identification with case law",
                  "Professional Letter Before Action (LBA)",
                  "Full evidence pack with strategic timeline",
                  "Attack strategy — timing, sequencing, pressure points",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text">
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Defence Mode */}
            <div className="bg-surface rounded-2xl border border-border p-8 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-text mb-3">&ldquo;I have been served&rdquo;</h3>
              <p className="text-text-light mb-6">
                You&apos;ve received a claim or legal letter and need to respond.
                Atticus analyses their position and builds your defence.
              </p>
              <ul className="space-y-3">
                {[
                  "Upload the claim or letter you received",
                  "Atticus analyses the opposing side\u2019s strategy and weaknesses",
                  "Identifies where their evidence is thin or flawed",
                  "Builds counter-arguments with supporting case law",
                  "Generates a professional defence response",
                  "Defence strategy — what to concede, what to fight, when to respond",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Partner-Level Intelligence. Built In.
            </h2>
            <p className="mt-4 text-lg text-text-light max-w-2xl mx-auto">
              Nine specialist agents working together to build the strongest possible case,
              whether you&apos;re claiming or defending.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-8 bg-white rounded-2xl border border-border hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">{feature.title}</h3>
                <p className="text-text-light leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              How Atticus Works
            </h2>
            <p className="mt-4 text-lg text-text-light">
              Four simple steps. No legal knowledge required.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-surface rounded-2xl p-8 border border-border h-full">
                  <span className="text-4xl font-bold text-accent/20">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-semibold text-text mt-4 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-text-light">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Claim Output */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              See What Atticus Produces
            </h2>
            <p className="mt-4 text-lg text-text-light max-w-2xl mx-auto">
              Here&apos;s an example of a real claim built by Atticus &mdash; from intake to
              Letter Before Action. This is what partner-level output looks like.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="flex border-b border-border overflow-x-auto">
              {["Claim Summary", "Evidence Tags", "Strength Analysis", "Letter Before Action"].map((tab, i) => (
                <div
                  key={tab}
                  className={`px-6 py-4 text-sm font-semibold whitespace-nowrap ${i === 0 ? "bg-white text-primary border-b-2 border-accent" : "text-text-light hover:text-text"}`}
                >
                  {tab}
                </div>
              ))}
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">Example Claim</span>
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      Breach of Employment Contract &mdash; Wrongful Termination
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">England &amp; Wales</span>
                      <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">Employment Law</span>
                      <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">Strong Claim</span>
                    </div>
                  </div>

                  {/* Facts Summary */}
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Atticus-Compiled Facts Summary
                    </h4>
                    <div className="text-sm text-text leading-relaxed space-y-3">
                      <p>
                        The claimant was employed as a Senior Software Engineer from March 2022 under a
                        written contract providing for a 3-month notice period. On 15 January 2025, the
                        claimant was summarily dismissed without notice, allegedly for &quot;gross misconduct&quot;
                        relating to a client complaint.
                      </p>
                      <p>
                        Evidence analysis reveals the client complaint was filed 6 weeks after the
                        claimant raised a formal grievance about unpaid overtime. WhatsApp messages
                        between management show discussion of &quot;finding a reason&quot; to terminate the
                        claimant. The disciplinary process did not follow the ACAS Code of Practice.
                      </p>
                    </div>
                  </div>

                  {/* Causes of Action */}
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <Gavel className="h-4 w-4" />
                      Causes of Action Identified
                    </h4>
                    <div className="space-y-3">
                      {[
                        { name: "Wrongful Dismissal", strength: "Strong", elements: "4/4 elements satisfied", colour: "text-success" },
                        { name: "Unfair Dismissal (ERA 1996, s.98)", strength: "Strong", elements: "All procedural failures documented", colour: "text-success" },
                        { name: "Whistleblower Retaliation (ERA 1996, s.47B)", strength: "Moderate", elements: "3/4 elements \u2014 protected disclosure arguable", colour: "text-warning" },
                        { name: "Breach of Contract (Notice Period)", strength: "Strong", elements: "Contract term clear, no valid basis for summary dismissal", colour: "text-success" },
                      ].map((action) => (
                        <div key={action.name} className="flex items-start justify-between p-3 bg-white rounded-lg border border-border">
                          <div>
                            <p className="text-sm font-medium text-text">{action.name}</p>
                            <p className="text-xs text-text-light mt-0.5">{action.elements}</p>
                          </div>
                          <span className={`text-xs font-semibold ${action.colour}`}>{action.strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Remedies */}
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Available Remedies
                    </h4>
                    <div className="space-y-2">
                      {[
                        { remedy: "Damages for wrongful dismissal (notice period)", value: "\u00A321,250", likelihood: "High" },
                        { remedy: "Compensatory award (loss of earnings)", value: "\u00A325,000 \u2013 \u00A345,000", likelihood: "High" },
                        { remedy: "Injury to feelings (if whistleblowing established)", value: "\u00A39,900 \u2013 \u00A333,700", likelihood: "Medium" },
                        { remedy: "Unpaid overtime claim", value: "\u00A312,400", likelihood: "High" },
                        { remedy: "ACAS uplift (failure to follow Code)", value: "Up to 25% increase", likelihood: "High" },
                      ].map((r) => (
                        <div key={r.remedy} className="flex items-center justify-between p-3 bg-white rounded-lg border border-border">
                          <p className="text-sm text-text flex-1">{r.remedy}</p>
                          <div className="flex items-center gap-4 ml-4">
                            <span className="text-sm font-semibold text-primary whitespace-nowrap">{r.value}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.likelihood === "High" ? "bg-success/10 text-success" : "bg-amber-100 text-amber-700"}`}>
                              {r.likelihood}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">Total Estimated Recovery</span>
                        <span className="text-lg font-bold text-primary">&pound;68,550 &mdash; &pound;112,350</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Strength Score */}
                  <div className="bg-surface rounded-xl p-6 border border-border text-center">
                    <h4 className="text-sm font-semibold text-primary mb-4">Claim Strength</h4>
                    <div className="relative w-40 h-20 mx-auto mb-3">
                      <svg viewBox="0 0 200 100" className="w-full h-full">
                        <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
                        <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="url(#sg)" strokeWidth="12" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.82)} />
                        <defs>
                          <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#EF4444" />
                            <stop offset="50%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#10B981" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-end justify-center pb-0">
                        <span className="text-3xl font-bold text-primary">82</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-success">Strong Claim</span>
                    <div className="mt-4 space-y-2">
                      {[
                        { label: "Facts", score: 88 },
                        { label: "Evidence", score: 79 },
                        { label: "Legal Basis", score: 85 },
                        { label: "Remedy Likelihood", score: 76 },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-text-light">{item.label}</span>
                            <span className="font-medium text-text">{item.score}</span>
                          </div>
                          <div className="h-1.5 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${item.score}%`,
                                backgroundColor: item.score >= 75 ? '#10B981' : item.score >= 50 ? '#F59E0B' : '#EF4444'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Case Timeline
                    </h4>
                    <div className="relative pl-4 border-l-2 border-accent/30 space-y-4">
                      {[
                        { date: "Mar 2022", event: "Employment commenced", type: "normal" },
                        { date: "2 Dec 2024", event: "Formal grievance filed", type: "legal" },
                        { date: "10 Jan 2025", event: "Disciplinary letter drafted (metadata)", type: "critical" },
                        { date: "12 Jan 2025", event: "WhatsApp: \u2018find a reason\u2019", type: "critical" },
                        { date: "15 Jan 2025", event: "Summary dismissal without notice", type: "critical" },
                      ].map((event) => (
                        <div key={event.date + event.event} className="relative">
                          <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 border-white ${event.type === "critical" ? "bg-danger" : event.type === "legal" ? "bg-accent" : "bg-text-light/50"}`} />
                          <p className="text-[10px] font-semibold text-text-light">{event.date}</p>
                          <p className="text-xs text-text">{event.event}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Forensic */}
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Forensic Findings
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs font-semibold text-amber-800">\u26A0 Date Mismatch</p>
                        <p className="text-xs text-amber-700 mt-0.5">Disciplinary letter metadata shows creation before investigation concluded</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs font-semibold text-green-800">\u2713 Contract Properly Executed</p>
                        <p className="text-xs text-green-700 mt-0.5">Both signatures present, dates consistent</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-text-light mb-4">This level of analysis would typically cost &pound;3,000 &mdash; &pound;5,000 with a law firm.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20"
            >
              Build Your Case Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lawyer Marketplace Teaser */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            Coming Soon
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            Need a Solicitor? Let Them Come to You.
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto mb-10">
            Once Atticus has built your case, put it on the marketplace. Vetted law firms
            from your jurisdiction bid with fixed-fee quotes. You choose who represents you &mdash;
            with full transparency on cost.
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-surface rounded-2xl p-8 border border-border">
            <div className="text-left">
              {[
                "Atticus builds 80% of the case",
                "Vetted solicitors bid with fixed fees",
                "No hourly billing surprises",
                "Full transparency on costs and outcomes",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-text mb-2">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-border pt-6 sm:pt-0 sm:pl-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20"
              >
                Start Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark text-white/70 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-white/50" />
              <span className="text-lg font-bold text-white">Atticus</span>
            </div>
            <p className="text-sm text-center md:text-right max-w-lg">
              Atticus provides legal document preparation assistance. This is not
              legal advice. For specific legal matters, please consult a qualified
              solicitor or barrister in your jurisdiction.
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm">
            &copy; 2026 Atticus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
