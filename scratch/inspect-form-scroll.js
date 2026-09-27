const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const WEBSITE_DIR = path.resolve(__dirname, '../website');
const PORT = 3012;

const MIME = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
};

function startServer() {
    const server = http.createServer((req, res) => {
        let reqPath = decodeURI(req.url.split('?')[0]);
        if (reqPath === '/') reqPath = '/index.html';
        const filePath = path.join(WEBSITE_DIR, reqPath);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not Found');
            } else {
                const ext = path.extname(filePath).toLowerCase();
                res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
                res.end(data);
            }
        });
    });

    return new Promise(resolve => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

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
        if (this.ws) this.ws.close();
    }
}

async function run() {
    const server = await startServer();
    const profileDir = path.resolve(__dirname, '../scratch/chrome-profile-test');
    if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

    const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    const chrome = spawn(chromePath, [
        '--headless=new',
        `--user-data-dir=${profileDir}`,
        '--remote-debugging-port=9223',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check'
    ]);

    let wsUrl = null;
    for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 200));
        try {
            const res = await fetch('http://127.0.0.1:9223/json/new', { method: 'PUT' });
            const pageData = await res.json();
            wsUrl = pageData.webSocketDebuggerUrl;
            if (wsUrl) break;
        } catch (e) {}
    }

    if (!wsUrl) {
        console.error('Failed to connect to chrome');
        chrome.kill('SIGKILL');
        server.close();
        process.exit(1);
    }

    const cdp = new ChromeDevToolsClient(wsUrl);
    await cdp.connect();
    await cdp.send('Page.enable');

    const viewports = [
        { name: 'iPhone SE (375x667)', width: 375, height: 667 },
        { name: 'iPhone 14 (390x844)', width: 390, height: 844 },
        { name: 'Desktop (1366x768)', width: 1366, height: 768 }
    ];

    for (const vp of viewports) {
        await cdp.send('Emulation.setDeviceMetricsOverride', {
            width: vp.width,
            height: vp.height,
            deviceScaleFactor: 2,
            mobile: vp.width < 1000
        });

        await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
        await new Promise(r => setTimeout(r, 1000));

        // Open popup
        const evalRes = await cdp.send('Runtime.evaluate', {
            expression: `(() => {
                if (typeof openPopup === 'function') openPopup();
                const modal = document.querySelector('.popup-modal');
                const overlay = document.querySelector('.popup-overlay');
                const left = document.querySelector('.popup-left');
                const right = document.querySelector('.popup-right');
                const form = document.querySelector('.popup-form');
                if (!modal) return { found: false };
                return {
                    found: true,
                    modalScrollHeight: modal.scrollHeight,
                    modalClientHeight: modal.clientHeight,
                    modalOffsetHeight: modal.offsetHeight,
                    overlayScrollHeight: overlay.scrollHeight,
                    overlayClientHeight: overlay.clientHeight,
                    leftHeight: left ? left.offsetHeight : 0,
                    rightHeight: right ? right.offsetHeight : 0,
                    formHeight: form ? form.offsetHeight : 0,
                    windowHeight: window.innerHeight
                };
            })()`,
            returnByValue: true
        });

        console.log(`\n--- Viewport: ${vp.name} ---`);
        console.log(evalRes.result.value);
    }

    cdp.close();
    chrome.kill('SIGKILL');
    server.close();
}

run().catch(console.error);
