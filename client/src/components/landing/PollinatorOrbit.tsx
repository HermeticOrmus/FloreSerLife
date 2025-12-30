import { cn } from "@/lib/utils";
import { papercut, type ArchetypeType } from "@/assets";

interface PollinatorConfig {
  type: ArchetypeType;
  radius: number;     // Distance from center in px
  duration: number;   // Animation duration in seconds
  startAngle: number; // Starting position in degrees
  size: number;       // Icon size in px
}

interface PollinatorOrbitProps {
  className?: string;
  /** Number of pollinators to show (for responsive hiding) */
  count?: 2 | 3 | 4;
}

const pollinatorConfigs: PollinatorConfig[] = [
  { type: 'bee', radius: 120, duration: 8, startAngle: 0, size: 48 },
  { type: 'butterfly', radius: 100, duration: 12, startAngle: 90, size: 44 },
  { type: 'hummingbird', radius: 140, duration: 6, startAngle: 180, size: 52 },
  { type: 'beetle', radius: 110, duration: 15, startAngle: 270, size: 40 },
];

/**
 * Orbiting pollinators around a central element
 * Each pollinator has its own orbital path and speed
 */
export function PollinatorOrbit({ className, count = 4 }: PollinatorOrbitProps) {
  const visiblePollinators = pollinatorConfigs.slice(0, count);

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      aria-hidden="true"
    >
      {visiblePollinators.map((config, index) => (
        <OrbitingPollinator key={config.type} config={config} index={index} />
      ))}
    </div>
  );
}

interface OrbitingPollinatorProps {
  config: PollinatorConfig;
  index: number;
}

function OrbitingPollinator({ config, index }: OrbitingPollinatorProps) {
  const { type, radius, duration, startAngle, size } = config;

  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        width: radius * 2,
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius,
      }}
    >
      {/* Initial rotation offset wrapper */}
      <div
        className="absolute inset-0"
        style={{ transform: `rotate(${startAngle}deg)` }}
      >
        {/* Orbiting container */}
        <div
          className="absolute inset-0 origin-center"
          style={{
            animation: `orbit ${duration}s linear infinite`,
            animationDelay: `${index * -0.5}s`,
          }}
        >
          {/* Pollinator icon - counter-rotate to keep upright */}
          <div
            className="absolute left-1/2"
            style={{
              top: 0,
              marginLeft: -size / 2,
              animation: `orbit ${duration}s linear infinite reverse`,
              animationDelay: `${index * -0.5}s`,
            }}
          >
            <img
              src={papercut.pollinatorsTransparent[type]}
              alt=""
              className="drop-shadow-lg"
              style={{
                width: size,
                height: size,
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollinatorOrbit;
