import { readContactMessage, sendContactEmail } from "@/lib/contact-email";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many messages. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const note = readContactMessage(body);
  if (!note) {
    return Response.json(
      { error: "Add your name, email, subject, and message." },
      { status: 400 },
    );
  }

  const result = await sendContactEmail(note);
  if (!result.ok) {
    return Response.json(
      { error: result.error, draft: result.draft ?? false },
      { status: 503 },
    );
  }

  remember(ip);
  return Response.json({ ok: true });
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.set(ip, hits);
  return hits.length >= MAX_PER_WINDOW;
}

function remember(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
}
