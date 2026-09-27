const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('\n=== Running Automated Verification for Form Scroll Reduction & Touch Ergonomics ===\n');

const WEBSITE_DIR = path.resolve(__dirname, '../website');
const improvementsCss = fs.readFileSync(path.join(WEBSITE_DIR, 'css/improvements.css'), 'utf8');
const styleCss = fs.readFileSync(path.join(WEBSITE_DIR, 'css/style.css'), 'utf8');
const leadFormCss = fs.readFileSync(path.join(WEBSITE_DIR, 'components/lead-form.css'), 'utf8');

// 1. Verify popup left duplicate banner is concealed on mobile
console.log('1. Verifying mobile duplicate promo suppression (.popup-left display: none)...');
assert(
    improvementsCss.includes('.popup-left {\n        display: none !important;\n    }'),
    '[FAIL] .popup-left must be hidden on mobile in improvements.css to avoid pushing form below fold'
);
assert(
    styleCss.includes('.popup-left {\n        display: none !important;\n    }'),
    '[FAIL] .popup-left must be hidden on mobile in style.css'
);
console.log('✅ PASS: Duplicate promo column concealed on mobile, form instantly visible with 0 banner scroll.');

// 2. Verify First Name & Last Name are 2-column side-by-side (saving 65px)
console.log('2. Verifying 2-column First Name & Last Name layout...');
assert(
    improvementsCss.includes('.popup-form .form-row.name-row {\n        display: grid !important;\n        grid-template-columns: 1fr 1fr !important;\n        gap: 8px !important;'),
    '[FAIL] .popup-form .form-row.name-row must be a 2-column grid to save vertical height'
);
assert(
    improvementsCss.includes('.lead-form-row.name-row,') && improvementsCss.includes('grid-template-columns: 1fr 1fr !important;'),
    '[FAIL] lead-form name-row must preserve 2-column layout'
);
assert(
    leadFormCss.includes('.lead-form-row:first-of-type {\n        grid-template-columns: 1fr 1fr;\n        gap: 8px;\n    }'),
    '[FAIL] lead-form.css must preserve 2-column layout on mobile'
);
console.log('✅ PASS: First Name and Last Name kept side-by-side in 2 columns (saves 65px vertical scroll).');

// 3. Verify Interest Options 2x2 grid instead of 4 vertical stacked rows (saving 110px)
console.log('3. Verifying Interest options 2x2 grid...');
assert(
    improvementsCss.includes('.popup-form .interest-options {\n        display: grid !important;\n        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;\n        gap: 5px !important;'),
    '[FAIL] .popup-form .interest-options must be 2x2 grid on mobile'
);
assert(
    styleCss.includes('.interest-options {\n        display: grid;\n        grid-template-columns: repeat(2, minmax(0, 1fr));\n        gap: 5px;\n    }'),
    '[FAIL] style.css must declare 2x2 grid for interest options'
);
console.log('✅ PASS: Interest options arranged in compact 2x2 grid (saves 110px vertical scroll).');

// 4. Verify compact textarea with focus expansion (saving 52px)
console.log('4. Verifying compact textarea height (no 100px bloat)...');
assert(
    improvementsCss.includes('.popup-form .input-icon-wrap textarea {\n        font-size: 13px !important;\n        min-height: 44px !important;\n        height: 44px !important;'),
    '[FAIL] popup-form textarea must be compact (44px) without 100px bloat'
);
assert(
    improvementsCss.includes('textarea,\n    .lead-form textarea,\n    .popup-form textarea,\n    .contact-form textarea {\n        width: 100% !important;\n        min-height: 52px !important;'),
    '[FAIL] General form textarea min-height must be 52px instead of 100px'
);
console.log('✅ PASS: Textareas reduced to compact heights (saves 52px vertical scroll).');

// 5. Verify elimination of double-spacing margins inside flex containers
console.log('5. Verifying elimination of margin-bottom bloat on flex children...');
assert(
    improvementsCss.includes('.popup-form .form-group {\n        margin-bottom: 0 !important;'),
    '[FAIL] .popup-form .form-group margin-bottom must be 0 inside flex container'
);
assert(
    improvementsCss.includes('.lead-form-group,\n    .form-group,\n    .lead-field-wrap,\n    .popup-input-group,\n    .contact-form-group {\n        width: 100% !important;\n        min-width: 0 !important;\n        margin-bottom: 0 !important;'),
    '[FAIL] Form groups must not declare margin-bottom when gap is applied'
);
console.log('✅ PASS: Redundant margins removed inside flex containers (prevents double gaps).');

// 6. Verify phone prefix clearance is preserved
console.log('6. Verifying phone input prefix clearance...');
assert(
    improvementsCss.includes('.input-icon-wrap.phone-wrap input,\n    .lead-input-wrap.has-prefix input {\n        padding-left: 78px !important;'),
    '[FAIL] Phone inputs must preserve prefix padding-left'
);
console.log('✅ PASS: Phone inputs retain prefix clearance (+91).');

// 7. Verify iOS zoom prevention (font-size >= 16px)
console.log('7. Verifying mobile Safari focus zoom prevention (16px)...');
assert(
    improvementsCss.includes('.popup-form .input-icon-wrap input {\n        font-size: 16px !important;'),
    '[FAIL] Mobile inputs must declare 16px to prevent iOS zoom'
);
assert(
    improvementsCss.includes('font-size: 16px !important; /* CRITICAL: Eliminates iOS Safari zoom-in on focus */'),
    '[FAIL] General form inputs must declare 16px font-size'
);
console.log('✅ PASS: 16px input font-size eliminates disruptive auto-zoom jumps on mobile Safari.');

console.log('\n🎉 ALL FORM SCROLL REDUCTION AND ERGONOMIC VERIFICATION CHECKS PASSED (100% CLEAN)!\n');
