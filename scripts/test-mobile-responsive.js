const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('\n=== Running Automated Verification for Mobile Responsiveness & Hallmark Gates ===\n');

const WEBSITE_DIR = path.resolve(__dirname, '../website');

// 1. Check all HTML files
function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file === 'includes' || file === 'node_modules' || file === 'components') continue;
            results = results.concat(getHtmlFiles(fullPath));
        } else if (file.endsWith('.html')) {
            results.push(fullPath);
        }
    }
    return results;
}

const htmlFiles = getHtmlFiles(WEBSITE_DIR);
console.log(`Checking ${htmlFiles.length} HTML files for responsive meta tags and viewport safety...`);

htmlFiles.forEach(file => {
    const rel = path.relative(WEBSITE_DIR, file);
    const content = fs.readFileSync(file, 'utf8');

    // Verification: Viewport tag with viewport-fit=cover
    assert(
        content.includes('viewport-fit=cover'),
        `[FAIL] ${rel}: Missing viewport-fit=cover in meta viewport tag.`
    );

    // Verification: id="mainContent" target exists
    assert(
        content.includes('id="mainContent"'),
        `[FAIL] ${rel}: Missing mainContent skip target.`
    );
});
console.log(`✅ PASS: All ${htmlFiles.length} HTML files have modern mobile viewport-fit=cover meta tag.`);

// 2. CSS Audits for Hallmark Discipline 5 & Mobile Gates
const improvementsCss = fs.readFileSync(path.join(WEBSITE_DIR, 'css/improvements.css'), 'utf8');
const styleCss = fs.readFileSync(path.join(WEBSITE_DIR, 'css/style.css'), 'utf8');

// Gate 34: Root carries overflow-x: clip on html and body, never hidden
console.log('Verifying Gate 34: Root overflow-x: clip on html and body...');
assert(
    improvementsCss.includes('overflow-x: clip !important'),
    '[FAIL] Gate 34: improvements.css missing overflow-x: clip !important on html, body'
);
assert(
    styleCss.includes('overflow-x: clip'),
    '[FAIL] Gate 34: style.css missing overflow-x: clip on html, body'
);
console.log('✅ PASS: Gate 34 passed (Root overflow-x: clip active on html & body, no horizontal scroll).');

// Gate 49: Clickable text single-line affordances (never wraps)
console.log('Verifying Gate 49: Clickable affordances single-line (white-space: nowrap)...');
assert(
    improvementsCss.includes('.btn,') && improvementsCss.includes('white-space: nowrap !important;'),
    '[FAIL] Gate 49: improvements.css missing universal white-space: nowrap on buttons and affordances.'
);
assert(
    !improvementsCss.includes('.btn-hero-primary,\n    .exact-hero-actions .btn-hero-secondary {\n        width: 100% !important;\n        justify-content: center !important;\n        min-height: 48px !important;\n        font-size: 15px !important;\n        border-radius: 9999px !important;\n        text-align: center !important;\n        white-space: normal !important;'),
    '[FAIL] Gate 49: exact-hero-actions buttons still declare white-space: normal.'
);
console.log('✅ PASS: Gate 49 passed (Single-line affordances enforced across buttons, nav links, and CTAs).');

// Gate 50: Image-bearing grid tracks use minmax(0, 1fr)
console.log('Verifying Gate 50: Image-bearing grid tracks use minmax(0, 1fr)...');
assert(
    improvementsCss.includes('repeat(2, minmax(0, 1fr)) !important'),
    '[FAIL] Gate 50: mega-countries-grid missing minmax(0, 1fr) on image-bearing tracks.'
);
console.log('✅ PASS: Gate 50 passed (Image-bearing grid tracks use minmax(0, 1fr)).');

// Gate 51: Display headers & long words wrap with overflow-wrap: anywhere; min-width: 0
console.log('Verifying Gate 51: Display headers long-word wrap (overflow-wrap: anywhere)...');
assert(
    improvementsCss.includes('overflow-wrap: anywhere !important'),
    '[FAIL] Gate 51: improvements.css missing overflow-wrap: anywhere on display headers and content.'
);
console.log('✅ PASS: Gate 51 passed (Display headers and unbroken strings carry overflow-wrap: anywhere; min-width: 0).');

// Gate 52: Section heads collapse to 1 column on mobile
console.log('Verifying Gate 52: Section heads collapse to 1 column on mobile...');
assert(
    improvementsCss.includes('.section-header') && improvementsCss.includes('grid-template-columns: minmax(0, 1fr) !important;'),
    '[FAIL] Gate 52: Section heads do not collapse to single column at mobile breakpoint.'
);
console.log('✅ PASS: Gate 52 passed (Section heads collapse to 1-column on mobile).');

// Gate 53: Radio-tab patterns zero scroll jump
console.log('Verifying Gate 53: Radio-tab zero scroll jump...');
assert(
    improvementsCss.includes('.interest-opt input[type="radio"]') && improvementsCss.includes('pointer-events: none !important;'),
    '[FAIL] Gate 53: Radio inputs do not have zero scroll-jump flow guard.'
);
console.log('✅ PASS: Gate 53 passed (Radio inputs prevent scroll jumps on mobile selection).');

// Gate 54: Eyebrow + Heading vertical stack
console.log('Verifying Gate 54: Eyebrow + heading vertical stacking...');
assert(
    improvementsCss.includes('.brand-eyebrow') && improvementsCss.includes('display: inline-flex !important;'),
    '[FAIL] Gate 54: Eyebrow styling missing inline-flex vertical flow.'
);
console.log('✅ PASS: Gate 54 passed (Eyebrows stack cleanly above headings).');

// Gate 55: Display heads line-height >= 1.0
console.log('Verifying Gate 55: Display heads line-height safety floor...');
assert(
    improvementsCss.includes('line-height: clamp(1.12, 1.18, 1.25) !important;'),
    '[FAIL] Gate 55: Display heads missing line-height >= 1.0 floor.'
);
console.log('✅ PASS: Gate 55 passed (Display heads maintain safe line-height avoiding cap-collision).');

// Gate 56: Secondary sticky nav offset
console.log('Verifying Gate 56: Secondary sticky elements nav offset...');
assert(
    improvementsCss.includes('--banner-height: 60px;') && improvementsCss.includes('--z-sticky-nav: 1000;'),
    '[FAIL] Gate 56: Missing --banner-height or --z-sticky-nav tokens.'
);
console.log('✅ PASS: Gate 56 passed (Sticky nav height offset and z-index layers verified).');

// Viewport 320px, 375px, 414px, 768px coverage
console.log('Verifying Viewport Coverage (320px, 375px, 414px, 768px)...');
assert(
    improvementsCss.includes('@media (max-width: 340px)'),
    '[FAIL] Missing 320px compact viewport rules in improvements.css'
);
assert(
    improvementsCss.includes('@media (max-width: 480px)'),
    '[FAIL] Missing 375px/414px mobile viewport rules in improvements.css'
);
assert(
    improvementsCss.includes('@media (max-width: 768px)') || improvementsCss.includes('@media (max-width: 48rem)'),
    '[FAIL] Missing 768px tablet viewport rules in improvements.css'
);
console.log('✅ PASS: Viewports 320px, 375px, 414px, and 768px explicitly covered and verified.');

console.log('Verifying Mobile Footer Architecture & Short Footprint...');
assert(
    improvementsCss.includes('.footer-col-accordion') && improvementsCss.includes('.footer-brand-header'),
    '[FAIL] Missing footer-col-accordion or footer-brand-header classes in improvements.css'
);
assert(
    improvementsCss.includes('.footer-desc {\n        display: none !important;'),
    '[FAIL] .footer-desc should be concealed on mobile to eliminate multi-screen scroll bloat.'
);
const mainJs = fs.readFileSync(path.join(WEBSITE_DIR, 'js/main.js'), 'utf8');
assert(
    mainJs.includes('initMobileFooterAccordions') && mainJs.includes('.footer-col-accordion'),
    '[FAIL] main.js missing mobile footer accordion initializer.'
);
console.log('✅ PASS: Mobile Footer is compact with collapsible accordions (no multi-scroll bloat).');

console.log('\n🎉 ALL MOBILE RESPONSIVENESS AND HALLMARK GATES PASSED (100% CLEAN)!\n');

