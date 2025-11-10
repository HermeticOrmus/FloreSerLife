# FloreSer Content Mapping Document

Complete mapping of content from uploaded markdown files to existing React components.

**Status**: ✅ All files analyzed
**Date**: 2025-11-08

---

## 📋 Source Files Analyzed

1. ✅ **Master site_1762576936257.md** - Landing page, About, Explore, Join the Hive
2. ✅ **My Hive_1762576936257.md** - Facilitator dashboard specifications
3. ✅ **My Garden_1762576936253.md** - Client dashboard specifications

---

## 🏠 LANDING PAGE CONTENT

### Current File
`client/src/pages/Home.tsx` or create new `Landing.tsx`

### Content to Integrate

#### Hero Section (Lines 47-58)
```html
<div class="trust-badge">Verified Wellness Facilitators • Conscious & Ethical Practice</div>

<h1><span>Beyond Traditional Therapy:</span> Nature-Inspired Guidance for Your Becoming</h1>

<p>Welcome, Dear One — this is fertile ground for your unfolding. FloreSer.Life is more than an online wellness platform. It's a <strong>living ecosystem</strong> where verified holistic facilitators—our Pollinators—offer presence, wisdom, and embodied practices to support your personal growth.</p>

<p>Whether you're taking first steps into self-discovery or deepening your practice, this is where <strong>healing becomes flourishing</strong> and your next season of becoming begins.</p>

<a href="#find">Find Your Pollinator</a>
<a href="/hive.html">For Facilitators</a>
```

**Implementation Notes:**
- Replace current hero copy exactly
- Add trust badge component above title
- Use "Dear One" greeting (poetic voice)
- Preserve existing styling but update text

---

#### What Awaits Inside (Lines 61-79)
Three cards with exact copy:

**The Hive:**
> A curated directory of guides, mentors, and visionaries across body, soul, and creative expression.

**My Garden:**
> Your personal sanctuary where sessions, reflections, and growth are lovingly tended.

**The Community Garden:**
> Seasonal rituals, shared insights, and global gatherings for collective flourishing.

---

#### Discover Your Perfect Match Section (Lines 82-93)
```html
<div class="eyebrow">Nature-Inspired Pollinator Matching</div>
<h2>Discover Your Perfect Pollinator Match</h2>

<p>Every journey is unique—shaped by your season, your rhythm, your becoming. Our <strong>Pollinator Archetype System</strong> connects you with facilitators whose natural style aligns with your current phase of life. Experience meaningful, trustworthy connections that foster genuine transformation.</p>

<ul class="benefits">
  <li>Personalized Matching</li>
  <li>Verified Expertise</li>
  <li>Meaningful, Heart-Led Connections</li>
</ul>
```

---

#### Archetype Cards (Lines 96-127)
**CRITICAL: Include exact Latin names and badge text**

**1. The Bee (*Apis mellifera*)**
- Badge: "You look to feel safe and supported"
- Description: "For when you crave steadiness, warmth, and gentle care. The Bee guides you back to your body, your rhythm, and belonging — gentle, grounding, restorative."
- Link: "Explore the Bees →"

**2. The Hummingbird (*Colibri coruscans*)**
- Badge: "You look for clarity and insight"
- Description: "When you're seeking clarity, alignment, and truth. The Hummingbird helps you listen deeply to what's whispering within — light, precise, luminous."
- Link: "Explore the Hummingbirds →"

**3. The Butterfly (*Papilio machaon*)**
- Badge: "You are in the middle of change"
- Description: "When life is transforming. The Butterfly reminds you that endings are gateways to new life — graceful, tender, liberating."
- Link: "Explore the Butterflies →"

**4. The Beetle (*Scarabaeus sacer*)**
- Badge: "You want to go deeper"
- Description: "For moments that call for depth and introspection. The Beetle walks with you through the dark, turning old stories into fertile soil — steady, alchemical, profound."
- Link: "Explore the Beetles →"

---

#### Seasons of Practice (Lines 129-141)
```html
<h2>The Seasons of Practice</h2>

<p>Each Pollinator grows through seasons of practice—some are <strong>Emerging</strong>, just beginning to share their light; others are <strong>Evolving</strong>, refining and expanding their craft; and some are <strong>Rooted</strong>, seasoned in their path, grounded in years of presence and wisdom.</p>

<p class="muted">Wherever they are in their journey, all are guided by integrity, care, and the wish to see you bloom.</p>

<ul>
  <li>Emerging</li>
  <li>Evolving</li>
  <li>Rooted</li>
</ul>
```

**Note:** Update from "Rising/Evolving/Wise" to "Emerging/Evolving/Rooted"

---

#### mAIa Section (Lines 144-150)
```html
<h2>Not Sure Where to Begin?</h2>

<p>That's perfectly fine. Every soul blooms in its own rhythm. <strong>mAIa</strong> gently helps you find your start. She listens to your rhythm, needs, and intentions, then connects you with Pollinators most aligned with your growth.</p>

<a href="#">Let mAIa Guide You</a>
```

---

#### For Facilitators CTA (Lines 153-159)
```html
<h2>For Facilitators</h2>

<p>Are you a guide, healer, or catalyst? You carry a spark. A wisdom shaped by earth, time, and your own journey of becoming. Join the Hive and become a Pollinator in our living ecosystem of co-creation and conscious flourishing.</p>

<a href="/hive.html">Join the Hive</a>
```

---

#### Footer (Lines 162-169)
```html
<nav>
  <a href="/about.html">About</a>
  <a href="/hive.html">Join the Hive</a>
  <a href="#">Community Garden</a>
</nav>

<p>© {year} FloreSer.Life — Where growth is sacred and flourishing is your birthright.</p>
```

---

## 📄 JOIN THE HIVE PAGE

### New Page Component
Create: `client/src/pages/JoinTheHive.tsx`

### Complete Content Structure (Lines 524-623)

#### Hero
```html
<h1>Join the Hive — Become a Pollinator</h1>
<p class="lead">A home for soul-led facilitators who serve with depth, presence, and joy.</p>
<a href="#apply">Apply to Join</a>
```

---

#### Section 1: The Invitation (Lines 532-536)
```html
<h2>The Invitation</h2>

<p>You carry a spark — a wisdom shaped by earth, time, and your own becoming. <strong>FloreSer.Life</strong> is a living ecosystem where that wisdom takes root. A space to share your gifts, pollinate new hearts, and grow within a field of integrity and care.</p>

<p>This is not another gig platform. It is a home for soul-led practitioners.</p>
```

---

#### Section 2: Why We Call You Pollinators (Lines 539-543)
```html
<h2>Why We Call You Pollinators</h2>

<p>In nature, pollinators carry life between blossoms. At FloreSer.Life, our Pollinators — the Bees, Butterflies, Beetles, and Hummingbirds — do the same: guiding growth through wisdom, rhythm, and care.</p>

<p>Each archetype represents a way of serving, and together they form a vibrant ecosystem of transformation. When you join the Hive, you don't just list your work — you become part of a movement built on connection, reciprocity, and authenticity.</p>
```

---

#### Section 3: Why Join the Hive (Lines 546-570)
5 benefit cards:

**1. Visibility & Belonging**
> Be seen by a global community seeking authentic, grounded, holistic guidance. Your work is curated and celebrated.

**2. Ease & Flow**
> Scheduling, payments, and client communication in one intuitive place — so you can focus on your craft.

**3. Integrity & Trust**
> Every Pollinator is reviewed with care. We prioritize ethical practice, emotional safety, and transparency.

**4. Collective Growth**
> Join a circle that grows together through mentoring, co-creation opportunities, and shared visibility.

**5. Creative Equity**
> You remain the owner of your sessions and content. FloreSer.Life is the fertile ground that helps them bloom.

---

#### Section 4: Seasons of Practice (Lines 573-581)
```html
<h2>The Seasons of Practice</h2>

<ul>
  <li><strong>Emerging</strong> — New blossoms sharing fresh energy, curiosity, and care. Supported with mentoring and ethical foundations.</li>
  <li><strong>Evolving</strong> — Experienced guides refining their craft and expanding their reach while staying rooted in essence.</li>
  <li><strong>Rooted</strong> — Seasoned facilitators holding wisdom, depth, and steady presence.</li>
</ul>

<p class="muted">These are not ranks — they are seasons. Each one vital to the balance of our collective ecosystem.</p>
```

---

#### Section 5: The Hive Culture (Lines 584-604)
4 value cards:

**Integrity**
> Holding space with care, honesty, and respect.

**Authenticity**
> Guiding from lived experience, not performance.

**Presence**
> Being fully here — with yourself and those you serve.

**Co-Creation**
> Nurturing a field that flourishes through collaboration, not comparison.

---

#### Section 6: The Path to Join (Lines 607-616)
```html
<h2>The Path to Join</h2>

<ol>
  <li><strong>Apply</strong> — Share your background, offerings, and archetype resonance.</li>
  <li><strong>Connect</strong> — If aligned, meet us for a short conversation or onboarding call.</li>
  <li><strong>Create Your Hive Profile</strong> — Craft your story, session offerings, and welcome video.</li>
  <li><strong>Bloom</strong> — Once verified, your profile goes live — ready to connect, guide, and grow.</li>
</ol>

<a href="#">Start Your Application</a>
```

---

#### Section 7: Together, We Bloom (Lines 619-623)
```html
<h2>Together, We Bloom</h2>

<p>You are part of nature's great choreography of flourishing. If you guide from integrity, facilitate with joy, and serve from your center — the Hive is ready to welcome you. Together, we cross-pollinate insight, creativity, and care.</p>

<a href="#apply">Join the Hive</a>
```

---

## 🐝 MY HIVE DASHBOARD FEATURES

### Current File
`client/src/pages/hive.tsx` - Recently transformed, preserve UI/UX

### Features to Add

#### 1. Application & Onboarding Flow (My_Hive.md Lines 10-47)
**New Components Needed:**
- Application form with archetype selection
- Vetting process steps
- Digital signature for agreements
- Welcome email template integration
- Onboarding kit access (videos, templates, branding kit)
- Optional orientation call scheduling

**Implementation:**
- Create `components/hive/ApplicationFlow.tsx`
- Create `components/hive/OnboardingWizard.tsx`
- Add route: `/hive/apply`

---

#### 2. Soul Profile Enhancements (Lines 50-69)
**Current:** Basic profile display
**Add:**
- Archetype badge + level color
- "Facilitator Essence Quote" (hover display)
- Short story/bio (poetic tone)
- Offerings with poetic descriptions
- Testimonials section
- Languages spoken + location
- Profile photo + optional banner/video

**Implementation:**
- Update `components/hive/SoulProfile.tsx`
- Add hover state for essence quote
- Integrate testimonials display

---

#### 3. Session Management Tools (Lines 72-92)
**Currently Exists:** Basic session display
**Add:**
- Calendar integration (Google/native)
- Availability management
- Rescheduling/cancellations
- Post-session summary field (private notes)
- "Follow-up Recommended" toggle → triggers client message
- **Energy Level Tracker** (High/Balanced/Resting)

**Implementation:**
- Enhance existing session management
- Add `components/hive/EnergyLevelTracker.tsx`
- Add post-session form

---

#### 4. Payments & Invoicing (Lines 94-115)
**Currently Exists:** Basic earnings card
**Enhance with:**
- Total earnings display
- Upcoming payouts section
- Pending invoices list
- Commission % by facilitator tier
- Monthly revenue graph (already has bars visualization)
- **"Session Value Reflection"** field (optional notes)

**Implementation:**
- Expand payments dashboard
- Add invoices list view
- Add reflection field to session completion

---

#### 5. Messaging & Relationship Tools (Lines 118-137)
**New Features:**
- In-app chat with message templates:
  - "Thank you for your session"
  - "Follow-up invitation"
  - "Check-in after 7 days"
- Pre-session client form access
- File sharing (PDFs, audio)
- **"Reflections Journal"** private space

**Implementation:**
- Create `components/hive/MessagingCenter.tsx`
- Create `components/hive/ReflectionsJournal.tsx`
- Add message template system

---

#### 6. Collaboration & Referral Tools (Lines 140-157)
**New Features:**
- Refer Another Facilitator (generate link/form)
- Cross-Pollinate suggestions (joint sessions)
- Mentor Path option (badge + reward)
- Upload to Community Garden
- **Visibility Rewards** system:
  - "Facilitator of the Month" carousel
  - Boosted profile visibility
  - Reduced platform fee

**Implementation:**
- Create `components/hive/ReferralTools.tsx`
- Create `components/hive/VisibilityRewards.tsx`
- Add mentor matching system

---

#### 7. Analytics & Growth Tracking (Lines 160-171)
**Currently Exists:** "Your Blooming Metrics" card
**Enhance with:**
- Dashboard overview: sessions completed, retention rate, avg rating
- Insight cards: "Most booked day", "Returning clients", "Most resonant offering"
- **"Flourishing Index"**: gamified metric (contribution + testimonials + satisfaction)
- **Badge progression**: Emerging → Evolving → Rooted

**Implementation:**
- Expand analytics card
- Add `components/hive/FlourishingIndex.tsx`
- Create badge progression visualization

---

#### 8. Community Integration (Lines 174-183)
**New Section:**
- Access to Founder/Mentor Circle Calls
- Calendar of facilitator workshops
- News & Rituals section
- **Internal Notice Board** (open calls, collaborations, campaigns)

**Implementation:**
- Create `components/hive/CommunityIntegration.tsx`
- Add events calendar
- Add notice board component

---

## 🌸 MY GARDEN DASHBOARD FEATURES

### Current File
`client/src/pages/garden.tsx` - Recently transformed, preserve UI/UX

### Features to Add

#### 1. Welcome Layer (My_Garden.md Lines 14-31)
**New Components:**
- Welcome email template (triggered on signup)
- Video walkthrough embedding
- Intention selection prompt ("What would you like to tend this season?")
- Personal Maia message generation (based on archetype/onboarding)

**Implementation:**
- Create `components/garden/WelcomeFlow.tsx`
- Create `components/garden/IntentionSelector.tsx`
- Add Maia message generator

---

#### 2. Living Garden View (Lines 33-65)
**Currently Exists:** Growth tracker with flower
**Enhance with:**
- **Circular mandala** showing growth archetype
- **6-petal domains**:
  1. Body
  2. Emotion
  3. Mind
  4. Spirit
  5. Creativity
  6. Connection
- Next Session Card (already exists, enhance layout)
- Action Tiles:
  - Find a New Guide
  - My Favorites
  - Track My Growth
- **Maia/Angelica contextual messages** (appear after sessions/journaling)

**Implementation:**
- Update flower to 6 petals with domain labels
- Add action tiles grid
- Create `components/garden/MaiaMessage.tsx`

---

#### 3. Select & Book Sessions (Lines 67-83)
**Currently Exists:** Practitioners page
**Enhance with:**
- Filter by intention (Relaxation, Clarity, Expansion, etc.)
- Smart recommendations: "Because you loved..."
- Ritual-toned confirmation page: "Your seed is planted. See you soon."

**Implementation:**
- Add intention filter to practitioners page
- Create `components/garden/SessionConfirmation.tsx`
- Add recommendation engine

---

#### 4. Payment & Session Access (Lines 85-98)
**Currently Exists:** Basic payment handling
**Add:**
- Stored payment method display
- View invoices/receipts
- Zoom/in-app session link (auto-generated)
- Reminder notifications (24h before)
- **Golden leaf progress indicator** (fills as session nears)

**Implementation:**
- Enhance payment dashboard
- Add countdown/progress indicator
- Create session link generator

---

#### 5. Growth Timeline "Your Bloom Path" (Lines 100-128)
**CRITICAL DIFFERENTIATOR** - Unique feature

**Visual:**
- Circular vine with blooms for each completed session
- Hover shows: date, facilitator, theme, takeaway, reflection notes
- **Pollination points** system:
  - 1 bloom = 1 seed sprouted
  - 3 blooms = "Rising Flower" badge
  - 7 blooms = "Flourishing Path" milestone

**Self-Development Archetype Tracker:**
- Stages: Seed → Sprout → Blossom → Fruit → Forest
- Upgrades through engagement + reflection completion
- Each stage unlocks Maia/Angelica messages + journal prompts

**Implementation:**
- Create `components/garden/BloomPathTimeline.tsx`
- Create `components/garden/PollinationPoints.tsx`
- Create `components/garden/ArchetypeTracker.tsx`
- Add SVG circular vine visualization

---

#### 6. Reflections & Follow-Up Journeys (Lines 130-158)
**After Session Completion:**

**Feedback Screen:**
- 1-5 stars
- Open reflection: "What did you feel opened within you?"
- Checkbox: "Would you like to continue this journey?"

**Personalized Path Suggestion:**
- "Would you like to continue exploring your Inner Child with Angelica?"
- Links to recommended facilitator/content

**Mini Ritual:**
- Maia: grounding poem, journaling prompt
- Angelica: uplifting reflection, next-step suggestion
- Example: *"Growth is not always loud. Sometimes it whispers through your choices." – Maia*

**Implementation:**
- Create `components/garden/PostSessionFeedback.tsx`
- Create `components/garden/PathSuggestions.tsx`
- Create `components/garden/MiniRitual.tsx`

---

#### 7. Journal & Reflections Section (Lines 160-170)
**New Feature:**
- Integrated private journal
- Editable entries linked to sessions
- Optional prompts after milestones
- **PDF export**: "My Garden of Becoming"
- AI synthesis (optional): "You seem to be moving from grounding toward expansion."

**Implementation:**
- Create `components/garden/JournalSystem.tsx`
- Add session-linked entries
- Add PDF export functionality
- Add Maia AI synthesis (placeholder for future)

---

#### 8. Favorites & Reviews (Lines 172-178)
**Currently Exists:** Heart icon toggle
**Enhance:**
- Saved list under "My Guides"
- Leave testimonials with prompt: "What shifted for you after this session?"
- Display reviews on facilitator Soul Profile

**Implementation:**
- Add favorites list view
- Create review submission form
- Link to facilitator profiles

---

#### 9. Upgrades & Membership Path (Lines 180-193)
**Symbolic Levels:**
- Seed → Sprout → Bloom → Fruit → Forest

**Each unlock includes:**
- New Maia/Angelica message
- Access to deeper content (recordings, workshops)
- Personalized badge animation

**Implementation:**
- Create `components/garden/MembershipProgress.tsx`
- Add level-up animations
- Create badge system

---

#### 10. Emotional Touches (Lines 195-209)
**Micro-interactions:**
- Sprout unfurling animation on reflection completion
- Ambient nature sounds (optional)
- Notifications in FloreSer voice:
  - "Your next bloom opens tomorrow."
  - "You've just planted your 5th seed. Beautiful work."
  - "Angelica whispers: keep expanding."

**Implementation:**
- Add Framer Motion animations for growth
- Create notification toast system with custom messages
- Add optional ambient audio

---

## 🎨 TERMINOLOGY UPDATES

**Global Find & Replace (User-Facing Copy Only):**

| Old Term | New Term | Context |
|----------|----------|---------|
| Practitioner | Pollinator | User-facing copy (keep in code/database) |
| Client | Seeker | User-facing copy (keep in code/database) |
| Rising | Emerging | Experience level |
| Wise | Rooted | Experience level |
| Evolving | Evolving | ✅ Keep as-is |
| Progress | Bloom Path | Growth tracking |
| Journey | Becoming | Transformation context |

**Note:** Keep technical terms like "practitioner" in code/API, but use "Pollinator" in all UI text.

---

## 📐 DESIGN PRESERVATION RULES

**MUST PRESERVE from recent transformation:**
- ✅ All HIVE/GARDEN color palettes
- ✅ Typography scale (text-page-heading, text-card-heading, etc.)
- ✅ Spacing system (p-8, space-y-6, etc.)
- ✅ Shadow system (shadow-card, shadow-card-md, etc.)
- ✅ Border radius (rounded-card, rounded-button, etc.)
- ✅ Framer Motion animations
- ✅ Sidebar layout
- ✅ Card-based designs
- ✅ Existing component structure

**SAFE TO UPDATE:**
- ✅ Text content (copy, messaging)
- ✅ Add new cards/sections (using existing patterns)
- ✅ Add new features (following established UI patterns)
- ✅ Navigation labels
- ✅ Button text
- ✅ Microcopy

---

## 🚀 IMPLEMENTATION PRIORITY

### Phase 1: Essential (Week 1)
1. ✅ Landing page hero + archetype cards
2. ✅ Join the Hive page creation
3. ✅ Terminology updates across site
4. Update Hive session management
5. Add Garden Bloom Path timeline skeleton

### Phase 2: Important (Week 2)
1. Hive payments dashboard enhancement
2. Garden growth mandala (6 petals)
3. Maia contextual messages system
4. Journal system with session linking
5. Post-session feedback flow

### Phase 3: Growth (Week 3)
1. Hive referral tools
2. Hive community integration
3. Garden membership progression
4. PDF export functionality
5. Badge animations

### Phase 4: Polish (Week 4)
1. Energy Level Tracker
2. Visibility Rewards
3. Mini rituals
4. Growth animations
5. Ambient sound (optional)

---

## 🔧 TECHNICAL NOTES

### New Routes Needed
```typescript
// Add to router
/join-the-hive          → JoinTheHive page
/hive/apply             → Application flow
/hive/journal           → Reflections journal
/hive/community         → Community integration
/garden/bloom-path      → Timeline view
/garden/journal         → Private journal
/garden/membership      → Membership progress
```

### New Components Structure
```
client/src/components/
├── landing/
│   ├── ArchetypeCard.tsx (with Latin names + badges)
│   ├── SeasonsOfPractice.tsx
│   └── WhatAwaitsInside.tsx
├── join/
│   ├── JoinHero.tsx
│   ├── BenefitCards.tsx
│   ├── HiveCulture.tsx
│   └── PathToJoin.tsx
├── hive/
│   ├── EnergyLevelTracker.tsx
│   ├── ReflectionsJournal.tsx
│   ├── ReferralTools.tsx
│   ├── FlourishingIndex.tsx
│   ├── VisibilityRewards.tsx
│   └── CommunityIntegration.tsx
├── garden/
│   ├── BloomPathTimeline.tsx
│   ├── GrowthMandala.tsx (6 petals)
│   ├── MaiaMessage.tsx
│   ├── JournalSystem.tsx
│   ├── PostSessionFeedback.tsx
│   ├── MiniRitual.tsx
│   ├── ArchetypeTracker.tsx
│   └── MembershipProgress.tsx
└── shared/
    ├── PollinatorBadge.tsx
    ├── GrowthAnimation.tsx
    └── SeasonBadge.tsx
```

### API Endpoints Needed (Backend)
```
POST /api/journal/entries          - Create journal entry
GET  /api/journal/entries/:userId  - Get user journal
POST /api/feedback/session         - Submit post-session feedback
GET  /api/growth/bloom-path/:userId - Get bloom path data
POST /api/maia/generate-message    - Generate Maia message
GET  /api/membership/progress/:userId - Get membership level
POST /api/referrals/generate       - Generate referral link
GET  /api/community/events         - Get community events
POST /api/energy-level             - Update facilitator energy
GET  /api/analytics/flourishing-index/:userId - Get flourishing score
```

---

## ✅ CONTENT ACCURACY CHECKLIST

Before marking complete, verify:

- [ ] All archetype Latin names are correct
- [ ] All badge text matches exactly ("You look to feel safe...")
- [ ] "Dear One" greeting is used
- [ ] "Emerging/Evolving/Rooted" terminology (not Rising/Wise)
- [ ] "Pollinator/Seeker" in user-facing copy
- [ ] "Bloom Path" instead of "Progress"
- [ ] "Becoming" instead of "Journey" where appropriate
- [ ] Footer tagline: "Where growth is sacred and flourishing is your birthright"
- [ ] mAIa spelled correctly (lowercase 'm', uppercase 'AI', lowercase 'a')

---

**Next Step**: Begin Phase 1 implementation with landing page updates and Join the Hive page creation.

**Estimated Total Work**: 3-4 weeks for complete integration
**Current Status**: Mapping complete, ready to implement
