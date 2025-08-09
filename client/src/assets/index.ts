// Brand Assets - Centralized import system for FloreSer brand assets

// Main Logos
import mainColoredText from './images/logos/main-colored-text.png';
import mainColoredIcon from './images/logos/main-colored-icon.png';
import goldText from './images/logos/gold-text.png';
import goldIcon from './images/logos/gold-icon.png';
import greenText from './images/logos/green-text.png';
import greenIcon from './images/logos/green-icon.png';

// Archetype Icons
import beeIcon from './images/icons/bee.png';
import butterflyIcon from './images/icons/butterfly.png';
import beetleIcon from './images/icons/beetle.png';
import hummingbirdIcon from './images/icons/hummingbird.png';

// Logo exports organized by usage context
export const logos = {
  // Main brand logos
  main: {
    coloredWithText: mainColoredText,
    coloredIcon: mainColoredIcon,
  },
  // Alternative color variations
  gold: {
    withText: goldText,
    icon: goldIcon,
  },
  green: {
    withText: greenText,
    icon: greenIcon,
  },
} as const;

// Archetype icon exports
export const archetypeIcons = {
  bee: beeIcon,
  butterfly: butterflyIcon,
  beetle: beetleIcon,
  hummingbird: hummingbirdIcon,
} as const;

// Convenient re-exports for specific use cases
export const primaryLogo = logos.main.coloredWithText;
export const primaryIcon = logos.main.coloredIcon;

// Type definitions for better TypeScript support
export type ArchetypeType = keyof typeof archetypeIcons;
export type LogoVariant = 'main' | 'gold' | 'green';