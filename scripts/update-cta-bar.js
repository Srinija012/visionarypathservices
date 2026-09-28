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

const DEFAULT_WA = 'https://wa.me/918150949070?text=Hello%20Visionary%20Path%20Services%2C%20I%20would%20like%20to%20get%20expert%20guidance%20regarding%20education%20loan%20options%20and%20eligibility%20for%20higher%20studies.%20Please%20assist%20me.';

function generateCtaBar(waUrl) {
    return `    <!-- BOTTOM FIXED/STICKY CTA BAR (Modern High-Converting 3-Button Action Dock) -->
    <nav class="bottom-cta-bar" id="bottomCtaBar" aria-label="Quick Actions">
        <div class="bottom-cta-container">
            <a href="tel:9063703038" class="cta-bar-btn cta-btn-call" aria-label="Call Desk">
                <svg class="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span class="cta-label">Call Desk</span>
            </a>

            <a href="${waUrl}" target="_blank" rel="noopener" class="cta-bar-btn cta-btn-whatsapp" aria-label="WhatsApp">
                <svg class="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span class="cta-label">WhatsApp</span>
            </a>

            <button type="button" class="cta-bar-btn cta-btn-book" onclick="openPopup()" aria-label="Book Visit">
                <svg class="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="3" ry="3"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span class="cta-label">Book Visit</span>
            </button>
        </div>
    </nav>`;
}

const htmlFiles = getHtmlFiles(WEBSITE_DIR);
console.log(`Processing ${htmlFiles.length} HTML files...`);

let updatedCount = 0;

for (const filePath of htmlFiles) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const rel = path.relative(WEBSITE_DIR, filePath);

    // Extract existing WhatsApp url if present
    const waMatch = content.match(/<a[^>]+class=[\"'][^\"']*whatsapp-float[^\"']*[\"'][^>]*href=[\"']([^\"']+)[\"']|<a[^>]+href=[\"']([^\"']+)[\"'][^>]*class=[\"'][^\"']*whatsapp-float[^\"']*[\"']/i);
    const waUrl = (waMatch ? (waMatch[1] || waMatch[2]) : null) || DEFAULT_WA;

    const ctaBarMarkup = generateCtaBar(waUrl);

    // If already has bottomCtaBar, update it
    if (content.includes('id="bottomCtaBar"')) {
        content = content.replace(/<!-- BOTTOM FIXED\/STICKY CTA BAR[\s\S]*?<\/nav>/i, ctaBarMarkup);
        fs.writeFileSync(filePath, content, 'utf-8');
        updatedCount++;
        continue;
    }

    // Pattern 1: floating eligibility button followed by floating whatsapp button
    const floatBlockRegex = /(?:<!--\s*FLOATING ELIGIBILITY QUICK CTA[\s\S]*?-->\s*)?<button\s+id="floatingEligibilityBtn"[\s\S]*?<\/button>\s*(?:<!--\s*Floating WhatsApp[\s\S]*?-->|<!--\s*WHATSAPP FLOATING BUTTON[\s\S]*?-->)?\s*<a\s+[^>]*class="[^"]*whatsapp-float[^"]*"[\s\S]*?<\/a>/i;

    if (floatBlockRegex.test(content)) {
        content = content.replace(floatBlockRegex, ctaBarMarkup);
        fs.writeFileSync(filePath, content, 'utf-8');
        updatedCount++;
        console.log(`[UPDATED] ${rel} (Replaced float block)`);
        continue;
    }

    // Pattern 2: isolated whatsapp-float
    const isolatedWaRegex = /(?:<!--\s*Floating WhatsApp[\s\S]*?-->|<!--\s*WHATSAPP FLOATING BUTTON[\s\S]*?-->)?\s*<a\s+[^>]*class="[^"]*whatsapp-float[^"]*"[\s\S]*?<\/a>/i;
    if (isolatedWaRegex.test(content)) {
        content = content.replace(isolatedWaRegex, '');
        // Insert ctaBarMarkup before scripts
        const scriptMatch = content.match(/(\s*<!--\s*Framer Motion[\s\S]*|<script[^>]*src=[\s\S]*<\/body>)/i);
        if (scriptMatch) {
            content = content.replace(scriptMatch[1], `\n\n${ctaBarMarkup}\n${scriptMatch[1]}`);
        } else {
            content = content.replace('</body>', `${ctaBarMarkup}\n</body>`);
        }
        fs.writeFileSync(filePath, content, 'utf-8');
        updatedCount++;
        console.log(`[UPDATED] ${rel} (Replaced isolated whatsapp-float)`);
        continue;
    }

    // Pattern 3: Neither present (e.g. 404.html)
    const scriptMatch = content.match(/(\s*<!--\s*Framer Motion[\s\S]*|<script[^>]*src=[\s\S]*<\/body>)/i);
    if (scriptMatch) {
        content = content.replace(scriptMatch[1], `\n\n${ctaBarMarkup}\n${scriptMatch[1]}`);
    } else {
        content = content.replace('</body>', `${ctaBarMarkup}\n</body>`);
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    updatedCount++;
    console.log(`[UPDATED] ${rel} (Injected before scripts)`);
}

console.log(`\nSuccessfully updated ${updatedCount} files with Modern Bottom CTA Bar!`);
