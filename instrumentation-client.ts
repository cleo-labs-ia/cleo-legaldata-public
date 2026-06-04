import posthog from "posthog-js";

// PostHog (EU). Next.js 15.3+ lightweight client instrumentation — runs once
// on the client automatically. No-op safe: if the project token isn't set,
// PostHog is never initialized (no crash in preview/build without env).
const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (token) {
  posthog.init(token, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
    defaults: "2026-01-30",
  });
}
