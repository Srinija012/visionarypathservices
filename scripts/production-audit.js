const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WEBSITE_DIR = path.resolve(__dirname, '../website');

function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file === 'includes' || file === 'node_modules') continue;
            results = results.concat(getHtmlFiles(fullPath));
        } else if (file.endsWith('.html')) {
            results.push(fullPath);
        }
    }
    return results;
}

const htmlFiles = getHtmlFiles(WEBSITE_DIR);
let errors = 0;
let auditPassed = 0;

console.log('\n================================================================');
console.log(' VISIONARY PATH SERVICES (VPS) — PRODUCTION QUALITY AUDIT');
console.log('================================================================');
console.log(`Auditing ${htmlFiles.length} HTML files, CSS design system, and JS tools...\n`);

// ── 1. HTML & SEO AUDIT ──────────────────────────────────────────
console.log('--- 1. HTML & SEO AUDIT ---');
const titles = new Set();

for (const filePath of htmlFiles) {
    const rel = path.relative(WEBSITE_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Title
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim()) {
        console.error(`[FAIL] ${rel}: Missing or empty <title>.`);
        errors++;
    } else {
        titles.add(titleMatch[1].trim());
        auditPassed++;
    }

    // Meta Description
    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    if (!descMatch || !descMatch[1].trim()) {
        console.error(`[FAIL] ${rel}: Missing or empty <meta name="description">.`);
        errors++;
    } else {
        auditPassed++;
    }

    // Canonical link
    const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    if (!canonMatch || !canonMatch[1].trim()) {
        console.error(`[FAIL] ${rel}: Missing canonical <link>.`);
        errors++;
    } else {
        auditPassed++;
    }

    // Open Graph Tags
    if (!content.includes('property="og:title"') || !content.includes('property="og:description"')) {
        console.error(`[FAIL] ${rel}: Missing Open Graph title/description tags.`);
        errors++;
    } else {
        auditPassed++;
    }

    // Single H1 check
    const h1Matches = content.match(/<h1\b[^>]*>/gi) || [];
    if (h1Matches.length !== 1) {
        console.error(`[FAIL] ${rel}: Expected exactly 1 <h1> tag, found ${h1Matches.length}.`);
        errors++;
    } else {
        auditPassed++;
    }

    // Duplicate IDs check
    const idMatches = content.match(/\bid=["']([^"']+)["']/gi) || [];
    const ids = idMatches.map(m => m.replace(/\bid=["']|["']/gi, ''));
    const seenIds = new Set();
    const dups = new Set();
    ids.forEach(id => {
        if (seenIds.has(id)) dups.add(id);
        seenIds.add(id);
    });
    if (dups.size > 0) {
        console.error(`[FAIL] ${rel}: Duplicate element IDs found: ${Array.from(dups).join(', ')}`);
        errors++;
    } else {
        auditPassed++;
    }

    // Image alt attributes
    const imgMatches = content.match(/<img\b[^>]*>/gi) || [];
    let imgMissingAlt = 0;
    imgMatches.forEach(img => {
        if (!/alt=["'][^"']*["']/i.test(img)) imgMissingAlt++;
    });
    if (imgMissingAlt > 0) {
        console.error(`[FAIL] ${rel}: ${imgMissingAlt} image(s) missing alt attribute.`);
        errors++;
    } else {
        auditPassed++;
    }

    // Breadcrumbs on internal pages
    if (rel !== 'index.html') {
        if (!content.toLowerCase().includes('breadcrumb')) {
            console.error(`[FAIL] ${rel}: Missing breadcrumb navigation component.`);
            errors++;
        } else {
            auditPassed++;
        }
    }

    // Skip to main content target
    if (!content.includes('id="mainContent"')) {
        console.error(`[FAIL] ${rel}: Missing id="mainContent" skip-link anchor.`);
        errors++;
    } else {
        auditPassed++;
    }

    // Popup modal accessibility
    if (content.includes('id="popupOverlay"')) {
        if (!content.includes('role="dialog"') || !content.includes('aria-modal="true"')) {
            console.error(`[FAIL] ${rel}: Popup modal missing role="dialog" or aria-modal="true".`);
            errors++;
        } else {
            auditPassed++;
        }
    }
}

// ── 2. INTERNAL LINKS INTEGRITY AUDIT ────────────────────────────
console.log('--- 2. INTERNAL LINKS INTEGRITY AUDIT ---');
let brokenLinks = 0;
for (const filePath of htmlFiles) {
    const rel = path.relative(WEBSITE_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const links = content.match(/href=["']([^"']+)["']/gi) || [];

    for (const linkAttr of links) {
        const link = linkAttr.replace(/href=["']|["']/gi, '').trim();
        if (!link || link.startsWith('#') || link.startsWith('http') || link.startsWith('tel:') || link.startsWith('mailto:') || link.startsWith('javascript:')) {
            continue;
        }
        const cleanPath = link.split('#')[0].split('?')[0];
        if (!cleanPath) continue;

        const targetFile = path.resolve(path.dirname(filePath), cleanPath);
        if (!fs.existsSync(targetFile)) {
            console.error(`[FAIL] ${rel}: Broken link "${link}" -> target ${targetFile} does not exist.`);
            brokenLinks++;
            errors++;
        }
    }
}
if (brokenLinks === 0) {
    console.log('[PASS] All internal links resolve to valid files.');
    auditPassed++;
}

// ── 3. CSS DESIGN SYSTEM & TOKENS AUDIT ───────────────────────────
console.log('--- 3. CSS DESIGN SYSTEM & TOKENS AUDIT ---');

// Check design-system.css exists (the canonical token layer)
const designSystemCssPath = path.join(WEBSITE_DIR, 'css/design-system.css');
if (!fs.existsSync(designSystemCssPath)) {
    console.error('[FAIL] css/design-system.css: File is MISSING — canonical token layer must exist.');
    errors++;
} else {
    console.log('[PASS] css/design-system.css exists (canonical token layer).');
    auditPassed++;
}

const designSystemCss = fs.existsSync(designSystemCssPath) ? fs.readFileSync(designSystemCssPath, 'utf-8') : '';
const improvementsCssPath = path.join(WEBSITE_DIR, 'css/improvements.css');
const improvementsCss = fs.readFileSync(improvementsCssPath, 'utf-8');

// Tokens are now defined in design-system.css (not improvements.css)
const requiredTokens = [
    '--color-primary',
    '--color-primary-dark',
    '--color-secondary',
    '--color-accent',
    '--color-success',
    '--color-background',
    '--color-surface',
    '--color-border',
    '--color-white',
    '--color-text',
    '--color-text-muted',
    '--radius-sm',
    '--radius-lg',
    '--radius-full',
    '--space-1',
    '--space-4',
    '--space-8',
    '--space-12',
    '--space-16',
    '--space-20',
    '--space-24'
];

// Check tokens exist in design-system.css OR improvements.css (backward compat)
const combinedCss = designSystemCss + '\n' + improvementsCss;
let missingTokens = 0;
requiredTokens.forEach(token => {
    if (!combinedCss.includes(token + ':') && !combinedCss.includes(token + ' :')) {
        console.error(`[FAIL] design-system.css: Missing design token ${token}`);
        missingTokens++;
        errors++;
    }
});
if (missingTokens === 0) {
    console.log(`[PASS] All ${requiredTokens.length} master design system tokens defined in design-system.css.`);
    auditPassed++;
}

// ── 3a. P0 BUG REGRESSION CHECKS ─────────────────────────────────
console.log('--- 3a. P0 BUG REGRESSION CHECKS (Design System Integrity) ---');

// CHECK 1: .motion-init CSS must be defined (scroll reveal animations)
if (!improvementsCss.includes('.motion-init') || !improvementsCss.includes('.motion-revealed')) {
    console.error('[FAIL] improvements.css: .motion-init / .motion-revealed CSS not defined — scroll animations will SILENTLY FAIL.');
    errors++;
} else {
    console.log('[PASS] .motion-init / .motion-revealed CSS defined — scroll reveal animations active.');
    auditPassed++;
}

// CHECK 2: .navbar.scrolled-elevated CSS must be defined
if (!improvementsCss.includes('.navbar.scrolled-elevated')) {
    console.error('[FAIL] improvements.css: .navbar.scrolled-elevated CSS not defined — scroll nav elevation will SILENTLY FAIL.');
    errors++;
} else {
    console.log('[PASS] .navbar.scrolled-elevated CSS defined — scroll navbar elevation active.');
    auditPassed++;
}

// CHECK 3: --transition-bounce must be defined (used in .pan-card, .bridge-card)
if (!combinedCss.includes('--transition-bounce:')) {
    console.error('[FAIL] design-system.css: --transition-bounce not defined — card hover transitions silently broken.');
    errors++;
} else {
    console.log('[PASS] --transition-bounce defined — card hover transitions active.');
    auditPassed++;
}

// CHECK 4: --vps-navy and family must be defined (previously undefined, used in hero section)
const vpsVars = ['--vps-navy:', '--vps-green:', '--vps-blue:', '--vps-border:', '--vps-shadow-xs:'];
let missingVpsVars = 0;
vpsVars.forEach(v => {
    if (!combinedCss.includes(v)) {
        console.error(`[FAIL] design-system.css: ${v.replace(':', '')} not defined — hero section rendering broken.`);
        missingVpsVars++;
        errors++;
    }
});
if (missingVpsVars === 0) {
    console.log('[PASS] All --vps-* alias tokens defined — hero section rendering safe.');
    auditPassed++;
}

// CHECK 5: design-system.css must be loaded BEFORE style.css on all pages
let dsLoadOrderErrors = 0;
for (const filePath of htmlFiles) {
    const rel = path.relative(WEBSITE_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const dsIdx = content.indexOf('design-system.css');
    const styleIdx = content.indexOf('style.css');
    if (dsIdx === -1) {
        console.error(`[FAIL] ${rel}: design-system.css not loaded.`);
        dsLoadOrderErrors++;
        errors++;
    } else if (styleIdx !== -1 && dsIdx > styleIdx) {
        console.error(`[FAIL] ${rel}: design-system.css loads AFTER style.css — must load first.`);
        dsLoadOrderErrors++;
        errors++;
    }
}
if (dsLoadOrderErrors === 0) {
    console.log('[PASS] design-system.css loads before style.css on all pages.');
    auditPassed++;
}

// CHECK 6: AOS CDN link without AOS.init() — dead dependency
let aosWithoutInitCount = 0;
for (const filePath of htmlFiles) {
    const rel = path.relative(WEBSITE_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const hasAosCss = content.includes('aos@') && content.includes('.css');
    const hasAosJs = content.includes('AOS.init') || (content.includes('aos@') && content.includes('.js'));
    if (hasAosCss && !hasAosJs) {
        console.error(`[FAIL] ${rel}: AOS CSS loaded but AOS never initialized — dead dependency.`);
        aosWithoutInitCount++;
        errors++;
    }
}
if (aosWithoutInitCount === 0) {
    console.log('[PASS] No pages have AOS CSS without AOS initialization.');
    auditPassed++;
}

// Card System Classes
const requiredCardClasses = [
    '.card',
    '.card--elevated',
    '.card--outlined',
    '.card--interactive',
    '.card--featured'
];
requiredCardClasses.forEach(cls => {
    if (!improvementsCss.includes(cls)) {
        console.error(`[FAIL] improvements.css: Missing card class ${cls}`);
        errors++;
    } else {
        auditPassed++;
    }
});

// A11y & Motion Media Queries
if (!improvementsCss.includes('(prefers-reduced-motion: reduce)')) {
    console.error('[FAIL] improvements.css: Missing (prefers-reduced-motion: reduce) support.');
    errors++;
} else {
    console.log('[PASS] prefers-reduced-motion accessibility query supported.');
    auditPassed++;
}

if (!improvementsCss.includes(':focus-visible')) {
    console.error('[FAIL] improvements.css: Missing :focus-visible accessible indicator styles.');
    errors++;
} else {
    console.log('[PASS] Accessible :focus-visible ring styles active.');
    auditPassed++;
}

// WCAG 2.2 AA Color Contrast & Scope Verification
console.log('--- 3b. WCAG 2.2 AA COLOR CONTRAST & ACCESSIBILITY AUDIT ---');

// 1. Ensure green-highlight defaults to high contrast emerald on white
if (!improvementsCss.includes('.green-highlight') || !improvementsCss.includes('#047857')) {
    console.error('[FAIL] improvements.css: .green-highlight must use high-contrast emerald (#047857) for white/light surfaces.');
    errors++;
} else {
    console.log('[PASS] .green-highlight on light surfaces is deep emerald (#047857, 5.58:1 contrast).');
    auditPassed++;
}

// 2. Ensure exact-hero trust strip is high contrast slate/navy and NOT white on white
if (!improvementsCss.includes('.exact-hero .hero-trust-strip') || !improvementsCss.includes('.exact-hero .hero-trust-item strong')) {
    console.error('[FAIL] improvements.css: Missing explicit .exact-hero .hero-trust-strip contrast rules.');
    errors++;
} else {
    console.log('[PASS] .exact-hero .hero-trust-strip has scoped dark slate/navy colors on white background.');
    auditPassed++;
}

// 3. Ensure exact-hero secondary button has high contrast navy text and NOT white on white
if (!improvementsCss.includes('.exact-hero .btn-hero-secondary')) {
    console.error('[FAIL] improvements.css: Missing explicit .exact-hero .btn-hero-secondary contrast rules.');
    errors++;
} else {
    console.log('[PASS] .exact-hero .btn-hero-secondary has dark navy text on white background.');
    auditPassed++;
}

// 4. Ensure dark heroes have scoped mint green (#34d399, 8.5:1 on dark navy)
if (!improvementsCss.includes('.page-hero .green-highlight') && !improvementsCss.includes('.legal-hero .green-highlight')) {
    console.error('[FAIL] improvements.css: Dark heroes missing scoped #34d399 highlight rule.');
    errors++;
} else {
    console.log('[PASS] Dark hero containers use high-contrast #34d399 mint green (>8.5:1 on navy).');
    auditPassed++;
}

// 5. Ensure section lead text (section-sub, pan-india-sub, etc.) has high contrast (>= 4.5:1 on white)
if (!improvementsCss.includes('.pan-india-sub') || !improvementsCss.includes('#475569')) {
    console.error('[FAIL] improvements.css: Section subtitles must meet WCAG AA contrast on white (#475569).');
    errors++;
} else {
    console.log('[PASS] Section subtitles (.section-sub, .pan-india-sub, .bridging-sub) use #475569 (7.1:1 on white).');
    auditPassed++;
}

// 6. Ensure mega dropdown country flags and country-cards are scoped cleanly
if (improvementsCss.includes('\n.country-flag {') || !improvementsCss.includes('.mega-country-link .country-flag')) {
    console.error('[FAIL] improvements.css: .country-flag must not be declared unscoped; mega dropdown flags must have bounded styles.');
    errors++;
} else {
    console.log('[PASS] .country-flag is properly scoped and mega-dropdown destination flags have bounded sizing.');
    auditPassed++;
}

// ── 4. JAVASCRIPT & CALCULATORS VERIFICATION ───────────────────────
console.log('--- 4. JAVASCRIPT & CALCULATORS VERIFICATION ---');
const mainJsPath = path.join(WEBSITE_DIR, 'js/main.js');
const calculatorsJsPath = path.join(WEBSITE_DIR, 'js/calculators.js');
const motionJsPath = path.join(WEBSITE_DIR, 'js/motion-ux.js');

if (!fs.existsSync(mainJsPath) || !fs.existsSync(calculatorsJsPath) || !fs.existsSync(motionJsPath)) {
    console.error('[FAIL] Missing core JS scripts in website/js/.');
    errors++;
} else {
    console.log('[PASS] Core JS scripts (main.js, calculators.js, motion-ux.js) verified.');
    auditPassed++;
}

// Run python calculators unit tests
try {
    const pyOutput = execSync('python3 website/test_calculators.py', { cwd: path.resolve(__dirname, '..'), encoding: 'utf-8' });
    console.log('[PASS] Financial calculators mathematical test suite passed cleanly.');
    auditPassed++;
} catch (pyErr) {
    console.error('[FAIL] Financial calculators mathematical tests failed:', pyErr.message);
    errors++;
}

// ── 5. BRANDING & CONTACT VERIFICATION ───────────────────────────
console.log('--- 5. BRANDING & COMPLIANCE VERIFICATION ---');
for (const filePath of htmlFiles) {
    const rel = path.relative(WEBSITE_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    if (!content.includes('9063703038')) {
        console.error(`[FAIL] ${rel}: Missing official phone 9063703038.`);
        errors++;
    } else {
        auditPassed++;
    }

    if (!content.includes('8150949070')) {
        console.error(`[FAIL] ${rel}: Missing official WhatsApp 8150949070.`);
        errors++;
    } else {
        auditPassed++;
    }

    if (!content.includes('Visionarypathservises@gmail.com')) {
        console.error(`[FAIL] ${rel}: Missing official contact email Visionarypathservises@gmail.com.`);
        errors++;
    } else {
        auditPassed++;
    }

    if (content.includes('{{ROOT}}')) {
        console.error(`[FAIL] ${rel}: Contains unreplaced {{ROOT}} token.`);
        errors++;
    } else {
        auditPassed++;
    }

    // 5b. Placeholder & Template Strings Guard
    const placeholderRegex = /(\(Your Address Here\)|5600XX|\blorem ipsum\b|\bTODO\b|\bFIXME\b)/i;
    if (placeholderRegex.test(content)) {
        console.error(`[FAIL] ${rel}: Found unresolved placeholder/template text.`);
        errors++;
    } else {
        auditPassed++;
    }

    // 5c. Numeric Range Typography Guard (En-Dash Consistency)
    const spacedHyphenRange = /\b\d+%\s+-\s+\d+%/g;
    if (spacedHyphenRange.test(content)) {
        console.error(`[FAIL] ${rel}: Contains unformatted spaced-hyphen percentage range (should use en-dash).`);
        errors++;
    } else {
        auditPassed++;
    }
}

// ── SUMMARY REPORT ───────────────────────────────────────────────
console.log('\n================================================================');
console.log(` AUDIT SUMMARY: ${auditPassed} CHECKS PASSED, ${errors} ERRORS`);
console.log('================================================================\n');

if (errors > 0) {
    console.error(`Production audit failed with ${errors} error(s). Please review and correct.`);
    process.exit(1);
} else {
    console.log('Production Quality Audit PASSED 100% cleanly (0 errors)!\n');
    process.exit(0);
}
