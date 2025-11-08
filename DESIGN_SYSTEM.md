# FloreSer Design System

Complete typography, spacing, shadows, and visual design system extracted from HIVE and GARDEN UI references.

---

## 📝 Typography System

### Font Families
- **Headings**: Lora (serif) - Elegant, warm, trustworthy
- **Body**: Poppins (sans-serif) - Clean, readable, modern
- **Monospace**: Menlo - Code and technical content

### Type Scale & Hierarchy

#### Dashboard & Page Headings (Lora)
```tsx
// Page-level headings - "My Hive", "My Garden"
<h1 className="text-page-heading font-heading">
  My Hive
</h1>
// → 36px (2.25rem), line-height: 44px, font-weight: 700, letter-spacing: -0.025em

// Section headings - "Your Session", major sections
<h2 className="text-section-heading font-heading">
  Your Session
</h2>
// → 28px (1.75rem), line-height: 36px, font-weight: 600, letter-spacing: -0.02em
```

#### Card Headings (Lora)
```tsx
// Large card headings - "Your Blooming Metrics"
<h3 className="text-card-heading-lg font-heading">
  Your Blooming Metrics
</h3>
// → 24px (1.5rem), line-height: 32px, font-weight: 600, letter-spacing: -0.015em

// Standard card headings - "Angelica", card titles
<h3 className="text-card-heading font-heading">
  Reflections from Maia
</h3>
// → 20px (1.25rem), line-height: 28px, font-weight: 600, letter-spacing: -0.01em

// Card subheadings
<h4 className="text-card-subheading font-heading">
  Your Next Session
</h4>
// → 18px (1.125rem), line-height: 26px, font-weight: 500
```

#### Body Text (Poppins)
```tsx
// Large body text - primary content
<p className="text-body-lg">
  Explore the Hive and discover a new guide for your journey.
</p>
// → 16px (1rem), line-height: 26px, font-weight: 400

// Standard body - most common
<p className="text-body">
  Session details and description text.
</p>
// → 15px (0.9375rem), line-height: 24px, font-weight: 400

// Small body - metadata, descriptions
<p className="text-body-sm">
  Apr 26 1st 10:00 AM
</p>
// → 14px (0.875rem), line-height: 22px, font-weight: 400
```

#### Stats & Metrics (Lora)
```tsx
// Extra large stats - "+420", major numbers
<span className="text-stat-xl font-heading">
  +420
</span>
// → 40px (2.5rem), line-height: 1, font-weight: 700, letter-spacing: -0.02em

// Large stats - "18", "8", primary metrics
<span className="text-stat-lg font-heading">
  18
</span>
// → 36px (2.25rem), line-height: 1, font-weight: 700, letter-spacing: -0.02em

// Medium stats - "67%", secondary metrics
<span className="text-stat-md font-heading">
  67%
</span>
// → 32px (2rem), line-height: 1, font-weight: 700, letter-spacing: -0.015em
```

#### Labels & Small Text (Poppins)
```tsx
// Labels - button text, form labels
<span className="text-label">
  Earning this week
</span>
// → 13px (0.8125rem), line-height: 20px, font-weight: 500

// Captions - badges, tiny metadata
<span className="text-caption">
  You are a Blooming Seeker
</span>
// → 12px (0.75rem), line-height: 18px, font-weight: 400
```

---

## 🎨 Border Radius System

### Card & Container Radius
```tsx
// Large cards - main content cards
<Card className="rounded-card-lg">
// → border-radius: 20px (1.25rem)

// Standard cards - most cards
<Card className="rounded-card">
// → border-radius: 16px (1rem)

// Small cards/sections - nested content
<div className="rounded-card-sm">
// → border-radius: 12px (0.75rem)
```

### Interactive Elements
```tsx
// Buttons
<Button className="rounded-button">
// → border-radius: 14px (0.875rem)

// Badges/pills - "You are an Evolving Pollinator"
<Badge className="rounded-badge">
// → border-radius: 24px (1.5rem)

// Input fields
<Input className="rounded-input">
// → border-radius: 10px (0.625rem)
```

### Visual Examples
| Element | Class | Radius | Use Case |
|---------|-------|--------|----------|
| Main cards | `rounded-card-lg` | 20px | Dashboard cards, feature cards |
| Standard cards | `rounded-card` | 16px | Content cards, info panels |
| Small sections | `rounded-card-sm` | 12px | Nested content, sub-cards |
| Buttons | `rounded-button` | 14px | All button elements |
| Badges | `rounded-badge` | 24px | Status badges, pills |
| Inputs | `rounded-input` | 10px | Form fields |

---

## 🌑 Shadow & Elevation System

### Shadow Scale (Warm-toned)
All shadows use `rgba(74, 53, 41, ...)` for a warm, earthy feel matching the brand.

```tsx
// Extra small - subtle depth
<Card className="shadow-card-sm">
// → 0 1px 3px rgba(74, 53, 41, 0.08), 0 1px 2px rgba(74, 53, 41, 0.04)
// Use for: Subtle elevation, list items

// Small - default cards (most common)
<Card className="shadow-card">
// → 0 4px 6px rgba(74, 53, 41, 0.08), 0 2px 4px rgba(74, 53, 41, 0.04)
// Use for: Standard cards, panels

// Medium - elevated cards
<Card className="shadow-card-md">
// → 0 10px 15px rgba(74, 53, 41, 0.08), 0 4px 6px rgba(74, 53, 41, 0.04)
// Use for: Important cards, featured content

// Large - prominent cards
<Card className="shadow-card-lg">
// → 0 20px 25px rgba(74, 53, 41, 0.08), 0 10px 10px rgba(74, 53, 41, 0.03)
// Use for: Modal-like cards, primary focus

// Extra large - modals, popovers
<div className="shadow-card-xl">
// → 0 25px 50px rgba(74, 53, 41, 0.15)
// Use for: Dialogs, overlays

// Hover state - interactive elevation
<Card className="shadow-card hover:shadow-card-hover">
// → 0 12px 20px rgba(74, 53, 41, 0.12), 0 6px 8px rgba(74, 53, 41, 0.06)
// Use for: Hover effects on cards

// Inner shadow - inset elements
<div className="shadow-inner-soft">
// → inset 0 2px 4px rgba(74, 53, 41, 0.05)
// Use for: Input fields, wells
```

### Elevation Hierarchy
```
Level 0: No shadow (flat elements)
Level 1: shadow-card-sm (subtle depth)
Level 2: shadow-card (default cards) ← Most common
Level 3: shadow-card-md (elevated cards)
Level 4: shadow-card-lg (prominent cards)
Level 5: shadow-card-xl (modals, overlays)

Interactive: shadow-card-hover (on hover/active states)
```

---

## 📏 Spacing System

### Enhanced Spacing Scale
Generous whitespace matching the reference designs.

#### Standard Tailwind Scale (available)
`0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64`

#### Custom Additions (matching references)
```tsx
// Fine-tuned spacing
space-4.5  // 18px (1.125rem)
space-5.5  // 22px (1.375rem)
space-7.5  // 30px (1.875rem)
space-8.5  // 34px (2.125rem)
space-9.5  // 38px (2.375rem)
space-13   // 52px (3.25rem)
space-15   // 60px (3.75rem)
space-17   // 68px (4.25rem)
space-18   // 72px (4.5rem)
space-19   // 76px (4.75rem)
space-21   // 84px (5.25rem)
space-22   // 88px (5.5rem)
space-26   // 104px (6.5rem)
space-30   // 120px (7.5rem)
```

### Spacing Guidelines by Use Case

#### Card Padding (generous, breathable)
```tsx
// Small cards
<Card className="p-6">          // 24px - compact cards

// Standard cards (most common)
<Card className="p-8">          // 32px - default card padding

// Large cards
<Card className="p-10">         // 40px - spacious cards

// Extra large feature cards
<Card className="p-12">         // 48px - hero cards
```

#### Vertical Spacing (sections)
```tsx
// Between cards in a list
<div className="space-y-4">     // 16px - tight spacing
<div className="space-y-6">     // 24px - standard spacing (most common)
<div className="space-y-8">     // 32px - generous spacing

// Between page sections
<section className="space-y-12"> // 48px - section separation
<section className="space-y-16"> // 64px - major sections
```

#### Horizontal Spacing (layouts)
```tsx
// Between elements in a row
<div className="space-x-4">     // 16px - tight
<div className="space-x-6">     // 24px - standard (most common)
<div className="space-x-8">     // 32px - generous

// Grid gaps
<div className="gap-6">         // 24px - card grids
<div className="gap-8">         // 32px - spacious grids
```

#### Content Margins
```tsx
// Page margins
<main className="mx-auto max-w-7xl px-6 py-12">  // Standard page layout

// Container spacing
<div className="my-8">          // 32px - vertical rhythm
<div className="my-12">         // 48px - section spacing
```

---

## 🎯 Complete Component Examples

### HIVE Dashboard Card
```tsx
<Card className="bg-hive-card-dark text-white rounded-card-lg shadow-card-md p-8">
  <CardHeader className="space-y-2">
    <CardTitle className="text-card-heading-lg font-heading">
      Your Blooming Metrics
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">
    <div className="space-y-2">
      <p className="text-body-sm text-white/80">Sessions completed</p>
      <p className="text-stat-lg font-heading">18</p>
    </div>
    <div className="space-y-2">
      <p className="text-body-sm text-white/80">Favorite clients</p>
      <p className="text-stat-md font-heading">67%</p>
    </div>
    <Button className="w-full rounded-button text-label bg-hive-accent hover:bg-hive-accent-light">
      View Full Analytics
    </Button>
  </CardContent>
</Card>
```

### HIVE Stats Card (Light)
```tsx
<Card className="bg-hive-card-light rounded-card shadow-card p-6">
  <CardContent className="space-y-3">
    <p className="text-body-sm text-hive-text-secondary">Today at 3:00 PM</p>
    <p className="text-card-heading font-heading text-hive-text-primary">
      Client: Akiya
    </p>
    <p className="text-body-sm text-hive-text-secondary">Manage Sessions</p>
  </CardContent>
</Card>
```

### HIVE Earnings Card (Accent)
```tsx
<Card className="bg-hive-accent text-white rounded-card shadow-card-md p-6 hover:shadow-card-hover transition-shadow">
  <CardContent className="flex items-center justify-between">
    <div>
      <p className="text-label text-white/90">Earning this week</p>
      <p className="text-stat-xl font-heading">+420</p>
    </div>
    <Button
      variant="secondary"
      size="sm"
      className="rounded-button text-label bg-hive-accent-light hover:bg-white/20"
    >
      View Details
    </Button>
  </CardContent>
</Card>
```

### GARDEN Session Card
```tsx
<Card className="bg-garden-card rounded-card-lg shadow-card p-8">
  <CardHeader className="space-y-4">
    <div className="flex items-center justify-between">
      <CardTitle className="text-card-heading font-heading text-garden-text-primary">
        Your Next Session
      </CardTitle>
      <Badge className="bg-garden-accent-light rounded-badge px-4 py-1">
        <Heart className="w-3 h-3 mr-1" />
        <span className="text-caption">My Favorites</span>
      </Badge>
    </div>
  </CardHeader>
  <CardContent className="space-y-6">
    <div className="space-y-2">
      <h3 className="text-card-heading font-heading text-garden-text-primary">
        Angelica
      </h3>
      <p className="text-body-sm text-garden-text-secondary">
        Apr 26 1st 10:00 AM
      </p>
    </div>
    <Button className="w-full bg-garden-accent hover:bg-garden-accent/90 rounded-button text-label">
      Enter Session
    </Button>
  </CardContent>
</Card>
```

### GARDEN Growth Tracker
```tsx
<Card className="bg-garden-card rounded-card shadow-card-sm p-6">
  <CardHeader>
    <CardTitle className="text-card-heading font-heading text-garden-text-primary">
      Track My Growth
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">
    <div className="flex items-center justify-around">
      <div className="text-center space-y-1">
        <p className="text-stat-lg font-heading text-garden-text-primary">8</p>
        <p className="text-caption text-garden-text-secondary">Growth Path</p>
      </div>
      <div className="text-center space-y-1">
        <p className="text-stat-lg font-heading text-garden-text-primary">8</p>
        <p className="text-caption text-garden-text-secondary">Signposts Earned</p>
      </div>
    </div>
    <div className="space-y-2">
      <p className="text-label text-garden-text-secondary">DISTORTIONS</p>
      <p className="text-body-sm text-garden-text-primary">Completed</p>
    </div>
    <Button
      variant="outline"
      className="w-full rounded-button text-label border-garden-accent text-garden-accent hover:bg-garden-accent hover:text-white"
    >
      View Timeline
    </Button>
  </CardContent>
</Card>
```

### GARDEN Sidebar
```tsx
<aside className="w-64 bg-garden-sidebar rounded-card-lg shadow-card-md p-6">
  <nav className="space-y-1">
    <h2 className="text-section-heading font-heading text-garden-text-on-sage mb-6">
      My Garden
    </h2>
    <a className="flex items-center gap-3 px-4 py-3 rounded-button hover:bg-white/10 transition-colors text-body text-garden-text-on-sage">
      <Home className="w-5 h-5" />
      Home
    </a>
    <a className="flex items-center gap-3 px-4 py-3 rounded-button hover:bg-white/10 transition-colors text-body text-garden-text-on-sage">
      <Calendar className="w-5 h-5" />
      Book Session
    </a>
    <a className="flex items-center gap-3 px-4 py-3 rounded-button hover:bg-white/10 transition-colors text-body text-garden-text-on-sage">
      <BookOpen className="w-5 h-5" />
      My Sessions
    </a>
  </nav>

  <div className="mt-12 p-6 bg-garden-container rounded-card shadow-card-sm">
    <p className="text-card-subheading font-heading text-garden-text-primary mb-2">
      Reflections from Maia
    </p>
    <p className="text-body-sm text-garden-text-secondary mb-4">
      You are a Blooming Seeker
    </p>
  </div>
</aside>
```

### Badge Component
```tsx
// User status badge (HIVE)
<Badge className="bg-hive-accent-light rounded-badge px-4 py-2 shadow-card-sm">
  <span className="text-caption text-hive-text-primary">
    You are an Evolving Pollinator
  </span>
</Badge>

// User status badge (GARDEN)
<Badge className="bg-garden-accent-light rounded-badge px-4 py-2 shadow-card-sm">
  <span className="text-caption text-garden-text-primary">
    You are a Blooming Seeker
  </span>
</Badge>
```

---

## 📐 Layout Patterns

### Standard Page Layout
```tsx
<div className="min-h-screen bg-hive-bg">
  <div className="max-w-7xl mx-auto px-6 py-12">
    <header className="mb-12">
      <h1 className="text-page-heading font-heading text-hive-text-primary">
        My Hive
      </h1>
    </header>

    <div className="space-y-8">
      {/* Cards go here */}
    </div>
  </div>
</div>
```

### Card Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card className="bg-hive-card-light rounded-card shadow-card p-6">
    {/* Card content */}
  </Card>
  {/* More cards */}
</div>
```

### Sidebar + Content Layout
```tsx
<div className="flex min-h-screen bg-garden-bg">
  <aside className="w-64 bg-garden-sidebar p-6">
    {/* Sidebar */}
  </aside>

  <main className="flex-1 bg-garden-container p-12">
    <div className="max-w-5xl">
      {/* Main content */}
    </div>
  </main>
</div>
```

---

## 🎨 Design Principles

### Typography Principles
1. **Hierarchy is King**: Use the type scale consistently to create clear visual hierarchy
2. **Lora for Emotion**: Headings and stats use Lora for warmth and personality
3. **Poppins for Clarity**: Body text uses Poppins for readability and modernity
4. **Generous Line Heights**: All body text has comfortable line-height for readability
5. **Negative Letter Spacing**: Large text uses slight negative tracking for elegance

### Spacing Principles
1. **Breathe**: The UI should feel spacious, not cramped
2. **Consistent Scale**: Use multiples of 4px (or the custom scale) for all spacing
3. **Card Padding**: Default to `p-8` (32px) for most cards
4. **Vertical Rhythm**: Use `space-y-6` (24px) as the standard between elements
5. **Section Separation**: Use `space-y-12` (48px) or larger between major sections

### Shadow Principles
1. **Warm Tones**: All shadows use brown tones, not black, for brand consistency
2. **Subtle by Default**: Most cards use `shadow-card` (level 2)
3. **Elevation on Interaction**: Increase shadow on hover for feedback
4. **Context-Appropriate**: Use larger shadows for modals/overlays

### Radius Principles
1. **Generous Corners**: Default to 16px (`rounded-card`) for cards
2. **Consistency**: Match radius to element size (larger elements = larger radius)
3. **Fully Rounded Badges**: Use `rounded-badge` (24px) for pill-shaped elements
4. **Subtle Inputs**: Use smaller radius (`rounded-input` 10px) for form fields

---

## ✅ Quick Reference Cheat Sheet

### Typography
- Page heading: `text-page-heading font-heading` (36px)
- Card heading: `text-card-heading font-heading` (20px)
- Body text: `text-body` (15px)
- Stat: `text-stat-lg font-heading` (36px)
- Label: `text-label` (13px)

### Spacing
- Card padding: `p-8` (32px)
- Element spacing: `space-y-6` (24px)
- Section spacing: `space-y-12` (48px)

### Shadows
- Default card: `shadow-card`
- Hover state: `hover:shadow-card-hover`

### Radius
- Cards: `rounded-card` (16px)
- Buttons: `rounded-button` (14px)
- Badges: `rounded-badge` (24px)

---

**Last Updated**: 2025-11-08
**Reference Images**: `attached_assets/HIVE_UI_REFERENCE.png`, `attached_assets/GARDEN_UI_REFERENCE.png`
