/**
 * Blog content — content-modelled so the journal can grow without touching
 * components. A future CMS or FastAPI endpoint (see BACKEND_PLAN.md) can serve
 * the same shape; pages only read from here.
 */

export type BlogSection = { heading?: string; body: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "top-5-reasons-to-study-in-germany",
    title: "Top 5 Reasons to Study in Germany",
    excerpt:
      "Tuition-free universities, a booming economy and a clear path to work — here's why Germany keeps topping the list for East African students.",
    category: "Study Abroad",
    date: "2026-07-22",
    author: "Aline Uwase",
    readTime: "6 min read",
    sections: [
      {
        heading: "The price is the headline",
        body: [
          "Germany is one of the last countries in the world where most public universities are tuition-free — for international students too. You pay a semester fee of roughly €300, which covers transport, student services and the administration of your enrolment.",
          "When our clients compare a German degree against an equivalent in the UK or US, the total cost over three years is usually a fraction of the alternative. That changes which cities, internships and graduate jobs become realistic.",
        ],
      },
      {
        heading: "A degree that employers already trust",
        body: [
          "German engineering, IT and manufacturing degrees carry serious weight on the global job market. The country is Europe's largest economy, and its universities are built around the industries that actually employ people.",
          "After graduation, the 18-month job-seeker visa gives you time to find a role without sponsorship pressure. Many of our clients convert that into a permanent residency route within a few years.",
        ],
      },
      {
        heading: "You can work while you study",
        body: [
          "International students can work 120 full days a year — roughly 20 hours a week during term. That funds a large share of living costs in cities like Berlin, Leipzig or Dresden, where rent is still affordable compared to London or Toronto.",
          "Practical semesters are built into many programs, meaning your CV graduates with real German employers on it, not just a transcript.",
        ],
      },
      {
        heading: "The application is more forgiving than you think",
        body: [
          "German admissions care less about 'brand-name' universities and more about whether you genuinely meet the academic requirements. A solid transcript from a recognised East African institution is often enough, and pathway programs cover the gap when it isn't.",
          "You don't need perfect German for English-taught programs, though B1 will dramatically widen your options — and scholarship money is available for motivated applicants.",
        ],
      },
      {
        heading: "The bottom line",
        body: [
          "Germany offers the rarest combination in international education: world-class quality, near-zero tuition and a realistic route to staying. If your grades are solid and you're willing to put in the application work, it should be near the top of your list.",
          "Our study consultants prepare German applications every intake — from course matching to the blocked account (Sperrkonto) that proves your funds. Start with the eligibility check on the study abroad page.",
        ],
      },
    ],
  },
  {
    slug: "navigating-the-uk-healthcare-system",
    title: "Navigating the UK Healthcare System",
    excerpt:
      "For nurses and care workers arriving on the Health & Care Worker visa, here's what the first six months in the UK actually look like.",
    category: "Work Abroad",
    date: "2026-06-18",
    author: "Jean-Claude Mugisha",
    readTime: "7 min read",
    sections: [
      {
        heading: "Your first week",
        body: [
          "You'll land, complete an occupational health check and go through Trust induction — ID checks, IT access and your ward assignment. Expect your first full shift within the first fortnight.",
          "Most NHS Trusts assign a preceptor — a senior colleague who shadows you for your first 90 days. Use them. No question is too small, and the system expects you to ask rather than guess.",
        ],
      },
      {
        heading: "How shifts and pay actually work",
        body: [
          "The NHS pays by Agenda for Change banding. Most internationally educated nurses start at Band 5 — roughly £29,000–£35,000 a year — with unsocial-hours enhancements for nights and weekends.",
          "Overtime and bank shifts are widely available, which is how many of our clients grow their income in the first year while building a reputation on the ward.",
        ],
      },
      {
        heading: "Registration you must keep on top of",
        body: [
          "Your NMC pin is your licence to practice — renew it every year and never let it lapse. Your OSCE must be passed within the window your Trust sets, and your sponsor obligations continue for the first months of your placement.",
          "Keep a folder with your NMC, DBS, revalidation evidence and payslips. You'll need them for council tax, your bank, and eventually your indefinite leave application.",
        ],
      },
      {
        heading: "Settling in beyond the ward",
        body: [
          "Open a bank account early, register with a GP and get a National Insurance number within your first weeks. Most Trusts have an international nursing network — join it. They're the fastest route to housing advice, community and the social side of British life.",
          "The five-year settlement clock starts from your first day on the visa. Keep your employment continuous and documented, and the route to indefinite leave stays open.",
        ],
      },
    ],
  },
  {
    slug: "packing-for-a-safari",
    title: "Packing for a Safari: What to Bring",
    excerpt:
      "Everything you need to know before heading into the East African wilderness — and the five things you should definitely leave at home.",
    category: "Travel Tips",
    date: "2026-05-30",
    author: "Sarah Thomas",
    readTime: "5 min read",
    sections: [
      {
        heading: "Dress for the dust, not the brochure",
        body: [
          "Neutral colours — khaki, olive, beige — work best on game drives. Bright white reads like a signal to animals and reds attract tsetse flies. Layer instead: cold dawns, hot middays, and a light fleece for evening sundowners.",
          "Long trousers and closed shoes are non-negotiable for gorilla trekking. The forest is thick, wet and unforgiving on ankles.",
        ],
      },
      {
        heading: "The gear that earns its weight",
        body: [
          "A wide-brimmed hat, high-SPF sunscreen and a buff to cover your neck. Binoculars make a bigger difference than a telephoto lens — most guides will tell you they're the first thing repeat visitors pack.",
          "A power bank is essential; lodges in the bush have limited outlets, and you'll be photographing all day. A headlamp for early-morning starts and dark tent paths is the quiet hero of every safari.",
        ],
      },
      {
        heading: "What to leave behind",
        body: [
          "Camouflage is illegal for civilians in most East African countries. Leave drones at home unless you have permits — ranger teams confiscate them. And resist packing formalwear; safari lodges are 'smart casual at best' places.",
          "Plastic bags are banned in Rwanda and Kenya. Pack your toiletries in washbags and expect a bag check at the airport.",
        ],
      },
    ],
  },
  {
    slug: "understanding-visa-processing-times",
    title: "Understanding Visa Processing Times",
    excerpt:
      "Why some visas take two weeks and others two months — and how to build a timeline that survives embassy calendars.",
    category: "Immigration",
    date: "2026-04-25",
    author: "Eric Niyonzima",
    readTime: "6 min read",
    sections: [
      {
        heading: "Processing time is not a promise",
        body: [
          "The times printed on embassy websites are averages, not deadlines. A Schengen visa might state '15 working days' and take six weeks in peak season; a UK visitor visa can state three weeks and run to eight when biometrics slots are scarce.",
          "The single best predictor is current demand in your destination — summer, post-holiday and September-student seasons all stretch calendars. Book your appointment before you buy non-refundable flights.",
        ],
      },
      {
        heading: "What actually slows a file down",
        body: [
          "Incomplete financial evidence is the number one cause of delays and refusals. Embassies want six months of statements that show regular, explainable deposits — not a single large transfer a week before you apply.",
          "Missing translations, an expired passport and application forms that contradict your bank statements all trigger manual reviews. One inconsistency can double your wait.",
        ],
      },
      {
        heading: "Building a realistic timeline",
        body: [
          "Add a 30% buffer to the official time, then add your document prep time on top. For a work or study visa, that usually means starting 12–16 weeks before your travel date — not eight.",
          "Apply with a complete, internally consistent file and you are not 'gaming' the system; you are simply giving the officer no reason to slow you down. That is the entire job of a good agency.",
        ],
      },
    ],
  },
  {
    slug: "qatars-construction-boom-opportunities",
    title: "Qatar's Construction Boom: What It Means for Workers",
    excerpt:
      "New projects, high pay and a structured recruitment system — a field guide to construction roles in the Gulf.",
    category: "Work Abroad",
    date: "2026-03-12",
    author: "Jean-Claude Mugisha",
    readTime: "5 min read",
    sections: [
      {
        heading: "The demand is real",
        body: [
          "Qatar is building again. Beyond the World Cup legacy, major transport, health and urban projects are drawing in skilled and semi-skilled construction workers by the thousands — and the recruitment pipeline from East Africa is well established.",
          "Supervisors, crane operators, electricians, plumbers and scaffolders are the roles employers contact us about most.",
        ],
      },
      {
        heading: "What the package actually includes",
        body: [
          "Standard contracts bundle salary, free accommodation, transport and annual leave flights. Salaries for skilled trades typically range from $800–$1,800 a month, tax-free, with overtime paid above the base.",
          "Read the contract line by line — leave entitlement, notice periods and end-of-service benefits are where the real value hides. We review every contract before a client signs.",
        ],
      },
      {
        heading: "The honest warning",
        body: [
          "Work in the Gulf is hot, physical and serious. Contracts are for one to two years, and the best jobs are often the ones that offer training and advancement rather than the highest starting number.",
          "Recruit through a licensed agency — illegitimate brokers promising immediate visas are the single largest source of lost savings in the industry.",
        ],
      },
    ],
  },
  {
    slug: "first-time-vehicle-import-to-rwanda",
    title: "Importing Your First Vehicle to Rwanda: A Field Guide",
    excerpt:
      "From a Dubai auction to your Kigali driveway — the step-by-step route, the real costs and the mistakes that cost people money.",
    category: "Vehicle Import",
    date: "2026-02-08",
    author: "Patrick Nkusi",
    readTime: "8 min read",
    sections: [
      {
        heading: "Start with the landed price, not the sticker",
        body: [
          "The price in Dubai or Tokyo is the beginning, not the budget. Your real number is vehicle + freight + insurance + duty + clearance + registration. On a $20,000 vehicle that difference is often $8,000–$12,000 — itemise it before you commit.",
          "East African Community duties are calculated on the CIF value (cost, insurance, freight), so a cheap vehicle shipped expensively can owe more than a pricier one shipped well.",
        ],
      },
      {
        heading: "The inspection that saves your money",
        body: [
          "Every horror story we hear starts with 'it looked perfect in the photos'. An independent inspection report — compression test, frame damage scan, accident history — costs a fraction of one surprise repair.",
          "Insist on the report before paying any deposit. If a seller resists, that is the report you most needed.",
        ],
      },
      {
        heading: "Ports, agents and timelines",
        body: [
          "Most Rwanda-bound vehicles arrive through Dar es Salaam, with Mombasa as the alternative. Clearance depends on paperwork accuracy — a mismatched chassis number can hold your car at port for weeks.",
          "Realistic door-to-door time is 6–9 weeks. Plan your deposit and any financing around that, not the optimistic four weeks a listing agent might suggest.",
        ],
      },
    ],
  },
];

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, count = 3) {
  const current = getPost(slug);
  return blogPosts
    .filter((p) => p.slug !== slug && (current ? p.category === current.category : true))
    .concat(blogPosts.filter((p) => p.slug !== slug))
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, count);
}
