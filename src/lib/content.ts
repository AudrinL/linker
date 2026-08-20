/**
 * Editorial content for the site. Written copy lives here, not in components,
 * so pages stay layout-only and the client can revise text in one place.
 */

/**
 * The four pillars, and the single source of truth for how the business
 * describes itself. The home page previously named its offering three
 * incompatible ways — a five-item hero strip, a four-item tile grid and a
 * "Three services" panel stack — so a visitor could not form a model of what
 * is sold. Everything that enumerates services now maps this array, and the
 * order matches the site navigation.
 */
export type Service = {
  slug: string;
  index: string;
  /** Long-form title for the panel stack. */
  title: string;
  /** Short label used by the tile grid and anywhere the pillar is listed. */
  label: string;
  kicker: string;
  blurb: string;
  /** One line, tile-length. */
  summary: string;
  points: string[];
  image: string;
  href: string;
};

export const services: Service[] = [
  {
    slug: "recruitment",
    index: "01",
    title: "Work abroad",
    label: "Work Abroad",
    kicker: "International Recruitment",
    blurb:
      "We place skilled and semi-skilled professionals with vetted employers across the Gulf, Europe and North America, and we stay with you from first interview to first payslip.",
    summary: "Find international employment with vetted employers.",
    points: [
      "Employer matching & interview preparation",
      "Work permit and contract processing",
      "Pre-departure briefing and orientation",
      "Ongoing support after you arrive",
    ],
    image: "/img/recruitment-worker.png",
    href: "/work-abroad",
  },
  {
    slug: "study-abroad",
    index: "02",
    title: "Study abroad",
    label: "Study Abroad",
    kicker: "Admissions & Student Visas",
    blurb:
      "Universities and colleges matched to the qualifications you actually hold and the budget you actually have, with the admission file and the student visa handled as one process.",
    summary: "Reach universities and colleges worldwide.",
    points: [
      "University and course matching",
      "Admission file preparation",
      "Student visa applications",
      "Accommodation and arrival guidance",
    ],
    image: "/assets/move%20abroad.jpg",
    href: "/study-abroad",
  },
  {
    slug: "visa-services",
    index: "03",
    title: "Cross borders",
    label: "Visa Support",
    kicker: "Visa Services",
    blurb:
      "Work, study and tourist visas prepared with the precision that gets applications approved the first time. We handle the paperwork so you can plan the life on the other side of it.",
    summary: "Get your application and documents right first time.",
    points: [
      "Work, study and tourist visa applications",
      "Document review and certified translation",
      "Embassy appointment scheduling",
      "Honest eligibility assessment, upfront",
    ],
    image: "/img/visa-documents.png",
    href: "/visa-support",
  },
  {
    slug: "travel-services",
    index: "04",
    title: "Travel well",
    label: "Flights & Travel",
    kicker: "Flights, Hotels & Packages",
    blurb:
      "Competitive fares, considered hotels and itineraries built around how you actually want to travel, with a real person on the other end of the phone when plans change.",
    summary: "Book flights, hotels and tailored packages.",
    points: [
      "International and regional flight booking",
      "Hotel and lodge reservations worldwide",
      "Tailored holiday packages",
      "Travel insurance and airport assistance",
    ],
    image: "/img/travel-terminal.png",
    href: "/travel",
  },
];

/* ------------------------------------------------------------------ */

/**
 * One source for the four numbers. The hero used to carry its own hardcoded
 * copy of these, already drifting from this list in both wording and order.
 * `short` is the hero's compressed label; `label` is the full one Proof uses.
 */
export const stats = [
  { value: 2400, suffix: "+", short: "people placed", label: "Travellers & candidates placed" },
  { value: 38, suffix: "", short: "countries", label: "Countries we operate across" },
  { value: 96, suffix: "%", short: "visa success rate", label: "Visa application success rate" },
  { value: 11, suffix: " yrs", short: "since 2014", label: "Connecting Africa to the world" },
];

/** Pre-rendered display strings for the hero, which shows them without a counter. */
export const heroStats = stats.map((s) => ({
  value: `${s.value.toLocaleString("en-GB")}${s.suffix}`,
  label: s.short,
}));

/* ------------------------------------------------------------------ */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  service: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I had been turned down for a work visa once already and had almost given up. Linker World rebuilt my whole application, explained exactly why the first one failed, and eleven weeks later I was in Warsaw. I am still there, still employed, still grateful.",
    name: "Jean-Claude M.",
    role: "Warehouse Supervisor, Poland",
    service: "Work Visa & Placement",
  },
  {
    quote:
      "What I appreciated most was the honesty. They told me my first choice of country was a poor fit for my qualifications instead of taking my money. The role they found me instead pays more than I asked for.",
    name: "Aline U.",
    role: "Registered Nurse, Canada",
    service: "Overseas Recruitment",
  },
];

/* ------------------------------------------------------------------ */

export const timeline = [
  {
    year: "2014",
    title: "A desk and a promise",
    copy: "Linker World Travel opens in Kigali with one consultant and a conviction that Rwandans deserve honest guidance abroad.",
  },
  {
    year: "2017",
    title: "Recruitment begins",
    copy: "First employer partnerships signed in the Gulf. Forty-two candidates placed in the opening year.",
  },
  {
    year: "Today",
    title: "Thirty-eight countries",
    copy: "One team, one standard, and a client base that spans four continents, still headquartered in Kigali.",
  },
];

export const values = [
  {
    title: "Honesty first",
    copy: "If an application will not succeed, we say so before you pay. A refused visa costs you far more than our advice.",
  },
  {
    title: "One team, end to end",
    copy: "The person who takes your first call is the person who sees your file through. No handoffs into a void.",
  },
  {
    title: "Rooted in Rwanda",
    copy: "We are not an agent for someone else's product. East Africa is where we live, and it shows in what we build.",
  },
  {
    title: "Answer the phone",
    copy: "Plans break at inconvenient hours. Our clients reach a real person, not a ticket number.",
  },
];

/* ------------------------------------------------------------------ */

/**
 * How working with us actually goes, in three steps.
 *
 * This exists to answer the question that stops most visitors from making
 * contact: "what happens if I call, and what will it cost me to find out?"
 * The honest answer — a free conversation, a straight assessment, no money
 * until there is a plan — is the strongest thing the company has to say, so
 * the home page now says it plainly instead of implying it.
 */
export const steps = [
  {
    n: "01",
    title: "Tell us where you want to go",
    copy: "One conversation, free of charge. We ask about your qualifications, your budget and when you want to travel.",
  },
  {
    n: "02",
    title: "We tell you honestly what is possible",
    copy: "A clear recommendation and a real cost, before you pay anything. If your plan will not succeed, we say so.",
  },
  {
    n: "03",
    title: "We handle it, start to finish",
    copy: "Employer matching, admission files, visa applications and flights — one consultant, all the way to the day you land.",
  },
];
