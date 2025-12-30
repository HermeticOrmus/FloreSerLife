# FloreSer Website Redesign - Asset Requirements

> Comprehensive asset plan for full papercut-style website redesign
> **Style**: Depth (layered 3D paper-cut effect)
> **Date**: 2024-12-16

---

## Current Depth Assets (Available)

### Textures (Backgrounds)
| Asset | File | Size | Usage |
|-------|------|------|-------|
| Cream | `depth-texture-cream-1024` | 1024px | Light backgrounds, cards |
| Sage | `depth-texture-sage-1024` | 1024px | Section backgrounds |
| Clay | `depth-texture-clay-1024` | 1024px | Hero top, warm sections |
| Earth Dark | `depth-texture-earth-dark-1024` | 1024px | Footer, dark sections |

### Hero Elements
| Asset | File | Size | Usage |
|-------|------|------|-------|
| Sprout Seed | `depth-hero-sprout-seed-512` | 512px | Hero illustration base |
| Sprout Stem | `depth-hero-sprout-stem-512` | 512px | Hero illustration middle |
| Sprout Leaves | `depth-hero-sprout-leaves-512` | 512px | Hero illustration top |
| Sun Glow | `depth-hero-sun-glow-512` | 512px | Hero accent, warmth |

### Pollinators (Archetypes)
| Asset | File | Size | Usage |
|-------|------|------|-------|
| Bee (Maia) | `depth-pollinator-bee-256` | 256px | Archetype icon |
| Butterfly (Luna) | `depth-pollinator-butterfly-256` | 256px | Archetype icon |
| Hummingbird (Angelica) | `depth-pollinator-hummingbird-256` | 256px | Archetype icon |
| Beetle (Bodhi) | `depth-pollinator-beetle-256` | 256px | Archetype icon |

### Patterns (Overlays)
| Asset | File | Size | Usage |
|-------|------|------|-------|
| Leaves | `depth-pattern-leaves-1024` | 1024px | Banner overlays |
| Roots | `depth-pattern-roots-1024` | 1024px | Banner overlays |

### Hexagon Backgrounds
| Asset | File | Size | Usage |
|-------|------|------|-------|
| Sage | `depth-hex-sage-512` | 512px | Feature cards |
| Earth | `depth-hex-earth-512` | 512px | Feature cards |
| Gold | `depth-hex-gold-512` | 512px | Feature cards |
| Crimson | `depth-hex-crimson-512` | 512px | Feature cards |

### Accents
| Asset | File | Size | Usage |
|-------|------|------|-------|
| Leaf | `depth-accent-leaf-128` | 128px | Decorative |
| Flower Bud | `depth-accent-flowerbud-128` | 128px | Decorative |

### Dividers
| Asset | File | Size | Usage |
|-------|------|------|-------|
| Wavy Horizon | `depth-wavy-horizon-1920` | 1920px | Section dividers |

---

## Pages Requiring Redesign

### Tier 1: Public-Facing (Priority)
| Page | Current State | Assets Needed |
|------|--------------|---------------|
| **Landing** | Partially styled | Update to depth textures, pollinator icons |
| **Practitioners List** | Basic cards | Archetype badges, practitioner card backgrounds |
| **Practitioner Profile** | Plain | Profile header texture, archetype banner |
| **SignIn** | Basic | Papercut frame, authentication illustration |
| **SignUp** | Basic | Papercut frame, welcome illustration |
| **Alpha** | Basic | Alpha badge, community illustration |

### Tier 2: Client Experience
| Page | Current State | Assets Needed |
|------|--------------|---------------|
| **Home (Dashboard Hub)** | Old styling | Stat card backgrounds, activity icons |
| **Client Dashboard** | Mixed | Garden-themed cards, progress illustrations |
| **Garden** | Large page | Content cards, AI Guardian illustration |
| **Book Session** | Functional | Calendar styling, session type icons |
| **Hive** | Large page | Hive-themed hexagon layouts |

### Tier 3: Practitioner Experience
| Page | Current State | Assets Needed |
|------|--------------|---------------|
| **Practitioner Dashboard** | Large | Earnings cards, calendar styling |
| **Practitioner Onboarding** | Very large | Multi-step illustrations, archetype selection UI |
| **JoinTheHive** | Large | Facilitator welcome illustration |

### Tier 4: Admin/Utility
| Page | Current State | Assets Needed |
|------|--------------|---------------|
| **Admin Dashboard** | Functional | Data visualization backgrounds |
| **Survey** | Very large | Survey progress, completion illustration |

---

## Missing Assets - To Generate

### HIGH PRIORITY - Landing Page Completion
```
[ ] depth-sprout-composite-512    # Combined sprout (seed+stem+leaves)
[ ] depth-pollinator-orbit-ring   # Circular path for orbiting pollinators
```

### HIGH PRIORITY - Page-Specific Heroes
```
[ ] depth-hero-garden-512         # Garden page hero (flourishing plants)
[ ] depth-hero-hive-512           # Hive page hero (honeycomb structure)
[ ] depth-hero-practitioner-512   # Practitioner listing hero
[ ] depth-hero-profile-512        # Profile page header element
```

### MEDIUM PRIORITY - Authentication
```
[ ] depth-auth-frame-768          # Decorative frame for auth forms
[ ] depth-auth-welcome-256        # Welcome/greeting illustration
[ ] depth-auth-secure-128         # Security/trust icon
```

### MEDIUM PRIORITY - Dashboard Elements
```
[ ] depth-card-garden-256         # Garden-themed stat card bg
[ ] depth-card-hive-256           # Hive-themed stat card bg
[ ] depth-progress-vine-512       # Progress indicator (growing vine)
[ ] depth-achievement-bloom-128   # Achievement/milestone icon
```

### MEDIUM PRIORITY - UI Elements
```
[ ] depth-button-leaf             # Organic button shape
[ ] depth-divider-vine-1920       # Alternative section divider
[ ] depth-badge-pollinator-64     # Small archetype badges
[ ] depth-empty-state-256         # Empty state illustration
```

### LOW PRIORITY - Character Illustrations
```
[ ] depth-maia-character-512      # Maia the Bee full character
[ ] depth-luna-character-512      # Luna the Butterfly full character
[ ] depth-angelica-character-512  # Angelica the Hummingbird character
[ ] depth-bodhi-character-512     # Bodhi the Beetle character
```

### LOW PRIORITY - Seasonal/Special
```
[ ] depth-seasons-spring-256      # Rising practitioners
[ ] depth-seasons-summer-256      # Evolving practitioners
[ ] depth-seasons-autumn-256      # Wise practitioners
```

---

## Midjourney Prompt Template (Depth Style)

```
/imagine prompt: paper cut art illustration, [SUBJECT DESCRIPTION],
layered paper cutout style with visible depth shadows between layers,
[COLOR PALETTE from brand colors], handmade craft aesthetic,
soft ambient occlusion shadows, 3-4 distinct paper layers,
botanical/nature-inspired, warm organic feeling,
[SIZE RATIO], transparent background --v 7 --s 300
```

**Color Reference:**
- Greens: #C9DCC9, #AFC8A8, #9CB69A, #7FA889, #6F8E72, #6E7B60
- Earths: #F2E5CA, #F5D29A, #D9B77F, #BA9A82, #564B3A
- Accents: #A23C40 (crimson), #7C0015 (deep red)

---

## Integration Checklist

### Phase 1: Update Asset Index
- [ ] Point assets/index.ts to depth folder
- [ ] Add all depth assets to exports
- [ ] Update TypeScript types

### Phase 2: Landing Page
- [ ] HeroSection - use depth textures
- [ ] PollinatorOrbit - use depth pollinators
- [ ] PaperCutBanner - use depth patterns
- [ ] HexagonGrid - use depth hex backgrounds

### Phase 3: Core Pages
- [ ] Practitioners list
- [ ] Auth pages (SignIn, SignUp)
- [ ] Home dashboard

### Phase 4: Feature Pages
- [ ] Garden
- [ ] Hive
- [ ] Client/Practitioner dashboards

---

## Notes

- All depth assets have transparent versions in `depth/transparent/`
- Pollinator variations in `variations/` folder for selection
- Archive of deprecated styles in `_archive/`
- Maintain consistent layered shadow depth across all new assets

---

*Asset planning for FloreSer papercut redesign*
