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
  | { type: "textarea"; name: string; label: string; placeholder?: string; required?: boolean; rows?: number };

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
  submitLabel: string;
  whatsappIntro: string;
  emailSubject: string;
};

/* ================================================================== */
/*  WORK ABROAD                                                        */
/* ================================================================== */

export const workForm: FormConfig = {
  id: "work-abroad",
  title: "Apply for work abroad",
  subtitle:
    "Five short steps. We review every application within one working day and reply on WhatsApp.",
  sections: [
    {
      id: "role",
      title: "Your profile",
      fields: [
        {
          type: "select",
          name: "role",
          label: "What kind of role are you looking for?",
          options: [
            "Healthcare (nurse, caregiver, doctor)",
            "Construction & trades",
            "Hospitality & tourism",
            "Logistics, warehouse & driving",
            "IT & engineering",
            "Agriculture & seasonal work",
            "Not sure — advise me",
          ],
          required: true,
        },
        {
          type: "select",
          name: "experience",
          label: "Years of experience",
          options: ["Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"],
          required: true,
        },
        {
          type: "select",
          name: "education",
          label: "Highest level of education",
          options: ["Primary", "Secondary (O/A level)", "Certificate / Diploma", "Bachelor's degree", "Master's or higher"],
          required: true,
        },
      ],
    },
    {
      id: "destination",
      title: "Your destination",
      fields: [
        {
          type: "radio",
          name: "destination",
          label: "Where would you like to work?",
          options: [
            "United Arab Emirates",
            "Qatar",
            "Saudi Arabia",
            "United Kingdom",
            "Germany",
            "Poland",
            "Canada",
            "Australia",
            "Anywhere you recommend",
          ],
          required: true,
        },
        {
          type: "select",
          name: "start",
          label: "When can you start?",
          options: ["Immediately", "Within 1–3 months", "Within 3–6 months", "Not sure yet"],
          required: true,
        },
      ],
    },
    {
      id: "contact",
      title: "Your details",
      fields: [
        { type: "text", name: "fullName", label: "Full name (as on passport)", placeholder: "e.g. Jean-Claude Mugisha", required: true },
        { type: "email", name: "email", label: "Email address", placeholder: "you@example.com", required: true },
        { type: "tel", name: "phone", label: "Phone / WhatsApp", placeholder: "+250 7…", required: true },
        { type: "select", name: "passport", label: "Do you have a valid passport?", options: ["Yes", "No, but I can get one", "No"], required: true },
        {
          type: "textarea",
          name: "message",
          label: "Anything we should know? (optional)",
          placeholder: "Current job, languages, injuries or gaps you'd like to explain…",
          rows: 3,
        },
      ],
    },
  ],
  documents: [
    { id: "passport", label: "Passport bio page", hint: "A clear photo of the personal details page", required: true },
    { id: "cv", label: "CV / Resume", hint: "PDF preferred", required: true },
    { id: "id", label: "National ID", hint: "Front and back", required: true },
    { id: "certificates", label: "Certificates & diplomas", hint: "Education or trade certificates", required: false },
    { id: "references", label: "Reference letters", hint: "From past employers, if available", required: false },
    { id: "photo", label: "Passport photo", hint: "White background, 2×2 inches", required: false },
  ],
  submitLabel: "Submit application",
  whatsappIntro: "New WORK ABROAD application",
  emailSubject: "Work Abroad Application",
};

/* ================================================================== */
/*  STUDY ABROAD                                                       */
/* ================================================================== */

export const studyForm: FormConfig = {
  id: "study-abroad",
  title: "Apply for study abroad",
  subtitle:
    "Tell us about your goals and documents. We respond with a country and course shortlist within two working days.",
  sections: [
    {
      id: "level",
      title: "What are you studying?",
      fields: [
        {
          type: "select",
          name: "level",
          label: "Level of study",
          options: ["Foundation / pathway", "Bachelor's degree", "Master's degree", "PhD / research", "Short course / language"],
          required: true,
        },
        {
          type: "select",
          name: "field",
          label: "Preferred field",
          options: [
            "Business & finance",
            "Health & medicine",
            "Engineering & technology",
            "Computer science / IT",
            "Arts, law & humanities",
            "Hospitality & tourism",
            "Not sure — recommend me",
          ],
          required: true,
        },
      ],
    },
    {
      id: "country",
      title: "Where to?",
      fields: [
        {
          type: "radio",
          name: "country",
          label: "Preferred study country",
          options: ["Canada", "United Kingdom", "Germany", "Australia", "United States", "Singapore", "Open to all — advise me"],
          required: true,
        },
        {
          type: "select",
          name: "intake",
          label: "Target intake",
          options: ["Spring 2026", "Summer 2026", "Autumn 2026", "Spring 2027", "Flexible"],
          required: true,
        },
        {
          type: "select",
          name: "budget",
          label: "Annual budget (tuition + living)",
          options: ["Under $10,000", "$10,000–$20,000", "$20,000–$35,000", "$35,000+", "I need scholarship support"],
          required: true,
        },
      ],
    },
    {
      id: "contact",
      title: "Your details",
      fields: [
        { type: "text", name: "fullName", label: "Full name (as on passport)", placeholder: "e.g. Aline Uwase", required: true },
        { type: "email", name: "email", label: "Email address", placeholder: "you@example.com", required: true },
        { type: "tel", name: "phone", label: "Phone / WhatsApp", placeholder: "+250 7…", required: true },
        {
          type: "select",
          name: "english",
          label: "English test status",
          options: ["IELTS / TOEFL already passed", "Booked a test date", "Have not started", "Exempt (taught in English)"],
          required: true,
        },
        {
          type: "textarea",
          name: "message",
          label: "Your story (optional)",
          placeholder: "Grades, work experience, what you want to become…",
          rows: 3,
        },
      ],
    },
  ],
  documents: [
    { id: "passport", label: "Passport bio page", hint: "A clear photo of the personal details page", required: true },
    { id: "transcripts", label: "Academic transcripts", hint: "All years, current or previous study", required: true },
    { id: "certificates", label: "Diplomas / certificates", hint: "Graduation or level completion", required: false },
    { id: "cv", label: "CV / Resume", hint: "Work & volunteer experience", required: false },
    { id: "english", label: "IELTS / TOEFL result", hint: "If you already have one", required: false },
    { id: "recommendation", label: "Recommendation letter", hint: "Academic or employer reference", required: false },
  ],
  submitLabel: "Submit application",
  whatsappIntro: "New STUDY ABROAD application",
  emailSubject: "Study Abroad Application",
};

/* ================================================================== */
/*  VISA SERVICES                                                      */
/* ================================================================== */

export const visaForm: FormConfig = {
  id: "visa",
  title: "Start your visa application",
  subtitle:
    "Answer a few questions and upload your documents. We build an embassy-ready file and book your appointment.",
  sections: [
    {
      id: "visa-type",
      title: "Which visa?",
      fields: [
        {
          type: "radio",
          name: "visaType",
          label: "What do you need?",
          options: ["Tourist visa", "Business visa", "Work visa", "Student visa", "Transit visa", "Not sure — advise me"],
          required: true,
        },
        {
          type: "select",
          name: "destination",
          label: "Destination country",
          options: [
            "Schengen (Europe)",
            "United Kingdom",
            "United States",
            "Canada",
            "United Arab Emirates",
            "Saudi Arabia / Qatar",
            "Other",
          ],
          required: true,
        },
        {
          type: "select",
          name: "travelDate",
          label: "When do you need to travel?",
          options: ["Within 2 weeks", "Within 1 month", "Within 3 months", "More than 3 months"],
          required: true,
        },
      ],
    },
    {
      id: "details",
      title: "Your details",
      fields: [
        { type: "text", name: "fullName", label: "Full name (as on passport)", placeholder: "e.g. Eric Niyonzima", required: true },
        { type: "email", name: "email", label: "Email address", placeholder: "you@example.com", required: true },
        { type: "tel", name: "phone", label: "Phone / WhatsApp", placeholder: "+250 7…", required: true },
        {
          type: "select",
          name: "history",
          label: "Previous visa history",
          options: ["Never applied", "Applied and approved", "Applied and refused", "Held a visa that expired"],
          required: true,
        },
      ],
    },
    {
      id: "purpose",
      title: "Purpose & travel",
      fields: [
        {
          type: "textarea",
          name: "purpose",
          label: "Purpose of travel",
          placeholder: "Holiday, family visit, conference, work secondment…",
          required: true,
          rows: 3,
        },
        {
          type: "textarea",
          name: "message",
          label: "Anything we should know? (optional)",
          placeholder: "Refusals to explain, short deadlines, special requests…",
          rows: 3,
        },
      ],
    },
  ],
  documents: [
    { id: "passport", label: "Passport bio page", hint: "Must be valid 6+ months", required: true },
    { id: "photo", label: "Passport photo", hint: "White background, 2×2 inches", required: true },
    { id: "bankStatements", label: "Bank statements", hint: "Last 6 months", required: true },
    { id: "id", label: "National ID", hint: "Front and back", required: false },
    { id: "travelHistory", label: "Previous visas / travel stamps", hint: "If available", required: false },
    { id: "supporting", label: "Invitation / employer letter", hint: "Business or family invitation, if applicable", required: false },
  ],
  submitLabel: "Submit visa application",
  whatsappIntro: "New VISA application",
  emailSubject: "Visa Application",
};

/* ================================================================== */
/*  SAFARI                                                             */
/* ================================================================== */

export const safariForm: FormConfig = {
  id: "safari",
  title: "Plan your safari",
  subtitle:
    "Tell us about your dates and group. A safari specialist replies with a day-by-day itinerary within 24 hours.",
  sections: [
    {
      id: "trip",
      title: "The trip",
      fields: [
        {
          type: "select",
          name: "package",
          label: "Which experience are you interested in?",
          options: [
            "Volcanoes Gorilla Trek (Rwanda)",
            "Great Migration (Kenya)",
            "Serengeti & Ngorongoro (Tanzania)",
            "Big Five, Akagera (Rwanda)",
            "Luxury lodge stay",
            "Honeymoon / private trip",
            "Something custom",
          ],
          required: true,
        },
        {
          type: "select",
          name: "month",
          label: "Preferred month",
          options: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Flexible"],
          required: true,
        },
        {
          type: "select",
          name: "nights",
          label: "How many nights?",
          options: ["2–3 nights", "4–5 nights", "6–8 nights", "9+ nights", "Not sure"],
          required: true,
        },
      ],
    },
    {
      id: "group",
      title: "Who's coming?",
      fields: [
        { type: "text", name: "fullName", label: "Lead traveller name", placeholder: "e.g. Sarah Thomas", required: true },
        { type: "email", name: "email", label: "Email address", placeholder: "you@example.com", required: true },
        { type: "tel", name: "phone", label: "Phone / WhatsApp", placeholder: "+44 7…", required: true },
        {
          type: "select",
          name: "groupSize",
          label: "Number of travellers",
          options: ["1 (solo)", "2", "3–4", "5–8", "9+"],
          required: true,
        },
        {
          type: "select",
          name: "kids",
          label: "Travelling with children?",
          options: ["No", "Yes, under 6", "Yes, 6–12", "Yes, teenagers"],
          required: true,
        },
      ],
    },
    {
      id: "style",
      title: "Style & budget",
      fields: [
        {
          type: "radio",
          name: "style",
          label: "Preferred style",
          options: ["Budget & group", "Comfort (mid-range)", "Luxury", "Ultra-luxury / private"],
          required: true,
        },
        {
          type: "textarea",
          name: "message",
          label: "Anything that would make this trip special? (optional)",
          placeholder: "Anniversary, mobility needs, must-see animals, dietary requirements…",
          rows: 3,
        },
      ],
    },
  ],
  documents: [
    { id: "passport", label: "Passport bio page", hint: "For permit & lodge bookings", required: true },
    { id: "visa", label: "Travel insurance", hint: "Proof or policy number, if you have it", required: false },
  ],
  submitLabel: "Submit my safari request",
  whatsappIntro: "New SAFARI booking request",
  emailSubject: "Safari Booking Request",
};

/* ================================================================== */
/*  VEHICLE IMPORT & EXPORT                                            */
/* ================================================================== */

export const vehicleForm: FormConfig = {
  id: "vehicle",
  title: "Request a vehicle quote",
  subtitle:
    "Give us the details and we come back within 24 hours with a fully itemised landed price.",
  sections: [
    {
      id: "vehicle",
      title: "The vehicle",
      fields: [
        { type: "text", name: "makeModel", label: "Make & model", placeholder: "e.g. Toyota Land Cruiser 2021", required: true },
        {
          type: "select",
          name: "source",
          label: "Preferred source market",
          options: ["Japan", "UAE (Dubai)", "Europe", "No preference — best value"],
          required: true,
        },
        {
          type: "select",
          name: "budget",
          label: "Budget (vehicle only)",
          options: ["Under $10,000", "$10,000–$25,000", "$25,000–$50,000", "$50,000+"],
          required: true,
        },
      ],
    },
    {
      id: "route",
      title: "The route",
      fields: [
        {
          type: "radio",
          name: "direction",
          label: "Import or export?",
          options: ["Import into Rwanda", "Import into another country", "Export a vehicle I own"],
          required: true,
        },
        {
          type: "select",
          name: "port",
          label: "Destination port",
          options: ["Kigali / central (via Dar es Salaam)", "Via Mombasa", "Other"],
          required: true,
        },
      ],
    },
    {
      id: "contact",
      title: "Your details",
      fields: [
        { type: "text", name: "fullName", label: "Your name", placeholder: "e.g. Patrick Nkusi", required: true },
        { type: "email", name: "email", label: "Email address", placeholder: "you@example.com", required: true },
        { type: "tel", name: "phone", label: "Phone / WhatsApp", placeholder: "+250 7…", required: true },
        {
          type: "textarea",
          name: "message",
          label: "Anything else? (optional)",
          placeholder: "Colour, trim, year range, delivery timeline…",
          rows: 3,
        },
      ],
    },
  ],
  documents: [
    { id: "id", label: "National ID / company registration", hint: "The importing entity", required: true },
    { id: "specs", label: "Vehicle specs / listing", hint: "Photo or link to what you want sourced", required: false },
  ],
  submitLabel: "Request my quote",
  whatsappIntro: "New VEHICLE quote request",
  emailSubject: "Vehicle Import / Export Quote",
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
