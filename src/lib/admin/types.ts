/**
 * Mirrors the Pydantic models in `backend/app/schemas.py`.
 *
 * Kept hand-written rather than generated from the OpenAPI schema: the surface
 * is small, and a hand-written type is the thing that fails a `tsc` build the
 * moment the backend renames a field, which is exactly the signal we want.
 */

export const STATUSES = [
  "new",
  "in_review",
  "contacted",
  "approved",
  "rejected",
  "archived",
] as const;

export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  new: "New",
  in_review: "In review",
  contacted: "Contacted",
  approved: "Approved",
  rejected: "Rejected",
  archived: "Archived",
};

export type Service =
  | "work"
  | "study"
  | "travel"
  | "visa"
  | "flights"
  | "employer"
  | "other";

export const SERVICE_LABELS: Record<Service, string> = {
  work: "Work abroad",
  study: "Study abroad",
  travel: "Travel",
  visa: "Visa support",
  flights: "Flights",
  employer: "Employer",
  other: "Other",
};

export type DocumentRef = {
  id: string;
  label: string;
  filename?: string | null;
  size_bytes?: number | null;
  content_type?: string | null;
  storage_key?: string | null;
};

export type Application = {
  id: string;
  form_id: string;
  service: Service;
  reference: string;
  name: string;
  email: string;
  phone?: string | null;
  destination?: string | null;
  values: Record<string, string>;
  documents: DocumentRef[];
  consents: string[];
  status: Status;
  note?: string | null;
  created_at: string;
  updated_at: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  service: Service;
  message: string;
  source?: string | null;
  status: Status;
  note?: string | null;
  created_at: string;
  updated_at: string;
};

export type Subscriber = {
  email: string;
  source?: string | null;
  created_at: string;
  unsubscribed: boolean;
};

export type BlogSection = { heading?: string | null; body: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  read_time: string;
  hero_image?: string | null;
  tags: string[];
  sections: BlogSection[];
  published: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type Stats = {
  applications_total: number;
  applications_new: number;
  inquiries_total: number;
  inquiries_new: number;
  subscribers_total: number;
  posts_total: number;
  posts_published: number;
  by_service: Record<string, number>;
  by_status: Record<string, number>;
  recent_days: Record<string, number>;
};
