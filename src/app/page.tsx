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
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Intake",
    description:
      "Conversational AI guides you through telling your story, asking the right questions a solicitor would ask.",
  },
  {
    icon: FileSearch,
    title: "Evidence Analysis",
    description:
      "Upload contracts, emails, photos, and messages. Our AI extracts and organizes key facts automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Forensic Verification",
    description:
      "Metadata analysis and authenticity checks ensure your evidence is credible and court-ready.",
  },
  {
    icon: Clock,
    title: "Visual Timeline",
    description:
      "See your case unfold chronologically with an interactive timeline linking events to evidence.",
  },
  {
    icon: BarChart3,
    title: "Claim Strength Rating",
    description:
      "Get an objective assessment of your claim strength with actionable insights to improve it.",
  },
  {
    icon: FileText,
    title: "LBA Generation",
    description:
      "Generate a professional Letter Before Action that meets legal standards for your jurisdiction.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell Your Story",
    description: "Our AI asks targeted questions to understand your situation fully.",
  },
  {
    number: "02",
    title: "Upload Evidence",
    description: "Drop in contracts, messages, photos, and documents.",
  },
  {
    number: "03",
    title: "AI Analyzes",
    description: "We identify legal issues, map evidence to facts, and assess strength.",
  },
  {
    number: "04",
    title: "Get Your Claim",
    description: "Receive a structured legal claim and Letter Before Action.",
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
              <span className="text-xl font-bold text-primary">ClaimCraft AI</span>
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
              <ShieldCheck className="h-4 w-4" />
              AI-Powered Legal Claim Creation
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary tracking-tight leading-[1.1]">
              Partner-Level Legal Claims.{" "}
              <span className="text-accent">Without the Partner-Level Fees.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-text-light max-w-2xl mx-auto leading-relaxed">
              Democratizing access to justice. Our AI guides you through building a
              structured legal claim with evidence analysis, strength assessment, and
              professional document generation.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
              >
                Start Your Claim
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-text-light hover:text-text rounded-xl border border-border hover:border-primary/30 transition-all"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
        {/* Decorative gradient */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Everything You Need to Build a Strong Claim
            </h2>
            <p className="mt-4 text-lg text-text-light max-w-2xl mx-auto">
              Professional legal tools powered by AI, designed for individuals and small
              businesses seeking justice.
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
      <section id="how-it-works" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-text-light">
              Four simple steps from story to structured legal claim.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-white rounded-2xl p-8 border border-border h-full">
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              See What You Get
            </h2>
            <p className="mt-4 text-lg text-text-light max-w-2xl mx-auto">
              Here&apos;s an example of a real claim built by ClaimCraft AI — from intake to
              Letter Before Action. This is what partner-level output looks like.
            </p>
          </div>

          {/* Tabbed Example */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            {/* Tab Header */}
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

            {/* Example Content — Claim Summary */}
            <div className="p-8 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left — Claim Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">Example Claim</span>
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      Breach of Employment Contract — Wrongful Termination
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
                      AI-Compiled Facts Summary
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
                      <p>
                        The claimant has suffered financial loss of approximately &pound;45,000 in lost
                        salary and benefits during the notice period, plus ongoing loss of earnings
                        estimated at &pound;8,500 per month.
                      </p>
                    </div>
                  </div>

                  {/* Causes of Action */}
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Causes of Action Identified
                    </h4>
                    <div className="space-y-3">
                      {[
                        { name: "Wrongful Dismissal", strength: "Strong", elements: "4/4 elements satisfied", color: "text-success" },
                        { name: "Unfair Dismissal (ERA 1996, s.98)", strength: "Strong", elements: "All procedural failures documented", color: "text-success" },
                        { name: "Whistleblower Retaliation (ERA 1996, s.47B)", strength: "Moderate", elements: "3/4 elements — protected disclosure arguable", color: "text-warning" },
                        { name: "Breach of Contract (Notice Period)", strength: "Strong", elements: "Contract term clear, no valid basis for summary dismissal", color: "text-success" },
                      ].map((action) => (
                        <div key={action.name} className="flex items-start justify-between p-3 bg-white rounded-lg border border-border">
                          <div>
                            <p className="text-sm font-medium text-text">{action.name}</p>
                            <p className="text-xs text-text-light mt-0.5">{action.elements}</p>
                          </div>
                          <span className={`text-xs font-semibold ${action.color}`}>{action.strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tagged Evidence */}
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <FileSearch className="h-4 w-4" />
                      Evidence Analysis &amp; Tags
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          file: "Employment_Contract.pdf",
                          type: "Contract",
                          tags: ["3-month notice", "Gross misconduct clause", "Grievance procedure", "£85,000 salary"],
                          tagColors: ["bg-blue-100 text-blue-700", "bg-red-100 text-red-700", "bg-purple-100 text-purple-700", "bg-green-100 text-green-700"],
                          forensic: null
                        },
                        {
                          file: "WhatsApp_Management_Group.txt",
                          type: "WhatsApp Export",
                          tags: ["Admission: 'find a reason'", "Timeline: 3 days after grievance", "Party: HR Director", "Threat: 'make it difficult'"],
                          tagColors: ["bg-red-100 text-red-700", "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-red-100 text-red-700"],
                          forensic: null
                        },
                        {
                          file: "Disciplinary_Letter.pdf",
                          type: "Letter",
                          tags: ["Date: 15 Jan 2025", "No prior warnings", "Missing: right of appeal"],
                          tagColors: ["bg-blue-100 text-blue-700", "bg-amber-100 text-amber-700", "bg-red-100 text-red-700"],
                          forensic: "⚠ Forensic Finding: Letter dated 15 Jan but metadata shows creation date of 10 Jan — drafted before the investigation concluded"
                        },
                        {
                          file: "Email_Thread_Grievance.eml",
                          type: "Email",
                          tags: ["Grievance filed: 2 Dec 2024", "Overtime claim: £12,400", "No response within 5 days", "Commitment: 'we will investigate'"],
                          tagColors: ["bg-blue-100 text-blue-700", "bg-green-100 text-green-700", "bg-amber-100 text-amber-700", "bg-purple-100 text-purple-700"],
                          forensic: null
                        },
                      ].map((evidence) => (
                        <div key={evidence.file} className="p-3 bg-white rounded-lg border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-text-light" />
                              <span className="text-sm font-medium text-text">{evidence.file}</span>
                            </div>
                            <span className="text-xs text-text-light">{evidence.type}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-1">
                            {evidence.tags.map((tag, i) => (
                              <span key={tag} className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${evidence.tagColors[i]}`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                          {evidence.forensic && (
                            <div className="mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                              <p className="text-xs text-amber-800">{evidence.forensic}</p>
                            </div>
                          )}
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
                        { remedy: "Damages for wrongful dismissal (notice period)", value: "£21,250", likelihood: "High" },
                        { remedy: "Compensation for unfair dismissal (basic award)", value: "£4,500 - £6,750", likelihood: "High" },
                        { remedy: "Compensatory award (loss of earnings)", value: "£25,000 - £45,000", likelihood: "High" },
                        { remedy: "Injury to feelings (if whistleblowing established)", value: "£9,900 - £33,700", likelihood: "Medium" },
                        { remedy: "Unpaid overtime claim", value: "£12,400", likelihood: "High" },
                        { remedy: "ACAS uplift (failure to follow Code)", value: "Up to 25% increase", likelihood: "High" },
                      ].map((r) => (
                        <div key={r.remedy} className="flex items-center justify-between p-3 bg-white rounded-lg border border-border">
                          <div className="flex-1">
                            <p className="text-sm text-text">{r.remedy}</p>
                          </div>
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
                        <span className="text-lg font-bold text-primary">&pound;73,050 — &pound;124,100</span>
                      </div>
                      <p className="text-xs text-text-light mt-1">
                        Cost-benefit analysis: Estimated legal costs of &pound;3,000 — &pound;8,000 vs. potential recovery.
                        Proceeding is commercially viable.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right — Strength Meter & Timeline */}
                <div className="space-y-6">
                  {/* Strength Score */}
                  <div className="bg-surface rounded-xl p-6 border border-border text-center">
                    <h4 className="text-sm font-semibold text-primary mb-4">Claim Strength</h4>
                    <div className="relative w-40 h-20 mx-auto mb-3">
                      <svg viewBox="0 0 200 100" className="w-full h-full">
                        <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
                        <path d="M 20 90 A 80 80 0 0 1 180 90" fill="none" stroke="url(#strength-gradient)" strokeWidth="12" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.82)} />
                        <defs>
                          <linearGradient id="strength-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                        <div key={item.label} className="text-left">
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

                  {/* Timeline Preview */}
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Case Timeline
                    </h4>
                    <div className="relative pl-4 border-l-2 border-accent/30 space-y-4">
                      {[
                        { date: "Mar 2022", event: "Employment commenced", type: "agreement" },
                        { date: "Nov 2024", event: "Unpaid overtime dispute raised informally", type: "communication" },
                        { date: "2 Dec 2024", event: "Formal grievance filed", type: "legal" },
                        { date: "10 Jan 2025", event: "Disciplinary letter drafted (metadata)", type: "critical" },
                        { date: "12 Jan 2025", event: "WhatsApp: 'find a reason'", type: "critical" },
                        { date: "14 Jan 2025", event: "Client complaint suddenly filed", type: "communication" },
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

                  {/* Forensic Summary */}
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Forensic Analysis
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs font-semibold text-amber-800">⚠ Date Mismatch Found</p>
                        <p className="text-xs text-amber-700 mt-0.5">Disciplinary letter metadata shows creation before investigation concluded</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs font-semibold text-green-800">✓ Contract Properly Executed</p>
                        <p className="text-xs text-green-700 mt-0.5">Both signatures present, dates consistent</p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs font-semibold text-blue-800">ℹ Missing Appeal Right</p>
                        <p className="text-xs text-blue-700 mt-0.5">Dismissal letter does not mention right to appeal — ACAS Code breach</p>
                      </div>
                    </div>
                  </div>

                  {/* Limitation Warning */}
                  <div className="bg-surface rounded-xl p-6 border border-border">
                    <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Limitation Period
                    </h4>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">68 days</p>
                      <p className="text-xs text-text-light mt-1">remaining to file ET1 claim</p>
                      <p className="text-xs text-text-light mt-0.5">(3 months less 1 day from dismissal)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-text-light mb-4">This level of analysis would typically cost &pound;3,000 — &pound;5,000 with a law firm.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/20"
            >
              Build Your Claim Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            Claims That Would Cost{" "}
            <span className="line-through text-text-light">&pound;5,000+</span>{" "}
            with a Law Firm
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto mb-10">
            Get structured, evidence-backed legal claims at a fraction of the cost.
            Our AI handles the heavy lifting that would otherwise require hours of
            solicitor time.
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-surface rounded-2xl p-8 border border-border">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-3">
                {[
                  "AI-guided intake process",
                  "Evidence analysis & verification",
                  "Claim strength assessment",
                  "Professional LBA generation",
                ].map((item) => (
                  <div key={item} className="hidden" />
                ))}
              </div>
              {[
                "AI-guided intake process",
                "Evidence analysis & verification",
                "Claim strength assessment",
                "Professional LBA generation",
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
              <span className="text-lg font-bold text-white">ClaimCraft AI</span>
            </div>
            <p className="text-sm text-center md:text-right max-w-lg">
              ClaimCraft AI provides legal document preparation assistance. This is not
              legal advice. For specific legal matters, please consult a qualified
              solicitor or attorney in your jurisdiction.
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm">
            &copy; {new Date().getFullYear()} ClaimCraft AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
