"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { messageDraftHref } from "@/lib/mailto";
import { Button } from "@/components/ui/Button";

const fieldClass =
  "mt-2 w-full rounded-2xl border border-border bg-bg px-4 py-3 text-text outline-none transition-colors focus:border-accent";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "draft" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });
      const payload = (await response.json()) as { error?: string; draft?: boolean };
      if (payload.draft) {
        window.location.href = messageDraftHref(site.email, {
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          subject: String(data.get("subject") ?? ""),
          message: String(data.get("message") ?? ""),
        });
        setStatus("draft");
        return;
      }
      if (!response.ok) {
        setStatus("error");
        setError(payload.error || "The message couldn’t be sent.");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("The message couldn’t be sent. Please use the email link instead.");
    }
  }

  return (
    <form
      className="relative rounded-3xl border border-border bg-surface p-6 sm:p-8"
      onSubmit={onSubmit}
    >
      <h2 className="text-h2 text-text">Send a message</h2>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === "sent" ? (
        <p className="mt-6 text-body text-text-muted">
          Message sent. I’ll get back to you soon.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="text-eyebrow text-text-muted">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              maxLength={120}
              className={fieldClass}
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-eyebrow text-text-muted">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              maxLength={200}
              className={fieldClass}
              placeholder="Your email"
            />
          </div>
          <div>
            <label htmlFor="subject" className="text-eyebrow text-text-muted">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              maxLength={160}
              className={fieldClass}
              placeholder="How can I help?"
            />
          </div>
          <div>
            <label htmlFor="message" className="text-eyebrow text-text-muted">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              maxLength={5000}
              className={`${fieldClass} resize-y`}
              placeholder="Write your message…"
            />
          </div>
          {status === "draft" ? (
            <p className="text-sm text-text-muted" role="status">
              Your email app should open with this message ready to send.
            </p>
          ) : null}
          {error ? (
            <p className="text-sm text-plum" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send message"}
          </Button>
        </div>
      )}
    </form>
  );
}
