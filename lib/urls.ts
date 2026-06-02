/**
 * Single source of truth for every external/internal URL referenced
 * from multiple files. Update here, not in each component.
 */

export const URLS = {
  /** Sales / book a call. Cleo Labs Calendly hosted on cleolabs.co. */
  MEET: "https://www.cleolabs.co/en/meet",

  /** Self-serve signup (cleo-legal-public app, paired with cleo-legal-api). */
  SIGNUP: "https://cleo-legal-public.vercel.app/signup",

  /** Self-serve pricing on the app project. */
  APP_PRICING: "https://cleo-legal-public.vercel.app/pricing",

  /** Local Stripe checkout entry point (this project). */
  CHECKOUT: "/api/checkout",

  /** Public REST API base URL (production). */
  API_BASE: "https://api.legaldata.cleolabs.co",

  /** Where Stripe redirects after successful checkout (key delivery page). */
  CHECKOUT_SUCCESS: "https://cleo-legal-public.vercel.app/dashboard/billing?checkout=success",

  /** Sales email. */
  SALES_EMAIL: "sales@cleolabs.co",
} as const;

/** Build a checkout URL for a given plan id (light, pro, business, etc.). */
export function checkoutUrl(plan: string): string {
  return `${URLS.CHECKOUT}?plan=${encodeURIComponent(plan)}`;
}
