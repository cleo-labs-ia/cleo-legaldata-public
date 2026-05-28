import HomeChooser from "./components/HomeChooser";

export const dynamic = "force-static";

export const metadata = {
  title: "Cleo Legal Data — Two atlases. One platform.",
  description:
    "Pick the Cleo atlas that fits your need — product compliance (46,031 regs across 15 categories) or worldwide legal mapping (1,479 sources across 177 jurisdictions). One API.",
};

export default function Page() {
  return <HomeChooser />;
}
