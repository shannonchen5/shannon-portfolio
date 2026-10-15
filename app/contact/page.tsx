import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { site } from "@/content/site";
import { contactDraftHref } from "@/lib/mailto";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Shannon Chen.",
};

export default function ContactPage() {
  const linkedin = site.socials.find((social) => social.label === "LinkedIn");

  return (
    <>
      <HeroTitle>Contact Me</HeroTitle>
      <div className="pb-16 pt-14 sm:pb-24">
        <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)]">
          <FadeIn>
            <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-x-20 xl:gap-x-28">
              <div>
                <p className="max-w-2xl text-body text-text-muted">
                  Have a question or want to work together? I’d love to hear from
                  you.
                </p>
                <div className="@container mt-10">
                  <div className="grid grid-cols-1 gap-8 @min-[44rem]:grid-cols-3 @min-[44rem]:gap-6">
                    <div>
                      <p className="text-eyebrow text-text-muted">Email</p>
                      <div className="mt-4">
                        <Button href={contactDraftHref(site.email)}>
                          {site.email}
                        </Button>
                      </div>
                    </div>
                    {linkedin ? (
                      <div>
                        <p className="text-eyebrow text-text-muted">LinkedIn</p>
                        <div className="mt-4">
                          <Button
                            href={linkedin.href}
                            variant="secondary"
                            external
                            showArrow
                          >
                            Let&apos;s Connect
                          </Button>
                        </div>
                      </div>
                    ) : null}
                    <div>
                      <p className="text-eyebrow text-text-muted">Resume</p>
                      <div className="mt-4">
                        <Button
                          href={site.resume.href}
                          variant="secondary"
                          external
                          showArrow
                        >
                          Resume
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
