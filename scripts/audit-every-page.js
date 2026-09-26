const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.resolve(__dirname, '../website');

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

const htmlFiles = getHtmlFiles(WEBSITE_DIR).sort();

console.log('='.repeat(80));
console.log(` PRODUCTION READINESS DEEP AUDIT: INSPECTING EVERY PAGE (${htmlFiles.length} PAGES)`);
console.log('='.repeat(80));

const results = [];
let totalErrors = 0;
let totalWarnings = 0;

for (const filePath of htmlFiles) {
    const rel = path.relative(WEBSITE_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const pageErrors = [];
    const pageWarnings = [];
    const pageStats = {};

    // 1. DocType & Viewport
    if (!content.includes('<!DOCTYPE html>')) pageErrors.push('Missing <!DOCTYPE html>');
    if (!content.includes('<meta name="viewport"')) pageErrors.push('Missing viewport meta tag');
    if (!content.includes('charset="UTF-8"') && !content.includes('charset="utf-8"')) pageErrors.push('Missing charset UTF-8');

    // 2. SEO & Meta
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim()) {
        pageErrors.push('Missing or empty <title>');
    } else {
        pageStats.title = titleMatch[1].trim();
    }

    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    if (!descMatch || !descMatch[1].trim()) {
        pageErrors.push('Missing <meta name="description">');
    }

    const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    if (!canonMatch || !canonMatch[1].trim()) {
        pageErrors.push('Missing canonical <link>');
    }

    // 3. Headings & Landmarks
    const h1Matches = content.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    if (h1Matches.length === 0) {
        pageErrors.push('Missing <h1> heading');
    } else if (h1Matches.length > 1) {
        pageErrors.push(`Multiple <h1> headings found (${h1Matches.length})`);
    } else {
        pageStats.h1 = h1Matches[0].replace(/<[^>]+>/g, '').trim();
    }

    if (!content.includes('id="mainContent"')) {
        pageErrors.push('Missing #mainContent anchor for skip link');
    }

    // 4. Duplicate IDs
    const idMatches = content.match(/\bid=["']([^"']+)["']/gi) || [];
    const ids = idMatches.map(m => m.replace(/\bid=["']|["']/gi, ''));
    const seenIds = new Set();
    const dups = new Set();
    ids.forEach(id => {
        if (seenIds.has(id)) dups.add(id);
        seenIds.add(id);
    });
    if (dups.size > 0) {
        pageErrors.push(`Duplicate IDs: ${Array.from(dups).join(', ')}`);
    }

    // 5. Images existence & alt text
    const imgRegex = /<img\b([^>]*)>/gi;
    let imgMatch;
    let totalImages = 0;
    while ((imgMatch = imgRegex.exec(content)) !== null) {
        totalImages++;
        const tag = imgMatch[1];
        const srcMatch = tag.match(/src=["']([^"']+)["']/i);
        const altMatch = tag.match(/alt=["']([^"']*)["']/i);

        if (!altMatch || !altMatch[1].trim()) {
            pageWarnings.push(`Image missing alt text: ${srcMatch ? srcMatch[1] : 'unknown'}`);
        }

        if (srcMatch) {
            const src = srcMatch[1];
            if (!src.startsWith('http') && !src.startsWith('data:')) {
                const cleanSrc = src.split('?')[0].split('#')[0];
                const resolvedImg = path.resolve(path.dirname(filePath), cleanSrc);
                if (!fs.existsSync(resolvedImg)) {
                    pageErrors.push(`Broken image src: "${src}" -> ${resolvedImg}`);
                }
            }
        }
    }
    pageStats.totalImages = totalImages;

    // 6. Linked Assets (CSS & JS)
    const linkRegex = /<link\b([^>]*)>/gi;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(content)) !== null) {
        const tag = linkMatch[1];
        if (/rel=["']stylesheet["']/i.test(tag)) {
            const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
            if (hrefMatch && !hrefMatch[1].startsWith('http')) {
                const cleanHref = hrefMatch[1].split('?')[0].split('#')[0];
                const resolvedCss = path.resolve(path.dirname(filePath), cleanHref);
                if (!fs.existsSync(resolvedCss)) {
                    pageErrors.push(`Broken CSS file: "${hrefMatch[1]}" -> ${resolvedCss}`);
                }
            }
        }
    }

    const scriptRegex = /<script\b([^>]*)src=["']([^"']+)["']/gi;
    let scriptMatch;
    while ((scriptMatch = scriptRegex.exec(content)) !== null) {
        const src = scriptMatch[2];
        if (!src.startsWith('http')) {
            const cleanSrc = src.split('?')[0].split('#')[0];
            const resolvedJs = path.resolve(path.dirname(filePath), cleanSrc);
            if (!fs.existsSync(resolvedJs)) {
                pageErrors.push(`Broken JS file: "${src}" -> ${resolvedJs}`);
            }
        }
    }

    // 7. Internal Links
    const aRegex = /<a\b([^>]*)href=["']([^"']+)["']/gi;
    let aMatch;
    let internalLinksCount = 0;
    while ((aMatch = aRegex.exec(content)) !== null) {
        const href = aMatch[2].trim();
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('javascript:')) {
            continue;
        }
        internalLinksCount++;
        const cleanHref = href.split('?')[0].split('#')[0];
        if (!cleanHref) continue;
        const resolvedTarget = path.resolve(path.dirname(filePath), cleanHref);
        if (!fs.existsSync(resolvedTarget)) {
            pageErrors.push(`Broken link: "${href}" -> ${resolvedTarget}`);
        }
    }
    pageStats.internalLinks = internalLinksCount;

    // 8. Design system & Typography
    if (!content.includes('fonts.googleapis.com') || (!content.includes('Manrope') && !content.includes('Inter'))) {
        pageWarnings.push('Missing Google Fonts reference for Manrope or Inter');
    }
    if (!content.includes('css/design-system.css')) {
        pageErrors.push('Missing css/design-system.css canonical token layer');
    }
    if (!content.includes('css/improvements.css')) {
        pageErrors.push('Missing css/improvements.css');
    }

    // 9. Forms & Modal Accessibility
    if (content.includes('id="popupOverlay"')) {
        if (!content.includes('role="dialog"') || !content.includes('aria-modal="true"')) {
            pageErrors.push('Modal missing role="dialog" or aria-modal="true"');
        }
        if (!content.includes('aria-labelledby="popupTitle"')) {
            pageWarnings.push('Modal missing aria-labelledby="popupTitle"');
        }
    }

    // 10. Regulatory Disclaimer Strip
    if (!content.includes('disclaimer-accordion') && !content.includes('site-disclaimer-wrap')) {
        pageWarnings.push('Missing institutional regulatory disclaimer accordion');
    }

    totalErrors += pageErrors.length;
    totalWarnings += pageWarnings.length;

    results.push({
        file: rel,
        status: pageErrors.length === 0 ? 'PASS' : 'FAIL',
        errors: pageErrors,
        warnings: pageWarnings,
        stats: pageStats
    });
}

// Print Report
results.forEach((r, idx) => {
    const num = (idx + 1).toString().padStart(2, '0');
    const badge = r.status === 'PASS' ? '✅ PASS' : '❌ FAIL';
    console.log(`[${num}] ${badge}  ${r.file.padEnd(48)} (Links: ${r.stats.internalLinks || 0}, Imgs: ${r.stats.totalImages || 0})`);
    if (r.errors.length > 0) {
        r.errors.forEach(e => console.log(`     ⛔ ERROR: ${e}`));
    }
    if (r.warnings.length > 0) {
        r.warnings.forEach(w => console.log(`     ⚠️  WARN:  ${w}`));
    }
});

console.log('='.repeat(80));
console.log(` AUDIT SUMMARY: ${results.filter(r => r.status === 'PASS').length}/${results.length} PAGES PASSED`);
console.log(` Total Errors: ${totalErrors} | Total Warnings: ${totalWarnings}`);
console.log('='.repeat(80));

process.exit(totalErrors === 0 ? 0 : 1);
