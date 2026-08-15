/**
 * Editorial content for the site. Written copy lives here, not in components,
 * so pages stay layout-only and the client can revise text in one place.
 */

export type Service = {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  blurb: string;
  points: string[];
  image: string;
  href: string;
};

export const services: Service[] = [
  {
    slug: "recruitment",
    index: "01",
    title: "Work abroad",
    kicker: "International Recruitment",
    blurb:
      "We place skilled and semi-skilled professionals with vetted employers across the Gulf, Europe and North America — and we stay with you from first interview to first payslip.",
    points: [
      "Employer matching & interview preparation",
      "Work permit and contract processing",
      "Pre-departure briefing and orientation",
      "Ongoing support after you arrive",
    ],
    image: "/assets/work%20abroad%20(2).jpg",
    href: "/work-abroad/recruitment",
  },
  {
    slug: "visa-services",
    index: "02",
    title: "Cross borders",
    kicker: "Visa Services",
    blurb:
      "Work, study and tourist visas prepared with the precision that gets applications approved the first time. We handle the paperwork so you can plan the life on the other side of it.",
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
    index: "03",
    title: "Travel well",
    kicker: "Flights, Hotels & Packages",
    blurb:
      "Competitive fares, considered hotels and itineraries built around how you actually want to travel — with a real person on the other end of the phone when plans change.",
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

export const stats = [
  { value: 2400, suffix: "+", label: "Travellers & candidates placed" },
  { value: 38, suffix: "", label: "Countries we operate across" },
  { value: 96, suffix: "%", label: "Visa application success rate" },
  { value: 11, suffix: " yrs", label: "Connecting Africa to the world" },
];

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
    copy: "One team, one standard, and a client base that spans four continents — still headquartered in Kigali.",
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
