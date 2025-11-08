# FloreSer Color Mapping: HIVE & GARDEN

This document maps the extracted UI reference colors to our brand palette and shows how to use them in code.

---

## 🐝 HIVE Section Colors (Warm, Grounded, Earthy)

### Extracted from HIVE_UI_REFERENCE

| Element | Reference Color | HSL | Mapped To | Usage |
|---------|----------------|-----|-----------|-------|
| **Background** | `#E8C8A0` | `hsl(30, 45%, 78%)` | `hive-bg` | Main page background |
| **Light Cards** | `#F5E6D3` | `hsl(33, 50%, 92%)` | `hive-card-light` | Session cards, info panels |
| **Dark Cards** | `#4A3529` | `hsl(25, 28%, 24%)` | `hive-card-dark` | Analytics cards, metrics |
| **Primary Accent** | `#D4915E` | `hsl(28, 55%, 60%)` | `hive-accent` | CTAs, important buttons |
| **Accent Light** | `#E89451` | `hsl(35, 58%, 65%)` | `hive-accent-light` | Buttons on accent cards |
| **Text Primary** | `#4A3529` | `hsl(25, 28%, 24%)` | `hive-text-primary` | Headings, body text |
| **Text Secondary** | `#8B7355` | `hsl(30, 20%, 45%)` | `hive-text-secondary` | Subtitles, metadata |
| **Text on Accent** | `#FFFFFF` | `hsl(0, 0%, 100%)` | `hive-text-on-accent` | White text on orange |

### Brand Palette Integration
- **Base**: Warmer variation of `cream` (`#F5F5DC`)
- **Accent**: More orange variant of `gold` (`#D4AF37`)
- **Dark**: Brown alternative to `forest` (`#2F4F4F`)
- **Overall Feel**: Cozy, productive, professional

### Tailwind Usage
```tsx
// Background
<div className="bg-hive-bg">

// Light cards
<Card className="bg-hive-card-light">

// Dark analytics cards
<Card className="bg-hive-card-dark text-white">

// Primary button
<Button className="bg-hive-accent hover:bg-hive-accent-light text-hive-text-on-accent">

// Text styling
<h2 className="text-hive-text-primary">
<p className="text-hive-text-secondary">
```

---

## 🌸 GARDEN Section Colors (Fresh, Growing, Tranquil)

### Extracted from GARDEN_UI_REFERENCE

| Element | Reference Color | HSL | Mapped To | Usage |
|---------|----------------|-----|-----------|-------|
| **Background** | `#A9B08F` | `hsl(75, 18%, 64%)` | `garden-bg` | Page outer background |
| **Container** | `#F5EFE7` | `hsl(40, 50%, 94%)` | `garden-container` | Main content area |
| **Light Cards** | `#F9F6F0` | `hsl(45, 60%, 97%)` | `garden-card` | Content cards, sections |
| **Accent Buttons** | `#D4A76A` | `hsl(42, 48%, 60%)` | `garden-accent` | Primary buttons, CTAs |
| **Accent Light** | `#F5D791` | `hsl(45, 82%, 77%)` | `garden-accent-light` | Badges, favorites |
| **Sidebar** | `#8A9B6F` | `hsl(75, 18%, 58%)` | `garden-sidebar` | Navigation sidebar |
| **Text Primary** | `#4A3529` | `hsl(25, 28%, 24%)` | `garden-text-primary` | Main text |
| **Text Secondary** | `#7D7264` | `hsl(30, 15%, 50%)` | `garden-text-secondary` | Subtitles, labels |
| **Text on Sage** | `#4A3529` | `hsl(25, 28%, 24%)` | `garden-text-on-sage` | Sidebar text |

### Brand Palette Integration
- **Base**: Muted variation of `sage` (`#9CAF88`)
- **Container**: Warmer version of `cream` (`#F5F5DC`)
- **Accent**: Softer variant of `gold` (`#D4AF37`)
- **Overall Feel**: Peaceful, nurturing, growth-oriented

### Tailwind Usage
```tsx
// Background
<div className="bg-garden-bg">

// Main container
<div className="bg-garden-container">

// Content cards
<Card className="bg-garden-card">

// Primary button
<Button className="bg-garden-accent hover:bg-garden-accent-light">

// Sidebar
<aside className="bg-garden-sidebar text-garden-text-on-sage">

// Badge/favorite
<Badge className="bg-garden-accent-light">

// Text styling
<h2 className="text-garden-text-primary">
<p className="text-garden-text-secondary">
```

---

## 🎨 Brand Palette Reference

### Core FloreSer Colors
| Color Name | HSL | Hex | Usage |
|------------|-----|-----|-------|
| **Forest** | `hsl(180, 25%, 31%)` | `#2F4F4F` | Headers, CTAs |
| **Cream** | `hsl(60, 56%, 91%)` | `#F5F5DC` | Backgrounds |
| **Gold** | `hsl(45, 70%, 52%)` | `#D4AF37` | Accents, links |
| **Sage** | `hsl(82, 15%, 62%)` | `#9CAF88` | Borders, subtle |
| **Subtle Rose** | `hsl(0, 20%, 69%)` | `#C49C9C` | Gentle accents |

### How HIVE & GARDEN Extend the Palette

**HIVE** creates a **warmer, earthier** environment:
- Shifts `cream` → warmer peach tones
- Shifts `gold` → more orange/bronze
- Introduces rich browns instead of forest green
- Perfect for: Practitioner dashboards, analytics, productivity

**GARDEN** creates a **fresher, calmer** environment:
- Uses `sage` as primary background tone
- Keeps `cream` but warmer variation
- Softens `gold` for gentle CTAs
- Perfect for: Content browsing, meditation, wellness resources

---

## 🔧 Implementation Examples

### HIVE Page Layout
```tsx
export function HivePage() {
  return (
    <div className="min-h-screen bg-hive-bg">
      <div className="max-w-7xl mx-auto p-6">
        {/* Light info card */}
        <Card className="bg-hive-card-light border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-hive-text-primary">
              Today at 3:00 PM
            </CardTitle>
            <CardDescription className="text-hive-text-secondary">
              Client: Akiya
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Accent CTA */}
        <Button className="bg-hive-accent hover:bg-hive-accent-light text-hive-text-on-accent">
          Earning this week: +420
        </Button>

        {/* Dark analytics card */}
        <Card className="bg-hive-card-dark text-white border-0">
          <CardContent>
            <h3 className="text-2xl font-heading">Your Blooming Metrics</h3>
            <div className="space-y-2">
              <p className="text-white/90">Sessions completed: 18</p>
              <p className="text-white/90">Favorite clients: 67%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### GARDEN Page Layout
```tsx
export function GardenPage() {
  return (
    <div className="min-h-screen bg-garden-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-garden-sidebar p-4">
        <nav className="space-y-2">
          <a className="text-garden-text-on-sage">Home</a>
          <a className="text-garden-text-on-sage">Book Session</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-garden-container">
        <div className="max-w-4xl mx-auto p-8">
          {/* Content card */}
          <Card className="bg-garden-card border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-garden-text-primary">
                Your Next Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-garden-text-secondary">
                Angelica - Apr 26 1st 10:00 AM
              </p>
              <Button className="bg-garden-accent hover:bg-garden-accent-light">
                Enter Session
              </Button>
            </CardContent>
          </Card>

          {/* Favorite badge */}
          <Badge className="bg-garden-accent-light text-garden-text-primary">
            My Favorites
          </Badge>
        </div>
      </main>
    </div>
  );
}
```

---

## 📋 Quick Reference Cheat Sheet

### HIVE Classes
- `bg-hive-bg` - Warm peach background
- `bg-hive-card-light` - Soft cream cards
- `bg-hive-card-dark` - Rich brown cards
- `bg-hive-accent` - Golden orange buttons
- `text-hive-text-primary` - Dark brown text
- `text-hive-text-secondary` - Muted text
- `text-hive-text-on-accent` - White on orange

### GARDEN Classes
- `bg-garden-bg` - Muted sage background
- `bg-garden-container` - Warm cream container
- `bg-garden-card` - Very light cream cards
- `bg-garden-accent` - Warm gold buttons
- `bg-garden-accent-light` - Light golden badges
- `bg-garden-sidebar` - Muted sage sidebar
- `text-garden-text-primary` - Dark text
- `text-garden-text-secondary` - Muted text
- `text-garden-text-on-sage` - Text on sage bg

---

## 🎯 Design Principles

### When to Use HIVE Colors
- **Practitioner dashboards** (productivity, earnings, metrics)
- **Admin panels** (data-heavy, analytical)
- **Booking management** (scheduling, sessions)
- **Professional tools** (calendars, analytics)

### When to Use GARDEN Colors
- **Content browsing** (articles, videos, resources)
- **Meditation/wellness areas** (calm, peaceful)
- **Community features** (sharing, discussions)
- **Client-facing experiences** (exploration, discovery)

### Combining with Core Palette
You can still use core brand colors alongside section-specific colors:
```tsx
// Mix HIVE with core forest for headers
<header className="bg-forest text-cream">
  <h1>Practitioner Dashboard</h1>
</header>
<main className="bg-hive-bg">
  {/* HIVE content */}
</main>

// Mix GARDEN with core gold for special accents
<div className="bg-garden-bg">
  <Button className="bg-gold">Special Offer</Button>
</div>
```

---

**Last Updated**: 2025-11-08
**Reference Images**: `attached_assets/HIVE_UI_REFERENCE.png`, `attached_assets/GARDEN_UI_REFERENCE.png`
