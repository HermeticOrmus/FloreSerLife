# FloreSer Brand Assets Documentation

This document provides a complete reference for all FloreSer brand assets, their organization, and usage throughout the application.

## Asset Organization

All brand assets are organized in the `client/src/assets/` directory with clean, descriptive naming conventions.

### Directory Structure

```
client/src/assets/
├── index.ts              # Centralized asset exports
├── images/
│   ├── logos/            # Brand logos in various formats
│   │   ├── main-colored-text.png     # Main logo with "FloreSer" text
│   │   ├── main-colored-icon.png     # Main logo icon only
│   │   ├── gold-text.png             # Gold variant with text
│   │   ├── gold-icon.png             # Gold variant icon only
│   │   ├── green-text.png            # Green variant with text
│   │   └── green-icon.png            # Green variant icon only
│   └── icons/            # Archetype icons
│       ├── bee.png               # Bee archetype icon
│       ├── butterfly.png         # Butterfly archetype icon
│       ├── beetle.png            # Beetle archetype icon
│       └── hummingbird.png       # Hummingbird archetype icon
```

## Logo Variations

### Main Brand Logos
- **Primary Logo**: `main-colored-text.png` - Full logo with hummingbird and "FloreSer" text
- **Primary Icon**: `main-colored-icon.png` - Hummingbird symbol only
- **Colors**: Gold hummingbird with red accent leaves on transparent background

### Alternative Color Variations
- **Gold Series**: Monochromatic gold versions for premium feel
  - `gold-text.png` - Gold logo with text
  - `gold-icon.png` - Gold icon only
- **Green Series**: Nature-themed green versions
  - `green-text.png` - Green logo with text  
  - `green-icon.png` - Green icon only

## Archetype Icons

The pollinator archetype system uses four distinct icons representing different practitioner approaches:

1. **Bee** (`bee.png`) - Structured, community-focused practitioners
2. **Hummingbird** (`hummingbird.png`) - Quick, adaptable, energy-focused practitioners  
3. **Butterfly** (`butterfly.png`) - Transformational, holistic practitioners
4. **Beetle** (`beetle.png`) - Grounding, strength-based practitioners

## Usage in Code

### Importing Assets
All assets are centrally managed through `client/src/assets/index.ts`:

```typescript
import { logos, archetypeIcons } from "@/assets";

// Logo usage
<img src={logos.main.coloredWithText} alt="FloreSer" />
<img src={logos.main.coloredIcon} alt="FloreSer Icon" />

// Archetype icon usage  
<img src={archetypeIcons.bee} alt="Bee archetype" />
```

### Current Implementation
- **Header Component**: Uses `logos.main.coloredIcon` for navigation logo
- **Archetype Showcase**: Uses real archetype icons instead of SVG placeholders
- **Featured Practitioners**: Uses archetype icons to display practitioner types

## File Sources

All assets were organized from the uploaded brand files:
- Original files: `attached_assets/FloreSer-*_*.png`
- Cleaned and renamed for consistent usage
- Latest versions selected (timestamp: 1754775346xxx)

## Character Illustrations

### Brand Ambassadors
- **MAIA the Bee** (`maia-the-bee.png`) - Golden, fluffy bee with glowing spiral energy center representing community and structured healing
- **ANGELICA the Colibri** (`angelica-the-colibri.png`) - Elegant teal and gold hummingbird representing swift adaptation and energy work

### Usage in Code
Character illustrations are imported through the centralized asset system:
```typescript
import { characters } from "@/assets";

// Character usage
<img src={characters.maia} alt="MAIA the Bee" />
<img src={characters.angelica} alt="ANGELICA the Colibri" />
```

## Design Notes

- All icons maintain consistent visual style with golden color scheme
- Logos feature the hummingbird as the central brand symbol
- Archetype icons each have unique symbolism while maintaining brand cohesion
- Character illustrations add personality and warmth to the brand experience
- Transparent backgrounds allow flexible placement on different color schemes