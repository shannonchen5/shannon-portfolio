"use client";

import { SiteCopy } from "@/components/home/SiteCopy";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHeader } from "@/components/ui/PageHeader";

export function AboutPageContent() {
  return (
    <SiteCopy>
      {(site) => (
        <FadeIn className="max-w-3xl">
          <PageHeader eyebrow="About" title={site.name} />
          <p className="mt-6 text-body text-text-muted">{site.about.body}</p>
          <p className="mt-4 text-body text-text-muted">{site.about.extended}</p>

          <div className="mt-12 rounded-3xl border border-border bg-peach/60 p-8">
            <h2 className="text-h3 text-text">Currently</h2>
            <ul className="mt-4 space-y-2 text-text-muted">
              <li>[Your copy here — current focus 1]</li>
              <li>[Your copy here — current focus 2]</li>
              <li>[Your copy here — current focus 3]</li>
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/contact">Contact</Button>
            <Button href="/digital" variant="secondary">
              View work
            </Button>
          </div>
        </FadeIn>
      )}
    </SiteCopy>
  );
}
