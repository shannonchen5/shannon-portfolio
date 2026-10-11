import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section>
      <p className="text-eyebrow text-plum">404</p>
      <h1 className="mt-3 text-h1 text-text">Off the track</h1>
      <p className="mt-4 max-w-md text-body text-text-muted">
        That page doesn&apos;t exist. Head back home and pick another lane.
      </p>
      <div className="mt-8">
        <Button href="/">Back home</Button>
      </div>
    </Section>
  );
}
