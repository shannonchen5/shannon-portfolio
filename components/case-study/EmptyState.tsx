import { Button } from "@/components/ui/Button";

type EmptyStateProps = {
  category: "digital" | "physical";
};

export function EmptyState({ category }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <p className="text-eyebrow text-text-muted">Coming soon</p>
      <h2 className="mt-3 text-h2 text-text">
        No {category} case studies yet
      </h2>
      <p className="mx-auto mt-4 max-w-md text-body text-text-muted">
        [Your copy here — a short note while this category is empty.]
      </p>
      <div className="mt-8 flex justify-center">
        <Button href="/contact" variant="secondary">
          Get in touch
        </Button>
      </div>
    </div>
  );
}
