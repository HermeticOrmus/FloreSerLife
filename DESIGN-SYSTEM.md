# FloreSer Design System

**Extracted from**: Garden & Hive Pages (Client-Approved Designs)
**Purpose**: Site-wide UI/UX consistency and implementation reference
**Version**: 1.0 (2025-11-09)

---

## 🎨 Color Palette

### Garden Theme (Fresh, Growing, Tranquil)
```css
--garden-bg: #8B9480;              /* Muted sage/olive background */
--garden-container: #F5F0E8;       /* Warm cream main area */
--garden-card: #FAF8F5;            /* Very light cream cards */
--garden-accent: #D4A574;          /* Warm gold buttons/accents */
--garden-accent-light: #E8D4B8;    /* Light golden badges */
--garden-sidebar: #7A8470;         /* Muted sage sidebar */

/* Text Colors */
--garden-text-primary: #2C2417;    /* Dark brown heading text */
--garden-text-secondary: #6B5E4F;  /* Muted body text */
--garden-text-on-sage: #F5F0E8;    /* Light text on sage background */
```

**Usage**: Garden page, content areas, reading experiences

### Hive Theme (Warm, Grounded, Earthy)
```css
--hive-bg: #E8C5B0;                /* Warm peach/tan background */
--hive-card-light: #F7E9DC;        /* Soft cream cards */
--hive-card-dark: #4A3D32;         /* Rich brown dark cards */
--hive-accent: #D89A5F;            /* Golden orange primary accent */
--hive-accent-light: #E5B888;      /* Lighter golden for buttons */

/* Text Colors */
--hive-text-primary: #2D241E;      /* Dark brown text */
--hive-text-secondary: #6F5E52;    /* Muted text */
--hive-text-on-accent: #FFF8F0;    /* Text on orange cards */
```

**Usage**: Hive page, practitioner browsing, community features

### Shared Earth Tones
```javascript
earth: {
  50: '#FAF8F5',   // Lightest cream
  100: '#F5F2EC',  // Very light beige
  200: '#E8E4DC',  // Light beige
  300: '#D4CFC4',  // Medium beige
  400: '#B8B0A0',  // Warm gray
  500: '#9A8F7D',  // Medium brown-gray
  600: '#7D6F5E',  // Brown-gray
  700: '#635648',  // Dark brown-gray
  800: '#4A4037',  // Very dark brown
  900: '#332D27',  // Darkest brown
}
```

---

## 📝 Typography

### Font Families
- **Headings**: `Playfair Display` (serif) - Elegant, refined, attention-grabbing
- **Body**: `Inter` (sans-serif) - Clean, readable, modern
- **Mono**: `ui-monospace` - Code and technical content

### Type Scale

#### Headings (Playfair Display)
```css
/* Dashboard & Page Titles */
.text-page-heading {
  font-size: 2.25rem;      /* 36px */
  line-height: 2.75rem;    /* 44px */
  font-weight: 700;
  letter-spacing: -0.025em;
}
/* Usage: "My Hive", "My Garden" */

.text-section-heading {
  font-size: 1.75rem;      /* 28px */
  line-height: 2.25rem;    /* 36px */
  font-weight: 600;
  letter-spacing: -0.02em;
}
/* Usage: "Your Session", "Browse Facilitators" */

/* Card Titles */
.text-card-heading-lg {
  font-size: 1.5rem;       /* 24px */
  line-height: 2rem;       /* 32px */
  font-weight: 600;
  letter-spacing: -0.015em;
}
/* Usage: "Your Blooming Metrics" */

.text-card-heading {
  font-size: 1.25rem;      /* 20px */
  line-height: 1.75rem;    /* 28px */
  font-weight: 600;
  letter-spacing: -0.01em;
}
/* Usage: Card titles, practitioner names */

.text-card-subheading {
  font-size: 1.125rem;     /* 18px */
  line-height: 1.625rem;   /* 26px */
  font-weight: 500;
}
/* Usage: Section subtitles within cards */
```

#### Body Text (Inter)
```css
.text-body-lg {
  font-size: 1rem;         /* 16px */
  line-height: 1.625rem;   /* 26px */
  font-weight: 400;
}
/* Usage: Primary content, important text */

.text-body {
  font-size: 0.9375rem;    /* 15px */
  line-height: 1.5rem;     /* 24px */
  font-weight: 400;
}
/* Usage: Standard body text, descriptions */

.text-body-sm {
  font-size: 0.875rem;     /* 14px */
  line-height: 1.375rem;   /* 22px */
  font-weight: 400;
}
/* Usage: Metadata, secondary descriptions */
```

#### Stats & Metrics (Playfair Display)
```css
.text-stat-xl {
  font-size: 2.5rem;       /* 40px */
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.02em;
}
/* Usage: Large numbers like "+420" earnings */

.text-stat-lg {
  font-size: 2.25rem;      /* 36px */
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.02em;
}
/* Usage: Stats like "18", "8" */

.text-stat-md {
  font-size: 2rem;         /* 32px */
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.015em;
}
/* Usage: Percentages like "67%" */
```

#### Labels & Small Text (Inter)
```css
.text-label {
  font-size: 0.8125rem;    /* 13px */
  line-height: 1.25rem;    /* 20px */
  font-weight: 500;
}
/* Usage: Button text, input labels, badges */

.text-caption {
  font-size: 0.75rem;      /* 12px */
  line-height: 1.125rem;   /* 18px */
  font-weight: 400;
}
/* Usage: Tiny metadata, helper text */
```

---

## 📦 Component Patterns

### Cards
```jsx
/* Standard Card */
<Card className="bg-garden-card border-0 rounded-card shadow-card">
  <CardHeader>
    <CardTitle className="text-card-heading font-heading text-garden-text-primary">
      Title Here
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Content */}
  </CardContent>
</Card>

/* Large Featured Card */
<Card className="bg-hive-card-dark text-white border-0 rounded-card-lg shadow-card-lg">
  {/* Dark theme card with large radius */}
</Card>

/* Light Accent Card */
<Card className="bg-garden-accent-light border-0 rounded-card shadow-card-sm">
  {/* Subtle accent background */}
</Card>
```

**Border Radius:**
- `rounded-card-lg`: 1.25rem (20px) - Large cards
- `rounded-card`: 1rem (16px) - Standard cards
- `rounded-card-sm`: 0.75rem (12px) - Small cards

**Shadows:**
- `shadow-card-sm`: Subtle elevation
- `shadow-card`: Standard elevation
- `shadow-card-md`: Medium elevation
- `shadow-card-lg`: High elevation
- `shadow-card-hover`: Hover state elevation

All shadows use warm brown tones: `rgba(74, 53, 41, opacity)`

### Buttons
```jsx
/* Primary Action */
<Button className="bg-garden-accent text-white hover:bg-garden-accent/90 rounded-button text-label">
  Action Text
</Button>

/* Outline */
<Button
  variant="outline"
  className="rounded-button text-label border-garden-accent/30 hover:bg-garden-accent hover:text-white"
>
  Secondary Action
</Button>

/* Ghost */
<Button variant="ghost" className="rounded-button">
  Tertiary Action
</Button>
```

**Border Radius**: `0.875rem` (14px)

**Typography**: `text-label` (13px, medium weight)

### Badges
```jsx
/* Experience Badge */
<Badge className="bg-green-100 text-green-700 border-green-200 text-xs border">
  <Star className="w-3 h-3 mr-1" />
  Rising
</Badge>

/* Tier Badge */
<Badge className="bg-garden-accent text-white text-label px-4 py-2 rounded-badge">
  <TrendingUp className="w-4 h-4 mr-1" />
  Blooming Pollinator
</Badge>

/* Content Type Badge */
<Badge variant="outline" className="text-xs border-garden-accent/30">
  📝 Article
</Badge>
```

**Border Radius**: `1.5rem` (24px) - Full pill shape

### Inputs & Selects
```jsx
/* Search Input */
<Input
  placeholder="Search..."
  className="bg-garden-card border-garden-accent/20 rounded-input"
/>

/* Select Dropdown */
<Select>
  <SelectTrigger className="bg-hive-card-light border-hive-accent/20 rounded-input">
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option">Option</SelectItem>
  </SelectContent>
</Select>
```

**Border Radius**: `0.625rem` (10px)

**Border**: 20% opacity of accent color for subtle borders

---

## 📏 Layout & Spacing

### Grid Patterns
```jsx
/* Three-column stats */
<div className="grid grid-cols-3 gap-8">

/* Two-column cards */
<div className="grid grid-cols-2 gap-6">

/* Practitioner/content grid */
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

/* Four-column archetypes */
<div className="grid grid-cols-4 gap-4">
```

### Sidebar Layout
```jsx
<div className="flex min-h-screen bg-[theme]-bg">
  {/* Sidebar */}
  <aside className="w-64 bg-[theme]-sidebar border-r border-[theme]-accent/20 p-6 flex flex-col">
    {/* Navigation */}
    <nav className="space-y-1 flex-1">
      {/* Nav items */}
    </nav>

    {/* Bottom card */}
    <div className="mt-auto">
      {/* User badge or info */}
    </div>
  </aside>

  {/* Main Content */}
  <main className="flex-1 p-12 overflow-y-auto">
    <div className="max-w-6xl mx-auto">
      {/* Page content */}
    </div>
  </main>
</div>
```

### Spacing Scale
- Container padding: `p-12` (48px) for main content
- Card padding: `p-6` (24px) standard
- Sidebar padding: `p-6` (24px)
- Section gaps: `gap-6` to `gap-8` (24-32px)
- Card content spacing: `space-y-4` (16px)

---

## ✨ Animation Patterns

### Framer Motion Stagger
```jsx
/* Cards entering with stagger */
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.5 + index * 0.05 }}
>
  {/* Card content */}
</motion.div>

/* Sidebar entrance */
<motion.aside
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
>
```

### Garden Animations
- `animate-bloom`: Flower opening effect
- `animate-petal-fade`: Gentle fade-in
- `animate-vine-grow`: Line drawing effect
- `animate-sprout`: Scale from bottom

### Hive Animations
- `animate-honey-drip`: Dripping effect
- `animate-hexagon-pulse`: Breathing pulse
- `animate-float`: Gentle floating

---

## 🎯 Interactive States

### Buttons
```css
/* Default */
bg-garden-accent text-white

/* Hover */
hover:bg-garden-accent/90

/* Focus */
focus:ring-2 focus:ring-garden-accent focus:ring-offset-2
```

### Cards
```css
/* Default */
shadow-card

/* Hover */
hover:shadow-card-hover transition-shadow cursor-pointer
```

### Navigation Items
```css
/* Default */
text-body text-garden-text-on-sage

/* Hover */
hover:bg-white/10 transition-colors
```

---

## 🖼️ Icon System

### Sizes
- Large icons (headers): `w-6 h-6`
- Medium icons (cards): `w-5 h-5`
- Small icons (badges, buttons): `w-4 h-4` or `w-3 h-3`

### Archetype Icons
```jsx
import { ArchetypeIcons } from "@/components/icons/archetype-icons";

<ArchetypeIcons.Bee className="w-6 h-6" />
<ArchetypeIcons.Hummingbird className="w-6 h-6" />
<ArchetypeIcons.Butterfly className="w-6 h-6" />
<ArchetypeIcons.Beetle className="w-6 h-6" />
```

### Emoji Icons (Alternative)
- Bee: 🐝
- Hummingbird: 🦜
- Butterfly: 🦋
- Beetle: 🪲

---

## 📱 Responsive Patterns

### Breakpoints (Tailwind defaults)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Common Responsive Patterns
```jsx
/* Grid adaptation */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

/* Text size adaptation */
<h1 className="text-page-heading md:text-5xl lg:text-6xl">

/* Sidebar collapse (future implementation) */
<aside className="hidden lg:flex w-64 ...">
```

---

## 🎨 Design Principles

### Visual Hierarchy
1. **Headings**: Playfair Display, larger sizes, bold weights
2. **Body**: Inter, medium sizes, regular weight
3. **Metadata**: Inter, smaller sizes, lighter colors

### Color Usage
- **Backgrounds**: Muted earth tones (sage, peach, cream)
- **Accents**: Warm golds and oranges for CTAs
- **Text**: Dark browns for readability, muted browns for secondary

### Spacing
- **Generous**: Use large padding/margins for breathing room
- **Consistent**: Stick to 4px grid (gap-4, p-6, etc.)
- **Grouped**: Related elements closer together (space-y-2), sections further apart (gap-8)

### Shadows
- **Soft and warm**: Using brown tones, not pure black
- **Multi-layer**: Combines blur + spread for depth
- **Subtle**: Elevation without harshness

---

## 🔧 Implementation Checklist

When applying this design system to other pages:

- [ ] Update color theme (Garden or Hive appropriate)
- [ ] Apply typography classes (`text-*`, `font-heading/body`)
- [ ] Use consistent border radius (`rounded-card`, `rounded-button`)
- [ ] Apply shadow system (`shadow-card-*`)
- [ ] Implement sidebar layout if dashboard-style
- [ ] Add motion animations for entrance
- [ ] Ensure responsive grid layouts
- [ ] Test hover/focus states
- [ ] Verify icon sizes and usage
- [ ] Check spacing consistency

---

## 📚 Reference Files
- **Tailwind Config**: `website/tailwind.config.ts`
- **Garden Page**: `website/client/src/pages/Garden.tsx`
- **Hive Page**: `website/client/src/pages/Hive.tsx`
- **Global Styles**: `website/client/src/index.css`

**Last Updated**: 2025-11-09
**Status**: Complete design system extracted from client-approved Garden & Hive pages
