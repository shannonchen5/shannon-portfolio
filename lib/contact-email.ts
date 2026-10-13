import { site } from "@/content/site";

export type ContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readContactMessage(body: unknown): ContactMessage | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const name = clean(record.name, 120);
  const email = clean(record.email, 200);
  const subject = clean(record.subject, 160);
  const message = clean(record.message, 5000);
  const company = clean(record.company, 200);
  if (!name || !email || !subject || !message) return null;
  if (!EMAIL_PATTERN.test(email)) return null;
  return { name, email, subject, message, company };
}

/** Sends the note through Resend. Returns a visitor-safe error when it cannot. */
export async function sendContactEmail(
  note: ContactMessage,
): Promise<{ ok: true } | { ok: false; error: string; draft?: boolean }> {
  if (note.company) return { ok: true };

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || site.email;

  if (!apiKey || !from || !to || to.endsWith("@example.com")) {
    console.error(
      "Contact email is not configured. Set RESEND_API_KEY, CONTACT_FROM_EMAIL, and CONTACT_TO_EMAIL.",
    );
    return {
      ok: false,
      error: "The message couldn’t be sent. Please use the email link instead.",
      draft: true,
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: note.email,
      subject: note.subject.replace(/[\r\n]+/g, " "),
      text: `From: ${note.name} <${note.email}>\n\n${note.message}`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Resend rejected the contact email", response.status, detail);
    return {
      ok: false,
      error: "The message couldn’t be sent. Please use the email link instead.",
    };
  }

  return { ok: true };
}

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}
