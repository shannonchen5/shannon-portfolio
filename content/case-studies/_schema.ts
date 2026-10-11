export type Category = "digital" | "physical";

export type MediaImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  blurDataURL?: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type Block =
  | { type: "richText"; content: string }
  | { type: "image"; src: string; alt: string; aspectRatio?: string; blurDataURL?: string }
  | { type: "imageGallery"; images: MediaImage[] }
  | {
      type: "video";
      mp4: string;
      webm?: string;
      poster: string;
      alt: string;
      aspectRatio?: string;
    }
  | {
      type: "twoColumn";
      text: string;
      media:
        | { kind: "image"; src: string; alt: string; aspectRatio?: string }
        | {
            kind: "video";
            mp4: string;
            webm?: string;
            poster: string;
            alt: string;
            aspectRatio?: string;
          };
    }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "stats"; items: StatItem[] }
  | { type: "callout"; content: string }
  | {
      type: "comparison";
      before: { src: string; alt: string; label?: string };
      after: { src: string; alt: string; label?: string };
    }
  | { type: "custom"; component: string; props?: Record<string, unknown> };

export type CaseStudySection = {
  id: string;
  title: string;
  blocks: Block[];
};

/** Optional per-study brand token set applied on the case study page. */
export type CaseStudyBrand =
  | "kitchens-for-good"
  | "current"
  | "autumn-moon";

export type CaseStudy = {
  slug: string;
  title: string;
  category: Category;
  summary: string;
  role: string;
  duration: string;
  team: string;
  tools: string[];
  cover: MediaImage;
  featured: boolean;
  /** When set, remaps site CSS tokens to this project's brand guidelines. */
  brand?: CaseStudyBrand;
  stats?: StatItem[];
  sections: CaseStudySection[];
};
