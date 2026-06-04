import posthog from "posthog-js";

/**
 * Fired from every "Get API key" CTA on click.
 *
 * - PostHog `get_api_key_clicked` event fires on EVERY click (no-op safe if
 *   PostHog isn't initialized — guarded by try/catch).
 * - The internal email notification (/api/notify-key-interest) fires at most
 *   ONCE per browser session, to avoid flooding the team's inboxes on repeat
 *   clicks / bots. Fire-and-forget: never blocks the link navigation, never
 *   throws.
 *
 * Does NOT preventDefault — the surrounding <a> proceeds to the signup as usual.
 */
const SESSION_FLAG = "cleo_key_interest_notified";

export function trackGetApiKeyClick(source: string): void {
  const path = typeof location !== "undefined" ? location.pathname : "";

  try {
    posthog.capture("get_api_key_clicked", { source, path });
  } catch {
    /* PostHog not loaded — ignore */
  }

  try {
    if (sessionStorage.getItem(SESSION_FLAG)) return;
    sessionStorage.setItem(SESSION_FLAG, "1");
    void fetch("/api/notify-key-interest", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, path, ts: new Date().toISOString() }),
    }).catch(() => {});
  } catch {
    /* sessionStorage unavailable (private mode / SSR) — ignore */
  }
}
