/**
 * Stripe singleton + plan → price ID mapping.
 *
 * Reads price IDs from env vars (same names as cleo-legal-public, so they can be
 * shared across Vercel projects without duplication).
 *
 * If STRIPE_SECRET_KEY or a price ID is missing, callers must handle the
 * `null` / `undefined` and fall back to a non-Stripe destination.
 */
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  // Pin API version to avoid SDK-vs-account version drift, and use fetch
  // (smaller cold-start in Vercel serverless than the default Node HTTP).
  _stripe = new Stripe(key, {
    httpClient: Stripe.createFetchHttpClient(),
  });
  return _stripe;
}

export type Plan =
  | "starter"
  | "light"
  | "pro"
  | "business"
  | "product-light"
  | "product-pro"
  | "product-business"
  | "legal-light"
  | "legal-pro"
  | "legal-business";

export type Cadence = "monthly" | "yearly";

/**
 * Map our public plan keys → Stripe price ID env vars.
 * Add the matching env var on Vercel (Production + Preview) for the plans you
 * want clickable. Plans without a configured price will redirect to the
 * sales-call page.
 */
function priceIdEnv(plan: Plan, cadence: Cadence): string | undefined {
  // Light tier (100€/mo)
  if (plan === "light" || plan === "product-light" || plan === "legal-light") {
    return cadence === "yearly"
      ? process.env.STRIPE_LIGHT_YEARLY_PRICE_ID
      : process.env.STRIPE_LIGHT_MONTHLY_PRICE_ID;
  }
  // Pro tier (349€/mo) — same env names as cleo-legal-public, intentionally
  if (plan === "pro" || plan === "product-pro" || plan === "legal-pro") {
    return cadence === "yearly"
      ? process.env.STRIPE_PRO_YEARLY_PRICE_ID
      : process.env.STRIPE_PRO_PRICE_ID;
  }
  // Business tier (999€/mo)
  if (plan === "business" || plan === "product-business" || plan === "legal-business") {
    return cadence === "yearly"
      ? process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID
      : process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID;
  }
  // Starter / Free → no Stripe charge, signup-only flow
  return undefined;
}

export function getPriceId(plan: Plan, cadence: Cadence): string | undefined {
  return priceIdEnv(plan, cadence);
}
