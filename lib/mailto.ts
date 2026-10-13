/** Opens the visitor’s mail app with a message addressed and ready to send. */
export function mailtoHref(to: string, subject: string, body: string) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function contactDraftHref(to: string) {
  return mailtoHref(to, "Hello Shannon", "Hi Shannon,\n\n");
}

export function messageDraftHref(
  to: string,
  note: { name: string; email: string; subject: string; message: string },
) {
  return mailtoHref(
    to,
    note.subject,
    `Hi Shannon,\n\n${note.message}\n\n— ${note.name}\n${note.email}`,
  );
}
