import Link from "next/link";
import { cn } from "@/lib/cn";

type CommonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  showArrow?: boolean;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & { href: string; external?: boolean };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants = {
  primary:
    "bg-accent text-text-on-accent hover:bg-accent-hover shadow-[var(--shadow-warm)]",
  secondary:
    "bg-surface text-text border border-border hover:border-plum hover:text-plum",
  ghost: "bg-transparent text-text hover:text-plum",
};

export function Button(props: ButtonProps) {
  const {
    children,
    className,
    variant = "primary",
    showArrow = variant === "primary",
  } = props;
  const classes = cn(
    "inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-semibold transition-[transform,background-color,border-color,color] duration-[120ms] ease-out hover:translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent motion-reduce:transform-none",
    variants[variant],
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {showArrow ? (
        <span aria-hidden className="inline-flex items-center self-center text-base leading-none">
          →
        </span>
      ) : null}
    </>
  );

  if ("href" in props && props.href) {
    const { href, external } = props;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      return (
        <a href={href} className={classes}>
          {content}
        </a>
      );
    }
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
