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

const htmlFiles = getHtmlFiles(WEBSITE_DIR);
let modifiedCount = 0;

for (const filePath of htmlFiles) {
    const rel = path.relative(WEBSITE_DIR, filePath);
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // 1. Unify green-highlight to vps-orange-text
    if (content.includes('class="green-highlight"') || content.includes("class='green-highlight'")) {
        content = content.replace(/class=["']green-highlight["']/g, 'class="vps-orange-text"');
        modified = true;
    }

    // 2. Unify popup titles that might still have non-standard spans
    // Ensure any <span class="...">Together!</span> uses vps-orange-text
    if (content.includes('Together!</span>') && !content.includes('class="vps-orange-text">Together!</span>')) {
        content = content.replace(/<span\s+class=["'][^"']*["']>Together!<\/span>/g, '<span class="vps-orange-text">Together!</span>');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`[UPDATED] ${rel}`);
        modifiedCount++;
    }
}

console.log(`\nSuccessfully standardized brand consistency across ${modifiedCount} files.`);
