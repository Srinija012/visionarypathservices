const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('\n=== Running Automated Verification for Framer Motion Animation Engine ===\n');

const WEBSITE_DIR = path.resolve(__dirname, '../website');

// Find all HTML files
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

// Test 1: Verify all 29 HTML files include motion.js and motion-ux.js
console.log(`Checking ${htmlFiles.length} HTML files for Framer Motion script tags...`);
htmlFiles.forEach(file => {
    const rel = path.relative(WEBSITE_DIR, file);
    const content = fs.readFileSync(file, 'utf8');
    const depth = rel.split(path.sep).length - 1;
    const prefix = depth === 0 ? '' : '../'.repeat(depth);

    const expectedMotion = `${prefix}js/vendor/motion.js`;
    const expectedMotionUx = `${prefix}js/motion-ux.js`;

    assert(
        content.includes(expectedMotion),
        `[FAIL] ${rel}: Missing Framer Motion script tag (${expectedMotion})`
    );
    assert(
        content.includes(expectedMotionUx),
        `[FAIL] ${rel}: Missing Framer Motion UX engine script tag (${expectedMotionUx})`
    );

    // Ensure no legacy AOS remains
    assert(
        !content.includes('aos.js'),
        `[FAIL] ${rel}: Contains deprecated aos.js script`
    );
    assert(
        !content.includes('AOS.init'),
        `[FAIL] ${rel}: Contains deprecated AOS.init call`
    );
});
console.log(`✅ PASS: All ${htmlFiles.length} HTML files properly load Framer Motion & Motion UX engine (0 deprecated tags)`);

// Test 2: Verify vendor/motion.js exports Framer Motion primitives
const motionVendorCode = fs.readFileSync(path.join(WEBSITE_DIR, 'js/vendor/motion.js'), 'utf8');
const vmCtx = {
    console, Math, setTimeout, clearTimeout, queueMicrotask,
    requestAnimationFrame: fn => setTimeout(fn, 16), cancelAnimationFrame: id => clearTimeout(id)
};
vmCtx.globalThis = vmCtx;
vmCtx.self = vmCtx;
vmCtx.window = vmCtx;
vm.createContext(vmCtx);
vm.runInContext('var exports = undefined; var module = undefined;\n' + motionVendorCode, vmCtx);

assert(vmCtx.Motion, 'Motion library must be defined on window');
assert.strictEqual(typeof vmCtx.Motion.animate, 'function', 'Motion.animate must be a function');
assert.strictEqual(typeof vmCtx.Motion.inView, 'function', 'Motion.inView must be a function');
assert.strictEqual(typeof vmCtx.Motion.scroll, 'function', 'Motion.scroll must be a function');
assert.strictEqual(typeof vmCtx.Motion.stagger, 'function', 'Motion.stagger must be a function');
assert.strictEqual(typeof vmCtx.Motion.spring, 'function', 'Motion.spring must be a function');
console.log('✅ PASS: Framer Motion primitives (animate, inView, scroll, stagger, spring) verified in vendor/motion.js');

// Test 3: Verify motion-ux.js structure and exports
const motionUxCode = fs.readFileSync(path.join(WEBSITE_DIR, 'js/motion-ux.js'), 'utf8');
assert(motionUxCode.includes('initScrollProgressBar'), 'motion-ux.js must define initScrollProgressBar');
assert(motionUxCode.includes('initNavbarElevation'), 'motion-ux.js must define initNavbarElevation');
assert(motionUxCode.includes('initHeroAnimations'), 'motion-ux.js must define initHeroAnimations');
assert(motionUxCode.includes('initSectionHeaders'), 'motion-ux.js must define initSectionHeaders');
assert(motionUxCode.includes('initCardGridReveals'), 'motion-ux.js must define initCardGridReveals');
assert(motionUxCode.includes('initDataAosConverter'), 'motion-ux.js must define initDataAosConverter');
assert(motionUxCode.includes('initAnimatedCounters'), 'motion-ux.js must define initAnimatedCounters');
assert(motionUxCode.includes('initTactileMicrointeractions'), 'motion-ux.js must define initTactileMicrointeractions');
assert(motionUxCode.includes('initFloatingCtaAnimations'), 'motion-ux.js must define initFloatingCtaAnimations');
assert(motionUxCode.includes('animateModalOpen'), 'motion-ux.js must define animateModalOpen');
assert(motionUxCode.includes('animateModalClose'), 'motion-ux.js must define animateModalClose');
assert(motionUxCode.includes('animateThankYouScreen'), 'motion-ux.js must define animateThankYouScreen');
assert(motionUxCode.includes('window.VPSMotion'), 'motion-ux.js must export window.VPSMotion');
console.log('✅ PASS: All 12 animation subsystems and VPSMotion export methods verified in motion-ux.js');

// Test 4: Verify CSS optimizations in improvements.css
const improvementsCss = fs.readFileSync(path.join(WEBSITE_DIR, 'css/improvements.css'), 'utf8');
assert(improvementsCss.includes('#scrollProgressBar'), 'improvements.css must define #scrollProgressBar');
assert(improvementsCss.includes('will-change: transform, opacity'), 'improvements.css must include will-change optimizations for cards');
assert(improvementsCss.includes('will-change: transform, box-shadow'), 'improvements.css must include will-change optimizations for buttons');
console.log('✅ PASS: Hardware acceleration & Framer Motion progress bar styles verified in improvements.css');

// Test 5: Verify main.js integrates with VPSMotion modal and thank you screen
const mainJs = fs.readFileSync(path.join(WEBSITE_DIR, 'js/main.js'), 'utf8');
assert(mainJs.includes('VPSMotion.animateModalOpen'), 'main.js must call VPSMotion.animateModalOpen in openPopup');
assert(mainJs.includes('VPSMotion.animateModalClose'), 'main.js must call VPSMotion.animateModalClose in closePopup');
assert(mainJs.includes('VPSMotion.animateThankYouScreen'), 'main.js must call VPSMotion.animateThankYouScreen in showLeadThankYouScreen');
console.log('✅ PASS: Modal & Thank You Screen Framer Motion hooks verified in main.js');

console.log('\n🎉 ALL FRAMER MOTION VERIFICATION CHECKS PASSED (100% CLEAN)!\n');
process.exit(0);
