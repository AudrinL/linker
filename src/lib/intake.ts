/**
 * Validation for the public forms.
 *
 * This used to live in FastAPI's Pydantic models, which were the single source
 * of truth for what a submission may contain. With the backend gone the checks
 * have to live here, because the row now goes straight into Postgres: whatever
 * this module lets through is what gets stored.
 *
 * The bounds are the ones the Pydantic models used, deliberately — they are
 * what the database's own column checks were sized against, and an unbounded
 * string on a public endpoint is the easiest way in. Written by hand rather
 * than with a schema library to avoid adding a dependency for four shapes.
 *
 * What this does NOT do is decide which fields a given funnel requires. That
 * stays in the form config that generated the form (`src/lib/forms.ts`); here
 * we check identity, size and shape.
 */

const SERVICES = [
  "work",
  "study",
  "travel",
  "visa",
  "flights",
  "employer",
  "other",
] as const;

type Service = (typeof SERVICES)[number];

/** Bounds carried over from the Pydantic models. */
const SHORT = 200;
const LINE = 500;
const BODY = 5000;
const MAX_VALUES = 120;
const MAX_DOCUMENTS = 30;
const MAX_CONSENTS = 20;

export type Invalid = { ok: false; error: string };
export type Valid<T> = { ok: true; value: T };
export type Checked<T> = Valid<T> | Invalid;

const invalid = (error: string): Invalid => ({ ok: false, error });

function text(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed.length > max ? null : trimmed;
}

function optionalText(v: unknown, max: number): string | null | undefined {
  if (v === undefined || v === null || v === "") return null;
  return text(v, max) ?? undefined; // undefined signals "present but invalid"
}

/**
 * Deliberately permissive, and matches the pattern the sign-in form uses.
 * A stricter regex rejects real addresses; the authoritative test is whether
 * mail to it is ever answered, which no regex can do.
 */
function email(v: unknown): string | null {
  const value = text(v, SHORT);
  if (!value) return null;
  return /^\S+@\S+\.\S{2,}$/.test(value) ? value.toLowerCase() : null;
}

function service(v: unknown): Service {
  return SERVICES.includes(v as Service) ? (v as Service) : "other";
}

/**
 * The honeypot. Real people never see this field, so anything in it is a bot.
 * Callers answer exactly as they would a real submission and store nothing, so
 * the bot gets no signal to tune against.
 */
export function isBot(body: Record<string, unknown>): boolean {
  return Boolean(text(body.website, LINE));
}

export function asObject(payload: unknown): Record<string, unknown> | null {
  return payload && typeof payload === "object" && !Array.isArray(payload)
    ? (payload as Record<string, unknown>)
    : null;
}

// ------------------------------------------------------------------ inquiries

export type InquiryRow = {
  name: string;
  email: string;
  phone: string | null;
  service: Service;
  message: string;
  source: string | null;
};

export function checkInquiry(body: Record<string, unknown>): Checked<InquiryRow> {
  const name = text(body.name, SHORT);
  if (!name) return invalid("Enter your name.");

  const address = email(body.email);
  if (!address) return invalid("Enter a valid email address.");

  const message = text(body.message, BODY);
  if (!message) return invalid("Enter a message.");

  const phone = optionalText(body.phone, LINE);
  if (phone === undefined) return invalid("That phone number is too long.");

  const source = optionalText(body.source, LINE);

  return {
    ok: true,
    value: {
      name,
      email: address,
      phone,
      service: service(body.service),
      message,
      source: source === undefined ? null : source,
    },
  };
}

// --------------------------------------------------------------- applications

export type ApplicationRow = {
  form_id: string;
  service: Service;
  reference: string;
  name: string;
  email: string;
  phone: string | null;
  destination: string | null;
  answers: Record<string, string>;
  documents: unknown[];
  consents: string[];
};

export function checkApplication(
  body: Record<string, unknown>,
): Checked<ApplicationRow> {
  const form_id = text(body.form_id, SHORT);
  if (!form_id) return invalid("Something went wrong with this form.");

  const reference = text(body.reference, SHORT);
  if (!reference) return invalid("Something went wrong with this form.");

  const name = text(body.name, SHORT);
  if (!name) return invalid("Enter your name.");

  const address = email(body.email);
  if (!address) return invalid("Enter a valid email address.");

  const phone = optionalText(body.phone, LINE);
  if (phone === undefined) return invalid("That phone number is too long.");

  const destination = optionalText(body.destination, LINE);
  if (destination === undefined) return invalid("That destination is too long.");

  // The funnel's answers. Free-form by design — the funnels differ per service
  // — so the shape is checked rather than the keys: a bounded number of
  // bounded strings.
  const rawValues = asObject(body.values) ?? {};
  const entries = Object.entries(rawValues);
  if (entries.length > MAX_VALUES) return invalid("That form has too many answers.");

  const answers: Record<string, string> = {};
  for (const [key, value] of entries) {
    const k = text(key, SHORT);
    if (!k) return invalid("That form has an invalid answer.");
    // Answers are stringified rather than rejected: a checkbox group arrives
    // as an array and a number arrives as a number, and neither is an error.
    const v = text(Array.isArray(value) ? value.join(", ") : String(value ?? ""), BODY);
    if (v === null) return invalid("One of your answers is too long.");
    answers[k] = v;
  }

  const documents = Array.isArray(body.documents) ? body.documents : [];
  if (documents.length > MAX_DOCUMENTS) return invalid("Too many documents.");

  const rawConsents = Array.isArray(body.consents) ? body.consents : [];
  if (rawConsents.length > MAX_CONSENTS) return invalid("Too many consents.");
  const consents: string[] = [];
  for (const c of rawConsents) {
    const value = text(c, LINE);
    if (value) consents.push(value);
  }

  return {
    ok: true,
    value: {
      form_id,
      service: service(body.service),
      reference,
      name,
      email: address,
      phone,
      destination,
      answers,
      documents,
      consents,
    },
  };
}

// ---------------------------------------------------------------- subscribers

export type SubscriberRow = { email: string; source: string | null };

export function checkSubscriber(
  body: Record<string, unknown>,
): Checked<SubscriberRow> {
  const address = email(body.email);
  if (!address) return invalid("Enter a valid email address.");
  const source = optionalText(body.source, LINE);
  return { ok: true, value: { email: address, source: source ?? null } };
}
