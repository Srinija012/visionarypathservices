const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('\n=== Running Automated Verification for Hamburger Menu & Hallmark Standards ===\n');

const ROOT_DIR = path.resolve(__dirname, '..');
const WEBSITE_DIR = path.join(ROOT_DIR, 'website');
const NAVBAR_TEMPLATE = path.join(WEBSITE_DIR, 'includes/navbar.html');
const MAIN_JS = path.join(WEBSITE_DIR, 'js/main.js');
const STYLE_CSS = path.join(WEBSITE_DIR, 'css/style.css');
const IMPROVEMENTS_CSS = path.join(WEBSITE_DIR, 'css/improvements.css');
const PREVIEW_HTML = path.join(WEBSITE_DIR, 'components/hamburger.preview.html');
const COMPONENT_CSS = path.join(WEBSITE_DIR, 'components/hamburger.css');

// 1. Template Verification
console.log('1. Verifying includes/navbar.html template...');
const navbarHtml = fs.readFileSync(NAVBAR_TEMPLATE, 'utf8');
assert(navbarHtml.includes('type="button"'), '[FAIL] Hamburger button missing type="button" in navbar.html');
assert(navbarHtml.includes('class="hamburger"'), '[FAIL] Missing class="hamburger" in navbar.html');
assert(navbarHtml.includes('id="hamburger"'), '[FAIL] Missing id="hamburger" in navbar.html');
assert(navbarHtml.includes('aria-label="Toggle Navigation"'), '[FAIL] Missing accessible aria-label in navbar.html');
assert(navbarHtml.includes('aria-expanded="false"'), '[FAIL] Missing initial aria-expanded="false" in navbar.html');
assert(navbarHtml.includes('aria-controls="navLinks"'), '[FAIL] Missing aria-controls in navbar.html');
assert(navbarHtml.includes('<span></span><span></span><span></span>'), '[FAIL] Missing 3 span bars in navbar.html');
assert(navbarHtml.includes('class="nav-backdrop"'), '[FAIL] Missing nav-backdrop in navbar.html');
console.log('   ✅ PASS: navbar.html template verified.');

// 2. All 29 HTML Files Verification
console.log('2. Verifying all synchronized HTML files for standardized hamburger markup...');
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
assert(htmlFiles.length >= 25, `[FAIL] Expected at least 25 HTML files, found ${htmlFiles.length}`);
htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(WEBSITE_DIR, file);
    assert(
        content.includes('class="hamburger"') && content.includes('type="button"'),
        `[FAIL] ${rel}: Missing accessible hamburger markup with type="button"`
    );
});
console.log(`   ✅ PASS: All ${htmlFiles.length} HTML files verified.`);

// 3. JavaScript Engine Verification (main.js)
console.log('3. Verifying JavaScript drawer engine in main.js...');
const mainJs = fs.readFileSync(MAIN_JS, 'utf8');
assert(mainJs.includes('function toggleMenu()'), '[FAIL] toggleMenu function missing in main.js');
assert(mainJs.includes('function closeMenu()'), '[FAIL] closeMenu function missing in main.js');
assert(mainJs.includes('function updateNavHeight()'), '[FAIL] updateNavHeight helper missing in main.js');
assert(mainJs.includes('links.style.top = navHeight'), '[FAIL] Dynamic navHeight top positioning missing in main.js');
assert(mainJs.includes('e.key === \'Escape\''), '[FAIL] Keyboard Escape dismissal handler missing in main.js');
assert(mainJs.includes('e.key === \' \' || e.key === \'Spacebar\''), '[FAIL] Keyboard Spacebar accordion handler missing in main.js');
assert(mainJs.includes('document.body.classList.add(\'menu-open\')'), '[FAIL] menu-open body class management missing in main.js');
console.log('   ✅ PASS: main.js JavaScript drawer engine verified.');

// 4. CSS Verification (style.css & improvements.css)
console.log('4. Verifying CSS rules, 8 states, and responsive styling...');
const styleCss = fs.readFileSync(STYLE_CSS, 'utf8');
const impCss = fs.readFileSync(IMPROVEMENTS_CSS, 'utf8');

// Hallmark 8-State interactive check
assert(styleCss.includes('.hamburger:hover') || styleCss.includes('.hamburger.is-hover'), '[FAIL] Hover state missing in style.css');
assert(styleCss.includes('.hamburger:focus-visible') || styleCss.includes('.hamburger.is-focus'), '[FAIL] Focus state missing in style.css');
assert(styleCss.includes('.hamburger:active') || styleCss.includes('.hamburger.is-active'), '[FAIL] Active state missing in style.css');
assert(styleCss.includes('.hamburger:disabled') || styleCss.includes('.hamburger.is-disabled'), '[FAIL] Disabled state missing in style.css');
assert(styleCss.includes('data-state="loading"') || styleCss.includes('.hamburger.is-loading'), '[FAIL] Loading state missing in style.css');
assert(styleCss.includes('data-state="error"') || styleCss.includes('.hamburger.is-error'), '[FAIL] Error state missing in style.css');
assert(styleCss.includes('data-state="success"') || styleCss.includes('.hamburger.is-success'), '[FAIL] Success state missing in style.css');

// WCAG AAA Touch Target Check (>= 44x44px)
assert(styleCss.includes('width: 44px') && styleCss.includes('height: 44px'), '[FAIL] 44x44px touch target floor missing in style.css');
assert(impCss.includes('min-width: 44px') && impCss.includes('min-height: 44px'), '[FAIL] 44x44px minimum constraint missing in improvements.css');

// Backdrop filter containing block trap elimination
assert(
    impCss.includes('body.menu-open .navbar') && impCss.includes('backdrop-filter: none !important'),
    '[FAIL] Stacking context containing block fix missing on body.menu-open .navbar in improvements.css'
);

// Body scroll lock without touch-action: none freeze
assert(
    !styleCss.includes('body.menu-open {\n        overflow: hidden !important;\n        touch-action: none;\n    }'),
    '[FAIL] style.css still contains touch-action: none on body.menu-open'
);

// X Morph symmetry check (±7.5px translate, ±45deg rotate)
assert(impCss.includes('translateY(7.5px) rotate(45deg)'), '[FAIL] Symmetric top-bar transform missing in improvements.css');
assert(impCss.includes('translateY(-7.5px) rotate(-45deg)'), '[FAIL] Symmetric bottom-bar transform missing in improvements.css');
console.log('   ✅ PASS: CSS rules and 8-state interactive design verified.');

// 5. Component Artifacts & Preview Verification
console.log('5. Verifying Hallmark component artifact and 8-state preview wrapper...');
assert(fs.existsSync(PREVIEW_HTML), '[FAIL] hamburger.preview.html missing in website/components/');
assert(fs.existsSync(COMPONENT_CSS), '[FAIL] hamburger.css missing in website/components/');

const previewContent = fs.readFileSync(PREVIEW_HTML, 'utf8');
assert(previewContent.includes('Hallmark Component Standard'), '[FAIL] Hallmark stamp missing in preview wrapper');
assert(previewContent.includes('Component 8-State Matrix'), '[FAIL] 8-State Matrix section missing in preview wrapper');
assert(previewContent.includes('Live Interactive Playground'), '[FAIL] Interactive playground missing in preview wrapper');

console.log('   ✅ PASS: Hallmark component artifacts and 8-state preview verified.');

console.log('\n🎉 ALL HAMBURGER MENU VERIFICATION CHECKS PASSED (100% CLEAN)!\n');
process.exit(0);
