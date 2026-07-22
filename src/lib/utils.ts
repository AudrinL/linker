import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Build a wa.me deep link with a pre-filled message. */
export function whatsappLink(phoneE164Digits: string, message: string) {
  return `https://wa.me/${phoneE164Digits}?text=${encodeURIComponent(message)}`;
}

/** Build a mailto: link with subject and body. */
export function mailtoLink(to: string, subject: string, body: string) {
  return `mailto:${to}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

/** True when the visitor has asked the OS to reduce motion. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
