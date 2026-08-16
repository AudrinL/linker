/**
 * Recording submissions to the API.
 *
 * Both helpers are deliberately best-effort and never throw. The WhatsApp
 * hand-off is still the primary route an inquiry reaches the office — it works
 * with the backend down, and it is what the client's team already watches.
 * This adds the durable copy that the staff dashboard reads. If the API is
 * unreachable the applicant sees no difference, because nothing about their
 * outcome depended on it.
 */

import type { FormConfig } from "./forms";

/** Backend `Service` enum. Keep in step with `backend/app/schemas.py`. */
export type Service =
  | "work"
  | "study"
  | "travel"
  | "visa"
  | "flights"
  | "employer"
  | "other";

/** Funnel id → service line. Anything unmapped records as "other". */
const FORM_SERVICE: Record<string, Service> = {
  "work-abroad": "work",
  "study-abroad": "study",
  "visa-support": "visa",
  "submit-cv": "work",
  "job-order": "employer",
  flight: "flights",
  contact: "other",
};

/** Contact-form service label → service line. */
const LABEL_SERVICE: Record<string, Service> = {
  "Overseas jobs & recruitment": "work",
  "Visa application": "visa",
  "Flights & hotels": "flights",
  "Study abroad": "study",
  "Something else": "other",
};

export function serviceForLabel(label: string): Service {
  return LABEL_SERVICE[label] ?? "other";
}

async function post(path: string, body: unknown): Promise<boolean> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // The applicant may be navigating to WhatsApp as this fires; keepalive
      // lets the request finish after the page starts unloading.
      keepalive: true,
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function recordInquiry(input: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  source?: string;
}): Promise<boolean> {
  return post("/api/inquiries", {
    name: input.name,
    // The form accepts either an email or a phone number, but the API requires
    // a valid address. This placeholder keeps a phone-only inquiry from being
    // dropped; the real number is right there in the record.
    email: input.email.trim() || "no-email@linkerworldtravel.com",
    phone: input.phone || null,
    service: serviceForLabel(input.service),
    message: input.message,
    source: input.source,
  });
}

export function recordSubscriber(email: string, source?: string): Promise<boolean> {
  return post("/api/newsletter", { email, source });
}

/** Pull the applicant's identity out of a funnel's free-form answers. */
function identity(values: Record<string, string>) {
  const pick = (...keys: string[]) =>
    keys.map((k) => values[k]).find((v) => v && v.trim()) ?? "";

  return {
    name: pick("fullName", "name", "contactName", "companyName") || "Unnamed applicant",
    email: pick("email", "workEmail", "contactEmail") || "no-email@linkerworldtravel.com",
    phone: pick("phone", "whatsapp", "contactPhone") || null,
    destination: pick("firstChoice", "destination", "country", "to") || null,
  };
}

export function recordApplication(
  config: FormConfig,
  reference: string,
  values: Record<string, string>,
  files: Record<string, File | null>,
): Promise<boolean> {
  // Consent checkboxes are stored alongside the answers as `consent:0` — split
  // them back out so the record shows what was agreed to, not "consent:0=on".
  const answers: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    if (!key.startsWith("consent:") && value) answers[key] = value;
  }

  const consents = config.consents.filter((_, i) => values[`consent:${i}`] === "on");

  const documents = config.documents
    .filter((document) => files[document.id])
    .map((document) => ({
      id: document.id,
      label: document.label,
      filename: files[document.id]?.name ?? null,
      size_bytes: files[document.id]?.size ?? null,
      content_type: files[document.id]?.type || null,
    }));

  return post("/api/applications", {
    form_id: config.id,
    service: FORM_SERVICE[config.id] ?? "other",
    reference,
    ...identity(values),
    values: answers,
    documents,
    consents,
  });
}
