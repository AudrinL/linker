/**
 * The vacancy board.
 *
 * Every field here is what a candidate needs to self-select before applying —
 * country, sector, pay band, whether the language is a barrier. Salary is
 * stored as the employer states it (gross, per month or per hour, in local
 * currency) rather than normalised, because converting it would imply a
 * precision the ranges do not have. The page carries a notice saying so.
 *
 * `slug` is the detail route. `skill` drives the filter's Skill Level facet.
 */

import type { sectors } from "./countries";

export type Job = {
  slug: string;
  title: string;
  icon: string;
  country: string;
  flag: string;
  /**
   * Must be one of the canonical sectors — the job filter builds its options
   * from that same list, so a near-miss like "Healthcare" instead of
   * "Healthcare & Care" would silently drop the vacancy out of the facet.
   */
  sector: (typeof sectors)[number];
  employment: "Full-time" | "Part-time" | "Contract" | "Seasonal" | "Full-time / Seasonal";
  skill: "Professional" | "Skilled" | "Blue Collar" | "Entry Level";
  experience: string;
  language?: string;
  salary: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const jobs: Job[] = [
  /* ---------------------------- Germany ---------------------------- */
  {
    slug: "germany-caregiver",
    title: "Caregiver / Healthcare Assistant",
    icon: "🧑‍⚕️",
    country: "Germany",
    flag: "🇩🇪",
    sector: "Healthcare & Care",
    employment: "Full-time",
    skill: "Skilled",
    experience: "1–2+ years depending on employer",
    language: "German may be required",
    salary: "€2,900 – €4,750 gross/month",
    summary:
      "Support residents in German care homes and assisted-living facilities, with structured training and a recognised career ladder.",
    responsibilities: [
      "Assist residents with daily living, mobility and personal care",
      "Support nursing staff with basic clinical tasks and documentation",
      "Monitor and report changes in residents' condition",
      "Work within a shift rota including some nights and weekends",
    ],
    requirements: [
      "Care experience or a recognised care qualification",
      "German language, typically B1 (employers vary)",
      "Valid passport with at least 6 months' validity",
      "Willingness to complete recognition of qualifications",
    ],
  },
  {
    slug: "germany-electrician",
    title: "Electrician",
    icon: "⚡",
    country: "Germany",
    flag: "🇩🇪",
    sector: "Skilled Trades",
    employment: "Full-time",
    skill: "Skilled",
    experience: "Relevant experience",
    salary: "€3,200 – €4,000 gross/month",
    summary:
      "Installation and maintenance work on commercial and residential sites for established German contractors.",
    responsibilities: [
      "Install, test and maintain electrical systems",
      "Read and work from technical drawings",
      "Fault-find and repair on site",
      "Work to German safety and compliance standards",
    ],
    requirements: [
      "Trade certification and demonstrable site experience",
      "Ability to read electrical schematics",
      "Basic German is an advantage",
      "Valid passport",
    ],
  },
  {
    slug: "germany-welder",
    title: "Welder",
    icon: "🔩",
    country: "Germany",
    flag: "🇩🇪",
    sector: "Manufacturing",
    employment: "Full-time",
    skill: "Skilled",
    experience: "Relevant experience",
    salary: "€3,000 – €4,000 gross/month",
    summary:
      "MIG, TIG and arc welding roles in manufacturing and construction, with certification support where needed.",
    responsibilities: [
      "Weld to specification across a range of materials",
      "Inspect welds for quality and integrity",
      "Maintain equipment and work area",
      "Follow site safety procedures at all times",
    ],
    requirements: [
      "Welding certification or verifiable experience",
      "Ability to work from technical drawings",
      "Valid passport",
    ],
  },
  {
    slug: "germany-truck-driver",
    title: "Truck Driver",
    icon: "🚛",
    country: "Germany",
    flag: "🇩🇪",
    sector: "Drivers & Transport",
    employment: "Full-time",
    skill: "Skilled",
    experience: "Appropriate driving licence and experience",
    salary: "€2,500 – €3,500 gross/month",
    summary:
      "Long-distance and regional haulage across Germany and the EU with regulated hours and rest periods.",
    responsibilities: [
      "Transport goods safely to schedule",
      "Complete vehicle checks and load documentation",
      "Comply with EU driving-time and tachograph rules",
    ],
    requirements: [
      "Category C/CE licence, convertible or recognised in the EU",
      "Driver CPC where required",
      "Clean driving record",
    ],
  },
  {
    slug: "germany-production-worker",
    title: "Production Worker",
    icon: "🏭",
    country: "Germany",
    flag: "🇩🇪",
    sector: "Manufacturing",
    employment: "Full-time",
    skill: "Entry Level",
    experience: "Depending on employer",
    salary: "€2,500 – €3,500 gross/month",
    summary:
      "Line and assembly roles in German manufacturing plants, often with on-the-job training provided.",
    responsibilities: [
      "Operate production machinery and assembly lines",
      "Carry out quality checks",
      "Work rotating shifts",
    ],
    requirements: [
      "Physical fitness for standing shift work",
      "Reliability and punctuality",
      "Valid passport",
    ],
  },

  /* ----------------------------- Canada ---------------------------- */
  {
    slug: "canada-truck-driver",
    title: "Truck Driver",
    icon: "🚛",
    country: "Canada",
    flag: "🇨🇦",
    sector: "Drivers & Transport",
    employment: "Full-time",
    skill: "Skilled",
    experience: "Relevant driving experience",
    salary: "CAD $25 – $40/hour",
    summary:
      "Long-haul and regional driving for Canadian carriers, with licence conversion support.",
    responsibilities: [
      "Operate heavy vehicles over long distances",
      "Maintain logs and complete pre-trip inspections",
      "Cross provincial and sometimes US borders",
    ],
    requirements: [
      "Commercial driving experience",
      "Clean record and medical fitness",
      "Willingness to convert to a Canadian class 1 licence",
    ],
  },
  {
    slug: "canada-caregiver",
    title: "Caregiver / Support Worker",
    icon: "🧑‍⚕️",
    country: "Canada",
    flag: "🇨🇦",
    sector: "Healthcare & Care",
    employment: "Full-time",
    skill: "Skilled",
    experience: "Depending on employer or program",
    salary: "CAD $20 – $35/hour",
    summary:
      "Home and facility-based care roles, several of which sit on recognised pathways to permanent residence.",
    responsibilities: [
      "Provide personal care and daily living support",
      "Support mobility and medication routines",
      "Keep accurate care records",
    ],
    requirements: [
      "Care experience or a relevant certificate",
      "Good spoken English",
      "Clear background check",
    ],
  },
  {
    slug: "canada-construction-worker",
    title: "Construction Worker",
    icon: "🏗️",
    country: "Canada",
    flag: "🇨🇦",
    sector: "Construction",
    employment: "Full-time",
    skill: "Blue Collar",
    experience: "Relevant experience preferred",
    salary: "CAD $22 – $40/hour",
    summary:
      "General and skilled construction work on residential and commercial projects.",
    responsibilities: [
      "Site preparation, materials handling and general labour",
      "Support trades on site",
      "Follow provincial safety regulations",
    ],
    requirements: [
      "Site experience preferred",
      "Physical fitness",
      "Ability to work outdoors year-round",
    ],
  },
  {
    slug: "canada-farm-worker",
    title: "Farm Worker",
    icon: "🌾",
    country: "Canada",
    flag: "🇨🇦",
    sector: "Agriculture",
    employment: "Full-time / Seasonal",
    skill: "Entry Level",
    experience: "Depending on employer",
    salary: "CAD $17 – $25/hour",
    summary:
      "Seasonal and year-round agricultural roles, frequently with accommodation provided.",
    responsibilities: [
      "Planting, harvesting and packing",
      "Operate basic farm equipment",
      "Meet daily production targets",
    ],
    requirements: [
      "Physical fitness for outdoor work",
      "Willingness to work seasonal hours",
    ],
  },
  {
    slug: "canada-manufacturing-worker",
    title: "Manufacturing Worker",
    icon: "🏭",
    country: "Canada",
    flag: "🇨🇦",
    sector: "Manufacturing",
    employment: "Full-time",
    skill: "Entry Level",
    experience: "Depending on employer",
    salary: "CAD $18 – $30/hour",
    summary: "Assembly, packaging and machine-operation roles across Canadian plants.",
    responsibilities: [
      "Operate production equipment",
      "Carry out quality inspections",
      "Work shift patterns",
    ],
    requirements: ["Reliability", "Basic English", "Physical fitness"],
  },

  /* ------------------------------ UAE ------------------------------ */
  {
    slug: "uae-delivery-driver",
    title: "Delivery Driver",
    icon: "🚚",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    sector: "Logistics & Warehouse",
    employment: "Full-time",
    skill: "Blue Collar",
    experience: "Driving experience preferred",
    salary: "AED 2,000 – 4,000/month",
    summary:
      "Last-mile delivery across Dubai and the Emirates, typically with accommodation and transport provided.",
    responsibilities: [
      "Deliver parcels and goods to schedule",
      "Handle cash and proof of delivery",
      "Maintain the vehicle",
    ],
    requirements: [
      "UAE licence or convertible licence",
      "Good navigation and customer manner",
      "Valid passport",
    ],
  },
  {
    slug: "uae-electrician",
    title: "Electrician",
    icon: "⚡",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    sector: "Construction",
    employment: "Full-time",
    skill: "Skilled",
    experience: "Relevant experience",
    salary: "AED 1,500 – 3,500/month",
    summary: "Electrical installation and maintenance on construction and facilities contracts.",
    responsibilities: [
      "Install and maintain electrical systems",
      "Carry out planned and reactive maintenance",
      "Work to site safety standards",
    ],
    requirements: ["Trade certificate or experience", "Valid passport", "Gulf experience an advantage"],
  },
  {
    slug: "uae-plumber",
    title: "Plumber",
    icon: "🔧",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    sector: "Construction",
    employment: "Full-time",
    skill: "Skilled",
    experience: "Relevant experience",
    salary: "AED 1,500 – 3,500/month",
    summary: "Plumbing installation and maintenance across construction and facilities management.",
    responsibilities: [
      "Install and repair pipework and fixtures",
      "Diagnose and resolve faults",
      "Complete job documentation",
    ],
    requirements: ["Trade experience", "Valid passport"],
  },
  {
    slug: "uae-mason-carpenter",
    title: "Mason / Carpenter",
    icon: "🧱",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    sector: "Construction",
    employment: "Full-time",
    skill: "Blue Collar",
    experience: "Relevant experience",
    salary: "AED 1,200 – 2,500/month",
    summary: "Masonry, formwork and carpentry on active construction sites.",
    responsibilities: [
      "Blockwork, plastering, formwork or joinery",
      "Work from drawings and site instructions",
      "Follow site safety rules",
    ],
    requirements: ["Trade experience", "Physical fitness", "Valid passport"],
  },
  {
    slug: "uae-chef",
    title: "Chef / Cook",
    icon: "👨‍🍳",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    sector: "Hospitality",
    employment: "Full-time",
    skill: "Skilled",
    experience: "Relevant experience preferred",
    salary: "AED 2,500 – 6,000/month",
    summary: "Kitchen roles across hotels, restaurants and catering operations in the Emirates.",
    responsibilities: [
      "Prepare dishes to the menu standard",
      "Maintain food hygiene and stock control",
      "Work service shifts including weekends",
    ],
    requirements: ["Kitchen experience", "Food hygiene knowledge", "Valid passport"],
  },

  /* -------------------------- Netherlands -------------------------- */
  {
    slug: "netherlands-warehouse-worker",
    title: "Warehouse Worker",
    icon: "📦",
    country: "Netherlands",
    flag: "🇳🇱",
    sector: "Logistics & Warehouse",
    employment: "Full-time",
    skill: "Entry Level",
    experience: "Depending on employer",
    salary: "€2,200 – €3,000 gross/month",
    summary: "Picking, packing and dispatch in Dutch distribution centres, often with housing arranged.",
    responsibilities: [
      "Pick and pack orders to target",
      "Operate scanners and basic equipment",
      "Work shift patterns",
    ],
    requirements: ["Physical fitness", "Basic English", "EU work authorisation or eligibility"],
  },
  {
    slug: "netherlands-production-worker",
    title: "Production Worker",
    icon: "🏭",
    country: "Netherlands",
    flag: "🇳🇱",
    sector: "Manufacturing",
    employment: "Full-time",
    skill: "Entry Level",
    experience: "Depending on employer",
    salary: "€2,200 – €3,100 gross/month",
    summary: "Food and general manufacturing lines across the Netherlands.",
    responsibilities: ["Operate production lines", "Quality checks", "Shift work"],
    requirements: ["Reliability", "Basic English", "Physical fitness"],
  },
  {
    slug: "netherlands-greenhouse-worker",
    title: "Greenhouse / Farm Worker",
    icon: "🌱",
    country: "Netherlands",
    flag: "🇳🇱",
    sector: "Agriculture",
    employment: "Full-time / Seasonal",
    skill: "Entry Level",
    experience: "Depending on employer",
    salary: "€2,100 – €2,800 gross/month",
    summary: "Horticulture roles in the Dutch greenhouse sector, seasonal and year-round.",
    responsibilities: ["Planting, pruning and harvesting", "Sorting and packing", "Meet daily targets"],
    requirements: ["Physical fitness", "Willingness to work early shifts"],
  },

  /* ------------------------ United Kingdom ------------------------- */
  {
    slug: "uk-chef",
    title: "Chef / Cook",
    icon: "👨‍🍳",
    country: "United Kingdom",
    flag: "🇬🇧",
    sector: "Hospitality",
    employment: "Full-time",
    skill: "Skilled",
    experience: "Relevant experience",
    salary: "£2,200 – £3,500/month",
    summary: "Kitchen roles in UK restaurants, hotels and contract catering, some with sponsorship.",
    responsibilities: [
      "Prepare and present dishes to standard",
      "Manage section and stock",
      "Maintain food safety records",
    ],
    requirements: ["Professional kitchen experience", "Food hygiene certification", "English language"],
  },
  {
    slug: "uk-healthcare-worker",
    title: "Healthcare Worker",
    icon: "🧑‍⚕️",
    country: "United Kingdom",
    flag: "🇬🇧",
    sector: "Healthcare & Care",
    employment: "Full-time",
    skill: "Professional",
    experience: "Position-specific qualifications",
    salary: "£2,200 – £3,500/month",
    summary:
      "Care and clinical support roles with licensed UK sponsors, including Health and Care Worker visa routes.",
    responsibilities: [
      "Deliver care under clinical supervision",
      "Maintain accurate patient records",
      "Work rota shifts including nights",
    ],
    requirements: [
      "Relevant qualification and registration where applicable",
      "English language test to the required level",
      "Enhanced background check",
    ],
  },
  {
    slug: "uk-skilled-trades",
    title: "Skilled Trades Worker",
    icon: "🔧",
    country: "United Kingdom",
    flag: "🇬🇧",
    sector: "Construction",
    employment: "Full-time",
    skill: "Skilled",
    experience: "Relevant qualification or experience",
    salary: "£2,300 – £3,800/month",
    summary: "Trades roles across UK construction and maintenance contracts.",
    responsibilities: ["Trade work to specification", "Site safety compliance", "Work from drawings"],
    requirements: ["Trade qualification or verifiable experience", "CSCS card or willingness to obtain"],
  },

  /* ----------------------------- Ireland --------------------------- */
  {
    slug: "ireland-healthcare-assistant",
    title: "Healthcare Assistant",
    icon: "🧑‍⚕️",
    country: "Ireland",
    flag: "🇮🇪",
    sector: "Healthcare & Care",
    employment: "Full-time",
    skill: "Skilled",
    experience: "Depending on employer",
    salary: "€2,300 – €3,500 gross/month",
    summary: "Care assistant roles in Irish nursing homes and community care.",
    responsibilities: [
      "Personal care and daily living support",
      "Assist nursing staff",
      "Record and report resident wellbeing",
    ],
    requirements: ["QQI Level 5 or equivalent, or willingness to obtain", "Good English", "Garda vetting"],
  },
  {
    slug: "ireland-warehouse-operative",
    title: "Warehouse Operative",
    icon: "📦",
    country: "Ireland",
    flag: "🇮🇪",
    sector: "Logistics & Warehouse",
    employment: "Full-time",
    skill: "Entry Level",
    experience: "Depending on employer",
    salary: "€2,200 – €3,000 gross/month",
    summary: "Distribution and fulfilment roles across Irish logistics operations.",
    responsibilities: ["Pick, pack and dispatch", "Stock accuracy", "Shift work"],
    requirements: ["Physical fitness", "Basic English"],
  },
  {
    slug: "ireland-production-worker",
    title: "Production Worker",
    icon: "🏭",
    country: "Ireland",
    flag: "🇮🇪",
    sector: "Manufacturing",
    employment: "Full-time",
    skill: "Entry Level",
    experience: "Depending on employer",
    salary: "€2,300 – €3,200 gross/month",
    summary: "Manufacturing and food-production roles across Ireland.",
    responsibilities: ["Line operation", "Quality control", "Shift patterns"],
    requirements: ["Reliability", "Basic English", "Physical fitness"],
  },
];

/** Countries that actually have vacancies, in board order. */
export const jobCountries = [
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇦🇪", name: "United Arab Emirates" },
  { flag: "🇳🇱", name: "Netherlands" },
  { flag: "🇬🇧", name: "United Kingdom" },
  { flag: "🇮🇪", name: "Ireland" },
];

export const jobSkillLevels = ["Professional", "Skilled", "Blue Collar", "Entry Level"];

export const jobEmploymentTypes = ["Full-time", "Part-time", "Contract", "Seasonal"];

export const getJob = (slug: string) => jobs.find((j) => j.slug === slug);

export const relatedJobs = (slug: string, count = 3) => {
  const current = getJob(slug);
  if (!current) return [];
  const sameCountry = jobs.filter((j) => j.slug !== slug && j.country === current.country);
  const sameSector = jobs.filter(
    (j) => j.slug !== slug && j.country !== current.country && j.sector === current.sector,
  );
  return [...sameCountry, ...sameSector].slice(0, count);
};
