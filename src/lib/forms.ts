/**
 * Multi-step application forms — configuration only.
 *
 * One engine (`<MultiStepForm />`) renders every funnel on the site from the
 * configs below, so each application flow looks identical and future backend
 * wiring (FastAPI, see BACKEND_PLAN.md) needs a single submission hook.
 */

export type FieldDef =
  | { type: "text" | "email" | "tel"; name: string; label: string; placeholder?: string; required?: boolean }
  | { type: "select"; name: string; label: string; options: string[]; placeholder?: string; required?: boolean }
  | { type: "radio"; name: string; label: string; options: string[]; required?: boolean }
  | { type: "checkbox"; name: string; label: string; required?: boolean }
  | { type: "textarea"; name: string; label: string; placeholder?: string; required?: boolean; rows?: number }
  /** Native date picker — birth dates, passport expiry, travel dates. */
  | { type: "date"; name: string; label: string; required?: boolean; hint?: string }
  /**
   * Type-to-search picker backed by a datalist. Free text is accepted so an
   * applicant is never blocked by a country or role we did not anticipate.
   */
  | { type: "search"; name: string; label: string; options: string[]; placeholder?: string; required?: boolean; hint?: string }
  /** Checkbox group. `max` caps how many can be picked (the brief's "up to 3"). */
  | { type: "multiselect"; name: string; label: string; options: string[]; max?: number; required?: boolean; hint?: string };

export type DocumentDef = {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  accept?: string;
  maxMb?: number;
};

export type EligibilityQuestion = {
  q: string;
  options: string[];
  /** Selecting any of these options flags the applicant as not yet eligible. */
  disqualifiers?: string[];
};

export type EligibilityConfig = {
  service: string;
  headline: string;
  intro: string;
  questions: EligibilityQuestion[];
  pass: { title: string; copy: string };
  fail: { title: string; copy: string };
};

export type FormConfig = {
  id: string;
  title: string;
  subtitle: string;
  /** Fields collected before the document step. Each array becomes a step. */
  sections: { id: string; title: string; fields: FieldDef[] }[];
  documents: DocumentDef[];
  /**
   * Declarations the applicant must tick before submitting. Every entry is
   * mandatory — these are the consent and no-guarantee statements the business
   * relies on, so the form will not submit until all are accepted.
   */
  consents: string[];
  submitLabel: string;
  whatsappIntro: string;
  emailSubject: string;
  /** Prefix for the generated reference, e.g. "LW-APPLICATION". */
  referencePrefix: string;
  /**
   * Field seeded from `?country=` so a destination chosen on the service page
   * carries into the form instead of being asked for twice.
   */
  prefillField?: string;
  /** Shown on the confirmation screen under the reference number. */
  successTitle: string;
  successCopy: string;
  /** Where the applicant is sent next from the confirmation screen. */
  successLinks?: { label: string; href: string }[];
};

/* ================================================================== */
/*  Shared option sets                                                 */
/* ================================================================== */

const THIS_YEAR = new Date().getFullYear();

const gradYears = Array.from({ length: 42 }, (_, i) => String(THIS_YEAR + 1 - i));
const startYears = Array.from({ length: 5 }, (_, i) => String(THIS_YEAR + i));

const contactPreference: FieldDef[] = [
  {
    type: "radio",
    name: "contactMethod",
    label: "How would you like us to contact you?",
    options: ["WhatsApp", "Phone call", "Email"],
    required: true,
  },
  {
    type: "select",
    name: "contactTime",
    label: "Preferred contact time",
    options: ["Morning (08:00 – 12:00)", "Afternoon (12:00 – 17:00)", "Evening (17:00 – 20:00)", "Any time"],
  },
];

/** Identity block — identical across every funnel, so it is written once. */
const personalFields = (opts: { dob?: boolean } = {}): FieldDef[] => [
  { type: "text", name: "fullName", label: "Full name (as shown on passport)", placeholder: "e.g. Jean-Claude Mugisha", required: true },
  ...(opts.dob
    ? ([{ type: "date", name: "dob", label: "Date of birth", required: true }] as FieldDef[])
    : []),
  { type: "search", name: "nationality", label: "Nationality", options: countries, placeholder: "Search your nationality…", required: true },
  { type: "search", name: "residence", label: "Country of residence", options: countries, placeholder: "Where do you live now?", required: true },
  { type: "tel", name: "phone", label: "Phone number", placeholder: "+250 7…", required: true },
  { type: "tel", name: "whatsapp", label: "WhatsApp number", placeholder: "If different from your phone" },
  { type: "email", name: "email", label: "Email address", placeholder: "you@example.com", required: true },
];

/* ================================================================== */
/*  WORK ABROAD                                                        */
/* ================================================================== */

export const workForm: FormConfig = {
  id: "work-abroad",
  title: "Apply for a job abroad",
  subtitle:
    "Our recruitment team reviews every profile and replies when your qualifications match an available opportunity.",
  prefillField: "firstChoice",
  sections: [
    {
      id: "personal",
      title: "Personal information",
      fields: personalFields({ dob: true }),
    },
    {
      id: "destination",
      title: "Where you want to work",
      fields: [
        {
          type: "search",
          name: "firstChoice",
          label: "Which country do you want to work in?",
          options: names(workDestinations),
          placeholder: "Search or select a country…",
          required: true,
          hint: "Your first choice. We will tell you honestly if another market suits your profile better.",
        },
        {
          type: "multiselect",
          name: "alsoConsider",
          label: "Other countries you would consider",
          options: names(workDestinations),
          max: 3,
          hint: "Choose up to 3",
        },
      ],
    },
    {
      id: "job",
      title: "Job preference",
      fields: [
        {
          type: "search",
          name: "role",
          label: "What job are you looking for?",
          options: jobRoles,
          placeholder: "e.g. Caregiver, Welder, Truck Driver…",
          required: true,
        },
        { type: "select", name: "sector", label: "Preferred sector", options: sectors, required: true },
        {
          type: "radio",
          name: "employmentType",
          label: "Employment type",
          options: ["Full-time", "Part-time", "Contract", "Seasonal"],
          required: true,
        },
        { type: "text", name: "salary", label: "Expected salary (optional)", placeholder: "e.g. €2,800 gross per month" },
      ],
    },
    {
      id: "education",
      title: "Education & qualifications",
      fields: [
        {
          type: "select",
          name: "education",
          label: "Highest education level",
          options: ["Primary", "Secondary school", "Certificate", "Diploma", "Bachelor's degree", "Master's degree", "PhD", "Professional qualification"],
          required: true,
        },
        { type: "text", name: "fieldOfStudy", label: "Field of study", placeholder: "e.g. Nursing, Electrical installation" },
        { type: "text", name: "certificates", label: "Professional certificates / licences", placeholder: "e.g. Category C driving licence, welding certification" },
      ],
    },
    {
      id: "experience",
      title: "Work experience",
      fields: [
        { type: "radio", name: "hasExperience", label: "Do you have work experience?", options: ["Yes", "No"], required: true },
        {
          type: "select",
          name: "years",
          label: "Years of experience",
          options: ["No experience", "Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "10+ years"],
          required: true,
        },
        { type: "text", name: "jobTitle", label: "Current / most recent job title", placeholder: "e.g. Site electrician" },
        { type: "text", name: "employer", label: "Employer / company name", placeholder: "e.g. Kigali Build Ltd" },
        {
          type: "textarea",
          name: "responsibilities",
          label: "Main responsibilities",
          placeholder: "Describe the work you actually did day to day — this is what employers read first.",
          rows: 3,
        },
      ],
    },
    {
      id: "languages",
      title: "Language skills",
      fields: [
        { type: "select", name: "english", label: "English level", options: fluencyLevels, required: true },
        { type: "select", name: "german", label: "German level", options: cefrLevels },
        { type: "text", name: "otherLanguages", label: "Other languages", placeholder: "e.g. French (fluent), Swahili (native)" },
      ],
    },
    {
      id: "passport",
      title: "Passport & travel",
      fields: [
        { type: "radio", name: "passport", label: "Do you have a valid passport?", options: ["Yes", "No, but I can get one", "No"], required: true },
        { type: "date", name: "passportExpiry", label: "Passport expiry date", hint: "Most employers need at least 6 months' validity." },
        { type: "radio", name: "workedAbroad", label: "Have you previously worked abroad?", options: ["Yes", "No"], required: true },
        { type: "date", name: "travelDate", label: "Preferred travel date" },
      ],
    },
    {
      id: "intro",
      title: "About you",
      fields: [
        {
          type: "textarea",
          name: "message",
          label: "Tell us about yourself and the job you are looking for",
          placeholder: "Why you want to work abroad, what you are good at, and anything about your situation we should know.",
          rows: 5,
          required: true,
        },
        ...contactPreference,
      ],
    },
  ],
  documents: [
    { id: "cv", label: "CV / Resume", hint: "PDF preferred", required: true },
    { id: "certificates", label: "Certificates", hint: "Education or trade certificates" },
    { id: "licence", label: "Professional licence", hint: "Driving, trade or nursing licence" },
    { id: "passport", label: "Passport copy", hint: "A clear photo of the personal details page" },
    { id: "additional", label: "Additional documents", hint: "Reference letters, portfolio, anything else" },
  ],
  consents: [
    "I confirm that the information provided is accurate and complete.",
    "I consent to Linker World Travel reviewing my application and contacting me regarding relevant opportunities.",
    "I understand that submitting an application does not guarantee employment, a job offer, work permit or visa approval.",
  ],
  submitLabel: "Apply now",
  whatsappIntro: "New WORK ABROAD application",
  emailSubject: "Work Abroad Application",
  referencePrefix: "LW-APPLICATION",
  successTitle: "Application received",
  successCopy:
    "Thank you for applying with Linker World Travel. Our recruitment team will review your profile and contact you if your qualifications match an available opportunity.",
  successLinks: [
    { label: "View available jobs", href: "/work-abroad/jobs" },
    { label: "Contact us", href: "/contact" },
  ],
};

/* ================================================================== */
/*  STUDY ABROAD                                                       */
/* ================================================================== */

export const studyForm: FormConfig = {
  id: "study-abroad",
  title: "Find your study program",
  subtitle:
    "Tell us where you want to study and our team will review your preferences and identify suitable opportunities.",
  prefillField: "firstChoice",
  sections: [
    {
      id: "personal",
      title: "Personal information",
      fields: personalFields({ dob: true }),
    },
    {
      id: "destination",
      title: "Where you want to study",
      fields: [
        {
          type: "search",
          name: "firstChoice",
          label: "Preferred study country",
          options: names(studyDestinations),
          placeholder: "Search or select a country…",
          required: true,
        },
        {
          type: "multiselect",
          name: "alsoConsider",
          label: "Other destinations you would consider",
          options: names(studyDestinations),
          max: 3,
          hint: "Choose up to 3",
        },
      ],
    },
    {
      id: "program",
      title: "What you want to study",
      fields: [
        {
          type: "search",
          name: "program",
          label: "Preferred program / course",
          options: studyPrograms,
          placeholder: "e.g. Nursing, Computer Science…",
          required: true,
        },
        {
          type: "select",
          name: "level",
          label: "Study level",
          options: ["Foundation", "Certificate", "Diploma", "Bachelor's degree", "Master's degree", "MBA", "PhD", "Vocational / technical training", "Language course", "Short course"],
          required: true,
        },
        {
          type: "radio",
          name: "mode",
          label: "Preferred study mode",
          options: ["On campus", "Online", "Hybrid"],
        },
      ],
    },
    {
      id: "academic",
      title: "Academic background",
      fields: [
        {
          type: "select",
          name: "qualification",
          label: "Highest qualification",
          options: ["Secondary school", "Certificate", "Diploma", "Bachelor's degree", "Master's degree", "PhD", "Professional qualification"],
          required: true,
        },
        { type: "text", name: "fieldOfStudy", label: "Field of study", placeholder: "e.g. Biology, Business" },
        { type: "text", name: "institution", label: "Previous institution", placeholder: "Name of your school or university" },
        { type: "select", name: "graduationYear", label: "Graduation year", options: gradYears },
        { type: "text", name: "grade", label: "Grade / GPA", placeholder: "e.g. 3.4 / 4.0, Second Upper, 78%" },
      ],
    },
    {
      id: "language",
      title: "Language",
      fields: [
        { type: "select", name: "english", label: "English language level", options: fluencyLevels, required: true },
        {
          type: "select",
          name: "englishCertificate",
          label: "English language certificate",
          options: ["IELTS", "TOEFL", "PTE", "Cambridge", "None", "Other"],
        },
        { type: "text", name: "score", label: "Score", placeholder: "e.g. IELTS 6.5" },
        { type: "text", name: "otherLanguages", label: "Other languages", placeholder: "e.g. French (B2), German (A2)" },
      ],
    },
    {
      id: "timing",
      title: "Study preferences",
      fields: [
        {
          type: "select",
          name: "intake",
          label: "Preferred intake",
          options: ["January", "February", "March", "May", "September", "October", "Other"],
          required: true,
        },
        { type: "select", name: "startYear", label: "When do you want to start?", options: startYears, required: true },
      ],
    },
    {
      id: "budget",
      title: "Budget",
      fields: [
        {
          type: "select",
          name: "budget",
          label: "Estimated tuition budget per year",
          options: ["Under €5,000", "€5,000 – €10,000", "€10,000 – €15,000", "€15,000 – €20,000", "€20,000 – €30,000", "€30,000+", "I need guidance"],
          required: true,
        },
        { type: "radio", name: "scholarship", label: "Do you need scholarship opportunities?", options: ["Yes", "No"], required: true },
        { type: "radio", name: "accommodation", label: "Do you need accommodation assistance?", options: ["Yes", "No"], required: true },
      ],
    },
    {
      id: "goals",
      title: "Your study goals",
      fields: [
        {
          type: "textarea",
          name: "message",
          label: "Tell us what you want to study and why you chose your preferred country",
          placeholder: "Your academic background, career goals and what you hope this program leads to.",
          rows: 5,
          required: true,
        },
        ...contactPreference,
      ],
    },
  ],
  documents: [
    { id: "certificate", label: "Academic certificate", hint: "Your highest qualification", required: true },
    { id: "transcript", label: "Academic transcript", hint: "Full results, all years" },
    { id: "passport", label: "Passport copy", hint: "Personal details page" },
    { id: "cv", label: "CV / Resume", hint: "PDF preferred" },
    { id: "language", label: "Language certificate", hint: "IELTS, TOEFL or equivalent" },
    { id: "motivation", label: "Motivation letter", hint: "If you already have a draft" },
    { id: "additional", label: "Additional documents", hint: "Recommendation letters, portfolio" },
  ],
  consents: [
    "I confirm that the information provided is accurate.",
    "I consent to Linker World Travel reviewing my information and contacting me regarding suitable study opportunities.",
    "I understand that submitting this form does not guarantee admission, scholarship or student visa approval.",
  ],
  submitLabel: "Find my study program",
  whatsappIntro: "New STUDY ABROAD request",
  emailSubject: "Study Abroad Application",
  referencePrefix: "LW-STUDY",
  successTitle: "Your study request has been received",
  successCopy:
    "Thank you for contacting Linker World Travel. Our team will review your academic background, preferred destination, program and budget, then contact you about suitable study opportunities.",
  successLinks: [
    { label: "Explore programs", href: "/study-abroad/universities" },
    { label: "Contact us", href: "/contact" },
  ],
};

/* ================================================================== */
/*  VISA SUPPORT                                                       */
/* ================================================================== */

export const visaForm: FormConfig = {
  id: "visa-support",
  title: "Request visa support",
  subtitle:
    "Tell us where you are going and why. We reply with the document checklist for your category within one working day.",
  prefillField: "destination",
  sections: [
    {
      id: "personal",
      title: "Personal information",
      fields: personalFields(),
    },
    {
      id: "travel",
      title: "Travel information",
      fields: [
        {
          type: "search",
          name: "destination",
          label: "Which country do you want to visit?",
          options: names(visaDestinations),
          placeholder: "Search or select a country…",
          required: true,
        },
        {
          type: "select",
          name: "visaType",
          label: "What type of visa do you need?",
          options: ["Work visa", "Student visa", "Tourist / visitor visa", "Business visa", "Family visit visa", "Transit visa", "Other"],
          required: true,
        },
        {
          type: "textarea",
          name: "purpose",
          label: "Purpose of travel",
          placeholder: "Why you are travelling, who you are visiting or which employer or institution accepted you.",
          rows: 3,
          required: true,
        },
        { type: "date", name: "travelDate", label: "Preferred travel date" },
        { type: "text", name: "duration", label: "Expected length of stay", placeholder: "e.g. 2 weeks, 6 months, permanent" },
      ],
    },
    {
      id: "background",
      title: "Employment & funding",
      fields: [
        { type: "text", name: "occupation", label: "Current occupation", placeholder: "e.g. Registered nurse, student, business owner" },
        { type: "text", name: "employer", label: "Employer / institution", placeholder: "Where you work or study now" },
        { type: "text", name: "funding", label: "Monthly income / funding source", placeholder: "e.g. Salary, family sponsor, savings" },
        {
          type: "radio",
          name: "refused",
          label: "Have you ever been refused a visa?",
          options: ["No", "Yes"],
          required: true,
        },
        {
          type: "textarea",
          name: "message",
          label: "Tell us about your visa situation",
          placeholder: "Previous applications, deadlines, family circumstances — anything that affects your file.",
          rows: 4,
        },
        ...contactPreference,
      ],
    },
  ],
  documents: [
    { id: "passport", label: "Passport copy", hint: "Personal details page, valid 6+ months", required: true },
    { id: "invitation", label: "Invitation letter", hint: "If applicable" },
    { id: "acceptance", label: "Employment / admission letter", hint: "If applicable" },
    { id: "financial", label: "Bank / financial documents", hint: "Proof of funds, last 6 months" },
    { id: "additional", label: "Additional documents", hint: "Insurance, itinerary, civil documents" },
  ],
  consents: [
    "I confirm that the information provided is accurate and that all documents I supply are genuine.",
    "I consent to Linker World Travel reviewing my information and contacting me regarding visa support.",
    "I understand that visa decisions are made solely by the relevant embassy, consulate or immigration authority, and that approval is not guaranteed.",
  ],
  submitLabel: "Request visa support",
  whatsappIntro: "New VISA support request",
  emailSubject: "Visa Support Request",
  referencePrefix: "LW-VISA",
  successTitle: "Your visa request has been received",
  successCopy:
    "Thank you for contacting Linker World Travel. Our team will review your travel plans and reply with the document checklist and next steps for your visa category.",
  successLinks: [
    { label: "Visa support", href: "/visa-support" },
    { label: "Contact us", href: "/contact" },
  ],
};


/* ================================================================== */
/*  Eligibility checkers                                               */
/* ================================================================== */

export const workEligibility: EligibilityConfig = {
  service: "work",
  headline: "Check your work-abroad eligibility",
  intro: "Answer honestly — this is the same screen our consultants run before any conversation.",
  questions: [
    { q: "How old are you?", options: ["Under 18", "18–35", "36–45", "46+"], disqualifiers: ["Under 18"] },
    { q: "Do you hold a valid passport?", options: ["Yes", "No, but I can get one soon", "No"], disqualifiers: ["No"] },
    { q: "Do you have at least 6 months of work experience?", options: ["Yes", "Almost", "No"], disqualifiers: ["No"] },
    { q: "Are you comfortable working outside Rwanda for 1–3 years?", options: ["Yes", "Prefer short-term only", "No"], disqualifiers: ["No"] },
  ],
  pass: {
    title: "You're a strong candidate",
    copy: "Based on your answers you should qualify for at least one of our current roles. Start your application and we'll confirm with a live eligibility review within one working day.",
  },
  fail: {
    title: "You may need a little more preparation",
    copy: "Don't worry — this is exactly why we check first. We can still help: experience-building routes, language courses or waiting until your passport and experience are ready.",
  },
};

export const studyEligibility: EligibilityConfig = {
  service: "study",
  headline: "Check your study-abroad eligibility",
  intro: "Three quick questions tell us whether a strong country match is realistic for you right now.",
  questions: [
    { q: "What is your highest completed qualification?", options: ["Secondary (O/A level)", "Certificate / Diploma", "Bachelor's degree", "Master's degree"], disqualifiers: [] },
    { q: "Do you have a valid passport?", options: ["Yes", "No, but I can get one soon", "No"], disqualifiers: ["No"] },
    { q: "Can you show study funds or access to a sponsor?", options: ["Yes, saved", "Family can sponsor", "Need scholarship support", "Not yet"], disqualifiers: [] },
  ],
  pass: {
    title: "You're ready to apply",
    copy: "There are realistic programs for your profile. Start an application and we'll build your country and course shortlist within two working days.",
  },
  fail: {
    title: "Let's plan the right route",
    copy: "A missing passport or uncertain funding narrows your options — but doesn't close them. We'll map a pathway (including scholarships) before you commit to anything.",
  },
};

export const visaEligibility: EligibilityConfig = {
  service: "visa",
  headline: "Quick visa eligibility check",
  intro: "A 2-minute screen before you pay for anything — the same one our consultants run on every file.",
  questions: [
    { q: "Do you have a valid passport with 6+ months remaining?", options: ["Yes", "No", "Not sure"], disqualifiers: ["No"] },
    { q: "When do you need to travel?", options: ["Within 2 weeks", "Within a month", "Within 3 months", "Later"], disqualifiers: [] },
    { q: "Have you ever been refused a visa?", options: ["No", "Yes, I can explain it"], disqualifiers: [] },
    { q: "Can you show funds for the trip?", options: ["Yes", "Partially", "No"], disqualifiers: ["No"] },
  ],
  pass: {
    title: "You should be approved",
    copy: "With your answers, a decision-ready file should be very achievable. Start your application and we'll confirm with a free document check.",
  },
  fail: {
    title: "Let's fix the basics first",
    copy: "A missing passport or funds will block most applications. Tell us your situation and we'll give you a written step-by-step plan — free.",
  },
};
