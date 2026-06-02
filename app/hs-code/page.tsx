import HsCodeProduct from "./HsCodeProduct";

export const dynamic = "force-static";

export const metadata = {
  title: "HS Code — Customs & trade API | Cleo Legal Data",
  description:
    "Classify any product to its HS code, compute duties and landed cost, screen dual-use & sanctions across 177 jurisdictions — one API call. Public pricing, instant key.",
};

export default function HsCodePage() {
  return <HsCodeProduct />;
}
