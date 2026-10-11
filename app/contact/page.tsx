import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Shannon Chen.",
};

export default function ContactPage() {
  return (
    <Section>
      <FadeIn className="max-w-2xl">
        <PageHeader
          eyebrow="Contact"
          title="Let's Connect"
          description="[Your copy here — how you like to be reached and what kinds of opportunities interest you.]"
          trackColor="mustard"
        />

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={`mailto:${site.email}`} external>
            Email me
          </Button>
          {site.socials
            .filter((s) => s.label !== "Email")
            .map((social) => (
              <Button
                key={social.label}
                href={social.href}
                variant="secondary"
                external
              >
                {social.label}
              </Button>
            ))}
        </div>

        <form
          className="mt-14 space-y-6 rounded-3xl border border-border bg-surface p-6 sm:p-8"
          action={`mailto:${site.email}`}
          method="get"
          encType="text/plain"
        >
          <p className="text-sm text-text-muted">
            Or send a quick note (opens your email client — no backend yet).
          </p>
          <div>
            <label htmlFor="name" className="text-eyebrow text-text-muted">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className="mt-2 w-full rounded-2xl border border-border bg-bg px-4 py-3 text-text outline-none transition-colors focus:border-accent"
              placeholder="[Your name]"
            />
          </div>
          <div>
            <label htmlFor="message" className="text-eyebrow text-text-muted">
              Message
            </label>
            <textarea
              id="message"
              name="body"
              rows={5}
              className="mt-2 w-full resize-y rounded-2xl border border-border bg-bg px-4 py-3 text-text outline-none transition-colors focus:border-accent"
              placeholder="[Your message here]"
            />
          </div>
          <Button type="submit">Open email draft</Button>
        </form>
      </FadeIn>
    </Section>
  );
}
