/**
 * Multi-step application forms — configuration only.
 *
 * One engine (`<MultiStepForm />`) renders every funnel on the site from the
 * configs below, so each application flow looks identical and future backend
 * wiring (FastAPI, see BACKEND_PLAN.md) needs a single submission hook.
 */

import { site } from "./site";
import {
  airports,
  currencies,
  employerSectors,
  cefrLevels,
  countries,
  fluencyLevels,
  jobRoles,
  names,
  sectors,
  studyDestinations,
  studyPrograms,
  visaDestinations,
  workDestinations,
} from "./countries";

export type FieldDef =
  | { type: "text" | "email" | "tel"; name: string; label: string; placeholder?: string; required?: boolean }
  | { type: "select"; name: string; label: string; options: readonly string[]; placeholder?: string; required?: boolean }
  | { type: "radio"; name: string; label: string; options: readonly string[]; required?: boolean }
  | { type: "checkbox"; name: string; label: string; required?: boolean }
  | { type: "textarea"; name: string; label: string; placeholder?: string; required?: boolean; rows?: number }
  /** Native date picker — birth dates, passport expiry, travel dates. */
  | { type: "date"; name: string; label: string; required?: boolean; hint?: string }
  /**
   * Type-to-search picker backed by a datalist. Free text is accepted so an
   * applicant is never blocked by a country or role we did not anticipate.
   */
  | { type: "search"; name: string; label: string; options: readonly string[]; placeholder?: string; required?: boolean; hint?: string }
  /** Checkbox group. `max` caps how many can be picked (the brief's "up to 3"). */
  | { type: "multiselect"; name: string; label: string; options: readonly string[]; max?: number; required?: boolean; hint?: string }
  /** Stepper for small counts — passengers, workers required. */
  | { type: "counter"; name: string; label: string; min?: number; max?: number; required?: boolean; hint?: string };

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
  options: readonly string[];
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
          placeholder: "Describe the work you actually did day to day. This is what employers read first.",
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
    `I consent to ${site.name} reviewing my application and contacting me regarding relevant opportunities.`,
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
    { label: "View available jobs", href: "/jobs" },
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
        { type: "text", name: "university", label: "Preferred university (optional)", placeholder: "If you already have one in mind" },
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
    `I consent to ${site.name} reviewing my information and contacting me regarding suitable study opportunities.`,
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
          placeholder: "Previous applications, deadlines, family circumstances, anything that affects your file.",
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
    `I consent to ${site.name} reviewing my information and contacting me regarding visa support.`,
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
  intro: "Answer honestly. This is the same screen our consultants run before any conversation.",
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
    copy: "Don't worry. This is exactly why we check first. We can still help: experience-building routes, language courses or waiting until your passport and experience are ready.",
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
    copy: "A missing passport or uncertain funding narrows your options, but doesn't close them. We'll map a pathway (including scholarships) before you commit to anything.",
  },
};

export const visaEligibility: EligibilityConfig = {
  service: "visa",
  headline: "Quick visa eligibility check",
  intro: "A 2-minute screen before you pay for anything, the same one our consultants run on every file.",
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
    copy: "A missing passport or funds will block most applications. Tell us your situation and we'll give you a written step-by-step plan, free.",
  },
};

/* ================================================================== */
/*  FOR JOB SEEKERS — SUBMIT CV                                        */
/* ================================================================== */

export const cvForm: FormConfig = {
  id: "submit-cv",
  title: "Submit your CV",
  subtitle:
    "Create your profile and tell us where and what type of work you are looking for. We contact you when a suitable opportunity matches.",
  prefillField: "firstChoice",
  sections: [
    {
      id: "destination",
      title: "Where you want to work",
      fields: [
        {
          type: "search",
          name: "firstChoice",
          label: "First-choice country",
          options: names(workDestinations),
          placeholder: "Search or select a country…",
          required: true,
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
      title: "What you are looking for",
      fields: [
        {
          type: "search",
          name: "role",
          label: "Preferred job position",
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
      ],
    },
    {
      id: "personal",
      title: "Personal information",
      fields: personalFields({ dob: true }),
    },
    {
      id: "education",
      title: "Education",
      fields: [
        {
          type: "select",
          name: "qualification",
          label: "Highest qualification",
          options: ["Secondary school", "Certificate", "Diploma", "Bachelor's degree", "Master's degree", "PhD", "Professional qualification", "Other"],
          required: true,
        },
        { type: "text", name: "fieldOfStudy", label: "Field of study", placeholder: "e.g. Nursing, Electrical installation" },
        { type: "text", name: "institution", label: "Institution", placeholder: "Where you studied" },
        { type: "select", name: "graduationYear", label: "Graduation year", options: gradYears },
      ],
    },
    {
      id: "experience",
      title: "Work experience",
      fields: [
        {
          type: "select",
          name: "years",
          label: "Years of experience",
          options: ["No experience", "Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "10+ years"],
          required: true,
        },
        { type: "text", name: "jobTitle", label: "Current / most recent job title", placeholder: "e.g. Site electrician" },
        { type: "text", name: "employer", label: "Employer / company", placeholder: "e.g. Kigali Build Ltd" },
        {
          type: "textarea",
          name: "responsibilities",
          label: "Main responsibilities",
          placeholder: "Describe the work you actually did day to day. This is what employers read first.",
          rows: 3,
        },
      ],
    },
    {
      id: "languages",
      title: "Language skills",
      fields: [
        { type: "select", name: "english", label: "English", options: fluencyLevels, required: true },
        { type: "select", name: "german", label: "German", options: cefrLevels },
        { type: "select", name: "french", label: "French", options: ["None", ...fluencyLevels] },
        { type: "text", name: "otherLanguages", label: "Other languages", placeholder: "e.g. Swahili (native), Arabic (basic)" },
      ],
    },
    {
      id: "status",
      title: "Passport & work status",
      fields: [
        { type: "radio", name: "passport", label: "Do you have a valid passport?", options: ["Yes", "No"], required: true },
        { type: "date", name: "passportExpiry", label: "Passport expiry date", hint: "Most employers need at least 6 months' validity." },
        {
          type: "radio",
          name: "permit",
          label: "Do you currently have a work permit or visa?",
          options: ["Yes", "No", "Application in progress"],
          required: true,
        },
        { type: "radio", name: "workedAbroad", label: "Have you worked abroad before?", options: ["Yes", "No"], required: true },
      ],
    },
    {
      id: "preferences",
      title: "Job preferences",
      fields: [
        { type: "text", name: "salary", label: "Expected salary", placeholder: "e.g. €2,800 gross per month" },
        { type: "date", name: "startDate", label: "Preferred starting date" },
        { type: "radio", name: "relocate", label: "Are you willing to relocate?", options: ["Yes", "No"], required: true },
        { type: "radio", name: "interview", label: "Are you available for an interview?", options: ["Yes", "No"], required: true },
      ],
    },
    {
      id: "intro",
      title: "About you",
      fields: [
        {
          type: "textarea",
          name: "message",
          label: "Why are you looking for work abroad, and what opportunity interests you?",
          placeholder: "Your situation, your strengths, and what you want this move to change.",
          rows: 5,
          required: true,
        },
        ...contactPreference,
      ],
    },
  ],
  documents: [
    { id: "cv", label: "CV / Resume", hint: "PDF, DOC or DOCX", required: true },
    { id: "certificates", label: "Academic certificates", hint: "Your highest qualification" },
    { id: "licence", label: "Professional certificates / licences", hint: "Trade, driving or nursing licence" },
    { id: "passport", label: "Passport copy", hint: "Personal details page" },
    { id: "additional", label: "Additional documents", hint: "References, portfolio, anything else" },
  ],
  consents: [
    "I confirm that the information provided in this application is accurate and complete.",
    `I authorize ${site.name} to review my CV and application for suitable employment opportunities.`,
    "I understand that submitting my CV does not guarantee employment, a job offer, work permit or visa approval.",
  ],
  submitLabel: "Submit my CV",
  whatsappIntro: "New CV submission",
  emailSubject: "CV Submission",
  referencePrefix: "LW-CV",
  successTitle: "Thank you for submitting your CV",
  successCopy:
    "Your profile has been received. Our recruitment team will review your information and contact you if your qualifications and experience match a suitable opportunity.",
  successLinks: [
    { label: "View available jobs", href: "/jobs" },
    { label: "Return home", href: "/" },
  ],
};

/* ================================================================== */
/*  FOR EMPLOYERS — JOB ORDER                                          */
/* ================================================================== */

export const employerForm: FormConfig = {
  id: "job-order",
  title: "Submit a job order",
  subtitle:
    "Tell us about your recruitment needs. We review your requirements and help identify suitable candidates for the positions you need to fill.",
  sections: [
    {
      id: "company",
      title: "Company information",
      fields: [
        { type: "text", name: "company", label: "Company name", placeholder: "Registered business name", required: true },
        { type: "search", name: "country", label: "Country", options: countries, placeholder: "Where the company is based", required: true },
        { type: "text", name: "city", label: "City / location", placeholder: "e.g. Munich", required: true },
        { type: "text", name: "website", label: "Company website", placeholder: "https://" },
        { type: "select", name: "sector", label: "Industry / sector", options: employerSectors, required: true },
      ],
    },
    {
      id: "contact",
      title: "Contact person",
      fields: [
        { type: "text", name: "contactName", label: "Contact person full name", required: true },
        { type: "text", name: "position", label: "Position / job title", placeholder: "e.g. HR Manager", required: true },
        { type: "email", name: "email", label: "Business email", placeholder: "you@company.com", required: true },
        { type: "tel", name: "phone", label: "Phone number", placeholder: "+49 …", required: true },
        { type: "tel", name: "whatsapp", label: "WhatsApp number", placeholder: "If different" },
        {
          type: "radio",
          name: "contactMethod",
          label: "Preferred contact method",
          options: ["Email", "Phone", "WhatsApp"],
          required: true,
        },
      ],
    },
    {
      id: "role",
      title: "Job requirements",
      fields: [
        { type: "text", name: "jobTitle", label: "Job title", placeholder: "e.g. Healthcare assistant", required: true },
        { type: "counter", name: "workers", label: "Number of workers required", min: 1, max: 99, required: true },
        { type: "text", name: "department", label: "Department / sector", placeholder: "e.g. Elderly care" },
        { type: "text", name: "location", label: "Job location", placeholder: "City / region", required: true },
        {
          type: "radio",
          name: "employmentType",
          label: "Employment type",
          options: ["Full-time", "Part-time", "Contract", "Seasonal", "Temporary"],
          required: true,
        },
        { type: "text", name: "duration", label: "Contract duration", placeholder: "e.g. 24 months, permanent", required: true },
        { type: "date", name: "startDate", label: "Expected start date", required: true },
      ],
    },
    {
      id: "candidate",
      title: "Candidate requirements",
      fields: [
        { type: "text", name: "education", label: "Required education", placeholder: "e.g. Vocational qualification in care" },
        { type: "text", name: "experience", label: "Required experience", placeholder: "e.g. 2+ years", required: true },
        {
          type: "textarea",
          name: "skills",
          label: "Required skills",
          placeholder: "The practical skills a candidate must already have.",
          rows: 3,
        },
        { type: "radio", name: "licence", label: "Professional licence / certification required?", options: ["Yes", "No"], required: true },
        { type: "text", name: "licenceDetail", label: "If yes, which licence or certification?", placeholder: "e.g. EU category C licence" },
        { type: "text", name: "language", label: "Language requirements", placeholder: "e.g. German" },
        { type: "select", name: "languageLevel", label: "Minimum language level", options: ["Not required", ...cefrLevels.slice(1)] },
      ],
    },
    {
      id: "salary",
      title: "Salary & benefits",
      fields: [
        { type: "text", name: "salary", label: "Salary", placeholder: "e.g. 2,900 – 3,400", required: true },
        { type: "select", name: "currency", label: "Currency", options: currencies, required: true },
        {
          type: "radio",
          name: "salaryPeriod",
          label: "Salary period",
          options: ["Hourly", "Weekly", "Monthly", "Annual"],
          required: true,
        },
        { type: "radio", name: "overtime", label: "Overtime available?", options: ["Yes", "No"], required: true },
        {
          type: "radio",
          name: "accommodation",
          label: "Accommodation provided?",
          options: ["Yes", "No", "Paid by employee", "Company contribution"],
          required: true,
        },
        {
          type: "radio",
          name: "meals",
          label: "Food / meals provided?",
          options: ["Yes", "No", "Allowance provided"],
          required: true,
        },
        {
          type: "multiselect",
          name: "benefits",
          label: "Additional benefits",
          options: ["Health insurance", "Transportation", "Accommodation", "Meals", "Paid vacation", "Overtime pay", "Bonus", "Other"],
        },
      ],
    },
    {
      id: "immigration",
      title: "Visa & work permit",
      fields: [
        {
          type: "radio",
          name: "permitSupport",
          label: "Does the company provide work permit support?",
          options: ["Yes", "No", "Depends on position", "Not applicable"],
          required: true,
        },
        {
          type: "radio",
          name: "sponsorship",
          label: "Does the company provide visa sponsorship?",
          options: ["Yes", "No", "Depends on position"],
          required: true,
        },
        {
          type: "radio",
          name: "permitCosts",
          label: "Who is responsible for visa / work permit costs?",
          options: ["Employer", "Employee", "Shared", "Other"],
          required: true,
        },
        {
          type: "textarea",
          name: "immigrationNotes",
          label: "Additional immigration information",
          placeholder: "Describe the work permit or visa arrangement.",
          rows: 3,
        },
      ],
    },
    {
      id: "description",
      title: "Job description",
      fields: [
        {
          type: "textarea",
          name: "responsibilities",
          label: "Job responsibilities",
          placeholder: "The main duties and responsibilities of the position.",
          rows: 4,
          required: true,
        },
        {
          type: "textarea",
          name: "qualifications",
          label: "Required qualifications",
          placeholder: "Formal qualifications a candidate must hold.",
          rows: 3,
        },
        {
          type: "textarea",
          name: "profile",
          label: "Preferred candidate profile",
          placeholder: "The kind of person who does well in this role.",
          rows: 3,
        },
        { type: "text", name: "hours", label: "Working hours", placeholder: "e.g. 40 hours per week", required: true },
        {
          type: "radio",
          name: "schedule",
          label: "Work schedule",
          options: ["Day shift", "Night shift", "Rotating shifts", "Flexible", "Other"],
          required: true,
        },
      ],
    },
    {
      id: "recruitment",
      title: "Recruitment details",
      fields: [
        { type: "search", name: "nationality", label: "Preferred candidate nationality", options: ["No preference", ...countries], placeholder: "No preference" },
        { type: "text", name: "age", label: "Age requirement", placeholder: "Only where lawful and job-related" },
        {
          type: "radio",
          name: "gender",
          label: "Gender requirement",
          options: ["No preference", "Lawful job-related requirement, specified below"],
          required: true,
        },
        {
          type: "radio",
          name: "interviewMethod",
          label: "Interview method",
          options: ["Online interview", "In-person interview", "Phone interview", "Not yet decided"],
          required: true,
        },
        { type: "date", name: "deadline", label: "Expected recruitment deadline" },
        {
          type: "radio",
          name: "urgency",
          label: "How quickly do you need candidates?",
          options: ["Immediately", "Within 1 month", "1–3 months", "3–6 months", "Flexible"],
          required: true,
        },
        { type: "radio", name: "international", label: "Are you open to international candidates?", options: ["Yes", "No"], required: true },
        { type: "radio", name: "priorExperience", label: "Previous international recruitment experience?", options: ["Yes", "No"], required: true },
        {
          type: "textarea",
          name: "message",
          label: "Anything else we should know about this request?",
          placeholder: "Context that would help us screen the right people.",
          rows: 3,
        },
      ],
    },
  ],
  documents: [
    { id: "vacancy", label: "Job description / vacancy document", hint: "The role as you have written it" },
    { id: "profile", label: "Company profile", hint: "So candidates know who they are joining" },
    { id: "contract", label: "Employment contract / job offer", hint: "Template or sample" },
    { id: "additional", label: "Additional documents" },
  ],
  consents: [
    "I confirm that the information provided is accurate and that I am authorized to submit this recruitment request on behalf of the company.",
    `I agree that ${site.name} may contact me regarding this job order.`,
    "I understand that candidate recruitment is subject to job requirements, candidate availability and applicable employment and immigration regulations.",
  ],
  submitLabel: "Submit job order",
  whatsappIntro: "New EMPLOYER job order",
  emailSubject: "Employer Job Order",
  referencePrefix: "LWT-JOB-ORDER",
  successTitle: "Job order received",
  successCopy:
    "Your recruitment request has been submitted. Our recruitment team will review the requirements and contact your company regarding the next steps.",
  successLinks: [
    { label: "Submit another job order", href: "/employers" },
    { label: "Contact our recruitment team", href: "/contact" },
  ],
};

/* ================================================================== */
/*  FLIGHT TICKETS                                                     */
/* ================================================================== */

export const flightForm: FormConfig = {
  id: "flight",
  title: "Request a flight",
  subtitle:
    "Tell us about your trip and our travel team comes back with available options, schedules and pricing.",
  sections: [
    {
      id: "passenger",
      title: "Passenger information",
      fields: [
        { type: "text", name: "fullName", label: "Full name (as shown on passport)", placeholder: "e.g. Jean-Claude Mugisha", required: true },
        { type: "email", name: "email", label: "Email address", placeholder: "you@example.com", required: true },
        { type: "tel", name: "phone", label: "Phone number", placeholder: "+250 7…", required: true },
        { type: "tel", name: "whatsapp", label: "WhatsApp number", placeholder: "If different from your phone" },
        { type: "search", name: "nationality", label: "Nationality", options: countries, placeholder: "Search your nationality…" },
      ],
    },
    {
      id: "trip",
      title: "Trip details",
      fields: [
        {
          type: "radio",
          name: "tripType",
          label: "Trip type",
          options: ["One way", "Round trip", "Multi-city"],
          required: true,
        },
        {
          type: "search",
          name: "from",
          label: "Departure city / airport",
          options: airports,
          placeholder: "Search a city or airport…",
          required: true,
        },
        {
          type: "search",
          name: "to",
          label: "Destination city / airport",
          options: airports,
          placeholder: "Search a city or airport…",
          required: true,
        },
        { type: "date", name: "departDate", label: "Departure date", required: true },
        { type: "date", name: "returnDate", label: "Return date", hint: "Round trips only" },
        {
          type: "select",
          name: "departTime",
          label: "Preferred departure time",
          options: ["Morning", "Afternoon", "Evening", "Night", "Any time"],
        },
      ],
    },
    {
      id: "passengers",
      title: "Passengers & class",
      fields: [
        { type: "counter", name: "adults", label: "Adults", min: 1, max: 9, required: true, hint: "12 years and over" },
        { type: "counter", name: "children", label: "Children", min: 0, max: 9, hint: "2 – 11 years" },
        { type: "counter", name: "infants", label: "Infants", min: 0, max: 9, hint: "Under 2 years" },
        {
          type: "radio",
          name: "class",
          label: "Preferred class",
          options: ["Economy", "Premium economy", "Business", "First class", "No preference"],
          required: true,
        },
      ],
    },
    {
      id: "preferences",
      title: "Baggage & preferences",
      fields: [
        {
          type: "radio",
          name: "baggage",
          label: "Baggage requirements",
          options: ["Standard baggage", "Additional baggage", "No preference"],
          required: true,
        },
        {
          type: "multiselect",
          name: "assistance",
          label: "Special requirements",
          options: ["Wheelchair assistance", "Special assistance", "Travelling with infant", "Other"],
        },
        { type: "text", name: "airline", label: "Preferred airline", placeholder: "e.g. RwandAir, Qatar Airways" },
        { type: "text", name: "flightNumber", label: "Do you have a preferred flight?", placeholder: "Flight number, if known" },
        {
          type: "radio",
          name: "stops",
          label: "Maximum number of stops",
          options: ["Direct flight only", "1 stop", "2+ stops", "No preference"],
          required: true,
        },
        { type: "text", name: "budget", label: "Budget per passenger", placeholder: "e.g. $850" },
      ],
    },
    {
      id: "travel",
      title: "Travel information",
      fields: [
        {
          type: "radio",
          name: "purpose",
          label: "Purpose of travel",
          options: ["Work", "Study", "Tourism", "Business", "Family visit", "Medical", "Other"],
          required: true,
        },
        {
          type: "radio",
          name: "visaStatus",
          label: "Do you already have the required visa or travel authorization?",
          options: ["Yes", "No", "Application in progress", "Not required"],
          required: true,
        },
        {
          type: "textarea",
          name: "message",
          label: "Additional information",
          placeholder: "Any special requirements, flexible dates or preferences.",
          rows: 3,
        },
        ...contactPreference,
      ],
    },
  ],
  documents: [
    { id: "passport", label: "Passport copy", hint: "So the name on the ticket matches exactly" },
    { id: "visa", label: "Visa / travel authorization", hint: "If you already have it" },
    { id: "additional", label: "Additional documents" },
  ],
  consents: [
    "I confirm that the information provided is accurate, and that passenger names match their passports.",
    `I agree that ${site.name} may contact me regarding available flight options and prices.`,
  ],
  submitLabel: "Search & request flight",
  whatsappIntro: "New FLIGHT request",
  emailSubject: "Flight Request",
  referencePrefix: "LWT-FLIGHT",
  successTitle: "Your flight request has been received",
  successCopy:
    "Our travel team will review your requirements and contact you with available flight options, schedules and pricing.",
  successLinks: [
    { label: "Back to flight tickets", href: "/flight-tickets" },
    { label: "Contact us", href: "/contact" },
  ],
};

/* ================================================================== */
/*  CONTACT                                                            */
/* ================================================================== */

export const contactForm: FormConfig = {
  id: "contact",
  title: "Send us a message",
  subtitle:
    "Tell us what you need and our team gets back to you using the method you prefer.",
  sections: [
    {
      id: "you",
      title: "Your details",
      fields: [
        { type: "text", name: "fullName", label: "Full name", placeholder: "Your name", required: true },
        { type: "tel", name: "phone", label: "Phone number", placeholder: "+250 7…", required: true },
        { type: "tel", name: "whatsapp", label: "WhatsApp number", placeholder: "If different from your phone" },
        { type: "email", name: "email", label: "Email address", placeholder: "you@example.com", required: true },
        { type: "search", name: "residence", label: "Country of residence", options: countries, placeholder: "Where do you live now?" },
      ],
    },
    {
      id: "need",
      title: "What you need",
      fields: [
        {
          type: "radio",
          name: "service",
          label: "Select a service",
          options: [
            "Work abroad",
            "Study abroad",
            "Visa support",
            "Flight tickets",
            "Submit CV",
            "Employer recruitment",
            "Business partnership",
            "General inquiry",
          ],
          required: true,
        },
        {
          type: "search",
          name: "country",
          label: "Which country are you interested in?",
          options: names(workDestinations),
          placeholder: "Search or select a country…",
        },
        { type: "text", name: "role", label: "If you are looking for work, preferred job position", placeholder: "e.g. Caregiver" },
        {
          type: "select",
          name: "years",
          label: "Years of experience",
          options: ["No experience", "Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "10+ years"],
        },
        { type: "text", name: "program", label: "If you want to study, preferred program", placeholder: "e.g. Nursing" },
        {
          type: "select",
          name: "level",
          label: "Study level",
          options: ["Diploma", "Bachelor's", "Master's", "PhD", "Vocational", "Language course", "Other"],
        },
      ],
    },
    {
      id: "message",
      title: "Your message",
      fields: [
        {
          type: "textarea",
          name: "message",
          label: "How can we help you?",
          placeholder: "Tell us what you are trying to do and where you are stuck.",
          rows: 5,
          required: true,
        },
        ...contactPreference,
      ],
    },
  ],
  documents: [
    { id: "cv", label: "CV", hint: "If relevant" },
    { id: "passport", label: "Passport copy", hint: "If relevant" },
    { id: "certificates", label: "Academic certificates", hint: "If relevant" },
    { id: "additional", label: "Other supporting documents" },
  ],
  consents: [
    "I confirm that the information provided is accurate.",
    `I consent to ${site.name} using my information to respond to my inquiry and provide relevant services.`,
  ],
  submitLabel: "Send message",
  whatsappIntro: "New CONTACT inquiry",
  emailSubject: "Website Inquiry",
  referencePrefix: "LWT-CONTACT",
  successTitle: "Thank you for getting in touch",
  successCopy:
    "Your inquiry has been received. Our team will review your request and contact you using your preferred communication method.",
  successLinks: [
    { label: "Return home", href: "/" },
    { label: "View opportunities", href: "/opportunities" },
  ],
};
