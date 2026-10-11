import { TrackCorner } from "@/components/track/TrackCorner";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  trackColor?: "mustard" | "lavender" | "plum" | "peach";
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  trackColor = "mustard",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute -right-2 -top-4 opacity-90 sm:right-0" aria-hidden>
        <TrackCorner color={trackColor} />
      </div>
      <p className="text-eyebrow text-text-muted">{eyebrow}</p>
      <h1 className="mt-3 text-h1 text-plum">{title}</h1>
      {description ? (
        <p className="mt-4 max-w-2xl text-body text-text-muted">{description}</p>
      ) : null}
    </div>
  );
}
