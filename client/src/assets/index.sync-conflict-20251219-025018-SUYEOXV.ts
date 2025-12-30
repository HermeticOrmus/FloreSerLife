// Brand Assets - Centralized import system for FloreSer brand assets
// Updated: 2024-12-16 - Now using DEPTH style papercut assets

// =============================================================================
// LOGOS
// =============================================================================
import mainColoredText from './images/logos/main-colored-text.png';
import mainColoredIcon from './images/logos/main-colored-icon.png';
import goldText from './images/logos/gold-text.png';
import goldIcon from './images/logos/gold-icon.png';
import greenText from './images/logos/green-text.png';
import greenIcon from './images/logos/green-icon.png';

// =============================================================================
// ARCHETYPE ICONS (Original style - for backward compatibility)
// =============================================================================
import beeIcon from './images/icons/bee.png';
import butterflyIcon from './images/icons/butterfly.png';
import beetleIcon from './images/icons/beetle.png';
import hummingbirdIcon from './images/icons/hummingbird.png';

// =============================================================================
// CHARACTER ILLUSTRATIONS
// =============================================================================
import maiaTheBee from './images/characters/maia.png';
import angelicaTheColibri from './images/characters/angelica.png';

// =============================================================================
// PAPERCUT ASSETS - DEPTH STYLE (Primary)
// =============================================================================

// Textures (tileable backgrounds)
import depthTextureCream from './images/papercut/generated/depth/depth-texture-cream-1024_222320.png';
import depthTextureSage from './images/papercut/generated/depth/depth-texture-sage-1024_222637.png';
import depthTextureClay from './images/papercut/generated/depth/depth-texture-clay-1024_222955.png';
import depthTextureEarthDark from './images/papercut/generated/depth/depth-texture-earth-dark-1024_223313.png';
import depthTextureSky from './images/papercut/generated/depth/depth-texture-sky-1024.png';

// Hero elements
import depthHeroSproutSeed from './images/papercut/generated/depth/depth-hero-sprout-seed-512_223633.png';
import depthHeroSproutStem from './images/papercut/generated/depth/depth-hero-sprout-stem-512_223952.png';
import depthHeroSproutLeaves from './images/papercut/generated/depth/depth-hero-sprout-leaves-512_224311.png';
import depthHeroSunGlow from './images/papercut/generated/depth/depth-hero-sun-glow-512_224630.png';

// Pollinators (256px archetype icons)
import depthPollinatorBee from './images/papercut/generated/depth/depth-pollinator-bee-256_224941.png';
import depthPollinatorButterfly from './images/papercut/generated/depth/depth-pollinator-butterfly-256_225253.png';
import depthPollinatorHummingbird from './images/papercut/generated/depth/depth-pollinator-hummingbird-256_225610.png';
import depthPollinatorBeetle from './images/papercut/generated/depth/depth-pollinator-beetle-256_225927.png';

// Patterns (overlay textures)
import depthPatternLeaves from './images/papercut/generated/depth/depth-pattern-leaves-1024_230248.png';
import depthPatternRoots from './images/papercut/generated/depth/depth-pattern-roots-1024_230606.png';

// Hexagon card backgrounds
import depthHexSage from './images/papercut/generated/depth/depth-hex-sage-512_231805.png';
import depthHexEarth from './images/papercut/generated/depth/depth-hex-earth-512_232122.png';
import depthHexGold from './images/papercut/generated/depth/depth-hex-gold-512_232438.png';
import depthHexCrimson from './images/papercut/generated/depth/depth-hex-crimson-512_232755.png';

// Accents (decorative elements)
import depthAccentLeaf from './images/papercut/generated/depth/depth-accent-leaf-128_231206.png';
import depthAccentFlowerbud from './images/papercut/generated/depth/depth-accent-flowerbud-128_231449.png';

// Dividers
import depthWavyHorizon from './images/papercut/generated/depth/depth-wavy-horizon-1920_230923.png';

// Full hero background (sky + land combined) - Midjourney with proper depth style
import depthHeroBackground from './images/papercut/generated/depth/depth-hero-landing-v2_20251218_231426.png';

// =============================================================================
// TRANSPARENT VERSIONS (Background removed)
// =============================================================================
import depthPollinatorBeeTransparent from './images/papercut/generated/depth/transparent/depth-pollinator-bee-256_224941.png';
import depthPollinatorButterflyTransparent from './images/papercut/generated/depth/transparent/depth-pollinator-butterfly-256_225253.png';
import depthPollinatorHummingbirdTransparent from './images/papercut/generated/depth/transparent/depth-pollinator-hummingbird-256_225610.png';
import depthPollinatorBeetleTransparent from './images/papercut/generated/depth/transparent/depth-pollinator-beetle-256_225927.png';
import depthHeroSproutLeavesTransparent from './images/papercut/generated/depth/transparent/depth-hero-sprout-leaves-512_224311.png';
import depthHeroSproutStemTransparent from './images/papercut/generated/depth/transparent/depth-hero-sprout-stem-512_223952.png';
import depthHeroSproutSeedTransparent from './images/papercut/generated/depth/transparent/depth-hero-sprout-seed-512_223633.png';
import depthHeroSunGlowTransparent from './images/papercut/generated/depth/transparent/depth-hero-sun-glow-512_224630.png';
import depthWavyHorizonTransparent from './images/papercut/generated/depth/transparent/depth-wavy-horizon-1920_230923.png';
import depthHeroTreePollinatorsTransparent from './images/papercut/generated/depth/transparent/depth-hero-tree-tall_20251218_225916.png';

// =============================================================================
// EXPORTS - LOGOS
// =============================================================================
export const logos = {
  main: {
    coloredWithText: mainColoredText,
    coloredIcon: mainColoredIcon,
  },
  gold: {
    withText: goldText,
    icon: goldIcon,
  },
  green: {
    withText: greenText,
    icon: greenIcon,
  },
} as const;

// =============================================================================
// EXPORTS - ARCHETYPE ICONS (Original)
// =============================================================================
export const archetypeIcons = {
  bee: beeIcon,
  butterfly: butterflyIcon,
  beetle: beetleIcon,
  hummingbird: hummingbirdIcon,
} as const;

// =============================================================================
// EXPORTS - CHARACTERS
// =============================================================================
export const characters = {
  maia: maiaTheBee,
  angelica: angelicaTheColibri,
} as const;

// =============================================================================
// EXPORTS - PAPERCUT (Depth Style)
// =============================================================================
export const papercut = {
  // Hero elements (for compositing)
  sproutSeed: depthHeroSproutSeed,
  sproutStem: depthHeroSproutStem,
  sproutLeaves: depthHeroSproutLeaves,
  sunGlow: depthHeroSunGlow,

  // Composite hero (use sproutLeaves as main visual)
  sproutHero: depthHeroSproutLeaves,

  // Textures for backgrounds
  textures: {
    cream: depthTextureCream,
    sage: depthTextureSage,
    clay: depthTextureClay,
    earthDark: depthTextureEarthDark,
    sky: depthTextureSky,
  },

  // Pattern overlays
  patterns: {
    leaves: depthPatternLeaves,
    roots: depthPatternRoots,
  },

  // Hexagon card backgrounds
  hex: {
    sage: depthHexSage,
    earth: depthHexEarth,
    gold: depthHexGold,
    crimson: depthHexCrimson,
  },

  // Pollinators (depth style)
  pollinators: {
    bee: depthPollinatorBee,
    butterfly: depthPollinatorButterfly,
    hummingbird: depthPollinatorHummingbird,
    beetle: depthPollinatorBeetle,
  },

  // Transparent pollinators (for overlays)
  pollinatorsTransparent: {
    bee: depthPollinatorBeeTransparent,
    butterfly: depthPollinatorButterflyTransparent,
    hummingbird: depthPollinatorHummingbirdTransparent,
    beetle: depthPollinatorBeetleTransparent,
  },

  // Accents
  accents: {
    leaf: depthAccentLeaf,
    flowerbud: depthAccentFlowerbud,
  },

  // Dividers
  dividers: {
    wavyHorizon: depthWavyHorizon,
    wavyHorizonTransparent: depthWavyHorizonTransparent,
  },

  // Full hero background (sky + land in one image)
  heroBackground: depthHeroBackground,

  // Transparent hero elements
  heroTransparent: {
    sproutSeed: depthHeroSproutSeedTransparent,
    sproutStem: depthHeroSproutStemTransparent,
    sproutLeaves: depthHeroSproutLeavesTransparent,
    sunGlow: depthHeroSunGlowTransparent,
    treeWithPollinators: depthHeroTreePollinatorsTransparent,
  },
} as const;

// =============================================================================
// CONVENIENT RE-EXPORTS
// =============================================================================
export const primaryLogo = logos.main.coloredWithText;
export const primaryIcon = logos.main.coloredIcon;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
export type ArchetypeType = keyof typeof archetypeIcons;
export type LogoVariant = 'main' | 'gold' | 'green';
export type PapercutTexture = keyof typeof papercut.textures;
export type PapercutHex = keyof typeof papercut.hex;
export type PapercutPollinator = keyof typeof papercut.pollinators;
