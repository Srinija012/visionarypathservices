# Visionary Path Services — Master Design System Specification

> Version 3.1 | Master Brand & UI/UX Consistency Specification | Load order: `design-system.css` → `style.css` → `improvements.css`

The canonical design system, brand identity guide, and engineering standard for **Visionary Path Services (VPS)**.

---

## 1. Brand Identity & Positioning

### Positioning
- **Primary Domain**: Education Loans (Domestic, Study Abroad, MBBS)
- **Extended Advisory**: Personal Loans, Home Loans, Forex
- **Positioning Statement**: *"Your Vision. Our Path. Your Future."*
- **Aesthetic Core**: *"Premium Financial Advisory + Modern Technology + Human Trust"* (Tier-1 Indian Financial Institution aesthetic; clean, calm, authoritative, not a generic SaaS or noisy infographic).

### Master Brand Proportions (The 70 / 20 / 10 Rule)
- **70% White / Off-White (`#FFFFFF`, `#F7F9FB`)**: Large clean canvas, generous breathing room, accessible WCAG contrast.
- **20% Navy (`#0B1F33`, `#123A63`)**: Institutional authority, headings, primary navigation, trust foundations.
- **10% Brand Orange (`#FF5A00` / `#FF8A00`)**: Energetic conversion accents, primary CTAs, interactive highlights, brand mark.
- **Strict Green Rule (`#16A765` / `#047857`)**: Green is strictly reserved for WhatsApp contact triggers, positive success states, and verified checkmarks. It is never used as a generic background or primary button color.

---

## 2. Typography Standard (Global Rule)

All 27 pages strictly adhere to a unified two-typeface typographic system:

| Role | Font Family | Weights | Usage |
|---|---|---|---|
| **Headings & Display** | `Manrope` | 800 (Bold), 700 (Semi-bold), 600 (Medium) | `h1`–`h6`, section titles, hero headlines, stat numerals, button labels, badge titles |
| **Body & Functional UI** | `Inter` | 400 (Regular), 500 (Medium), 600 (Semi-bold) | Paragraphs, checklist items, inputs, placeholders, table cells, disclosures, captions |
| **Organic Accent** | `Caveat` | 600, 700 | Subtle organic callouts, *"100% Free Consultation"* handwritten badges |
| **System Fallback** | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Normal | Native fallback stack for offline or instant rendering |

### Global Type Scale
- **Hero H1**: 46–56px desktop, 34–38px mobile (Line-height: 1.15, Letter-spacing: -0.025em)
- **Section H2**: 30–36px desktop, 24–28px mobile (Line-height: 1.25, Letter-spacing: -0.02em)
- **Subtitles & Leads**: 15–17px (Line-height: 1.65, Color: `#475569` or `#667085`)
- **Card / Item Headings**: 16–18px (Font-weight: 700, Color: `#0B1F33`)
- **Body Text**: 14.5–15.5px (Line-height: 1.6–1.7, Color: `#172B3F` or `#1E293B`)
- **Meta / Captions**: 12–13.5px (Color: `#667085`)

---

## 3. Master Color Palette

| Token | Hex / Value | Semantic Role |
|---|---|---|
| `--color-navy` / `--vp-navy` | `#0B1F33` | Primary brand navy — headings, navigation, primary text |
| `--color-navy-dark` | `#050E17` | Deepest navy — dark hero containers, footer backgrounds |
| `--color-navy-700` / `--vp-navy-2` | `#123A63` | Secondary navy — subtle dark surfaces, borders, icons |
| `--color-orange` / `--vp-orange` | `#FF5A00` | Primary energetic orange — primary CTAs, accents, key highlights |
| `--color-orange-dark` | `#E04F00` | Dark orange — hover states, active borders |
| `--color-orange-light` | `#FF8A00` | Soft orange — gradient highlights, pulse indicators |
| `--color-orange-tint` / `--vp-orange-light` | `#FFF1E8` | Very soft orange tint — badge backgrounds, icon pills |
| `--color-white` / `--vp-white` | `#FFFFFF` | Card surfaces, clean canvas |
| `--color-off-white` / `--vp-off-white` | `#F7F9FB` | Soft page backgrounds, alternating section fills |
| `--color-text` / `--vp-text` | `#172B3F` | Primary text and headings |
| `--color-muted` / `--vp-muted` | `#667085` | Subtitles, captions, meta (WCAG AA compliant >4.5:1) |
| `--color-border` / `--vp-border` | `#DCE4EA` | Crisp card, table, and input boundaries |
| `--color-success` / `--vp-green-text` | `#16A765` / `#047857` | WhatsApp and verified success indicators only |

---

## 4. UI/UX Component & Interaction Rules

1. **Card Discipline**:
   - Never assemble long infographic-style pages out of repeated colorful cards.
   - Use cards only when content genuinely requires visual grouping (e.g., 2 side-by-side loan options or compact calculators).
   - Prefer open layouts, 2-column information blocks, checklists, and accordions.
   - All cards use white or soft off-white background with a subtle border (`1px solid #DCE4EA`), border-radius 12–16px, and soft hover lift (`transform: translateY(-2px)`).
2. **Button Hierarchy**:
   - **Primary Action**: Orange background (`#FF5A00`), white text, bold, 8px radius (`Check Eligibility`).
   - **Secondary Action**: Clean white background, 1px border (`#DCE4EA`), navy text with WhatsApp green icon (`Talk to an Expert`).
   - Only ONE dominant primary CTA per visual viewport.
3. **Accordions & Modals**:
   - FAQs must always be collapsible accordions to prevent excessive page length.
   - Lead capture popup (`#popupOverlay`) is standardized with accessible dialog tags (`role="dialog"`, `aria-modal="true"`).

---

## 5. Canonical Flash Logo

The Flash symbol is the **central brand mark** of Visionary Path Services:
- Compact geometric energy mark with rounded corners and white negative-space lightning channel.
- Orange-to-red gradient (`#FF7A00` → `#FF5A00` → `#FF3800`).
- No generic icon-font glyphs or standard lightning bolts.
- Integrated into sticky navbar and footer across all pages.

---

## 6. Architecture & Quality Verification

```bash
npm run sync    # Synchronizes shared navbar and footer to all 27 HTML pages
npm test        # 162 automated structural tests (0 errors required)
npm run audit   # 455 production quality, link integrity, and WCAG AA contrast checks
```
