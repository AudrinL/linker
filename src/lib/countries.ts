/**
 * Country and nationality reference data.
 *
 * The application funnels ask "where do you want to go?" on almost every page,
 * so the lists live here once rather than being retyped into each form config.
 * Destination lists carry a flag for the picker grids; `nationalities` is a
 * plain list because it only ever feeds a searchable dropdown.
 */

export type Destination = { flag: string; name: string };

/** Countries we place workers into — the brief's work-abroad list. */
export const workDestinations: Destination[] = [
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇦🇪", name: "United Arab Emirates" },
  { flag: "🇳🇱", name: "Netherlands" },
  { flag: "🇬🇧", name: "United Kingdom" },
  { flag: "🇮🇪", name: "Ireland" },
  { flag: "🇩🇰", name: "Denmark" },
  { flag: "🇸🇪", name: "Sweden" },
  { flag: "🇫🇮", name: "Finland" },
  { flag: "🇳🇴", name: "Norway" },
  { flag: "🇵🇱", name: "Poland" },
  { flag: "🇫🇷", name: "France" },
  { flag: "🇮🇹", name: "Italy" },
  { flag: "🇭🇷", name: "Croatia" },
  { flag: "🇷🇴", name: "Romania" },
  { flag: "🇲🇹", name: "Malta" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "🇳🇿", name: "New Zealand" },
  { flag: "🇶🇦", name: "Qatar" },
  { flag: "🇸🇦", name: "Saudi Arabia" },
  { flag: "🇴🇲", name: "Oman" },
  { flag: "🌍", name: "Other" },
];

/** Countries we place students into. */
export const studyDestinations: Destination[] = [
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇬🇧", name: "United Kingdom" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "🇳🇿", name: "New Zealand" },
  { flag: "🇮🇪", name: "Ireland" },
  { flag: "🇫🇷", name: "France" },
  { flag: "🇳🇱", name: "Netherlands" },
  { flag: "🇵🇱", name: "Poland" },
  { flag: "🇩🇰", name: "Denmark" },
  { flag: "🇫🇮", name: "Finland" },
  { flag: "🇸🇪", name: "Sweden" },
  { flag: "🇲🇹", name: "Malta" },
  { flag: "🇮🇹", name: "Italy" },
  { flag: "🇨🇾", name: "Cyprus" },
  { flag: "🇦🇪", name: "United Arab Emirates" },
  { flag: "🇺🇸", name: "United States" },
  { flag: "🌍", name: "Other" },
];

/** Countries we prepare visa files for. */
export const visaDestinations: Destination[] = [
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇦🇪", name: "United Arab Emirates" },
  { flag: "🇬🇧", name: "United Kingdom" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "🇳🇿", name: "New Zealand" },
  { flag: "🇮🇪", name: "Ireland" },
  { flag: "🇫🇷", name: "France" },
  { flag: "🇳🇱", name: "Netherlands" },
  { flag: "🇵🇱", name: "Poland" },
  { flag: "🇩🇰", name: "Denmark" },
  { flag: "🇸🇪", name: "Sweden" },
  { flag: "🇫🇮", name: "Finland" },
  { flag: "🇮🇹", name: "Italy" },
  { flag: "🇲🇹", name: "Malta" },
  { flag: "🇺🇸", name: "United States" },
  { flag: "🌍", name: "Other" },
];

/** Plain-name lists for the form dropdowns. */
export const names = (list: Destination[]) => list.map((d) => d.name);

/**
 * Every country a client might be applying from. Stored as one delimited
 * string because it is only ever split into a dropdown — keeping it on a
 * single line stops the file turning into 200 lines of noise.
 */
export const countries: string[] =
  "Afghanistan,Albania,Algeria,Angola,Argentina,Armenia,Australia,Austria,Azerbaijan,Bahrain,Bangladesh,Belarus,Belgium,Benin,Bhutan,Bolivia,Bosnia and Herzegovina,Botswana,Brazil,Bulgaria,Burkina Faso,Burundi,Cambodia,Cameroon,Canada,Cape Verde,Central African Republic,Chad,Chile,China,Colombia,Comoros,Congo (Brazzaville),Congo (DRC),Costa Rica,Croatia,Cuba,Cyprus,Czechia,Denmark,Djibouti,Dominican Republic,Ecuador,Egypt,El Salvador,Equatorial Guinea,Eritrea,Estonia,Eswatini,Ethiopia,Fiji,Finland,France,Gabon,Gambia,Georgia,Germany,Ghana,Greece,Guatemala,Guinea,Guinea-Bissau,Guyana,Haiti,Honduras,Hungary,Iceland,India,Indonesia,Iran,Iraq,Ireland,Israel,Italy,Ivory Coast,Jamaica,Japan,Jordan,Kazakhstan,Kenya,Kuwait,Kyrgyzstan,Laos,Latvia,Lebanon,Lesotho,Liberia,Libya,Lithuania,Luxembourg,Madagascar,Malawi,Malaysia,Maldives,Mali,Malta,Mauritania,Mauritius,Mexico,Moldova,Mongolia,Montenegro,Morocco,Mozambique,Myanmar,Namibia,Nepal,Netherlands,New Zealand,Nicaragua,Niger,Nigeria,North Macedonia,Norway,Oman,Pakistan,Palestine,Panama,Papua New Guinea,Paraguay,Peru,Philippines,Poland,Portugal,Qatar,Romania,Russia,Rwanda,Saudi Arabia,Senegal,Serbia,Seychelles,Sierra Leone,Singapore,Slovakia,Slovenia,Somalia,South Africa,South Korea,South Sudan,Spain,Sri Lanka,Sudan,Sweden,Switzerland,Syria,Taiwan,Tajikistan,Tanzania,Thailand,Togo,Trinidad and Tobago,Tunisia,Turkey,Turkmenistan,Uganda,Ukraine,United Arab Emirates,United Kingdom,United States,Uruguay,Uzbekistan,Venezuela,Vietnam,Yemen,Zambia,Zimbabwe,Other".split(
    ",",
  );

/** Sectors used by both the job filters and the application forms. */
export const sectors = [
  "Healthcare & Care",
  "Construction",
  "Drivers & Transport",
  "Logistics & Warehouse",
  "Hospitality",
  "Manufacturing",
  "Agriculture",
  "Cleaning & Facility Services",
  "IT & Digital",
  "Engineering",
  "Education",
  "Skilled Trades",
  "Other",
];

/** Common roles, offered as suggestions on the job-preference field. */
export const jobRoles = [
  "Caregiver",
  "Nurse",
  "Healthcare Assistant",
  "Truck Driver",
  "Delivery Driver",
  "Electrician",
  "Plumber",
  "Welder",
  "Carpenter",
  "Construction Worker",
  "Warehouse Worker",
  "Factory Worker",
  "Hotel Housekeeper",
  "Chef / Cook",
  "Farm Worker",
  "IT Specialist",
  "Engineer",
  "Teacher",
  "Mechanic",
  "Other",
];

/** Fields of study, offered as suggestions on the study-preference field. */
export const studyPrograms = [
  "Nursing",
  "Medicine",
  "Engineering",
  "Computer Science",
  "Information Technology",
  "Business Administration",
  "Accounting",
  "Finance",
  "Hospitality & Tourism",
  "Architecture",
  "Education",
  "Law",
  "Agriculture",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Data Science",
  "Cybersecurity",
  "Marketing",
  "Social Sciences",
  "Other",
];

/** CEFR ladder, reused by every language field. */
export const cefrLevels = ["None", "A1", "A2", "B1", "B2", "C1", "C2"];

export const fluencyLevels = [
  "Beginner",
  "Basic",
  "Intermediate",
  "Upper-Intermediate",
  "Advanced",
  "Fluent",
];
