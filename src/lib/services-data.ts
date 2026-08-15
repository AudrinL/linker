/**
 * Structured service data — the layer under the presentation.
 *
 * Everything a page needs to render (jobs, universities, processes, pricing,
 * comparisons, FAQs, guides, partner marks) lives here so components stay
 * layout-only and the copy can be revised in one place.
 *
 * These modules are backend-ready: each collection mirrors the shape a FastAPI
 * endpoint would return (see BACKEND_PLAN.md), so swapping static arrays for
 * fetched data later is a find-and-replace, not a rewrite.
 */

export type ProcessStep = {
  title: string;
  description: string;
  /** Optional working-days estimate shown as a chip on the timeline. */
  duration?: string;
};

export type Country = {
  name: string;
  region: string;
  roles: string;
  highlights: string[];
  facts: string[];
};

export type Comparison = {
  caption: string;
  columns: string[];
  rows: { label: string; values: string[] }[];
};

export type PricingTier = {
  name: string;
  price: string;
  note: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

export type Faq = { q: string; a: string };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  meta: string;
  file: string;
};

export type TrustMark = { name: string; note: string };

/* ================================================================== */
/*  Moved from pages — so copy lives in one place, not in components   */
/* ================================================================== */

export const jobs = [
  { id: "1", title: "Registered Nurse", subtitle: "NHS - United Kingdom", tags: ["Healthcare", "Full-time", "Visa Sponsorship"], description: "Join top hospitals in the UK with full relocation support." },
  { id: "2", title: "Software Engineer", subtitle: "TechHub - Germany", tags: ["IT", "Full-time", "Relocation"], description: "Build scalable systems in Berlin. Relocation and visa provided." },
  { id: "3", title: "Hospitality Manager", subtitle: "Oasis Resorts - UAE", tags: ["Hospitality", "Contract", "Accommodation included"], description: "Manage premium resort operations in Dubai." },
  { id: "4", title: "Construction Supervisor", subtitle: "BuildCorp - Qatar", tags: ["Construction", "Full-time"], description: "Oversee major infrastructure projects in Doha." },
  { id: "5", title: "Caregiver", subtitle: "Senior Care - Canada", tags: ["Healthcare", "Full-time"], description: "Provide compassionate care in verified Canadian facilities." },
  { id: "6", title: "Agricultural Worker", subtitle: "Green Farms - Australia", tags: ["Agriculture", "Seasonal"], description: "Seasonal farming roles with accommodation." },
];

export const universities = [
  { id: "1", title: "University of Toronto", subtitle: "Canada", tags: ["Engineering", "Business", "Medicine"], description: "A globally ranked public research university in Toronto, Ontario." },
  { id: "2", title: "University of Melbourne", subtitle: "Australia", tags: ["Research", "Arts", "Science"], description: "Australia's leading university for academic excellence and research." },
  { id: "3", title: "Technical University of Munich", subtitle: "Germany", tags: ["Technology", "Engineering", "Tuition-Free"], description: "One of Europe's top universities for STEM programs." },
  { id: "4", title: "University of Manchester", subtitle: "United Kingdom", tags: ["Business", "Humanities", "Law"], description: "A prestigious red brick university in the heart of the UK." },
  { id: "5", title: "New York University", subtitle: "United States", tags: ["Arts", "Finance", "Media"], description: "A premier private university located in New York City." },
  { id: "6", title: "National University of Singapore", subtitle: "Singapore", tags: ["Technology", "Business"], description: "Asia's leading university offering global perspectives." },
];

export const flights = [
  { id: "1", title: "Kigali to Dubai", subtitle: "From $450 Round Trip", description: "Direct flights available via RwandAir or Emirates." },
  { id: "2", title: "Kigali to London", subtitle: "From $750 Round Trip", description: "Connecting flights with seamless layovers." },
  { id: "3", title: "Kigali to New York", subtitle: "From $950 Round Trip", description: "Best rates for trans-Atlantic journeys." },
];

export const holidayPackages = [
  { id: "1", title: "Dubai Extravaganza", subtitle: "5 Days / 4 Nights", tags: ["Shopping", "Desert Safari", "Family"], description: "Experience luxury shopping and thrilling desert safaris." },
  { id: "2", title: "European Romance", subtitle: "10 Days / 9 Nights", tags: ["Couples", "Culture", "Multi-city"], description: "Paris, Venice, and Rome in one unforgettable trip." },
  { id: "3", title: "Seychelles Escape", subtitle: "7 Days / 6 Nights", tags: ["Beach", "Relaxation"], description: "Pristine beaches and luxury resorts in the Indian Ocean." },
];

export const hotelHighlights = [
  { title: "Luxury Resorts", description: "5-star experiences globally.", className: "md:col-span-2", imagePlaceholder: "Resort" },
  { title: "Business Hotels", description: "Conveniently located for work.", className: "md:col-span-1" },
  { title: "Boutique Stays", description: "Unique and cultural accommodations.", className: "md:col-span-1" },
  { title: "Apartments", description: "Long-term stays for expats and students.", className: "md:col-span-2" },
];

/* ================================================================== */
/*  Shared trust signals — placed at key decision points               */
/* ================================================================== */

export const trustMarks: TrustMark[] = [
  { name: "Est. 2014", note: "11+ years in operation" },
  { name: "38 countries", note: "Across four continents" },
  { name: "2,400+ placed", note: "Travellers & candidates" },
  { name: "96% visa success", note: "First-time approval" },
];

export const partnerMarks: TrustMark[] = [
  { name: "NHS Trusts", note: "UK healthcare partners" },
  { name: "Gulf Employers", note: "UAE, Qatar & KSA" },
  { name: "Universities", note: "Canada, UK, EU, AU" },
  { name: "Certified Agencies", note: "Rwanda licensed" },
];

/* ================================================================== */
/*  WORK ABROAD                                                        */
/* ================================================================== */

export const workAbroadProcess: ProcessStep[] = [
  { title: "Submit your profile", description: "Tell us your skills, experience and where you want to go. Your first CV review is free.", duration: "Same day" },
  { title: "Eligibility & documents", description: "We verify your qualifications, run a document checklist and flag anything missing early.", duration: "1–3 days" },
  { title: "Employer matching", description: "Your profile is shortlisted against vetted employers in the Gulf, Europe and North America.", duration: "1–4 weeks" },
  { title: "Interview preparation", description: "One-to-one coaching for employer and embassy interviews, in person or by video.", duration: "Ongoing" },
  { title: "Visa & contract", description: "Work permit, medicals, contract review and government processing handled end to end.", duration: "2–8 weeks" },
  { title: "Pre-departure & support", description: "Briefing, airport logistics and support for your first months on the job.", duration: "Until settled" },
];

export const workCountries: Country[] = [
  {
    name: "United Arab Emirates",
    region: "Gulf",
    roles: "Hospitality, construction, retail, drivers, healthcare",
    highlights: ["Tax-free salaries", "2-year renewable contracts", "Employer-provided accommodation & flights"],
    facts: ["Avg. wage $700–$1,500/mo", "Working week 48 hours", "30 days annual leave"],
  },
  {
    name: "Qatar",
    region: "Gulf",
    roles: "Construction, security, aviation, facilities",
    highlights: ["World-class projects", "Housing & transport provided", "Growing healthcare sector"],
    facts: ["Avg. wage $800–$1,800/mo", "Contract includes repatriation", "Family visa after 6 months"],
  },
  {
    name: "Saudi Arabia",
    region: "Gulf",
    roles: "Healthcare, engineering, hospitality, retail",
    highlights: ["Large-scale hospital recruitment", "Long-term contracts", "Female & male roles across sectors"],
    facts: ["Avg. wage $700–$2,000/mo", "Free medical cover", "End-of-service benefits"],
  },
  {
    name: "United Kingdom",
    region: "Europe",
    roles: "Nursing, care work, hospitality, logistics",
    highlights: ["Health & Care Worker visa", "Pathway to settlement", "NHS and care-sector employers"],
    facts: ["Pay from £13/hr care", "Visa fees & IHS apply", "5-year settlement route"],
  },
  {
    name: "Germany",
    region: "Europe",
    roles: "Nursing, IT, engineering, trades",
    highlights: ["Blue Card for skilled work", "Language training funded", "Strong social security"],
    facts: ["Avg. nurse salary €3,000/mo", "Recognition process for qualifications", "Permanent residency possible"],
  },
  {
    name: "Poland",
    region: "Europe",
    roles: "Warehouse, production, food processing, logistics",
    highlights: ["Fast, accessible process", "Repeated contracts available", "Strong network for East Africans"],
    facts: ["Avg. wage €800–€1,300/mo", "Seasonal & long-term roles", "EU travel access"],
  },
  {
    name: "Canada",
    region: "North America",
    roles: "Nursing, care work, agriculture, logistics",
    highlights: ["Permanent residency routes", "Family sponsorship later", "High living standards"],
    facts: ["Caregiver programs active", "Provincial nomination options", "LMIA-backed employers"],
  },
  {
    name: "Australia",
    region: "Oceania",
    roles: "Agriculture, aged care, construction, hospitality",
    highlights: ["Regional workforce programs", "High wages", "Pathways to PR"],
    facts: ["Hourly rates from AUD 28", "Seasonal worker visas", "Accommodation often included"],
  },
];

export const workComparison: Comparison = {
  caption: "Which work route fits you?",
  columns: ["Route", "Best for", "Typical timeline", "Visa type"],
  rows: [
    { label: "Direct employment", values: ["Skilled roles with a named employer", "2–6 weeks", "Work visa / permit"] },
    { label: "Recruitment placement", values: ["Job seekers needing employer matching", "4–12 weeks", "Work visa sponsored"] },
    { label: "Seasonal & entry roles", values: ["Quick starts, logistics & farming", "2–4 weeks", "Seasonal work visa"] },
    { label: "Skilled migration", values: ["Healthcare, IT, engineering", "3–9 months", "Points / skilled visa"] },
  ],
};

export const workPricing: PricingTier[] = [
  {
    name: "Essentials",
    price: "$80",
    note: "Documentation pack, indicative, confirmed before you pay",
    features: ["CV & credential review", "Document checklist", "Eligibility assessment", "WhatsApp support"],
    cta: "Start now",
    href: "/work-abroad/apply",
  },
  {
    name: "Full Placement",
    price: "From $400",
    note: "Paid in stages, only as milestones complete",
    features: ["Employer matching", "Interview coaching", "Visa & contract processing", "Pre-departure briefing", "Post-arrival support"],
    cta: "Apply for placement",
    href: "/work-abroad/apply",
    featured: true,
  },
  {
    name: "Corporate / Group",
    price: "Custom",
    note: "For employers recruiting 10+ staff",
    features: ["Bulk screening", "Batch processing", "Dedicated account manager", "Compliance support"],
    cta: "Request a proposal",
    href: "/contact",
  },
];

export const workFaqs: Faq[] = [
  { q: "Are there any upfront fees?", a: "Our eligibility assessment and document review are free. Placement fees are staged and only charged as each milestone (employer match, visa filing) is reached. We never charge for a job we cannot secure." },
  { q: "Which countries can I work in?", a: "We place candidates across the Gulf (UAE, Qatar, Saudi Arabia), Europe (UK, Germany, Poland) and North America (Canada), with roles in healthcare, construction, hospitality, logistics and skilled trades." },
  { q: "How long does the whole process take?", a: "A direct hire with a ready employer can complete in 3–6 weeks. Recruitment placement typically takes 6–12 weeks depending on the role and visa processing times." },
  { q: "Do you help with the work visa?", a: "Yes. Work permit and visa processing is part of every placement. We handle forms, medicals, translation and embassy liaison from start to finish." },
  { q: "What if my application is refused?", a: "We review every refusal and rework the application at no extra fee. Our 96% first-time success rate is built on honest eligibility checks before you ever pay." },
  { q: "Can I apply without a passport yet?", a: "You can start your profile now and add documents as they are ready. A valid passport is only required at the visa filing stage." },
];

export const workGuides: Guide[] = [
  { slug: "cv-guide", title: "The East African CV that wins interviews", description: "A fill-in template and the five mistakes that quietly kill overseas applications.", meta: "8 pages · PDF · 5 min read", file: "/guides/work-cv-guide.html" },
  { slug: "permit-checklist", title: "Work permit & visa checklist", description: "Every document, medical and certificate you need before we file, country by country.", meta: "6 pages · PDF · 4 min read", file: "/guides/work-permit-checklist.html" },
  { slug: "interview-prep", title: "Interview prep for international employers", description: "What Gulf, UK and EU interviewers actually ask, and how to answer without nerves.", meta: "10 pages · PDF · 8 min read", file: "/guides/interview-prep.html" },
];

/* ================================================================== */
/*  STUDY ABROAD                                                       */
/* ================================================================== */

export const studyProcess: ProcessStep[] = [
  { title: "Course & country matching", description: "We map your grades, budget and goals to the programs where you genuinely qualify.", duration: "Same day" },
  { title: "Application filing", description: "Essays, references and forms prepared and submitted to your shortlist of universities.", duration: "2–3 weeks" },
  { title: "Admission & offer", description: "We track offers, compare packages and help you decide with the numbers in front of you.", duration: "4–8 weeks" },
  { title: "Student visa", description: "Financial proof, biometrics and interview coaching for your consulate appointment.", duration: "3–6 weeks" },
  { title: "Pre-departure", description: "Accommodation, flights, insurance and orientation, so day one feels planned.", duration: "2 weeks before" },
  { title: "Arrival & support", description: "Airport pickup, campus check-in and a local contact while you settle.", duration: "Ongoing" },
];

export const studyCountries: Country[] = [
  {
    name: "Canada",
    region: "North America",
    roles: "UG & PG degrees, diplomas, post-study work",
    highlights: ["Post-graduation work permit", "Clear PR pathway", "Affordable tuition vs USA"],
    facts: ["Tuition from $18k/yr", "Part-time work 20 hrs/wk", "Co-op programs common"],
  },
  {
    name: "United Kingdom",
    region: "Europe",
    roles: "Bachelor's, Master's, PhD, foundation",
    highlights: ["Graduate Route visa (2 yrs)", "Shorter degrees", "World-ranked universities"],
    facts: ["UG tuition from £14k/yr", "Chevening scholarships", "Tier 4 student visa"],
  },
  {
    name: "Germany",
    region: "Europe",
    roles: "Bachelor's & Master's in STEM",
    highlights: ["Mostly tuition-free public universities", "18-month job seeker visa", "Strong engineering reputation"],
    facts: ["Semester fee ~€300", "Proof of funds ~€11,900/yr", "B1 German helps"],
  },
  {
    name: "Australia",
    region: "Oceania",
    roles: "UG & PG, vocational (TAFE)",
    highlights: ["Post-study work rights", "High-quality research", "Safe student cities"],
    facts: ["Tuition from AUD 24k/yr", "Study & work 24 hrs/2wk", "PR points system"],
  },
  {
    name: "United States",
    region: "North America",
    roles: "Bachelor's, Master's, MBA",
    highlights: ["Merit & need-based aid", "F1 visa with OPT work", "Global employer access"],
    facts: ["Tuition from $25k/yr", "GRE/GMAT for some programs", "STEM = 3-yr OPT"],
  },
  {
    name: "Singapore",
    region: "Asia",
    roles: "Undergraduate, postgraduate, MBA",
    highlights: ["Top Asian universities", "Global finance hub", "Safe, modern, English-first"],
    facts: ["Tuition from SGD 30k/yr", "Scholarships for African students", "Strong post-study hiring"],
  },
];

export const studyComparison: Comparison = {
  caption: "Compare top destinations",
  columns: ["", "Canada", "UK", "Germany", "Australia"],
  rows: [
    { label: "Avg. UG tuition", values: ["$18k–$35k/yr", "£14k–£25k/yr", "~€300 fee only", "AUD 24k–$45k/yr"] },
    { label: "Post-study work", values: ["Up to 3 years", "2 years (Graduate Route)", "18 months job seeker", "2–4 years"] },
    { label: "Part-time work", values: ["20 hrs/wk", "20 hrs/wk", "120 days/yr", "24 hrs/2 weeks"] },
    { label: "PR pathway", values: ["Yes, express entry", "Limited", "Yes, skilled route", "Points-based"] },
    { label: "Visa success at LWT", values: ["97%", "98%", "95%", "96%"] },
  ],
};

export const studyPricing: PricingTier[] = [
  {
    name: "Admissions",
    price: "$150",
    note: "Per university, indicative, confirmed before you pay",
    features: ["Course & country matching", "SOP & essay review", "Application filing", "Offer negotiation"],
    cta: "Start now",
    href: "/study-abroad/apply",
  },
  {
    name: "Full Package",
    price: "From $600",
    note: "Admissions + visa, paid in stages",
    features: ["3 university applications", "Financial proof guidance", "Student visa processing", "Pre-departure & flights", "Arrival support"],
    cta: "Apply for study",
    href: "/study-abroad/apply",
    featured: true,
  },
  {
    name: "Visa Only",
    price: "$250",
    note: "When you already hold an offer",
    features: ["Document review", "Financial & sponsor letters", "Biometrics booking", "Interview coaching"],
    cta: "Process my visa",
    href: "/visa-support/apply",
  },
];

export const studyFaqs: Faq[] = [
  { q: "Can I study abroad with average grades?", a: "Yes. There are strong, accredited programs and pathways for students with C-grades, including foundation years and diploma-to-degree routes in Canada, the UK and Australia." },
  { q: "How much money do I need to show?", a: "It depends on the country: Germany ~€11,900/yr, UK £1,334/month, Canada CAD 20,635/yr. We prepare the financial proof documents so your file is approved the first time." },
  { q: "Can I work while studying?", a: "Most student visas allow 20 hours a week during term and full-time in the holidays. Germany allows 120 full days a year." },
  { q: "Do you help with scholarships?", a: "Yes. We screen every applicant against available scholarships and aid before you commit to any country or university." },
  { q: "What if my visa is refused?", a: "We re-file at no extra fee and give you a written explanation of exactly what to fix. Our student visa success rate is 98%." },
  { q: "Do I need to speak English perfectly?", a: "You need the IELTS/TOEFL score your university asks for. If you are close, we help you prepare for the test, and some universities offer English support courses." },
];

export const studyGuides: Guide[] = [
  { slug: "sop-guide", title: "Write a statement of purpose that opens doors", description: "A proven structure, real examples and the three paragraphs that decide your offer.", meta: "9 pages · PDF · 6 min read", file: "/guides/study-sop-guide.html" },
  { slug: "visa-checklist", title: "Student visa document checklist", description: "Financial proof, transcripts and sponsor letters, exactly what each embassy wants.", meta: "7 pages · PDF · 5 min read", file: "/guides/study-visa-checklist.html" },
  { slug: "funding-guide", title: "Funding your studies abroad", description: "Scholarships, loans and legitimate family sponsorship, how to structure your finances.", meta: "8 pages · PDF · 6 min read", file: "/guides/study-funding-guide.html" },
];

/* ================================================================== */
/*  VISA SERVICES                                                      */
/* ================================================================== */

export const visaProcess: ProcessStep[] = [
  { title: "Free eligibility check", description: "A 2-minute quiz tells you which visa you qualify for and what it involves.", duration: "2 minutes" },
  { title: "Document checklist", description: "A personalised list of exactly what your application needs, and nothing more.", duration: "Same day" },
  { title: "Application & review", description: "Forms completed to embassy standard, then a senior consultant checks every line.", duration: "1–3 days" },
  { title: "Appointment & biometrics", description: "We book your embassy slot and prepare you for the interview or bio capture.", duration: "1–2 weeks" },
  { title: "Decision & collection", description: "We track the decision and hand you back your passport with next steps.", duration: "2–8 weeks" },
];

export const visaComparison: Comparison = {
  caption: "Which visa do you need?",
  columns: ["Visa", "Who it's for", "Timeline", "Typical documents"],
  rows: [
    { label: "Tourist", values: ["Holiday & family visits", "5–15 days", "Passport, tickets, funds"] },
    { label: "Business", values: ["Meetings, conferences, trade", "1–2 weeks", "Invitation, employer letter"] },
    { label: "Work", values: ["Employed abroad", "2–8 weeks", "Contract, permit, medicals"] },
    { label: "Student", values: ["University or college", "3–6 weeks", "Offer, financial proof"] },
    { label: "Transit", values: ["Passing through an airport", "3–7 days", "Onward ticket, passport"] },
  ],
};

export const visaPricing: PricingTier[] = [
  {
    name: "Standard",
    price: "$120",
    note: "Indicative, final quote after the free check",
    features: ["Application drafting", "Document review", "Embassy booking", "Decision tracking"],
    cta: "Start the check",
    href: "/visa-support/apply",
  },
  {
    name: "Priority",
    price: "From $220",
    note: "For travel dates under three weeks away",
    features: ["Everything in Standard", "Express lane where offered", "Senior consultant review", "Direct WhatsApp updates"],
    cta: "Apply priority",
    href: "/visa-support/apply",
    featured: true,
  },
  {
    name: "Business / Group",
    price: "Custom",
    note: "Companies sending staff overseas",
    features: ["Bulk applications", "Corporate letters", "Dedicated coordinator", "Travel desk support"],
    cta: "Talk to us",
    href: "/contact",
  },
];

export const visaFaqs: Faq[] = [
  { q: "Which visas do you process?", a: "Tourist, business, work, student and transit visas for all major destinations, plus Schengen, UK, US, Canada and Gulf visas. If you are unsure, start with the free eligibility check." },
  { q: "How long does a visa take?", a: "Tourist visas average 5–15 days, business 1–2 weeks and work or student visas 3–8 weeks. Embassy calendars vary by season, so we build buffers into every plan." },
  { q: "Can you guarantee approval?", a: "No honest agency can. We guarantee a decision-ready file, with every document checked before submission, which is why 96% of our clients are approved first time." },
  { q: "Do I need to come to Kigali?", a: "Most of the process is handled remotely. You attend only the biometrics or embassy interview, and we book that slot for you." },
  { q: "What happens if my visa is refused?", a: "We review the refusal, correct the file and re-submit at no additional service fee. Government fees are not refundable, which is why we check eligibility first." },
  { q: "Can I apply with a weak passport or history?", a: "Yes. We build the strongest possible file around your circumstances, and we tell you honestly before you pay if a route is unlikely to succeed." },
];

export const visaGuides: Guide[] = [
  { slug: "tourist-checklist", title: "Schengen & UK tourist visa checklist", description: "Bank statements, itineraries and cover letters that get approved first time.", meta: "6 pages · PDF · 4 min read", file: "/guides/tourist-visa-checklist.html" },
  { slug: "interview-guide", title: "Ace the embassy interview", description: "The twelve questions officers ask and the answers that build confidence.", meta: "7 pages · PDF · 5 min read", file: "/guides/embassy-interview-guide.html" },
];

/* ================================================================== */
/*  Service inventories — what each page promises, in plain language   */
/* ================================================================== */

export type Feature = { title: string; description: string };

/** Work Abroad — the eight things the service actually covers. */
export const workServices: Feature[] = [
  { title: "Job opportunities", description: "Verified vacancies from employers we have placed candidates with before, not scraped listings." },
  { title: "Candidate assessment", description: "An honest read on which markets and roles your qualifications actually reach." },
  { title: "CV preparation", description: "Your experience rewritten to the format employers in your target country expect." },
  { title: "Interview preparation", description: "Practice rounds, common questions and what the employer is really assessing." },
  { title: "Employer matching", description: "We put your profile in front of vacancies you can win, not every vacancy open." },
  { title: "Work permit guidance", description: "What the permit route requires, who applies for what, and how long each stage takes." },
  { title: "Visa support", description: "Document preparation and application guidance once an offer is in hand." },
  { title: "Pre-departure preparation", description: "Contracts explained, travel arranged and a briefing before you fly." },
];

/** Study Abroad — the seven-part service, numbered on the page. */
export const studyServices: Feature[] = [
  { title: "University & college selection", description: "Institutions matched to your qualifications, career goals, destination and budget, shortlisted before you spend on applications." },
  { title: "Course selection", description: "A program that fits your interests and where you want the qualification to take you, not just what is easiest to get into." },
  { title: "Admission application support", description: "Help preparing and organising documents, then completing the admission application itself." },
  { title: "Scholarship guidance", description: "Information on funding opportunities and what each one actually requires from an applicant." },
  { title: "Student visa support", description: "Guidance through the student visa process and the documentation each destination expects." },
  { title: "Accommodation guidance", description: "Student housing options and what to arrange before you land." },
  { title: "Flight & travel preparation", description: "Once your place is confirmed, flight booking and pre-departure preparation." },
];

/** Visa Support — six categories we prepare files for. */
export const visaTypes: Feature[] = [
  { title: "Work visa", description: "For applicants taking up employment abroad: document preparation and work-permit requirements explained." },
  { title: "Student visa", description: "For students accepted by an eligible institution, including financial and accommodation evidence." },
  { title: "Tourist / visitor visa", description: "For holidays, family visits and short trips: itineraries, funds and cover letters." },
  { title: "Business visa", description: "For meetings, conferences, trade fairs and other business activities." },
  { title: "Family / visit visa", description: "For eligible family and personal visits, including invitation and relationship evidence." },
  { title: "Transit visa", description: "Understanding whether you need one and what the transit country requires." },
];

/** Visa Support — the seven-stage service. */
export const visaServices: Feature[] = [
  { title: "Consultation", description: "The right visa category, the basic requirements and what the process involves for your destination." },
  { title: "Document checklist", description: "A personalised list of what your application actually needs, nothing more and nothing missing." },
  { title: "Document preparation", description: "Help organising and preparing the supporting documentation to embassy standard." },
  { title: "Application support", description: "Guidance completing the forms and assembling the submission." },
  { title: "Appointment guidance", description: "Understanding appointment booking, biometrics and interview requirements where they apply." },
  { title: "Application follow-up", description: "Checking status and responding when the embassy requests additional documents." },
  { title: "Travel preparation", description: "Once approved, flight booking and travel arrangements through our travel desk." },
];

/** Visa Support — the full journey, per the brief. */
export const visaJourney: ProcessStep[] = [
  { title: "Consultation", description: "We establish the right visa category and what your destination requires.", duration: "Same day" },
  { title: "Document check", description: "Your documents reviewed against the checklist before anything is submitted.", duration: "1–2 days" },
  { title: "Application preparation", description: "Forms completed and the file assembled to embassy standard.", duration: "1–3 days" },
  { title: "Application submission", description: "The application is lodged with the embassy, consulate or visa centre.", duration: "Booking dependent" },
  { title: "Biometrics / interview", description: "Where required, we prepare you for the appointment and what is asked.", duration: "1–2 weeks" },
  { title: "Processing", description: "The authority assesses your file. We track it and respond to any requests.", duration: "2–8 weeks" },
  { title: "Decision", description: "The outcome is issued by the embassy or immigration authority.", duration: "Varies" },
  { title: "Travel preparation", description: "On approval, flights and pre-departure arrangements are made.", duration: "1–2 weeks" },
];

/** Documents an applicant may be asked for — deliberately framed as "may". */
export const visaDocuments = [
  "Valid passport",
  "Passport photographs",
  "Completed visa application form",
  "Proof of accommodation",
  "Flight / travel information",
  "Bank statements or proof of funds",
  "Employment documents",
  "Admission letter",
  "Employment contract",
  "Invitation letter",
  "Travel insurance",
  "Academic documents",
  "Civil documents (birth, marriage)",
  "Other supporting documents",
];

/* ------------------------------------------------------------------ */
/*  Study Abroad page content                                          */
/* ------------------------------------------------------------------ */

export type ProgramCategory = { title: string; items: string[] };

export const studyProgramCategories: ProgramCategory[] = [
  { title: "Undergraduate", items: ["Bachelor's degrees", "Diplomas", "Foundation programs", "Professional certificates"] },
  { title: "Postgraduate", items: ["Master's degrees", "MBA programs", "Postgraduate diplomas", "Professional programs"] },
  { title: "Doctoral", items: ["PhD programs", "Research programs"] },
  { title: "Vocational & professional", items: ["Technical training", "Vocational programs", "Professional courses", "Skills-based training"] },
  { title: "Language programs", items: ["English language courses", "German language courses", "French language courses", "Other language programs"] },
];

export const studyEligibleApplicants = [
  "High school graduates",
  "Diploma holders",
  "Bachelor's degree holders",
  "Master's degree holders",
  "Professionals seeking further education",
  "Students seeking vocational training",
  "Students interested in language programs",
];

export const studyRequirements = [
  "Valid passport",
  "Academic certificates",
  "Academic transcripts",
  "CV",
  "Motivation letter / statement of purpose",
  "Recommendation letters",
  "Proof of language proficiency",
  "Proof of financial resources where required",
  "Passport-size photographs",
  "Other supporting documents",
];

/** The eight-step journey from first conversation to first lecture. */
export const studyJourney: ProcessStep[] = [
  { title: "Consultation", description: "We discuss your education background, career goals and preferred destination.", duration: "Same day" },
  { title: "Program selection", description: "We identify suitable courses and institutions within your budget.", duration: "2–5 days" },
  { title: "Document preparation", description: "Academic and supporting documents prepared and organised.", duration: "1–2 weeks" },
  { title: "Application", description: "Your application is submitted to the selected institutions.", duration: "Intake dependent" },
  { title: "Admission", description: "The institution issues its decision and we review the offer with you.", duration: "2–8 weeks" },
  { title: "Visa preparation", description: "Student visa documents prepared and the application lodged.", duration: "3–8 weeks" },
  { title: "Pre-departure", description: "Accommodation, travel and everything else arranged before you fly.", duration: "2–4 weeks" },
  { title: "Start your journey", description: "You travel to your destination and begin your international education.", duration: "Your intake" },
];

export const studyBudgetItems = [
  "Tuition fees",
  "Application fees where applicable",
  "Accommodation",
  "Living expenses",
  "Health insurance",
  "Visa fees",
  "Travel expenses",
  "Other university or government charges",
];

export const scholarshipSources = [
  "Universities",
  "Governments",
  "International organizations",
  "Private institutions",
  "Foundations",
];

export const scholarshipCategories = [
  "University scholarships",
  "Government scholarships",
  "Merit-based scholarships",
  "Research scholarships",
  "International student scholarships",
  "Partial tuition scholarships",
  "Fully funded opportunities where available",
];

/* ------------------------------------------------------------------ */
/*  Why choose us — tailored per service                               */
/* ------------------------------------------------------------------ */

export const studyWhyUs: Feature[] = [
  { title: "Global opportunities", description: "Education opportunities across multiple international destinations." },
  { title: "Personalised guidance", description: "We weigh your academic background, goals and preferred destination, not a generic shortlist." },
  { title: "Application support", description: "Help organising your application and every supporting document." },
  { title: "Visa guidance", description: "The student visa process and documentation, explained before you start." },
  { title: "Travel support", description: "Flight booking and pre-departure preparation once your place is confirmed." },
];

export const visaWhyUs: Feature[] = [
  { title: "Document guidance", description: "Understand exactly which supporting documents your category requires." },
  { title: "Multiple destinations", description: "Support across work, study and travel destinations worldwide." },
  { title: "Professional assistance", description: "Help organising and presenting your application information." },
  { title: "Travel support", description: "After approval, arrange your journey through our flight desk." },
  { title: "One-stop service", description: "Work abroad, study abroad, visa support and flights handled by one team." },
];

/* ================================================================== */
/*  FLIGHT TICKETS                                                     */
/* ================================================================== */

export const flightServices: Feature[] = [
  { title: "International flights", description: "Flights to destinations around the world, priced across carriers rather than one." },
  { title: "Domestic & regional flights", description: "Travel within your country and across East Africa." },
  { title: "Return flights", description: "Round-trip journeys with connections that leave room to breathe." },
  { title: "One-way flights", description: "For travellers moving abroad for work, study or relocation." },
  { title: "Group bookings", description: "Families, groups, student cohorts and organisations." },
  { title: "Student travel", description: "Timed to your intake, with baggage allowances that fit a move." },
  { title: "Corporate travel", description: "Business travel with flexible fares and change protection." },
  { title: "Work-abroad travel", description: "Departure arranged around your contract start date." },
];

/** The four doors, reused on the flight and opportunities pages. */
export const oneStopServices = [
  { title: "Work Abroad", description: "Find international employment opportunities.", href: "/work-abroad" },
  { title: "Study Abroad", description: "Explore international education opportunities.", href: "/study-abroad" },
  { title: "Visa Support", description: "Get guidance with your visa application.", href: "/visa-support" },
  { title: "Flight Tickets", description: "Book your domestic or international journey.", href: "/flight-tickets" },
];

/* ================================================================== */
/*  OPPORTUNITIES                                                      */
/* ================================================================== */

export type OpportunityMarket = {
  flag: string;
  country: string;
  copy: string;
};

export const workMarkets: OpportunityMarket[] = [
  { flag: "🇩🇪", country: "Germany", copy: "Healthcare, skilled trades, engineering, IT, logistics, manufacturing and hospitality." },
  { flag: "🇨🇦", country: "Canada", copy: "Healthcare, construction, transport, agriculture, manufacturing, hospitality and logistics." },
  { flag: "🇦🇪", country: "United Arab Emirates", copy: "Drivers, construction, hospitality, maintenance, logistics, security and service positions." },
  { flag: "🇳🇱", country: "Netherlands", copy: "Logistics, agriculture, manufacturing, hospitality and technical positions." },
  { flag: "🇬🇧", country: "United Kingdom", copy: "Healthcare, hospitality, skilled trades, logistics and professional positions." },
  { flag: "🇮🇪", country: "Ireland", copy: "Healthcare, logistics and manufacturing roles across the country." },
];

export const opportunityFinder = [
  { title: "Work abroad", description: "Find international employment opportunities.", href: "/jobs" },
  { title: "Study abroad", description: "Find universities, colleges and programs.", href: "/study-abroad" },
  { title: "Scholarships", description: "Explore available funding opportunities.", href: "/study-abroad#scholarships" },
  { title: "Visa support", description: "Get guidance with your visa application.", href: "/visa-support" },
  { title: "Flight tickets", description: "Plan and book your journey.", href: "/flight-tickets" },
];

export const studyOpportunityTypes: Feature[] = [
  { title: "University programs", description: "Bachelor's and master's degrees, PhDs, diplomas and foundation programs." },
  { title: "Vocational & technical", description: "Technical training, professional certificates and skills-based programs." },
  { title: "International education", description: "Study opportunities across Germany, Canada, the UK, Australia, New Zealand, Ireland, France, the Netherlands and more." },
];

export const visaOpportunityTypes = [
  "Work visa",
  "Student visa",
  "Tourist / visitor visa",
  "Business visa",
  "Family visit visa",
  "Transit visa",
];

export const travelOpportunityTypes = [
  "International flights",
  "Domestic flights",
  "One-way tickets",
  "Return tickets",
  "Group travel",
  "Student travel",
  "Corporate travel",
  "Work-abroad travel",
];

/* ================================================================== */
/*  ABOUT                                                              */
/* ================================================================== */

export const aboutServices: {
  title: string;
  intro: string;
  items: string[];
  cta: { label: string; href: string };
}[] = [
  {
    title: "Work Abroad",
    intro: "We help job seekers explore international employment opportunities and submit their profiles for suitable vacancies.",
    items: [
      "Job opportunity information",
      "Candidate registration",
      "CV submission",
      "Candidate assessment",
      "Employer matching",
      "Interview preparation",
      "Work permit guidance",
      "Pre-departure preparation",
    ],
    cta: { label: "View available jobs", href: "/jobs" },
  },
  {
    title: "Study Abroad",
    intro: "We help students explore international education opportunities based on their academic background, career goals and preferred destination.",
    items: [
      "University and college selection",
      "Program selection",
      "Admission application support",
      "Scholarship guidance",
      "Student visa support",
      "Accommodation guidance",
      "Travel preparation",
    ],
    cta: { label: "Explore study opportunities", href: "/study-abroad" },
  },
  {
    title: "Visa Support",
    intro: "We guide clients who need help understanding visa application requirements and preparing their supporting documents.",
    items: [
      "Work visas",
      "Student visas",
      "Tourist / visitor visas",
      "Business visas",
      "Family visit visas",
      "Transit visas",
    ],
    cta: { label: "Request visa support", href: "/visa-support" },
  },
  {
    title: "Flight Tickets",
    intro: "We help travellers arrange domestic and international flights for every kind of journey.",
    items: [
      "Work travel",
      "Student travel",
      "Tourism",
      "Business travel",
      "Family visits",
      "Group travel",
      "One-way journeys",
      "Return journeys",
    ],
    cta: { label: "Book a flight", href: "/flight-tickets" },
  },
];

export const howWeWork: ProcessStep[] = [
  { title: "Discover", description: "Tell us what you want to achieve, work, study, travel or a visa." },
  { title: "Assess", description: "We review your requirements, qualifications and preferences honestly." },
  { title: "Match", description: "We identify opportunities and services that genuinely fit your profile." },
  { title: "Apply", description: "We help you through the application and documentation process." },
  { title: "Prepare", description: "Visa, travel and everything else you need before you go." },
  { title: "Go global", description: "You take the next step toward your international journey." },
];

export const aboutWhyUs: Feature[] = [
  { title: "International opportunities", description: "Opportunities across multiple countries and sectors, not one narrow corridor." },
  { title: "Personalised support", description: "We weigh each client's own goals, qualifications and preferences." },
  { title: "Application guidance", description: "Help understanding and organising what each application actually requires." },
  { title: "One-stop service", description: "Work, study, visa support and flights handled by the same team." },
  { title: "Client communication", description: "You are told where your file stands, not left guessing." },
  { title: "Travel support", description: "From the opportunity to the departure gate." },
];

/** Every destination the business touches, for the About page's global strip. */
export const globalReach = [
  "🇩🇪 Germany", "🇨🇦 Canada", "🇦🇪 UAE", "🇬🇧 United Kingdom", "🇳🇱 Netherlands",
  "🇮🇪 Ireland", "🇦🇺 Australia", "🇳🇿 New Zealand", "🇫🇷 France", "🇩🇰 Denmark",
  "🇸🇪 Sweden", "🇫🇮 Finland", "🇳🇴 Norway", "🇵🇱 Poland", "🇮🇹 Italy",
  "🇲🇹 Malta", "🇶🇦 Qatar", "🇸🇦 Saudi Arabia",
];

/* ================================================================== */
/*  CONTACT                                                            */
/* ================================================================== */

export const partnerTypes = [
  "An international employer",
  "A recruitment agency",
  "A university or college",
  "A travel company",
  "An education consultant",
  "A business looking for international partnerships",
];
