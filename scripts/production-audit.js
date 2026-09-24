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
const improvementsCssPath = path.join(WEBSITE_DIR, 'css/improvements.css');
const improvementsCss = fs.readFileSync(improvementsCssPath, 'utf-8');

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

let missingTokens = 0;
requiredTokens.forEach(token => {
    if (!improvementsCss.includes(token + ':')) {
        console.error(`[FAIL] improvements.css: Missing design token ${token}`);
        missingTokens++;
        errors++;
    }
});
if (missingTokens === 0) {
    console.log(`[PASS] All ${requiredTokens.length} master design system tokens defined in improvements.css.`);
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
