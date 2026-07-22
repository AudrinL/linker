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
    image: "/img/recruitment-worker.png",
    href: "/recruitment",
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
    href: "/visa-services",
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
    href: "/travel-services",
  },
  {
    slug: "safari-tours",
    index: "04",
    title: "Meet the wild",
    kicker: "Safari & Tours",
    blurb:
      "Gorilla trekking in Volcanoes. Big cats on the Mara. The Serengeti at first light. East Africa is our home ground, and we design these journeys the way we would for family.",
    points: [
      "Rwanda, Uganda, Kenya & Tanzania",
      "Gorilla and chimpanzee trekking permits",
      "Private guides and luxury lodges",
      "Cultural and community experiences",
    ],
    image: "/img/safari-elephants.png",
    href: "/safari-tours",
  },
  {
    slug: "vehicle-import-export",
    index: "05",
    title: "Move machines",
    kicker: "Vehicle Import & Export",
    blurb:
      "Sourcing, shipping, clearing and delivering vehicles across continents. You choose the vehicle; we handle every port, form and inspection between it and your driveway.",
    points: [
      "Vehicle sourcing from Japan, UAE & Europe",
      "Ocean freight and container consolidation",
      "Customs clearance and duty guidance",
      "Inspection reports before you commit",
    ],
    image: "/img/vehicle-port.png",
    href: "/vehicle-import-export",
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

export type Destination = {
  country: string;
  headline: string;
  experience: string;
  copy: string;
  image: string;
  highlights: string[];
};

export const destinations: Destination[] = [
  {
    country: "Rwanda",
    headline: "Volcanoes National Park",
    experience: "Gorilla Trekking",
    copy:
      "An hour uphill through bamboo and cloud, and then you are sitting eight metres from a silverback who has decided you are not worth standing up for. Rwanda protects roughly a third of the world's remaining mountain gorillas.",
    image: "/img/safari-gorilla.png",
    highlights: ["Gorilla permits", "Golden monkey tracking", "Lake Kivu"],
  },
  {
    country: "Kenya",
    headline: "Maasai Mara",
    experience: "The Great Migration",
    copy:
      "Between July and October, more than a million wildebeest pour across the Mara River while crocodiles wait in the shallows. There is no footage that prepares you for the sound of it.",
    image: "/img/safari-elephants.png",
    highlights: ["River crossings", "Big Five game drives", "Maasai villages"],
  },
  {
    country: "Tanzania",
    headline: "Serengeti & Ngorongoro",
    experience: "Balloon Safari",
    copy:
      "Lift off before dawn and watch the plains resolve out of the dark beneath you — herds moving, dust rising gold, the crater rim holding the horizon. Breakfast is served where you land.",
    image: "/img/safari-balloons.png",
    highlights: ["Balloon safari", "Ngorongoro Crater", "Zanzibar extension"],
  },
  {
    country: "Uganda",
    headline: "Bwindi Impenetrable Forest",
    experience: "Primate & Nile Country",
    copy:
      "Ancient rainforest that has never been logged, home to almost half the world's mountain gorillas — then north to Murchison Falls, where the entire Nile forces itself through a seven-metre gap.",
    image: "/img/safari-gorilla.png",
    highlights: ["Bwindi trekking", "Murchison Falls", "Queen Elizabeth NP"],
  },
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
      "We booked the Rwanda–Tanzania trip for our anniversary and expected a good holiday. What we got was the single best two weeks of our lives. The gorilla trek alone was worth the entire trip, and every transfer ran exactly on time.",
    name: "Sarah & Michael T.",
    role: "Travellers from Manchester",
    service: "Safari & Tours",
  },
  {
    quote:
      "They sourced the vehicle in Japan, sent me inspection photos before I paid a franc, and handled clearance at Dar es Salaam. It arrived in Kigali in better condition than described. I have since imported two more through them.",
    name: "Patrick N.",
    role: "Business Owner, Kigali",
    service: "Vehicle Import",
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
    year: "2019",
    title: "Into the wild",
    copy: "The safari division launches, built on the belief that East Africa should be sold by East Africans.",
  },
  {
    year: "2022",
    title: "Ports and permits",
    copy: "Vehicle import & export opens, extending the network from people to cargo.",
  },
  {
    year: "Today",
    title: "Thirty-eight countries",
    copy: "One team, five services, and a client base that spans four continents — still headquartered in Kigali.",
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
