import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { site } from "@/content/site";
import { contactDraftHref } from "@/lib/mailto";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Shannon Chen.",
};

export default function ContactPage() {
  const linkedin = site.socials.find((social) => social.label === "LinkedIn");

  return (
    <Section>
      <FadeIn>
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-x-20 xl:gap-x-28">
          <div className="max-w-md">
            <PageHeader
              eyebrow="Contact"
              title="Get in touch"
              description="Have a question or want to work together? I’d love to hear from you."
            />
            <div className="mt-10 flex flex-col items-start gap-3">
              <Button href={contactDraftHref(site.email)}>Email</Button>
              {linkedin ? (
                <Button href={linkedin.href} variant="secondary" external>
                  LinkedIn
                </Button>
              ) : null}
              <Button href={site.resume.href} variant="secondary" external>
                Resume
              </Button>
            </div>
          </div>

          <ContactForm />
        </div>
      </FadeIn>
    </Section>
  );
}
