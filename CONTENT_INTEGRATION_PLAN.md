# FloreSer Content Integration Plan

This document outlines the strategy for integrating content from the markdown files into the existing FloreSer website.

---

## 📋 Project Status

**Status**: ⏳ Awaiting uploaded markdown files
**Files Needed**:
- [ ] Master_site.md (Landing page, Join the Hive content)
- [ ] My_Hive.md (Facilitator dashboard features)
- [ ] My_Garden.md (Client dashboard features)

---

## 🎯 Integration Objectives

1. **Preserve UI/UX**: Maintain the dashboard designs we just completed
2. **Add Content**: Integrate all copy, messaging, and branded content
3. **Implement Features**: Build out all specified functionality
4. **Maintain Voice**: Keep nature-inspired, poetic tone throughout
5. **Ensure Consistency**: Use proper terminology (Pollinator, Seeker, Bloom Path)

---

## 📊 Content Mapping Framework

### Landing Page (Master_site.md expected sections)
- [ ] Hero section with "Beyond Traditional Therapy" messaging
- [ ] Trust badge copy
- [ ] "Dear One" welcome message
- [ ] "What Awaits Inside" section
- [ ] Pollinator Archetype cards (Bee, Hummingbird, Butterfly, Beetle)
- [ ] "Seasons of Practice" section (Emerging, Evolving, Rooted)
- [ ] Benefits and value propositions

### Join the Hive Page (Master_site.md lines 500-637)
- [ ] Hero: "Join the Hive — Become a Pollinator"
- [ ] "The Invitation" section
- [ ] "Why We Call You Pollinators" explanation
- [ ] "Why Join the Hive" benefits grid (5 cards)
- [ ] "Seasons of Practice" detailed descriptions
- [ ] "The Hive Culture" values (Integrity, Authenticity, Presence, Co-Creation)
- [ ] "The Path to Join" 4-step process
- [ ] "Together, We Bloom" closing section

### My Hive Features (My_Hive.md)
**Section 1: Application & Onboarding**
- [ ] Application flow
- [ ] Onboarding wizard

**Section 2: Soul Profile Enhancements**
- [ ] Public profile view improvements

**Section 3: Session Management**
- [ ] Calendar integration
- [ ] Availability management
- [ ] Post-session summary field
- [ ] Follow-up recommendation trigger
- [ ] Energy Level Tracker (optional)

**Section 4: Payments & Invoicing**
- [ ] Total earnings display
- [ ] Upcoming payouts section
- [ ] Pending invoices list
- [ ] Commission % by tier display
- [ ] Monthly revenue graph
- [ ] "Session Value Reflection" field

**Section 5: Messaging & Relationship Tools**
- [ ] In-app chat with templates
- [ ] Pre-session client form access
- [ ] File sharing capability
- [ ] "Reflections Journal" space

**Section 6: Collaboration & Referral**
- [ ] Refer Another Facilitator feature
- [ ] Cross-Pollinate suggestions
- [ ] Mentor Path option
- [ ] Upload to Community Garden
- [ ] Visibility Rewards system

**Section 7: Analytics & Growth Tracking**
- [ ] Dashboard overview metrics
- [ ] Insight cards
- [ ] "Flourishing Index" gamified metric
- [ ] Badge progression system

**Section 8: Community Integration**
- [ ] Founder/Mentor Circle Calls access
- [ ] Facilitator workshops calendar
- [ ] News & Rituals section
- [ ] Internal Notice Board

### My Garden Features (My_Garden.md)
**Section 1: Welcome Layer**
- [ ] Onboarding email integration
- [ ] Video walkthrough embedding
- [ ] Intention selection prompt
- [ ] Personal Maia message

**Section 2: Home Dashboard "Living Garden View"**
- [ ] Circular mandala growth archetype visual
- [ ] 6-petal domains (Body, Emotion, Mind, Spirit, Creativity, Connection)
- [ ] Enhanced Next Session Card
- [ ] Action Tiles (Find Guide, Favorites, Track Growth)
- [ ] Maia/Angelica contextual messages

**Section 3: Select & Book Sessions**
- [ ] Filter by archetype and intention
- [ ] Smart recommendations
- [ ] Ritual-toned confirmation page

**Section 4: Payment & Session Access**
- [ ] Stored payment method display
- [ ] Invoice/receipt viewing
- [ ] Zoom/in-app link generation
- [ ] Golden leaf progress indicator

**Section 5: Growth Timeline "Your Bloom Path"**
- [ ] Circular vine with blooms visualization
- [ ] Pollination points system
- [ ] Milestone badges (Rising Flower, Flourishing Path)
- [ ] Archetype Tracker (Seed → Sprout → Blossom → Fruit → Forest)

**Section 6: Reflections & Follow-Up**
- [ ] Post-session feedback screen
- [ ] Personalized path suggestions
- [ ] Mini ritual/message from Maia

**Section 7: Journal & Reflections**
- [ ] Private journal with session-linked entries
- [ ] Milestone prompts
- [ ] PDF export: "My Garden of Becoming"
- [ ] Optional AI synthesis placeholder

**Section 8: Favorites & Reviews**
- [ ] Heart icon save functionality
- [ ] Review/testimonial system

**Section 9: Upgrades & Membership**
- [ ] Level progression display
- [ ] Unlock notifications
- [ ] Badge animations

**Section 10: Emotional Touches**
- [ ] Growth animations (sprout unfurling)
- [ ] Gentle transitions

---

## 🏗️ Implementation Strategy

### Phase 1: Essential (High Priority)
**Week 1:**
- Landing page hero and archetype cards
- Join the Hive page creation
- Basic content updates across existing pages

**Week 2:**
- Hive dashboard: Session management core features
- Hive dashboard: Payments dashboard
- Garden dashboard: Bloom Path timeline skeleton

**Week 3:**
- Garden dashboard: Growth mandala visualization
- Maia messaging system foundation
- Analytics dashboard for Hive

### Phase 2: Important (Medium Priority)
**Week 4:**
- Hive: Referral tools implementation
- Hive: Community integration section
- Garden: Journal system with session linking

**Week 5:**
- Garden: Post-session feedback flow
- Garden: Favorites and reviews system
- Cross-site navigation updates

### Phase 3: Enhancements (Lower Priority)
**Week 6:**
- Energy Level Tracker
- Visibility Rewards visualization
- Membership progression UI

**Week 7:**
- PDF export functionality
- Advanced animations (sprout unfurling, etc.)
- Polish and refinements

---

## 🔧 Technical Approach

### New Component Structure
```
client/src/components/
├── landing/
│   ├── Hero.tsx
│   ├── ArchetypeCards.tsx
│   ├── SeasonsOfPractice.tsx
│   └── WhatAwaitsInside.tsx
├── join/
│   ├── JoinHero.tsx
│   ├── Invitation.tsx
│   ├── WhyPollinators.tsx
│   ├── HiveCulture.tsx
│   └── PathToJoin.tsx
├── hive/
│   ├── SessionManagement.tsx
│   ├── PaymentsDashboard.tsx
│   ├── ReflectionsJournal.tsx
│   ├── ReferralTools.tsx
│   ├── FlourishingIndex.tsx
│   └── CommunityIntegration.tsx
├── garden/
│   ├── GrowthMandala.tsx
│   ├── BloomPathTimeline.tsx
│   ├── MaiaMessage.tsx
│   ├── JournalSystem.tsx
│   ├── PostSessionFeedback.tsx
│   └── MembershipProgress.tsx
└── shared/
    ├── PollinatorBadge.tsx
    ├── GrowthAnimation.tsx
    └── NatureMetaphor.tsx
```

### State Management
- Use existing React Query patterns for data fetching
- Add new queries for journal entries, session feedback, etc.
- Maintain TypeScript types for all new features

### Styling Guidelines
- Use existing HIVE/GARDEN color palettes
- Apply established typography scale
- Maintain generous spacing (p-8, space-y-6)
- Use Framer Motion for animations
- Keep rounded-card, rounded-button styles

---

## 🎨 Design Preservation Checklist

For each new feature, ensure:
- [ ] Colors match HIVE or GARDEN palette
- [ ] Typography uses defined scale (text-page-heading, text-card-heading, etc.)
- [ ] Spacing uses custom scale (p-6, p-8, gap-6, etc.)
- [ ] Shadows use warm brown tones (shadow-card, shadow-card-md)
- [ ] Border radius uses custom values (rounded-card, rounded-button)
- [ ] Animations use Framer Motion with staggered delays
- [ ] Icons use Lucide icon set
- [ ] Layout follows existing patterns (sidebar + main, 3-column grid, etc.)

---

## 📝 Content Guidelines

### Voice & Tone
- Nature-inspired and poetic
- Warm, welcoming, non-clinical
- Uses metaphors: bloom, seed, pollinate, flourish, garden, hive
- Addresses users as "Dear One" when appropriate
- Celebratory of growth and transformation

### Terminology Consistency
- ✅ **Pollinator** (not "practitioner" in user-facing copy)
- ✅ **Seeker** (not "client" in user-facing copy)
- ✅ **Bloom Path** (not "progress" or "journey")
- ✅ **Flourishing** (not "success" or "achievement")
- ✅ **Seasons of Practice** (not "experience levels")
- ✅ **Soul Profile** (not "profile")
- ✅ **Community Garden** (not "content library")

### Archetype Names
Must include Latin names:
- Bee (*Apis mellifera*)
- Hummingbird (*Archilochus colubris*)
- Butterfly (*Danaus plexippus*)
- Beetle (*Dynastes hercules*)

---

## 🚀 Deployment Considerations

### Backend API Requirements
Flag features that need new API endpoints:
- [ ] Journal entries CRUD
- [ ] Session feedback submission
- [ ] Pollination points tracking
- [ ] Milestone badge awards
- [ ] Referral link generation
- [ ] Energy level tracking
- [ ] Session value reflections
- [ ] PDF export generation
- [ ] Maia message triggers
- [ ] Membership level progression

### Frontend-Only Features
Can be implemented immediately:
- [ ] Content updates (copy changes)
- [ ] New page layouts
- [ ] UI components for future API integration
- [ ] Animations and transitions
- [ ] Navigation structure
- [ ] Static visualizations

---

## ✅ Quality Assurance Checklist

### Content Accuracy
- [ ] All copy matches source markdown files
- [ ] No placeholder text remains
- [ ] Archetype descriptions are complete and accurate
- [ ] Latin names are properly formatted
- [ ] All section titles match specifications
- [ ] Voice is consistent throughout

### Functionality
- [ ] New forms submit correctly (or show "coming soon" if backend needed)
- [ ] Navigation links work
- [ ] Filters and search work
- [ ] Data persistence works where applicable
- [ ] Modals open/close properly

### Design Consistency
- [ ] Visual hierarchy matches established patterns
- [ ] Colors from HIVE/GARDEN palettes only
- [ ] Typography scale used correctly
- [ ] Spacing is generous and consistent
- [ ] Shadows are warm-toned
- [ ] Border radius matches specifications

### Responsiveness
- [ ] Mobile (< 768px) works
- [ ] Tablet (768px - 1024px) works
- [ ] Desktop (1024px+) works
- [ ] Text is readable at all sizes
- [ ] Images scale appropriately

### Accessibility
- [ ] All interactive elements have labels
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible

---

## 📊 Success Metrics

### Completion Tracking
- **Content Integration**: _% complete
- **Feature Implementation**: _% complete
- **Quality Assurance**: _% complete

### Key Deliverables
1. Updated landing page with full branded copy
2. New "Join the Hive" page
3. Enhanced Hive dashboard with all specified features
4. Enhanced Garden dashboard with all specified features
5. Comprehensive documentation of all changes

---

## 📄 Documentation Output

Will create:
1. **CONTENT_INTEGRATION_SUMMARY.md** - Complete record of all changes
2. **API_REQUIREMENTS.md** - List of backend endpoints needed
3. **COMPONENT_CATALOG.md** - Guide to all new components
4. **COPY_STYLE_GUIDE.md** - Voice, tone, and terminology reference

---

**Status**: Awaiting markdown file upload to begin analysis and implementation.
**Last Updated**: 2025-11-08
