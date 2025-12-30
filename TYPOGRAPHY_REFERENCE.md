# Typography & Visual Hierarchy Reference

Quick visual reference for FloreSer typography system based on HIVE and GARDEN UI references.

---

## 📊 Type Scale Visual Comparison

```
┌─────────────────────────────────────────────────────────────┐
│                     TYPE SCALE HIERARCHY                     │
└─────────────────────────────────────────────────────────────┘

text-page-heading (36px / 2.25rem) ─────────────┐
My Hive / My Garden                             │ Lora Bold
                                                │ -0.025em tracking
                                                │
text-section-heading (28px / 1.75rem) ──────────┤
Your Session                                    │ Lora Semibold
                                                │ -0.02em tracking
                                                │
text-card-heading-lg (24px / 1.5rem) ───────────┤
Your Blooming Metrics                           │ Lora Semibold
                                                │ -0.015em tracking
                                                │
text-card-heading (20px / 1.25rem) ─────────────┤
Angelica / Reflections from Maia                │ Lora Semibold
                                                │ -0.01em tracking
                                                │
text-card-subheading (18px / 1.125rem) ─────────┘
Your Next Session                                 Lora Medium


text-body-lg (16px / 1rem) ─────────────────────┐
Primary content and descriptions                │ Poppins Regular
                                                │
text-body (15px / 0.9375rem) ───────────────────┤
Standard body text (most common)                │ Poppins Regular
                                                │
text-body-sm (14px / 0.875rem) ─────────────────┤
Metadata, timestamps, descriptions              │ Poppins Regular
                                                │
text-label (13px / 0.8125rem) ──────────────────┤
Button text, form labels                        │ Poppins Medium
                                                │
text-caption (12px / 0.75rem) ──────────────────┘
Badges, tiny metadata                             Poppins Regular


text-stat-xl (40px / 2.5rem) ───────────────────┐
+420                                            │ Lora Bold
                                                │ line-height: 1
text-stat-lg (36px / 2.25rem) ──────────────────┤ tight tracking
18 / 8                                          │ for large numbers
                                                │
text-stat-md (32px / 2rem) ─────────────────────┘
67%
```

---

## 🎯 HIVE Section Typography Examples

### Page Structure
```
┌────────────────────────────────────────────────┐
│ My Hive                    ← text-page-heading │
│                                                 │
│ ┌────────────────────────────────────────────┐ │
│ │ Today at 3:00 PM         ← text-body-sm    │ │
│ │ Client: Akiya            ← text-card-heading │ │
│ │ Manage Sessions          ← text-body-sm    │ │
│ └────────────────────────────────────────────┘ │
│                                                 │
│ ┌────────────────────────────────────────────┐ │
│ │ Earning this week        ← text-label      │ │
│ │ +420                     ← text-stat-xl    │ │
│ │ [View Details]           ← text-label      │ │
│ └────────────────────────────────────────────┘ │
│                                                 │
│ ┌────────────────────────────────────────────┐ │
│ │ Your Blooming Metrics ← text-card-heading-lg │ │
│ │                                             │ │
│ │ Sessions completed       ← text-body-sm    │ │
│ │ 18                       ← text-stat-lg    │ │
│ │                                             │ │
│ │ Favorite clients         ← text-body-sm    │ │
│ │ 67%                      ← text-stat-md    │ │
│ │                                             │ │
│ │ [View Full Analytics]    ← text-label      │ │
│ └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

---

## 🌸 GARDEN Section Typography Examples

### Page Structure
```
┌──────────────┬─────────────────────────────────┐
│ My Garden    │ Your Session  ← text-section-heading
│ ← text-page- │                                 │
│   heading    │ ┌─────────────────────────────┐ │
│              │ │ Your Next Session           │ │
│ [Home]       │ │ ← text-card-subheading      │ │
│ [Book        │ │                             │ │
│  Session]    │ │ Angelica  ← text-card-heading │ │
│ [My          │ │ Apr 26 1st 10:00 AM         │ │
│  Sessions]   │ │ ← text-body-sm              │ │
│ ← text-body  │ │                             │ │
│              │ │ [Enter Session] ← text-label │ │
│              │ └─────────────────────────────┘ │
│              │                                 │
│ ┌──────────┐ │ Track My Growth               │
│ │Reflections│ │ ← text-card-heading           │
│ │from Maia  │ │                               │
│ │← text-    │ │ Growth Path  Signposts Earned │
│ │  card-sub │ │ ← text-caption                │
│ │  heading  │ │    8            8             │
│ │           │ │ ← text-stat-lg                │
│ │You are a  │ │                               │
│ │Blooming   │ │ DISTORTIONS  ← text-label     │
│ │Seeker     │ │ Completed    ← text-body-sm   │
│ │← text-    │ │                               │
│ │  body-sm  │ │ [View Timeline] ← text-label  │
│ └──────────┘ └─────────────────────────────────┘
```

---

## 📏 Spacing Visual Guide

### Card Padding Scale
```
┌───────────────────────────┐
│ p-6 (24px)                │  ← Compact cards
│ Content here              │
└───────────────────────────┘

┌─────────────────────────────┐
│ p-8 (32px)                  │  ← Standard cards (most common)
│ Content here                │
│                             │
└─────────────────────────────┘

┌───────────────────────────────┐
│ p-10 (40px)                   │  ← Spacious cards
│ Content here                  │
│                               │
│                               │
└───────────────────────────────┘

┌─────────────────────────────────┐
│ p-12 (48px)                     │  ← Hero/feature cards
│ Content here                    │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### Vertical Spacing Between Elements
```
┌──────────────┐
│ Element 1    │
└──────────────┘
    ↕ space-y-4 (16px) ← Tight spacing

┌──────────────┐
│ Element 2    │
└──────────────┘
    ↕ space-y-6 (24px) ← Standard spacing (most common)

┌──────────────┐
│ Element 3    │
└──────────────┘
    ↕ space-y-8 (32px) ← Generous spacing

┌──────────────┐
│ Element 4    │
└──────────────┘
    ↕ space-y-12 (48px) ← Section separation

┌──────────────┐
│ Element 5    │
└──────────────┘
```

---

## 🌑 Shadow Elevation Scale

```
┌────────────────────────┐
│ shadow-card-sm         │  Level 1: Subtle depth
│                        │  List items, minor cards
└────────────────────────┘

┌────────────────────────┐
│ shadow-card            │  Level 2: Default (most common)
│                        │  Standard cards, panels
└────────────────────────┘

┌────────────────────────┐
│ shadow-card-md         │  Level 3: Elevated
│                        │  Important cards, featured
└────────────────────────┘

┌────────────────────────┐
│ shadow-card-lg         │  Level 4: Prominent
│                        │  Modal-like cards, focus
└────────────────────────┘

┌────────────────────────┐
│ shadow-card-xl         │  Level 5: Maximum
│                        │  Dialogs, overlays
└────────────────────────┘

┌────────────────────────┐
│ shadow-card-hover      │  Interactive: Hover state
│                        │  On hover/active
└────────────────────────┘
```

---

## 🔲 Border Radius Scale

```
┌─────────────────────┐
│ rounded-input (10px)│  Input fields
└─────────────────────┘

┌──────────────────────┐
│ rounded-card-sm      │  Small cards/sections (12px)
│                      │
└──────────────────────┘

┌───────────────────────┐
│ rounded-button (14px) │  Buttons
│                       │
└───────────────────────┘

┌────────────────────────┐
│ rounded-card (16px)    │  Standard cards (most common)
│                        │
│                        │
└────────────────────────┘

┌─────────────────────────┐
│ rounded-card-lg (20px)  │  Large cards
│                         │
│                         │
│                         │
└─────────────────────────┘

╭─────────────────────────╮
│ rounded-badge (24px)    │  Badges/pills (fully rounded)
╰─────────────────────────╯
```

---

## 🎨 Color + Typography Combinations

### HIVE Dark Card (Analytics)
```tsx
bg-hive-card-dark + text-white
├─ Heading: text-card-heading-lg font-heading
├─ Label: text-body-sm text-white/80
├─ Stat: text-stat-lg font-heading
└─ Button: text-label bg-hive-accent
```

### HIVE Light Card (Info)
```tsx
bg-hive-card-light
├─ Heading: text-card-heading font-heading text-hive-text-primary
├─ Body: text-body-sm text-hive-text-secondary
└─ Meta: text-caption text-hive-text-secondary
```

### HIVE Accent Card (CTA)
```tsx
bg-hive-accent + text-white
├─ Label: text-label text-white/90
├─ Stat: text-stat-xl font-heading
└─ Button: text-label bg-hive-accent-light
```

### GARDEN Content Card
```tsx
bg-garden-card
├─ Heading: text-card-heading font-heading text-garden-text-primary
├─ Subheading: text-card-subheading font-heading text-garden-text-primary
├─ Body: text-body-sm text-garden-text-secondary
└─ Button: text-label bg-garden-accent
```

### GARDEN Sidebar
```tsx
bg-garden-sidebar
├─ Heading: text-section-heading font-heading text-garden-text-on-sage
├─ Nav items: text-body text-garden-text-on-sage
└─ Nested card: bg-garden-container rounded-card
```

---

## ⚡ Common Patterns

### Card Header Pattern
```tsx
<CardHeader className="space-y-2">
  <CardTitle className="text-card-heading font-heading">
    Title Here
  </CardTitle>
  <CardDescription className="text-body-sm">
    Description here
  </CardDescription>
</CardHeader>
```

### Metric Display Pattern
```tsx
<div className="space-y-1">
  <p className="text-body-sm text-muted">
    Label
  </p>
  <p className="text-stat-lg font-heading">
    42
  </p>
</div>
```

### Button Pattern
```tsx
<Button className="rounded-button text-label">
  Button Text
</Button>
```

### Badge Pattern
```tsx
<Badge className="rounded-badge px-4 py-1">
  <span className="text-caption">
    Badge Text
  </span>
</Badge>
```

---

## 📋 Implementation Checklist

### For Every Card Component
- [ ] Use appropriate padding: `p-6`, `p-8`, `p-10`, or `p-12`
- [ ] Apply shadow: typically `shadow-card`
- [ ] Set border radius: typically `rounded-card` or `rounded-card-lg`
- [ ] Add hover shadow if interactive: `hover:shadow-card-hover`

### For Every Heading
- [ ] Add `font-heading` class
- [ ] Choose correct size: `text-page-heading`, `text-card-heading`, etc.
- [ ] Set appropriate text color

### For Every Body Text
- [ ] Choose correct size: `text-body-lg`, `text-body`, or `text-body-sm`
- [ ] Set appropriate line height (built into size classes)

### For Every Stat/Metric
- [ ] Add `font-heading` class
- [ ] Choose stat size: `text-stat-xl`, `text-stat-lg`, or `text-stat-md`
- [ ] Ensure tight line-height (built into classes)

### For Spacing Between Elements
- [ ] Use `space-y-6` as default between card elements
- [ ] Use `space-y-12` between major sections
- [ ] Use `p-8` as default card padding

---

## 🔍 Before/After Examples

### ❌ Don't Do This
```tsx
// Generic, inconsistent sizing
<h1 className="text-3xl font-bold">My Hive</h1>
<p className="text-sm">Some text</p>
<Card className="rounded-lg p-4 shadow">
```

### ✅ Do This Instead
```tsx
// Specific, system-based sizing
<h1 className="text-page-heading font-heading">My Hive</h1>
<p className="text-body-sm">Some text</p>
<Card className="rounded-card p-8 shadow-card">
```

---

**Last Updated**: 2025-11-08
**See Also**: `DESIGN_SYSTEM.md` for complete documentation
