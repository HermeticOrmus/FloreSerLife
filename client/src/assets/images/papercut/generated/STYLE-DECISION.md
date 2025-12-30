# FloreSer Papercut Assets - Style Decision

> **Decision Date**: 2024-12-16
> **Chosen Style**: DEPTH (layered 3D paper-cut effect)

---

## Final Style: Depth

The **depth** variation was selected as the official FloreSer visual style. This style features:

- Layered paper-cut aesthetic with visible shadows between layers
- 3D dimensional quality that adds warmth and craftsmanship feel
- Consistent across all asset categories

---

## Active Asset Folders

### `depth/` - Primary Assets (21 files)
Complete set of production-ready assets:

| Category | Files | Description |
|----------|-------|-------------|
| Textures | 4 | cream, sage, clay, earth-dark (1024px, tileable) |
| Hero | 4 | sprout-seed, sprout-stem, sprout-leaves, sun-glow (512px) |
| Pollinators | 4 | bee, butterfly, hummingbird, beetle (256px) |
| Patterns | 2 | leaves, roots (1024px, overlay) |
| Hex Backgrounds | 4 | sage, earth, gold, crimson (512px) |
| Accents | 2 | leaf, flowerbud (128px) |
| Dividers | 1 | wavy-horizon (1920px) |

### `variations/` - Pollinator Refinements (12 files)
Alternative versions of the 4 pollinators for selection:
- `depth-bee-v2/v3/v4`
- `depth-butterfly-bright-v1/v2/v3`
- `depth-hummingbird-v2/v3/v4`
- `depth-beetle-v2/v3/v4`

---

## Archived Styles

Moved to `_archive/` for reference:

| Folder | Style | Reason Archived |
|--------|-------|-----------------|
| `flat/` | Flat 2D cutouts | Less dimensional, less warmth |
| `minimal/` | Simplified shapes | Too sparse for brand personality |
| `original-style/` | Initial generation | Superseded by depth refinements |
| `refinements-v2/` | Experimental | Merged into depth variations |
| `transparent/` | BG-removed versions | Recreate from depth if needed |

---

## Usage Notes

1. **For production**: Use assets from `depth/`
2. **Pollinator selection**: Review `variations/` to pick final versions
3. **Transparent backgrounds**: Run background removal on selected depth assets
4. **Archive is reference only**: Do not use in production

---

## Next Steps

- [ ] Select final pollinator versions from variations
- [ ] Run background removal on selected assets
- [ ] Update `assets/index.ts` to reference depth assets
- [ ] Create optimized web versions (compressed, sized)

---

*Style decision documented for FloreSer brand consistency.*
