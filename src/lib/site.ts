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

export type NavItem = {
  label: string;
  href: string;
  items?: { label: string; href: string }[];
};

export const nav: NavItem[] = [
  { 
    label: "Work Abroad", 
    href: "/work-abroad",
    items: [
      { label: "Jobs", href: "/work-abroad/jobs" },
      { label: "Recruitment", href: "/work-abroad/recruitment" },
      { label: "Employer Matching", href: "/work-abroad/employer-matching" },
      { label: "Work Permits", href: "/work-abroad/work-permits" },
    ]
  },
  {
    label: "Study Abroad",
    href: "/study-abroad",
    items: [
      { label: "Universities", href: "/study-abroad/universities" },
      { label: "Study Visa", href: "/study-abroad/study-visa" },
      { label: "Admission Guidance", href: "/study-abroad/admission-guidance" },
    ]
  },
  {
    label: "Travel",
    href: "/travel",
    items: [
      { label: "Flight Booking", href: "/travel/flight-booking" },
      { label: "Hotels", href: "/travel/hotels" },
      { label: "Holiday Packages", href: "/travel/holiday-packages" },
      { label: "Visa Services", href: "/travel/visa-services" },
    ]
  },
  { label: "Safaris", href: "/safari-tours" },
  { label: "Vehicle Import", href: "/vehicle-import-export" },
  { label: "Blog", href: "/blog" },
];

export const footerNav = [
  {
    heading: "Services",
    links: [
      { label: "Work Abroad", href: "/work-abroad" },
      { label: "Study Abroad", href: "/study-abroad" },
      { label: "Travel & Visas", href: "/travel" },
      { label: "Safari & Tours", href: "/safari-tours" },
      { label: "Vehicle Import & Export", href: "/vehicle-import-export" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Job Vacancies", href: "/work-abroad/jobs" },
      { label: "Journal", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;
