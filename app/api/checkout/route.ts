import { NextRequest, NextResponse } from "next/server";
import { getStripe, getPriceId, type Plan, type Cadence } from "@/lib/stripe";

/**
 * GET /api/checkout?plan=pro&cadence=monthly
 *
 * Public, no-auth Stripe Checkout entry. Creates a subscription session and
 * 302-redirects the visitor to Stripe directly — no signup form, no
 * intermediate pricing page.
 *
 * Stripe collects the email on its hosted page, the webhook on cleo-legal-api
 * provisions the API key after payment.
 *
 * Failure modes (all redirect to a safe fallback so the button never 404s):
 *   - STRIPE_SECRET_KEY missing  → /pricing on this site
 *   - Price ID missing for plan  → /pricing on this site
 *   - Stripe API error           → /pricing on this site with error flag
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const plan = (url.searchParams.get("plan") || "pro") as Plan;
  const cadence = (url.searchParams.get("cadence") || "monthly") as Cadence;
  const fallback = new URL("/pricing", url.origin);

  const stripe = getStripe();
  if (!stripe) {
    fallback.searchParams.set("checkout", "unconfigured");
    return NextResponse.redirect(fallback);
  }

  const priceId = getPriceId(plan, cadence);
  if (!priceId) {
    fallback.searchParams.set("checkout", "no-price");
    fallback.searchParams.set("plan", plan);
    return NextResponse.redirect(fallback);
  }

  try {
    const successUrl =
      "https://cleo-legal-public.vercel.app/dashboard/billing?checkout=success";
    const cancelUrl = `${url.origin}/pricing?checkout=cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ["card", "sepa_debit", "link"],
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      billing_address_collection: "required",
      allow_promotion_codes: true,
      customer_creation: "always",
      metadata: { plan, cadence, source: "legaldata-public" },
      subscription_data: {
        metadata: { plan, cadence, source: "legaldata-public" },
      },
    });

    if (!session.url) {
      fallback.searchParams.set("checkout", "no-url");
      return NextResponse.redirect(fallback);
    }
    return NextResponse.redirect(session.url, 303);
  } catch (e) {
    fallback.searchParams.set("checkout", "error");
    fallback.searchParams.set(
      "message",
      e instanceof Error ? e.message.slice(0, 120) : "unknown",
    );
    return NextResponse.redirect(fallback);
  }
}
