---
name: Kinetic Editorial Festival
colors:
  surface: '#fcf9f3'
  surface-dim: '#dcdad4'
  surface-bright: '#fcf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ed'
  surface-container: '#f0eee8'
  surface-container-high: '#ebe8e2'
  surface-container-highest: '#e5e2dc'
  on-surface: '#1c1c18'
  on-surface-variant: '#5d3f3c'
  inverse-surface: '#31312d'
  inverse-on-surface: '#f3f0ea'
  outline: '#926f6b'
  outline-variant: '#e7bdb8'
  surface-tint: '#c00014'
  primary: '#9c000e'
  on-primary: '#ffffff'
  primary-container: '#c90016'
  on-primary-container: '#ffd7d2'
  inverse-primary: '#ffb4ab'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#9c0019'
  on-tertiary: '#ffffff'
  tertiary-container: '#c90023'
  on-tertiary-container: '#ffd7d4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000d'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#930017'
  background: '#fcf9f3'
  on-background: '#1c1c18'
  surface-variant: '#e5e2dc'
typography:
  display-hero:
    fontFamily: Anton
    fontSize: 120px
    fontWeight: '400'
    lineHeight: 108px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Anton
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 54px
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Anton
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: 0em
  headline-xl-mobile:
    fontFamily: Anton
    fontSize: 38px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: 0em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 20px
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-ticker:
    fontFamily: Anton
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.05em
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 3rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 2rem
  space-xl: 4rem
---

## Brand & Style
The design system establishes a high-voltage, editorial visual language for a flagship collegiate technology festival. It unifies underground creative energy with the architectural rigor of an elite global tech summit. 

The aesthetic operates at the intersection of Swiss brutalist publishing, avant-garde club posters, and raw terminal diagnostic tools. It rejects sanitized corporate gradients and generic SaaS card grids in favor of stark typographic scale, aggressive structural borders, monospaced metadata, and asymmetric editorial broadsheet layouts.

### Emotional Objectives
- **Urgent & Visceral:** Unforgiving scale and high-impact typographic pacing ignite immediate anticipation and campus-wide energy.
- **Architecturally Precise:** Monospaced telemetry tags, razor-sharp registration marks, and disciplined dividing lines create structural discipline.
- **Cultural & Underground:** Asymmetric block breaks, editorial ticker tapes, and poster-format hero treatments resonate directly with next-generation builders, hackers, and creators.

## Colors
The system adheres to an intentional 60:30:10 structural color hierarchy that balances warm editorial paper tones against heavy ink blocks and electric warning signals.

- **60% Foundation (`#F5F2EC` Warm Cream):** The predominant canvas surface. Provides an archival, editorial texture distinct from clinical sterile whites.
- **30% Structural Contrast (`#111111` Deep Carbon / `#252525` Dark Grey):** Used for inverted thematic tracks, hero poster backdrops, footer monuments, and structural grid frames.
- **10% Kinetic Accents (`#C90016` Primary Red & `#FF1A35` Electric Crimson Glow):** Reserved strictly for critical kinetic moments: active states, live countdowns, sold-out badges, laser rules, and interactive triggers.

```
Base Canvas:        #F5F2EC (Warm Off-White)
Base Surface Muted: #E8E5DF (Neutral Border & Subtle Fill)
Base Text / Ink:    #111111 (Deep Black)
Sub-surface / Dark: #252525 (Dark Charcoal)
Primary Action:     #C90016 (Deep Scarlet)
Primary Hover:      #A90012 (Deep Oxide Red)
High-Voltage Neon:  #FF1A35 (Electric Crimson)
```

### Application Rules
1. **No Gradients:** Colors must never be applied via soft multi-stop radial or linear gradients. Transitions are sharp, discrete, and separated by 1px rules.
2. **Inverted Track Containers:** Specific schedule tracks or experimental stages invert entirely into the 30% deep charcoal base with warm cream typography and electric crimson indicators.

## Typography
Typography carries the primary emotional weight of the interface, employing three deliberate type families:

1. **Display (Anton):** Used strictly in uppercase for oversized impact headlines, stage dates, ticket tiers, and running marquee headers. Letterforms are tight, industrial, and unyielding.
2. **Secondary & Editorial Structural (Space Grotesk):** Provides an engineered, tech-forward voice for subheadings, speakers, panel names, and primary section hooks.
3. **Telemetry & Meta (JetBrains Mono):** Drives the terminal identity. Used for schedule timestamps, system tags (e.g. `[SYS:2027]`, `[STAGE:MAIN]`, `[CAPACITY:084%]`), and operational prompts.
4. **Body (Inter):** High-density readability for descriptive summaries, speaker bios, and rules of engagement.

### Typographic Rules
- **Display Case:** All `display-hero`, `headline-xl`, and `label-ticker` styles must be rendered in `text-transform: uppercase`.
- **System Brackets:** Labels and counters rendered in `JetBrains Mono` must always be enclosed in architectural square brackets (e.g., `[01/08]`, `[STATUS:CONFIRMED]`).

## Layout & Spacing
The layout uses an asymmetrical, high-density editorial grid system inspired by broadsheet print newspapers and experimental poster art.

### Grid Framework
- **Desktop (1024px+):** 12-column dynamic fluid grid with a fixed `3rem` canvas margin and `1.5rem` structural gutters. Columns are punctuated by visible `1px solid #E8E5DF` (or `#252525` on dark zones) border dividers.
- **Tablet (768px - 1023px):** 6-column grid with `2rem` outer margins and `1rem` gutters.
- **Mobile (<768px):** 2-column or single-column stack with `1rem` outer canvas padding. Elements break across full bleed to preserve poster-like density.

### Editorial Structural Rules
- **Hard Rule Dividers:** Sections are separated by continuous full-width 1px hairline rules instead of empty floating whitespace.
- **Asymmetric Spans:** Avoid symmetric cards. Standard layouts pair a wide 8-column primary showcase with a dense 4-column telemetry index.
- **Marquee Ribbons:** Full-bleed endless horizontal marquee ticker tapes running Anton text run edge-to-edge between disparate festival stages.

## Elevation & Depth
This design system rejects conventional blurry drop shadows, pillowy elevations, and multi-layer translucent glassmorphism. It models physical print production, silkscreen posters, and brutalist machine architecture.

### Elevation Principles
- **No Diffuse Shadows:** Elements do not float on soft clouds. Depth is achieved via crisp planar shifts, hard offset shadow blocks, and tonal inversion.
- **Hard Offset Blocks (Brutalist Depth):** When an element requires tactile priority (such as a primary CTA or active pass card), use a hard-edged, zero-blur 4px offset in solid `#111111`:
  ```css
  box-shadow: 4px 4px 0px 0px #111111;
  ```
- **Surface Inversion:** Major schedule days or stages do not elevate via Z-index; they flip contrast completely from `#F5F2EC` (warm cream) to `#111111` (deep black) canvas with `#E8E5DF` hairline dividers.
- **Tactile Outlines:** All modular cells and schedule slots feature razor-sharp 1px structural borders using `#E8E5DF` (on light) and `#252525` (on dark).

## Shapes
The shape language is strictly **Sharp (Level 0)**.

- **Zero Radius:** Buttons, content modules, banners, tabs, and input fields have `border-radius: 0px`. Corners are hard, industrial, and definitive.
- **The Only Exception (Pill Badges):** A single specialized component—the status pill badge—utilizes a fully rounded shape (`border-radius: 9999px`) to create intentional geometric contrast against the absolute grid.
- **Technical Chamfers (Optional):** Corner notches or 45-degree angled cuts (4px to 8px) are permitted on stage badges and terminal alert boxes to evoke pass lanyards and punch-cards.

## Components

### Buttons & Interactive Triggers
- **Primary Action (Ticket/Registration):**
  - Shape: Rectangular, 0px radius, 1.5px border `#111111`.
  - Fill: `#C90016` (Primary Red) with `#F5F2EC` bold uppercase text.
  - Hover: Background snaps to `#111111`, text to `#FF1A35`, accompanied by a sharp `3px 3px 0px #FF1A35` hard shadow shift.
- **Secondary / Ghost Action:**
  - Shape: Rectangular, 1px border `#111111`.
  - Fill: Transparent.
  - Hover: Inverts to solid `#111111` fill with `#F5F2EC` text.

### Technical Metadata Tags & Badges
- **Terminal Tags:** Monospaced (`JetBrains Mono`, 12px), styled as `[SYS:2027]`, `[STAGE:ARENA_01]`, or `[LIVE]`. Background is `#E8E5DF` or `#252525` with 0px radius and 4px 8px padding.
- **Status Pills:** Pill-shaped (`border-radius: 9999px`), 1px solid stroke, featuring a pulsing 6px circular dot indicator in `#FF1A35` or `#C90016`.

### Cards & Grid Modules
- **Modular Festival Cell:**
  - Zero border-radius, bordered by `1px solid #E8E5DF` (on cream) or `1px solid #252525` (on dark).
  - Internal padding: `space-lg` (2rem).
  - Upper meta bar: Stage number + time stamp in `JetBrains Mono` aligned left and right.
  - Core content: Anton headline, followed by an Inter body excerpt.
  - Hover state: Background subtly shifts from `#F5F2EC` to `#FFFFFF` with no soft blur shadow.

### Input Fields & Terminal Search
- Flat surface in `#F5F2EC`, bottom border or full border of `1.5px solid #111111`.
- Placeholder text in muted `JetBrains Mono` uppercase.
- Focus state: Border turns `#C90016` with a hard 2px solid red indicator, no glowing browser halo.

### Continuous Running Marquee
- Full-bleed band pinned between sections.
- Background: `#111111` or `#C90016`.
- Typography: `Anton`, 24px uppercase, running continuously with `*` or `///` delimiters separating announcements, campus clubs, and stage track names.

### Checkboxes & Radio Selectors
- Sharp 0px corners, 1.5px border `#111111`.
- Checked state: Filled with `#C90016` featuring a sharp white geometric cross or inner square.