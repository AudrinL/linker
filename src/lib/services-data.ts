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

export const safariHighlights = [
  { title: "Gorilla Trekking", description: "Volcanoes National Park, Rwanda.", className: "md:col-span-2", image: "/img/safari-gorilla.png" },
  { title: "Great Migration", description: "Serengeti & Maasai Mara.", className: "md:col-span-1", image: "/assets/tanzania%20safari.webp" },
  { title: "Big Five Drive", description: "Akagera National Park.", className: "md:col-span-1", image: "/img/safari-elephants.png" },
  { title: "Balloon Safaris", description: "Dawn flights over the savanna.", className: "md:col-span-2", image: "/img/safari-balloons.png" },
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
    note: "Documentation pack — indicative, confirmed before you pay",
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
  { q: "Do you help with the work visa?", a: "Yes — work permit and visa processing is part of every placement. We handle forms, medicals, translation and embassy liaison from start to finish." },
  { q: "What if my application is refused?", a: "We review every refusal and rework the application at no extra fee. Our 96% first-time success rate is built on honest eligibility checks before you ever pay." },
  { q: "Can I apply without a passport yet?", a: "You can start your profile now and add documents as they are ready. A valid passport is only required at the visa filing stage." },
];

export const workGuides: Guide[] = [
  { slug: "cv-guide", title: "The East African CV that wins interviews", description: "A fill-in template and the five mistakes that quietly kill overseas applications.", meta: "8 pages · PDF · 5 min read", file: "/guides/work-cv-guide.html" },
  { slug: "permit-checklist", title: "Work permit & visa checklist", description: "Every document, medical and certificate you need before we file — country by country.", meta: "6 pages · PDF · 4 min read", file: "/guides/work-permit-checklist.html" },
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
  { title: "Pre-departure", description: "Accommodation, flights, insurance and orientation — so day one feels planned.", duration: "2 weeks before" },
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
    note: "Per university — indicative, confirmed before you pay",
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
    href: "/travel/visa-services/apply",
  },
];

export const studyFaqs: Faq[] = [
  { q: "Can I study abroad with average grades?", a: "Yes. There are strong, accredited programs and pathways for students with C-grades, including foundation years and diploma-to-degree routes in Canada, the UK and Australia." },
  { q: "How much money do I need to show?", a: "It depends on the country: Germany ~€11,900/yr, UK £1,334/month, Canada CAD 20,635/yr. We prepare the financial proof documents so your file is approved the first time." },
  { q: "Can I work while studying?", a: "Most student visas allow 20 hours a week during term and full-time in the holidays. Germany allows 120 full days a year." },
  { q: "Do you help with scholarships?", a: "Yes — we screen every applicant against available scholarships and aid before you commit to any country or university." },
  { q: "What if my visa is refused?", a: "We re-file at no extra fee and give you a written explanation of exactly what to fix. Our student visa success rate is 98%." },
  { q: "Do I need to speak English perfectly?", a: "You need the IELTS/TOEFL score your university asks for. If you are close, we help you prepare for the test — and some universities offer English support courses." },
];

export const studyGuides: Guide[] = [
  { slug: "sop-guide", title: "Write a statement of purpose that opens doors", description: "A proven structure, real examples and the three paragraphs that decide your offer.", meta: "9 pages · PDF · 6 min read", file: "/guides/study-sop-guide.html" },
  { slug: "visa-checklist", title: "Student visa document checklist", description: "Financial proof, transcripts and sponsor letters — exactly what each embassy wants.", meta: "7 pages · PDF · 5 min read", file: "/guides/study-visa-checklist.html" },
  { slug: "funding-guide", title: "Funding your studies abroad", description: "Scholarships, loans and legitimate family sponsorship — how to structure your finances.", meta: "8 pages · PDF · 6 min read", file: "/guides/study-funding-guide.html" },
];

/* ================================================================== */
/*  VISA SERVICES                                                      */
/* ================================================================== */

export const visaProcess: ProcessStep[] = [
  { title: "Free eligibility check", description: "A 2-minute quiz tells you which visa you qualify for and what it involves.", duration: "2 minutes" },
  { title: "Document checklist", description: "A personalised list of exactly what your application needs — nothing more.", duration: "Same day" },
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
    note: "Indicative — final quote after the free check",
    features: ["Application drafting", "Document review", "Embassy booking", "Decision tracking"],
    cta: "Start the check",
    href: "/travel/visa-services/apply",
  },
  {
    name: "Priority",
    price: "From $220",
    note: "For travel dates under three weeks away",
    features: ["Everything in Standard", "Express lane where offered", "Senior consultant review", "Direct WhatsApp updates"],
    cta: "Apply priority",
    href: "/travel/visa-services/apply",
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
  { q: "Which visas do you process?", a: "Tourist, business, work, student and transit visas for all major destinations — plus Schengen, UK, US, Canada and Gulf visas. If you are unsure, start with the free eligibility check." },
  { q: "How long does a visa take?", a: "Tourist visas average 5–15 days, business 1–2 weeks and work or student visas 3–8 weeks. Embassy calendars vary by season, so we build buffers into every plan." },
  { q: "Can you guarantee approval?", a: "No honest agency can. We guarantee a decision-ready file — every document checked before submission — which is why 96% of our clients are approved first time." },
  { q: "Do I need to come to Kigali?", a: "Most of the process is handled remotely. You attend only the biometrics or embassy interview, and we book that slot for you." },
  { q: "What happens if my visa is refused?", a: "We review the refusal, correct the file and re-submit at no additional service fee. Government fees are not refundable, which is why we check eligibility first." },
  { q: "Can I apply with a weak passport or history?", a: "Yes — we build the strongest possible file around your circumstances, and we tell you honestly before you pay if a route is unlikely to succeed." },
];

export const visaGuides: Guide[] = [
  { slug: "tourist-checklist", title: "Schengen & UK tourist visa checklist", description: "Bank statements, itineraries and cover letters that get approved first time.", meta: "6 pages · PDF · 4 min read", file: "/guides/tourist-visa-checklist.html" },
  { slug: "interview-guide", title: "Ace the embassy interview", description: "The twelve questions officers ask and the answers that build confidence.", meta: "7 pages · PDF · 5 min read", file: "/guides/embassy-interview-guide.html" },
];

/* ================================================================== */
/*  SAFARI                                                             */
/* ================================================================== */

export const safariProcess: ProcessStep[] = [
  { title: "Tell us your dates & group", description: "A quick form, then a human response within hours — not an automated quote.", duration: "Same day" },
  { title: "Itinerary design", description: "We draft a day-by-day plan across parks, lodges and permits to your budget.", duration: "1–2 days" },
  { title: "Book & pay", description: "Deposit secures permits and lodges; balance due 45 days before departure.", duration: "Secure once approved" },
  { title: "Pre-trip briefing", description: "Packing, insurance, visas and meet-your-guide details — everything in one briefing.", duration: "1 week before" },
  { title: "The safari", description: "A private guide, transfers that run on time, and a dedicated contact throughout.", duration: "Your dates" },
];

export const safariPackages = [
  { id: "1", title: "Volcanoes Gorilla Trek", subtitle: "3 Days / 2 Nights", tags: ["Gorilla permit", "Luxury lodge", "All transfers"], description: "The classic: one unforgettable morning with the mountain gorillas of Rwanda." },
  { id: "2", title: "Great Migration Chase", subtitle: "6 Days / 5 Nights", tags: ["Maasai Mara", "Game drives", "River crossings"], description: "Follow the wildebeest through Kenya's Maasai Mara at the peak of the season." },
  { id: "3", title: "Serengeti & Ngorongoro", subtitle: "8 Days / 7 Nights", tags: ["Balloon safari", "Crater rim", "Zanzibar add-on"], description: "Tanzania's greatest hits: Serengeti plains and the Ngorongoro Crater floor." },
  { id: "4", title: "Big Five Safari", subtitle: "4 Days / 3 Nights", tags: ["Akagera", "Big Five", "Boat cruise"], description: "Lion, leopard, elephant, rhino and buffalo in Rwanda's wild east." },
];

export const safariPricing: PricingTier[] = [
  {
    name: "Day & Weekend Trips",
    price: "From $180",
    note: "Per person, shared basis — indicative",
    features: ["Akagera game drive", "Lake Kivu escapes", "Group transport", "Park fees included"],
    cta: "Explore options",
    href: "/safari-tours/book",
  },
  {
    name: "Signature Safari",
    price: "From $1,150",
    note: "Per person — permits, lodges & transfers included",
    features: ["Gorilla or migration itinerary", "Private guide & 4x4", "Luxury lodges", "All park fees", "24/7 trip support"],
    cta: "Design my safari",
    href: "/safari-tours/book",
    featured: true,
  },
  {
    name: "Honeymoon / Private",
    price: "Custom",
    note: "Tailored for two, private everything",
    features: ["Private itinerary", "Safari & beach combos", "Luxury & hideaway lodges", "Dedicated planner"],
    cta: "Plan it with us",
    href: "/contact",
  },
];

export const safariFaqs: Faq[] = [
  { q: "When is the best time to see gorillas?", a: "Trekking runs year-round. The short dry seasons (June–September and December–February) offer the driest trails, but permits sell out months ahead — book early." },
  { q: "How fit do I need to be?", a: "Gorilla trekking requires moderate fitness: 1–4 hours of forest hiking at altitude. We match you to a trek grade and arrange porters." },
  { q: "Are permits included in the price?", a: "Yes — in our Signature safaris the gorilla or migration permits, park fees and lodge transfers are all included, so the price we quote is the price you pay." },
  { q: "What if I'm travelling alone?", a: "We love solo travellers. Shared-group treks cut permit costs, and we pair you with like-minded guests or build a fully private trip." },
  { q: "How do I pay and what's the cancellation policy?", a: "A 30% deposit secures your dates. Cancel up to 60 days before for a full refund minus bank fees; permit refunds follow park authority rules." },
  { q: "Do I need a visa to visit Rwanda, Kenya or Tanzania?", a: "Most nationalities get visa on arrival in Rwanda and Kenya; Tanzania offers e-visas. We handle the paperwork as part of your booking." },
];

export const safariGuides: Guide[] = [
  { slug: "packing-list", title: "The smart safari packing list", description: "What to carry, what to leave behind and what the lodges provide for you.", meta: "5 pages · PDF · 3 min read", file: "/guides/safari-packing-list.html" },
  { slug: "best-time-guide", title: "When to see what: an East Africa calendar", description: "Migration seasons, gorilla windows and crater conditions, month by month.", meta: "8 pages · PDF · 6 min read", file: "/guides/safari-calendar.html" },
];

/* ================================================================== */
/*  VEHICLE IMPORT & EXPORT                                            */
/* ================================================================== */

export const vehicleProcess: ProcessStep[] = [
  { title: "Request a quote", description: "Tell us the make, model, budget and destination port. We come back with a landed price.", duration: "24 hours" },
  { title: "Sourcing & inspection", description: "We find your vehicle in Japan, UAE or Europe and send independent inspection photos and reports.", duration: "1–2 weeks" },
  { title: "Purchase & shipping", description: "You approve the vehicle, we handle payment, export papers and ocean freight.", duration: "3–5 weeks" },
  { title: "Customs clearance", description: "Port clearance, duty estimates and inspections managed from Dar, Mombasa or Kigali.", duration: "1–2 weeks" },
  { title: "Delivery & registration", description: "The vehicle is delivered, registered and ready to drive — with full documentation.", duration: "1 week" },
];

export const vehicleComparison: Comparison = {
  caption: "Import vs export at a glance",
  columns: ["", "Import", "Export"],
  rows: [
    { label: "What we handle", values: ["Sourcing, shipping, clearance, registration", "Buyers, documentation, logistics"] },
    { label: "Sourcing markets", values: ["Japan, UAE, Europe", "Rwanda & East Africa"] },
    { label: "Typical timeline", values: ["6–9 weeks door to door", "2–4 weeks"] },
    { label: "Duties & taxes", values: ["Advice & estimate included", "Exporter documentation"] },
  ],
};

export const vehiclePricing: PricingTier[] = [
  {
    name: "Sourcing & Import",
    price: "5% + docs",
    note: "Of vehicle value — indicative; exact quote in 24h",
    features: ["Market search & inspection", "Freight & clearance", "Duty guidance", "Door-to-door delivery"],
    cta: "Get a quote",
    href: "/vehicle-import-export/quote",
    featured: true,
  },
  {
    name: "Export Assistance",
    price: "From $300",
    note: "Per vehicle — indicative",
    features: ["Buyer matching", "Export documentation", "Port logistics", "Payment guidance"],
    cta: "Start export",
    href: "/vehicle-import-export/quote",
  },
  {
    name: "Inspection Only",
    price: "$120",
    note: "Pre-purchase independent report",
    features: ["Full mechanical inspection", "Photos & video", "Written condition report", "Value assessment"],
    cta: "Order inspection",
    href: "/vehicle-import-export/quote",
  },
];

export const vehicleFaqs: Faq[] = [
  { q: "Which countries do you import from?", a: "Japan, the UAE and Europe are our primary markets — the same sources as most dealers, but with transparent sourcing and an independent inspection before you pay." },
  { q: "How is the price calculated?", a: "Landed price = vehicle + freight + duty + clearance + our service fee. You receive an itemised quote, not a single scary number." },
  { q: "Can I trust the vehicle condition?", a: "You approve an independent inspection report with photos before any payment. If the report doesn't match, we walk away for you." },
  { q: "How long does an import take?", a: "Typical door-to-door is 6–9 weeks: 1–2 weeks sourcing, 3–5 weeks shipping, 1–2 weeks clearance and registration." },
  { q: "Do you handle registration in Rwanda?", a: "Yes — RRA duty, inspection, plates and registration are all part of our delivery service." },
  { q: "Can you export a vehicle I already own?", a: "Absolutely. We handle buyers, documentation, port logistics and payment structures for sellers and dealerships." },
];

export const vehicleGuides: Guide[] = [
  { slug: "import-checklist", title: "Importing a vehicle to Rwanda: the checklist", description: "Every document, inspection and fee between the port and your driveway.", meta: "6 pages · PDF · 5 min read", file: "/guides/vehicle-import-checklist.html" },
  { slug: "duty-guide", title: "Understanding duty & taxes", description: "How East African Common Market duties are calculated on imported vehicles.", meta: "5 pages · PDF · 4 min read", file: "/guides/vehicle-duty-guide.html" },
];
