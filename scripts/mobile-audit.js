const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const WEBSITE_DIR = path.resolve(__dirname, '../website');
const PORT = 3009;

// MIME types for static server
const MIME = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff'
};

// 1. Create simple local static HTTP server
function startServer() {
    const server = http.createServer((req, res) => {
        let reqPath = decodeURI(req.url.split('?')[0]);
        if (reqPath === '/') reqPath = '/index.html';
        const filePath = path.join(WEBSITE_DIR, reqPath);

        // Security check
        if (!filePath.startsWith(WEBSITE_DIR)) {
            res.writeHead(403);
            return res.end('Forbidden');
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found: ' + reqPath);
            } else {
                const ext = path.extname(filePath).toLowerCase();
                res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
                res.end(data);
            }
        });
    });

    return new Promise((resolve) => {
        server.listen(PORT, '127.0.0.1', () => {
            console.log(`[HTTP] Local test server listening on http://127.0.0.1:${PORT}`);
            resolve(server);
        });
    });
}

// 2. Discover all 29 HTML pages
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

// 3. Simple CDP Client via native WebSocket
class ChromeDevToolsClient {
    constructor(wsUrl) {
        this.wsUrl = wsUrl;
        this.msgId = 1;
        this.callbacks = new Map();
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.wsUrl);
            this.ws.onopen = () => resolve();
            this.ws.onerror = (e) => reject(e);
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.id && this.callbacks.has(data.id)) {
                    const { resolve, reject } = this.callbacks.get(data.id);
                    this.callbacks.delete(data.id);
                    if (data.error) reject(data.error);
                    else resolve(data.result);
                }
            };
        });
    }

    send(method, params = {}) {
        return new Promise((resolve, reject) => {
            const id = this.msgId++;
            this.callbacks.set(id, { resolve, reject });
            this.ws.send(JSON.stringify({ id, method, params }));
        });
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// Main audit orchestration
async function runAudit() {
    const server = await startServer();
    const htmlFiles = getHtmlFiles(WEBSITE_DIR).sort();
    console.log(`[AUDIT] Discovered ${htmlFiles.length} pages to audit.`);

    const profileDir = path.resolve(__dirname, '../scratch/chrome-profile');
    if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

    const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    const chrome = spawn(chromePath, [
        '--headless=new',
        `--user-data-dir=${profileDir}`,
        '--remote-debugging-port=9222',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check'
    ]);

    // Wait for Chrome to be ready
    let wsUrl = null;
    for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 250));
        try {
            const res = await fetch('http://127.0.0.1:9222/json/new', { method: 'PUT' });
            const pageData = await res.json();
            wsUrl = pageData.webSocketDebuggerUrl;
            if (wsUrl) break;
        } catch (e) {
            // Chrome still initializing
        }
    }

    if (!wsUrl) {
        console.error('[FAIL] Could not connect to headless Chrome on port 9222');
        chrome.kill('SIGKILL');
        server.close();
        process.exit(1);
    }

    const cdp = new ChromeDevToolsClient(wsUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');

    const viewports = [
        { name: '375px (Compact Mobile)', width: 375, height: 812 },
        { name: '390px (Standard Mobile)', width: 390, height: 844 },
        { name: '430px (Large Mobile)', width: 430, height: 932 },
        { name: '768px (Tablet)', width: 768, height: 1024 }
    ];

    const auditResults = [];
    let totalOverflowIssues = 0;
    let totalTouchTargetIssues = 0;
    let totalInputHeightIssues = 0;

    for (const filePath of htmlFiles) {
        const relPath = path.relative(WEBSITE_DIR, filePath);
        const pageUrl = `http://127.0.0.1:${PORT}/${relPath.replace(/\\/g, '/')}`;
        const pageSummary = { page: relPath, viewports: {} };

        for (const vp of viewports) {
            // Set device metrics
            await cdp.send('Emulation.setDeviceMetricsOverride', {
                width: vp.width,
                height: vp.height,
                deviceScaleFactor: 2,
                mobile: true
            });

            // Navigate
            await cdp.send('Page.navigate', { url: pageUrl });
            // Wait for load event
            await new Promise((r) => setTimeout(r, 600));

            // Run in-page evaluation script
            const evalResult = await cdp.send('Runtime.evaluate', {
                expression: `(() => {
                    const winW = window.innerWidth;
                    const docW = document.documentElement.scrollWidth;
                    const bodyW = document.body ? document.body.scrollWidth : 0;
                    const maxW = Math.max(docW, bodyW);
                    const hasOverflow = maxW > winW + 1;

                    // Find overflowing elements
                    const overflowingElements = [];
                    const allEls = document.querySelectorAll('*');
                    allEls.forEach(el => {
                        // Skip head / meta / style / script / hidden
                        if (['HEAD', 'STYLE', 'SCRIPT', 'NOSCRIPT', 'META', 'LINK', 'TITLE'].includes(el.tagName)) return;
                        const style = window.getComputedStyle(el);
                        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

                        // Intentional marquee tracks and carousels with horizontal swipe
                        if (el.closest('.marquee, .marquee-track, .partners-marquee, .why-nine-grid')) return;

                        const rect = el.getBoundingClientRect();
                        // Check if right edge exceeds viewport by more than 1px
                        if (rect.width > 0 && rect.right > winW + 1) {
                            overflowingElements.push({
                                tag: el.tagName.toLowerCase(),
                                id: el.id || '',
                                className: (el.className && typeof el.className === 'string') ? el.className.trim() : '',
                                width: Math.round(rect.width),
                                right: Math.round(rect.right),
                                overflowPx: Math.round(rect.right - winW)
                            });
                        }
                    });

                    // Touch target checks (interactive elements < 44px)
                    const smallTouchTargets = [];
                    const interactives = document.querySelectorAll('button:not(.why-carousel-dot), .btn, input[type="submit"], input[type="button"], a.btn, .nav-links a, .hamburger, .floating-eligibility-btn, .whatsapp-float, select');
                    interactives.forEach(el => {
                        const style = window.getComputedStyle(el);
                        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || style.pointerEvents === 'none') return;
                        if (el.classList.contains('hide')) return;
                        const rect = el.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0 && (rect.width < 43 || rect.height < 43)) {
                            smallTouchTargets.push({
                                tag: el.tagName.toLowerCase(),
                                text: el.innerText ? el.innerText.trim().slice(0, 25) : '',
                                className: (el.className && typeof el.className === 'string') ? el.className.trim() : '',
                                width: Math.round(rect.width),
                                height: Math.round(rect.height)
                            });
                        }
                    });

                    // Form input checks: height >= 48px, font-size >= 16px
                    const sub48Inputs = [];
                    const inputs = document.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):not([type="range"]), select, textarea');
                    inputs.forEach(inp => {
                        const style = window.getComputedStyle(inp);
                        if (style.display === 'none' || style.visibility === 'hidden') return;
                        const rect = inp.getBoundingClientRect();
                        const h = Math.round(rect.height);
                        const fs = parseFloat(style.fontSize) || 16;
                        if (h > 0 && h < 48) {
                            sub48Inputs.push({
                                tag: inp.tagName.toLowerCase(),
                                name: inp.name || inp.id || '',
                                height: h,
                                fontSize: fs,
                                className: (inp.className && typeof inp.className === 'string') ? inp.className.trim() : ''
                            });
                        }
                    });

                    // Heading typography clamp check
                    const heroH1 = document.querySelector('h1');
                    let h1Size = 0;
                    if (heroH1) {
                        h1Size = parseFloat(window.getComputedStyle(heroH1).fontSize) || 0;
                    }

                    // Floating sticky clearance
                    const stickyButtons = [];
                    const floaters = document.querySelectorAll('.whatsapp-float, .floating-eligibility-btn, .mobile-bottom-bar, .sticky-cta-bar');
                    floaters.forEach(fl => {
                        const style = window.getComputedStyle(fl);
                        stickyButtons.push({
                            className: fl.className,
                            bottom: style.bottom,
                            zIndex: style.zIndex,
                            paddingBottom: style.paddingBottom
                        });
                    });

                    return {
                        winW,
                        maxW,
                        hasOverflow,
                        overflowingElements: overflowingElements.slice(0, 10),
                        smallTouchTargets: smallTouchTargets.slice(0, 10),
                        sub48Inputs: sub48Inputs.slice(0, 10),
                        h1Size: Math.round(h1Size),
                        stickyButtons
                    };
                })()`,
                returnByValue: true
            });

            const res = evalResult.result ? evalResult.result.value : null;
            if (res) {
                if (res.hasOverflow) totalOverflowIssues++;
                if (res.smallTouchTargets.length > 0) totalTouchTargetIssues += res.smallTouchTargets.length;
                if (res.sub48Inputs.length > 0) totalInputHeightIssues += res.sub48Inputs.length;
                pageSummary.viewports[vp.width] = res;
            }
        }

        auditResults.push(pageSummary);
        const issues375 = pageSummary.viewports[375];
        const status = issues375 && !issues375.hasOverflow ? '✅ ZERO OVERFLOW' : '❌ OVERFLOW';
        console.log(`[${status}] ${relPath.padEnd(45)} @375px (docW: ${issues375 ? issues375.maxW : '?'}, winW: 375, H1: ${issues375 ? issues375.h1Size : '?'}px)`);
        if (issues375 && issues375.overflowingElements.length > 0) {
            console.log(`   Overflowing elements (${issues375.overflowingElements.length}):`, JSON.stringify(issues375.overflowingElements.slice(0, 3)));
        }
        if (issues375 && issues375.sub48Inputs.length > 0) {
            console.log(`   Inputs < 48px (${issues375.sub48Inputs.length}):`, JSON.stringify(issues375.sub48Inputs.slice(0, 3)));
        }
    }

    console.log('\n================ AUDIT SUMMARY ================');
    console.log(`Total Pages Audited: ${auditResults.length}`);
    console.log(`Total Viewport Overflow Instances: ${totalOverflowIssues}`);
    console.log(`Total Small Touch Target Instances: ${totalTouchTargetIssues}`);
    console.log(`Total Sub-48px Inputs: ${totalInputHeightIssues}`);

    // Save report to scratch/audit-report.json
    fs.writeFileSync(
        path.resolve(__dirname, '../scratch/audit-initial.json'),
        JSON.stringify(auditResults, null, 2)
    );

    cdp.close();
    chrome.kill('SIGKILL');
    server.close();
}

runAudit().catch(err => {
    console.error('Audit error:', err);
    process.exit(1);
});
