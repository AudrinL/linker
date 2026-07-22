/**
 * Single source of truth for company identity, contact routes and navigation.
 * Every phone number, link and label on the site resolves back to this file.
 */

export const site = {
  name: "Linker World Travel",
  shortName: "Linker World",
  tagline: "Connecting Africa to the world",
  description:
    "Linker World Travel connects people to opportunity worldwide — overseas recruitment, visa services, international travel, East African safaris and vehicle import & export, handled end to end from Kigali.",
  url: "https://www.linkerworldtravel.com",
  locale: "en_RW",

  // TODO(client): confirm street address and public email before launch.
  address: {
    city: "Kigali",
    country: "Rwanda",
    line: "Kigali, Rwanda",
  },

  email: "info@linkerworldtravel.com",

  phones: [
    { display: "+250 781 072 868", e164: "250781072868" },
    { display: "+250 789 520 838", e164: "250789520838" },
  ],

  /** Primary WhatsApp line — all inquiry forms hand off here. */
  whatsapp: "250781072868",

  hours: "Mon – Fri · 08:00 – 18:00 CAT · Sat 09:00 – 14:00",

  // TODO(client): replace with real profile URLs.
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "X", href: "https://x.com/" },
  ],
} as const;

export const nav = [
  { label: "About", href: "/about" },
  { label: "Recruitment", href: "/recruitment" },
  { label: "Visa Services", href: "/visa-services" },
  { label: "Travel", href: "/travel-services" },
  { label: "Safari & Tours", href: "/safari-tours" },
  { label: "Vehicles", href: "/vehicle-import-export" },
  { label: "Vacancies", href: "/vacancies" },
  { label: "Journal", href: "/blog" },
] as const;

export const footerNav = [
  {
    heading: "Services",
    links: [
      { label: "Overseas Recruitment", href: "/recruitment" },
      { label: "Visa Services", href: "/visa-services" },
      { label: "Flights & Hotels", href: "/travel-services" },
      { label: "Safari & Tours", href: "/safari-tours" },
      { label: "Vehicle Import & Export", href: "/vehicle-import-export" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Job Vacancies", href: "/vacancies" },
      { label: "Journal", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;
