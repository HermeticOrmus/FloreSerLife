import { cn } from "@/lib/utils";

interface OrganicBackgroundProps {
  variant?: "garden" | "hive" | "neutral" | "mixed";
  intensity?: "subtle" | "medium" | "strong";
  withVines?: boolean;
  vinesPosition?: "left" | "right" | "both";
  className?: string;
  children?: React.ReactNode;
}

// Reusable organic background shapes for section styling
export function OrganicBackground({
  variant = "neutral",
  intensity = "medium",
  withVines = false,
  vinesPosition = "left",
  className,
  children,
}: OrganicBackgroundProps) {
  const opacityMap = {
    subtle: { blobs: 8, vines: 8 },
    medium: { blobs: 15, vines: 12 },
    strong: { blobs: 25, vines: 18 },
  };

  const blobOpacity = opacityMap[intensity].blobs;
  const vineOpacity = opacityMap[intensity].vines;

  const gradientMap = {
    garden: {
      primary: "from-garden-accent",
      secondary: "from-light-green",
      tertiary: "from-gold",
      bg: "from-cream via-garden-accent/5 to-light-green/10",
    },
    hive: {
      primary: "from-hive-accent",
      secondary: "from-gold",
      tertiary: "from-hive-accent-light",
      bg: "from-cream via-hive-accent/5 to-gold/10",
    },
    neutral: {
      primary: "from-sage",
      secondary: "from-earth-300",
      tertiary: "from-gold",
      bg: "from-cream via-sage/5 to-earth-100",
    },
    mixed: {
      primary: "from-garden-accent",
      secondary: "from-hive-accent",
      tertiary: "from-gold",
      bg: "from-cream via-light-green/5 to-hive-accent/5",
    },
  };

  const colors = gradientMap[variant];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Base gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", colors.bg)} />

      {/* Floating organic blobs */}
      <div
        className={cn(
          "absolute top-10 left-10 w-72 h-72 bg-gradient-to-br to-transparent rounded-full blur-3xl animate-float",
          colors.primary
        )}
        style={{ opacity: blobOpacity / 100 }}
      />
      <div
        className={cn(
          "absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl to-transparent rounded-full blur-3xl animate-float",
          colors.secondary
        )}
        style={{ opacity: blobOpacity / 100, animationDelay: "2s" }}
      />
      <div
        className={cn(
          "absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r to-transparent rounded-full blur-2xl animate-float",
          colors.tertiary
        )}
        style={{ opacity: (blobOpacity * 0.6) / 100, animationDelay: "4s" }}
      />

      {/* Decorative vines */}
      {withVines && (vinesPosition === "left" || vinesPosition === "both") && (
        <div
          className="absolute left-0 top-0 w-32 h-full pointer-events-none"
          style={{ opacity: vineOpacity / 100 }}
        >
          <svg viewBox="0 0 100 800" className="h-full w-full" preserveAspectRatio="none">
            <path
              d="M50,0 Q30,100 50,200 T50,400 T50,600 T50,800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-forest"
            />
            <circle
              cx="50"
              cy="150"
              r="8"
              className="text-gold fill-current animate-bloom"
              style={{ animationDelay: "0.5s" }}
            />
            <circle
              cx="50"
              cy="350"
              r="6"
              className="text-garden-accent fill-current animate-bloom"
              style={{ animationDelay: "1s" }}
            />
            <circle
              cx="50"
              cy="550"
              r="10"
              className="text-hive-accent fill-current animate-bloom"
              style={{ animationDelay: "1.5s" }}
            />
          </svg>
        </div>
      )}

      {withVines && (vinesPosition === "right" || vinesPosition === "both") && (
        <div
          className="absolute right-0 top-0 w-32 h-full pointer-events-none"
          style={{ opacity: (vineOpacity * 0.8) / 100 }}
        >
          <svg viewBox="0 0 100 800" className="h-full w-full" preserveAspectRatio="none">
            <path
              d="M50,0 Q70,100 50,200 T50,400 T50,600 T50,800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-forest"
            />
            <circle
              cx="50"
              cy="250"
              r="7"
              className="text-garden-accent fill-current animate-bloom"
              style={{ animationDelay: "0.8s" }}
            />
            <circle
              cx="50"
              cy="450"
              r="5"
              className="text-gold fill-current animate-bloom"
              style={{ animationDelay: "1.3s" }}
            />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Individual decorative elements that can be used standalone
export function FloatingBlob({
  color = "gold",
  size = "md",
  position = { top: 10, left: 10 },
  delay = 0,
  className,
}: {
  color?: "gold" | "garden" | "hive" | "sage";
  size?: "sm" | "md" | "lg" | "xl";
  position?: { top?: number; left?: number; right?: number; bottom?: number };
  delay?: number;
  className?: string;
}) {
  const sizeMap = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-72 h-72",
    xl: "w-96 h-96",
  };

  const colorMap = {
    gold: "from-gold/15",
    garden: "from-garden-accent/15",
    hive: "from-hive-accent/15",
    sage: "from-sage/15",
  };

  const positionStyles: React.CSSProperties = {
    ...(position.top !== undefined && { top: `${position.top}%` }),
    ...(position.left !== undefined && { left: `${position.left}%` }),
    ...(position.right !== undefined && { right: `${position.right}%` }),
    ...(position.bottom !== undefined && { bottom: `${position.bottom}%` }),
  };

  return (
    <div
      className={cn(
        "absolute bg-gradient-to-br to-transparent rounded-full blur-3xl animate-float pointer-events-none",
        sizeMap[size],
        colorMap[color],
        className
      )}
      style={{
        ...positionStyles,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export function DecorativeVine({
  side = "left",
  opacity = 15,
  className,
}: {
  side?: "left" | "right";
  opacity?: number;
  className?: string;
}) {
  const isLeft = side === "left";

  return (
    <div
      className={cn(
        "absolute top-0 w-24 h-full pointer-events-none",
        isLeft ? "left-0" : "right-0",
        className
      )}
      style={{ opacity: opacity / 100 }}
    >
      <svg viewBox="0 0 100 800" className="h-full w-full" preserveAspectRatio="none">
        <path
          d={isLeft ? "M50,0 Q30,100 50,200 T50,400 T50,600 T50,800" : "M50,0 Q70,100 50,200 T50,400 T50,600 T50,800"}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-forest"
        />
        <circle
          cx="50"
          cy={isLeft ? 150 : 200}
          r={isLeft ? 8 : 6}
          className="text-gold fill-current animate-bloom"
          style={{ animationDelay: "0.5s" }}
        />
        <circle
          cx="50"
          cy={isLeft ? 350 : 400}
          r={isLeft ? 6 : 8}
          className="text-garden-accent fill-current animate-bloom"
          style={{ animationDelay: "1s" }}
        />
        <circle
          cx="50"
          cy={isLeft ? 550 : 600}
          r={isLeft ? 10 : 5}
          className="text-hive-accent fill-current animate-bloom"
          style={{ animationDelay: "1.5s" }}
        />
      </svg>
    </div>
  );
}
