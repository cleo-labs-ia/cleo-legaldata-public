import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/notify-key-interest
 *
 * Fire-and-forget internal notification: emails the team when a visitor clicks
 * "Get API key" on the legaldata vitrine. Called from the client on click
 * (keepalive fetch), so it MUST never surface an error to the user — every
 * code path returns HTTP 200.
 *
 * Body (JSON, all optional): { source?: string, ts?: string, path?: string }
 *
 * Failure modes (all return 200):
 *   - RESEND_API_KEY missing/empty  → no-op, { ok: true, skipped: "no_resend_key" }
 *   - Resend send throws            → caught, { ok: false, error: "send_failed" }
 */

// Default to contact@cleolabs.co — the only address Resend can reach until the
// cleolabs.co domain is verified (resend.com/domains). Once verified, set
// NOTIFY_TO="naomie@cleolabs.co,anaelle@cleolabs.co,alexandre@cleolabs.co" and
// NOTIFY_FROM to a @cleolabs.co sender — no code change needed.
const RECIPIENTS = (process.env.NOTIFY_TO || "contact@cleolabs.co")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

type NotifyBody = {
  source?: string;
  ts?: string;
  path?: string;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[notify-key-interest] RESEND_API_KEY not set — skipping notification",
    );
    return NextResponse.json({ ok: true, skipped: "no_resend_key" });
  }

  // Tolerate empty / invalid bodies — this is fire-and-forget.
  let body: NotifyBody = {};
  try {
    body = (await req.json()) as NotifyBody;
  } catch {
    body = {};
  }

  const source = body?.source || "unknown";
  const path = body?.path || "unknown";
  const ts = body?.ts || new Date().toISOString();

  const from = process.env.NOTIFY_FROM || "Cleo Legaldata <onboarding@resend.dev>";
  const subject = '🔑 Nouveau clic "Get API key" — legaldata';

  const text = [
    "Quelqu'un a cliqué Get API key sur la vitrine legaldata.",
    "",
    `Source : ${source}`,
    `Path   : ${path}`,
    `Date   : ${ts}`,
  ].join("\n");

  // Body fields are client-supplied (anyone can POST) → escape before embedding
  // in the internal email's HTML to avoid injection into the team's inboxes.
  const esc = (s: string) =>
    s.replace(/[<>&"]/g, (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c] as string,
    );

  const html = `
    <p>Quelqu'un a cliqué <strong>Get API key</strong> sur la vitrine legaldata.</p>
    <ul>
      <li><strong>Source :</strong> ${esc(source)}</li>
      <li><strong>Path :</strong> ${esc(path)}</li>
      <li><strong>Date :</strong> ${esc(ts)}</li>
    </ul>
  `;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: RECIPIENTS,
      subject,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[notify-key-interest] Resend send failed", {
      source,
      path,
      error:
        e instanceof Error
          ? { name: e.name, message: e.message, stack: e.stack?.slice(0, 500) }
          : e,
    });
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 200 });
  }
}
