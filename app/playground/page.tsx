import Playground from "./Playground";

export const dynamic = "force-static";

export const metadata = {
  title: "Playground | Cleo Legal Data API",
  description:
    "Test the Cleo Legal Data API live — pick an endpoint, set filters, see the generated curl request and a sample response.",
};

export default function PlaygroundPage() {
  return <Playground />;
}
