import type { Metadata } from "next";
import { site as siteFallback } from "@/content/site";
import { AboutPageContent } from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About",
  description: siteFallback.about.body,
};

export default function AboutPage() {
  return <AboutPageContent />;
}
