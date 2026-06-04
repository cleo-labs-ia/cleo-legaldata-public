"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * EU-region PostHog provider.
 *
 * No-op safe: when `NEXT_PUBLIC_POSTHOG_KEY` is missing/empty, posthog is
 * never initialized and children render untouched. Init runs once on mount
 * and is guarded against double-init (React StrictMode, fast refresh).
 */
export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    if (posthog.__loaded) return;

    posthog.init(POSTHOG_KEY, {
      api_host: "https://eu.i.posthog.com",
      ui_host: "https://eu.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    });
  }, []);

  if (!POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
