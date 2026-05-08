import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cleo Legal Data Atlas — 1,479 open legal sources across 177 jurisdictions",
  description:
    "Public, exhaustive map of every open legal data source tracked by Cleo Comply. Browse legislation, case law, and doctrine from 177 jurisdictions worldwide.",
  icons: {
    icon: [
      { url: "/cleo-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/cleo-icon.svg",
    apple: "/cleo-icon.svg",
  },
  openGraph: {
    title: "Cleo Legal Data Atlas",
    description:
      "1,479 open legal sources across 177 jurisdictions, tracked by Cleo Comply.",
    type: "website",
    images: [{ url: "/cleo-icon.svg" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
