// Brand Assets - Centralized import system for FloreSer brand assets
// Updated: 2025-03-04 - Cleaned dormant exports, keeping only actively used assets

// =============================================================================
// LOGOS
// =============================================================================
import mainColoredIcon from './images/logos/main-colored-icon.png';

// =============================================================================
// ARCHETYPE ICONS
// =============================================================================
import beeIcon from './images/icons/bee.png';
import butterflyIcon from './images/icons/butterfly.png';
import beetleIcon from './images/icons/beetle.png';
import hummingbirdIcon from './images/icons/hummingbird.png';

// =============================================================================
// CHARACTER ILLUSTRATIONS
// =============================================================================
import maiaTheBee from './images/characters/maia.png';
import maiaPapercraft from './images/characters/maia-papercraft.png';
import angelicaTheColibri from './images/characters/angelica.png';
import maiaGreetingFrame from './animations/maia/greeting/frame_000.png';

// =============================================================================
// PAPERCUT ASSETS - DEPTH STYLE
// =============================================================================

// Flat textures (for interactive surfaces - cards, forms, journals)
import depthTextureFlatCream from './images/papercut/generated/depth/depth-texture-flat-cream.png';
import depthTextureFlatSage from './images/papercut/generated/depth/depth-texture-flat-sage.png';
import depthTextureFlatGold from './images/papercut/generated/depth/depth-texture-flat-gold.png';
import depthTextureFlatForest from './images/papercut/generated/depth/depth-texture-flat-forest.png';
import depthTextureFlatCrimson from './images/papercut/generated/depth/depth-texture-flat-crimson.png';
import depthTextureFlatEarth from './images/papercut/generated/depth/depth-texture-flat-earth.png';

// =============================================================================
// TRANSPARENT VERSIONS (Background removed)
// =============================================================================
import depthPollinatorBeeTransparent from './images/papercut/generated/depth/transparent/depth-pollinator-bee-256_224941.png';
import depthPollinatorButterflyTransparent from './images/papercut/generated/depth/transparent/depth-pollinator-butterfly-256_225253.png';
import depthPollinatorHummingbirdTransparent from './images/papercut/generated/depth/transparent/depth-pollinator-hummingbird-256_225610.png';
import depthPollinatorBeetleTransparent from './images/papercut/generated/depth/transparent/depth-pollinator-beetle-256_225927.png';
import depthHeroSproutLeavesTransparent from './images/papercut/generated/depth/transparent/depth-hero-sprout-leaves-512_224311.png';
import depthWavyHorizonTransparent from './images/papercut/generated/depth/transparent/depth-wavy-horizon-1920_230923.png';

// =============================================================================
// EXPORTS - LOGOS
// =============================================================================
export const logos = {
  main: {
    coloredIcon: mainColoredIcon,
  },
} as const;

// =============================================================================
// EXPORTS - ARCHETYPE ICONS
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
  maiaPapercraft: maiaPapercraft,
  maiaIcon: maiaGreetingFrame,
  angelica: angelicaTheColibri,
} as const;

// =============================================================================
// EXPORTS - PAPERCUT (Depth Style)
// =============================================================================
export const papercut = {
  textures: {
    flatCream: depthTextureFlatCream,
    flatSage: depthTextureFlatSage,
    flatGold: depthTextureFlatGold,
    flatForest: depthTextureFlatForest,
    flatCrimson: depthTextureFlatCrimson,
    flatEarth: depthTextureFlatEarth,
  },

  // Transparent pollinators (for overlays)
  pollinatorsTransparent: {
    bee: depthPollinatorBeeTransparent,
    butterfly: depthPollinatorButterflyTransparent,
    hummingbird: depthPollinatorHummingbirdTransparent,
    beetle: depthPollinatorBeetleTransparent,
  },

  // Dividers
  dividers: {
    wavyHorizonTransparent: depthWavyHorizonTransparent,
  },

  // Transparent hero elements
  heroTransparent: {
    sproutLeaves: depthHeroSproutLeavesTransparent,
  },
} as const;

// =============================================================================
// HERO VIDEO
// =============================================================================
import tudorRoseHeroVideo from './videos/tudor-rose-hero.mp4';
import tudorRoseHeroPoster from './videos/drafts/tudor-04-bloom.png';

export const heroVideo = {
  src: tudorRoseHeroVideo,
  poster: tudorRoseHeroPoster,
} as const;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
export type ArchetypeType = keyof typeof archetypeIcons;
