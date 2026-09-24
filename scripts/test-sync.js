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
let testsPassed = 0;

console.log(`\n=== Running Automated Verification Test Suite for VPS Website ===`);
console.log(`Checking ${htmlFiles.length} HTML files...\n`);

for (const filePath of htmlFiles) {
    const relPath = path.relative(WEBSITE_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Test 1: Navbar markers present
    if (!content.includes('<!-- VPS_NAVBAR_START -->') || !content.includes('<!-- VPS_NAVBAR_END -->')) {
        console.error(`[FAIL] ${relPath}: Missing standardized VPS_NAVBAR tags.`);
        errors++;
    } else {
        testsPassed++;
    }

    // Test 2: Footer markers present
    if (!content.includes('<!-- VPS_FOOTER_START -->') || !content.includes('<!-- VPS_FOOTER_END -->')) {
        console.error(`[FAIL] ${relPath}: Missing standardized VPS_FOOTER tags.`);
        errors++;
    } else {
        testsPassed++;
    }

    // Test 3: No unreplaced {{ROOT}} tokens
    if (content.includes('{{ROOT}}')) {
        console.error(`[FAIL] ${relPath}: Contains unreplaced {{ROOT}} tokens.`);
        errors++;
    } else {
        testsPassed++;
    }

    // Test 4: Official Contact numbers present
    if (!content.includes('9063703038')) {
        console.error(`[FAIL] ${relPath}: Missing primary phone number 9063703038.`);
        errors++;
    } else {
        testsPassed++;
    }

    if (!content.includes('8150949070')) {
        console.error(`[FAIL] ${relPath}: Missing WhatsApp advisory number 8150949070.`);
        errors++;
    } else {
        testsPassed++;
    }

    // Test 5: Verify Partner Lenders link is in navbar
    if (!content.includes('Partner Lenders</a>')) {
        console.error(`[FAIL] ${relPath}: Missing Partner Lenders navbar link.`);
        errors++;
    } else {
        testsPassed++;
    }
}

console.log(`\nSummary:`);
console.log(`Passed checks: ${testsPassed}`);
console.log(`Errors found:  ${errors}`);

if (errors > 0) {
    console.error(`\nTest suite FAILED with ${errors} errors.`);
    process.exit(1);
} else {
    console.log(`\nAll automated test checks PASSED cleanly (0 errors)!\n`);
    process.exit(0);
}
