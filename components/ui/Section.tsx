import { cn } from "@/lib/cn";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "aside";
};

export function Section({
  children,
  className,
  id,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag id={id} className={cn("section-space", className)}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </Tag>
  );
}
