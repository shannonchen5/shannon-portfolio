type RunnerSpriteProps = {
  color?: string;
  className?: string;
};

export function RunnerSprite({
  color = "#D4561C",
  className,
}: RunnerSpriteProps) {
  return (
    <svg
      viewBox="0 0 48 64"
      width="40"
      height="52"
      className={className}
      aria-hidden
    >
      <ellipse cx="24" cy="58" rx="10" ry="3" fill="#1F1B16" opacity="0.12" />
      <circle cx="24" cy="14" r="8" fill={color} />
      <rect x="18" y="22" width="12" height="18" rx="6" fill={color} />
      <path
        d="M18 28c-6 2-10 0-12-2"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M30 28c6 2 10 4 12 2"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M20 40c-2 8-4 12-6 16"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M28 40c2 8 6 12 8 16"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
