const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.resolve(__dirname, '../website');
const NAVBAR_TEMPLATE_PATH = path.join(WEBSITE_DIR, 'includes/navbar.html');
const FOOTER_TEMPLATE_PATH = path.join(WEBSITE_DIR, 'includes/footer.html');

if (!fs.existsSync(NAVBAR_TEMPLATE_PATH) || !fs.existsSync(FOOTER_TEMPLATE_PATH)) {
    console.error('Error: Template files not found in website/includes/');
    process.exit(1);
}

const navbarTemplate = fs.readFileSync(NAVBAR_TEMPLATE_PATH, 'utf-8').trim();
const footerTemplate = fs.readFileSync(FOOTER_TEMPLATE_PATH, 'utf-8').trim();

// Find all HTML files recursively in website, excluding includes
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
console.log(`Found ${htmlFiles.length} HTML files to synchronize.`);

let updatedCount = 0;

for (const filePath of htmlFiles) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const relativeToWebsite = path.relative(WEBSITE_DIR, filePath);
    const depth = relativeToWebsite.split(path.sep).length - 1;
    const rootPrefix = depth === 0 ? '' : '../'.repeat(depth);

    // Prepare navbar with correct root path
    let fileNavbar = navbarTemplate.replace(/\{\{ROOT\}\}/g, rootPrefix);

    // Highlight active link if matches
    const currentRelPath = relativeToWebsite.replace(/\\/g, '/');
    if (currentRelPath === 'index.html') {
        fileNavbar = fileNavbar.replace(/class="logo"/, 'class="logo active-home"');
    } else if (currentRelPath === 'pages/services.html') {
        fileNavbar = fileNavbar.replace(/class="nav-link-services"/, 'class="nav-link-services active"');
    } else if (currentRelPath === 'pages/partner-lenders.html') {
        fileNavbar = fileNavbar.replace(/class="nav-link-partner-lenders"/, 'class="nav-link-partner-lenders active"');
    } else if (currentRelPath === 'pages/partner-with-us.html') {
        fileNavbar = fileNavbar.replace(/class="nav-link-partner-with-us"/, 'class="nav-link-partner-with-us active"');
    }

    const wrappedNavbar = `<!-- VPS_NAVBAR_START -->\n${fileNavbar}\n<!-- VPS_NAVBAR_END -->`;

    // Prepare footer with correct root path
    let fileFooter = footerTemplate.replace(/\{\{ROOT\}\}/g, rootPrefix);
    const wrappedFooter = `<!-- VPS_FOOTER_START -->\n${fileFooter}\n<!-- VPS_FOOTER_END -->`;

    let modified = false;

    // 1. Replace or insert Navbar block
    if (content.includes('<!-- VPS_NAVBAR_START -->') && content.includes('<!-- VPS_NAVBAR_END -->')) {
        const regex = /<!-- VPS_NAVBAR_START -->[\s\S]*?<!-- VPS_NAVBAR_END -->/;
        content = content.replace(regex, wrappedNavbar);
        modified = true;
    } else {
        // Find existing topbar + header
        const headerRegex = /(?:<!--\s*TOPBAR\s*-->|<!--\s*TOP BAR\s*-->|<div class="top-bar">)[\s\S]*?<\/header>/;
        if (headerRegex.test(content)) {
            content = content.replace(headerRegex, wrappedNavbar);
            modified = true;
        } else {
            console.warn(`[WARN] Could not find header pattern in ${relativeToWebsite}`);
        }
    }

    // 2. Replace or insert Footer block
    if (content.includes('<!-- VPS_FOOTER_START -->') && content.includes('<!-- VPS_FOOTER_END -->')) {
        const regex = /<!-- VPS_FOOTER_START -->[\s\S]*?<!-- VPS_FOOTER_END -->/;
        content = content.replace(regex, wrappedFooter);
        modified = true;
    } else {
        // Find existing footer (including site-disclaimer-strip if present)
        const footerRegex = /(?:<!--\s*INSTITUTIONAL REGULATORY DISCLAIMER STRIP\s*-->|<div class="site-disclaimer-strip">[\s\S]*?<\/div>\s*)?(?:<!--\s*FOOTER\s*-->|<footer class="footer">)[\s\S]*?<\/footer>/;
        if (footerRegex.test(content)) {
            content = content.replace(footerRegex, wrappedFooter);
            modified = true;
        } else {
            console.warn(`[WARN] Could not find footer pattern in ${relativeToWebsite}`);
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        updatedCount++;
    }
}

console.log(`\nSuccessfully synchronized ${updatedCount} HTML files with includes/navbar.html and includes/footer.html!`);
