import type { Metadata } from "next";
import { NUMBERS, fmt } from "@/lib/numbers";
import PostHogProvider from "@/app/components/PostHogProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: `Cleo Legal Data Atlas — ${fmt(NUMBERS.legalSources, "en")} open legal sources across ${NUMBERS.legalJurisdictions} jurisdictions`,
  description: `Public map of every open legal data source tracked by Cleo Comply: ${fmt(NUMBERS.legalSources, "en")} sources across ${NUMBERS.legalJurisdictions} jurisdictions — ${NUMBERS.sourcesComplete} fully indexed, ${NUMBERS.sourcesBlocked} in progress, ${NUMBERS.sourcesPlanned} planned. Browse legislation, case law and doctrine.`,
  icons: {
    icon: [
      { url: "/cleo-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/cleo-icon.svg",
    apple: "/cleo-icon.svg",
  },
  openGraph: {
    title: "Cleo Legal Data Atlas",
    description: `${fmt(NUMBERS.legalSources, "en")} open legal sources across ${NUMBERS.legalJurisdictions} jurisdictions, tracked by Cleo Comply.`,
    type: "website",
    images: [{ url: "/cleo-icon.svg" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
