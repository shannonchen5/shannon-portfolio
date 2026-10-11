import { getFeaturedCaseStudies } from "@/content/case-studies";
import { HomePageContent } from "./HomePageContent";

export default function HomePage() {
  const featured = getFeaturedCaseStudies();
  return <HomePageContent featured={featured} />;
}
