import { cn } from "@/lib/cn";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("relative", className)}>
      <p className="text-eyebrow text-text-muted">{eyebrow}</p>
      <h1 className="mt-3 text-h1 text-plum">{title}</h1>
      {description ? (
        <p className="mt-4 max-w-2xl text-body text-text-muted">{description}</p>
      ) : null}
    </div>
  );
}
