# Visionary Path Services — Design System

> Version 2.0 | September 2026 | Load order: `design-system.css` → `style.css` → `improvements.css`

The canonical reference for all design decisions, component patterns, and engineering standards for the Visionary Path Services website.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Color System](#color-system)
3. [Typography System](#typography-system)
4. [Spacing System](#spacing-system)
5. [Layout & Grid](#layout--grid)
6. [Border Radius](#border-radius)
7. [Shadow System](#shadow-system)
8. [Z-Index System](#z-index-system)
9. [Motion & Animation System](#motion--animation-system)
10. [Component Library](#component-library)
11. [Page Templates](#page-templates)
12. [Accessibility Standards](#accessibility-standards)
13. [CSS Architecture](#css-architecture)
14. [Contribution Guidelines](#contribution-guidelines)

---

## Architecture Overview

### CSS Load Order (Mandatory)

Every HTML page must load CSS in this exact order:

```html
<link rel="stylesheet" href="[root]css/design-system.css">  <!-- 1. Canonical tokens FIRST -->
<link rel="stylesheet" href="[root]css/style.css">          <!-- 2. Base components -->
<link rel="stylesheet" href="[root]css/improvements.css">   <!-- 3. Refinements, fixes -->
```

The `sync-components.js` build script automatically enforces this order on all 27 pages via `npm run sync`.

### File Responsibilities

| File | Purpose |
|---|---|
| `css/design-system.css` | **Single source of truth** for ALL CSS custom properties (tokens) |
| `css/style.css` | Base component definitions — navbar, hero, cards, buttons, footer, popup |
| `css/improvements.css` | Refinements, consistency fixes, page-extracted styles, P0 bug fixes, motion system |
| `js/motion-ux.js` | Scroll reveals, navbar elevation, animated counters, lazy loading |
| `js/main.js` | Navigation interactions, popup modal, mega dropdown |
| `js/calculators.js` | EMI and eligibility calculator logic |
| `includes/navbar.html` | Shared navbar — synced to all 27 pages via `npm run sync` |
| `includes/footer.html` | Shared footer — synced to all 27 pages |
| `scripts/sync-components.js` | Build: pushes navbar, footer, CSS links to all pages |
| `scripts/production-audit.js` | 401-check regression guard — 0 errors required before release |

### Build Commands

```bash
npm run sync    # Push shared navbar + footer + CSS links to all 27 HTML pages
npm test        # 162 automated structural checks, 0 errors required
npm run audit   # 401 production quality checks, 0 errors required
```

---

## Color System

### Brand Palette (Raw Scale)

Defined in `css/design-system.css`. Use semantic tokens in component code — not raw hex.

| Token | Value | Use |
|---|---|---|
| `--vps-navy-900` | `#0a1d37` | Primary brand — authority, trust |
| `--vps-navy-950` | `#050d1a` | Darkest navy |
| `--vps-green-800` | `#047857` | Deep emerald — light surfaces (5.58:1 on white) |
| `--vps-green-600` | `#10b981` | Action green — CTAs, icons |
| `--vps-green-500` | `#34d399` | Mint — **dark/hero surfaces ONLY** (8.5:1+ on navy) |
| `--vps-blue-700` | `#1a56db` | Primary blue — secondary actions |
| `--vps-blue-600` | `#2563eb` | Focus ring blue |

### Semantic Tokens (Use These in Components)

```css
var(--color-primary)        /* #0a1d37 — brand navy */
var(--color-text)           /* Heading text */
var(--color-text-body)      /* Body copy */
var(--color-text-muted)     /* Captions, meta — 7.1:1 on white */
var(--color-surface)        /* #ffffff — cards, modals */
var(--color-surface-soft)   /* #f8fafc — page background */
var(--color-surface-dark)   /* #0a1d37 — dark sections */
var(--color-green)          /* Primary green action */
var(--color-green-dark)     /* Deep emerald for light surfaces */
var(--color-green-light)    /* Mint for dark surfaces */
var(--color-blue)           /* Secondary action blue */
var(--color-border)         /* #e2e8f0 — default border */
var(--color-border-strong)  /* #cbd5e1 — hover/active border */
var(--color-focus-ring)     /* #2563eb — WCAG 2.2 compliant */
```

### Green Color Usage Rules

| Context | Token | Hex | Contrast |
|---|---|---|---|
| Light surface (default page) | `--color-green-dark` | `#047857` | 5.58:1 on white ✅ |
| Dark hero / navy background | `--color-green-light` | `#34d399` | 8.5:1+ on navy ✅ |
| Action buttons | `--color-green` | `#10b981` | White text required |
| Footer (dark bg) | `#34d399` | — | 8.5:1+ ✅ |

> ⚠️ Never use `#10b981` mint on white — contrast is only 2.1:1 (WCAG FAIL).

---

## Typography System

### Font Stack

```css
font-family: var(--font-display); /* Poppins — headings */
font-family: var(--font-body);    /* Poppins — body copy */
font-family: var(--font-mono);    /* System mono — code */
```

### Fluid Heading Scale

```css
--heading-hero:  clamp(2.1rem, 4.2vw, 3.2rem)   /* Page hero H1 */
--heading-h1:    clamp(1.85rem, 3.5vw, 2.8rem)   /* Section hero */
--heading-h2:    clamp(1.5rem, 3vw, 2.25rem)     /* Section titles */
--heading-h3:    clamp(1.1rem, 1.5vw, 1.35rem)   /* Card titles */
```

### Weight & Spacing Rules

- **H1 weight**: 800 | letter-spacing: `-0.025em`
- **H2 weight**: 800 | letter-spacing: `-0.02em`
- **H3 weight**: 700 | letter-spacing: `-0.015em`
- **Body weight**: 400 | font-size: 16px minimum
- **Button/label weight**: 600
- **Financial numerals**: always `font-variant-numeric: tabular-nums`

---

## Spacing System

Based on 4px unit. Never use raw pixel values for layout spacing in new code.

| Token | Value | Token | Value |
|---|---|---|---|
| `--space-1` | 4px | `--space-10` | 40px |
| `--space-2` | 8px | `--space-12` | 48px |
| `--space-3` | 12px | `--space-16` | 64px |
| `--space-4` | 16px | `--space-20` | 80px |
| `--space-6` | 24px | `--space-24` | 96px |
| `--space-8` | 32px | | |

### Section Rhythm

```css
--space-section:        72px  /* Standard section padding */
--space-section-lg:     96px  /* Hero sections */
--space-section-mobile: 44px  /* Auto-applied on mobile */
```

---

## Layout & Grid

```css
--container-width:   1200px   /* Max content width */
--container-narrow:  820px    /* Article/legal */
--container-reading: 72ch     /* Blog/article prose */
```

Common patterns:
```css
/* Responsive card grid */
grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 28px;

/* Two-column content */
grid-template-columns: 1fr 1fr; gap: 48px;

/* Article + sidebar */
grid-template-columns: 1fr 320px; gap: 48px;
```

---

## Border Radius

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 4px | Chips, progress bars |
| `--radius-sm` | 8px | Tags, badges |
| `--radius-md` | 12px | Standard cards, inputs |
| `--radius-lg` | 16px | Large cards, modals |
| `--radius-xl` | 24px | Hero cards |
| `--radius-full` | 9999px | Pills, circles |

---

## Shadow System

```css
--shadow-xs    /* Card default — subtle depth */
--shadow-sm    /* Card hover */
--shadow-md    /* Modals, elevated panels */
--shadow-lg    /* Floating elements */
--shadow-xl    /* Popups, overlays */
--shadow-green-sm / -md   /* Green CTA button glow */
--shadow-navy-md           /* Navy active state glow */
```

---

## Z-Index System

| Token | Value | Element |
|---|---|---|
| `--z-base` | 0 | Normal flow |
| `--z-sticky` | 100 | Sticky |
| `--z-header` | 1000 | Navbar |
| `--z-dropdown` | 1001 | Mega menus |
| `--z-modal` | 9001 | Modals |
| `--z-float` | 9999 | Floating WhatsApp/CTA |
| `--z-top` | 10000 | Scroll progress bar |

---

## Motion & Animation System

### Motion Tokens

```css
--motion-fast:     0.15s   /* Quick micro-interactions */
--motion-base:     0.22s   /* Standard transitions */
--motion-slow:     0.35s   /* Reveals */
--ease-spring:     cubic-bezier(0.16, 1, 0.3, 1)   /* Premium feel */
--ease-enter:      cubic-bezier(0, 0, 0.2, 1)       /* Reveals in */
--transition-bounce: 0.22s spring                    /* Card lifts */
```

### Scroll Reveal System

`motion-ux.js` observes cards via IntersectionObserver and adds `.motion-init` / `.motion-revealed`:

```css
.motion-init { opacity: 0; transform: translateY(18px); }
.motion-revealed { opacity: 1; transform: translateY(0); }
```

Auto-animated components: `.pan-card`, `.why-feature-card`, `.country-card`, `.core-card`, `.mbbs-card`, `.lender-card`, `.process-step`, `.process-card`, `.loan-card`, `.service-card`, `.blog-card`, `.contact-method-card`, `.country-stat-box`, `.faq-item`

Stagger: 60ms × child index inside grid containers.

### Navbar Scroll Elevation

Added by JS when `window.scrollY > 20`:
```css
.navbar.scrolled-elevated {
    box-shadow: 0 4px 24px -4px rgba(10,29,55,0.10);
    backdrop-filter: saturate(1.4) blur(12px);
    background: rgba(255, 255, 255, 0.96);
}
```

All animations respect `prefers-reduced-motion: reduce`.

---

## Component Library

### Buttons

```html
<a class="btn btn-primary">Primary</a>
<a class="btn btn-secondary">Secondary</a>
<a class="btn btn-whatsapp">WhatsApp CTA</a>
<a class="btn btn-hero-primary">Hero Primary</a>   <!-- inside .exact-hero only -->
<a class="btn btn-hero-secondary">Hero Secondary</a>  <!-- inside .exact-hero only -->
<a class="btn btn-lg">Large</a>
<a class="btn btn-sm">Small</a>
```

All buttons: min-height 44px (WCAG touch target), font-weight 600.

### Cards

```html
<div class="card card--interactive">
    <h3>Title</h3>
    <p>Body</p>
</div>
```

Modifiers: `card--elevated`, `card--outlined`, `card--interactive`, `card--featured`

### Hero Sections

**Homepage** (`.exact-hero`): White background, two-column with snapshot card. Green highlights use `#047857`.

**Inner pages** (`.page-hero`): Navy background with breadcrumbs. Green highlights use `#34d399` (mint).

```html
<header class="page-hero">
    <div class="container">
        <nav class="breadcrumb-nav" aria-label="Breadcrumb">...</nav>
        <h1>Page <span class="green-highlight">Title</span></h1>
        <p class="exact-hero-lead">Lead text.</p>
    </div>
</header>
```

### Navigation

Edit `includes/navbar.html` → run `npm run sync` → auto-updates all 27 pages.

`{{ROOT}}` placeholder replaced with relative path by sync script.

### Footer

Edit `includes/footer.html` → run `npm run sync`.

> ⚠️ The `<details>/<summary>` regulatory disclaimer accordion must be preserved. Do NOT replace with JS accordion.

### Badges & Tags

```html
<!-- Eyebrow pill (light surface) -->
<span class="eyebrow-pill">Services</span>

<!-- Eyebrow pill (dark surface) -->
<div class="page-hero-eyebrow dark-surface"><span class="eyebrow-pill">Blog</span></div>

<!-- Country stat -->
<div class="country-stat-box">
    <div class="country-stat-val">$50K</div>
    <div class="country-stat-lbl">Max Loan</div>
</div>

<!-- University tag -->
<span class="uni-tag"><i class="fas fa-university"></i> Harvard</span>
```

### Forms

All inputs: 44px min-height, Poppins font, `:focus-visible` ring at 2px solid `#2563eb` with 3px offset.

```html
<div class="form-group">
    <label for="name">Full Name</label>
    <input type="text" id="name" placeholder="Your name">
</div>
```

---

## Page Templates

### Standard Inner Page Head

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="../favicon.svg">
    <title>Page Title – Visionary Path Services</title>
    <meta name="description" content="...">
    <link rel="canonical" href="https://www.visionarypathservices.com/pages/page.html">
    <meta property="og:title" content="...">
    <meta property="og:description" content="...">
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins..." rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <!-- CSS — ORDER IS MANDATORY -->
    <link rel="stylesheet" href="../css/design-system.css">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/improvements.css">
    <!-- NO <style> blocks, NO AOS without init -->
</head>
```

### Country Page — Additional Sections

- `.country-stats-grid` with `.country-stat-box` items
- `.universities-grid` with `.uni-tag` items
- Breadcrumb required

### Blog Article Layout

- `.article-grid` (1fr 320px) — collapses to single column at 1024px
- `.article-sidebar` with `position: sticky; top: 96px`
- Prose in `.article-content` — max-width `72ch`

---

## Accessibility Standards

| Criterion | Requirement |
|---|---|
| Color contrast (body text) | ≥ 4.5:1 — `#1e293b` on white = 12.6:1 ✅ |
| Green on light surface | `#047857` = 5.58:1 on white ✅ |
| Green on dark surface | `#34d399` = 8.5:1+ on navy ✅ |
| Touch targets | All buttons/links ≥ 44×44px |
| Focus ring | 2px solid `#2563eb`, 3px offset, on all interactive elements |
| Skip link | `<a href="#mainContent" class="skip-link">` on every page |
| Modal ARIA | `role="dialog"`, `aria-modal="true"`, `aria-label` |
| Reduced motion | `prefers-reduced-motion: reduce` disables all animations |
| Semantic HTML | `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>` |
| Single H1 | Enforced by `production-audit.js` |
| Alt text | All `<img>` require `alt=""` — enforced by audit |
| Breadcrumbs | Required on all inner pages — enforced by audit |

---

## CSS Architecture

### Token Hierarchy

```
design-system.css  (canonical root)
├── Raw scale  (--vps-navy-*, --vps-green-*, ...)
├── Semantic   (--color-primary, --color-text-muted, ...)
├── BC aliases (--navy → --vps-navy-900, etc.)
└── System     (motion, spacing, radius, shadow, z-index)

style.css      → uses only var() from design-system.css
improvements.css → uses only var() from design-system.css
```

### !important Policy

Permitted ONLY for:
1. Contextual overrides (`.exact-hero .green-highlight` vs `.green-highlight`)
2. Accessibility (`prefers-reduced-motion`)
3. Scroll locks (`body.menu-open`, `body.modal-open`)

Never use `!important` to fight a specificity battle. Write more specific selectors instead.

### Rules

```css
/* ❌ Never redefine tokens */
:root { --color-primary: #0a1d37; }

/* ❌ Never raw hex for brand colors in components */
color: #0a1d37;

/* ❌ Never inline <style> blocks in HTML */
<style>.my-section { ... }</style>

/* ❌ Never load AOS without AOS.init() */
<link href="aos@2.3.1/dist/aos.css">

/* ✅ Use tokens */
color: var(--color-primary);
```

---

## Contribution Guidelines

### Adding a New Component

1. Add CSS to `improvements.css` with a numbered section comment
2. Use only `var()` token references — no raw brand hex values
3. If scroll-reveal needed: add selector to `motion-ux.js` `revealTargets` and `cardContainers`
4. Run `npm run sync && npm test && npm run audit` — must pass 0 errors

### Editing Navbar or Footer

1. Edit `includes/navbar.html` or `includes/footer.html`
2. Run `npm run sync` — auto-propagates to all 27 pages
3. Run `npm test && npm run audit`

### Adding a New Page

1. Copy the closest existing page template
2. Ensure `design-system.css` is the first CSS link (sync script enforces this)
3. Use `<!-- VPS_NAVBAR_START/END -->` and `<!-- VPS_FOOTER_START/END -->` markers
4. Run `npm run sync && npm test && npm run audit`

---

## Bug History

### P0 Bugs Fixed (September 2026)

| Bug | Root Cause | Fix |
|---|---|---|
| Scroll reveals never fired | `.motion-init`/`.motion-revealed` classes added by JS but no CSS defined their behavior | CSS added in `improvements.css` |
| Navbar elevation never triggered | `.scrolled-elevated` added by JS but no CSS for it | CSS added in `improvements.css` |
| Card hover transitions broken | `--transition-bounce` referenced but never defined | Defined in `design-system.css` |
| Hero section broken silently | `--vps-navy`, `--vps-green`, `--vps-blue`, `--vps-border`, `--vps-shadow-xs/sm` never declared | Defined as aliases in `design-system.css` |

### Regression Guard (production-audit.js)

These bugs are now guarded by checks 3a-1 through 3a-6 in `scripts/production-audit.js`. The audit must pass 0 errors before any release.
