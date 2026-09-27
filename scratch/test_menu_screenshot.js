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
    '.jpg': 'image/jpeg',
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

class CDP {
    constructor(wsUrl) {
        this.wsUrl = wsUrl;
        this.msgId = 1;
        this.callbacks = new Map();
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.wsUrl);
            this.ws.onopen = () => resolve();
            this.ws.onerror = reject;
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
    close() { if (this.ws) this.ws.close(); }
}

async function run() {
    const server = await startServer();
    const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    const chrome = spawn(chromePath, [
        '--headless=new',
        '--remote-debugging-port=9223', '--user-data-dir=' + path.resolve(__dirname, 'chrome-profile'),
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check'
    ]);

    let wsUrl = null;
    for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 250));
        try {
            const res = await fetch('http://127.0.0.1:9223/json/new', { method: 'PUT' });
            const data = await res.json();
            wsUrl = data.webSocketDebuggerUrl;
            if (wsUrl) break;
        } catch (e) {}
    }

    if (!wsUrl) {
        chrome.kill();
        server.close();
        console.error('Failed to get wsUrl');
        process.exit(1);
    }

    const cdp = new CDP(wsUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');

    // Emulate iPhone / Mobile viewport: 390x844
    await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
    await new Promise(r => setTimeout(r, 1200));

    // Click hamburger button to open menu
    await cdp.send('Runtime.evaluate', {
        expression: `
            document.getElementById('hamburger').click();
        `
    });
    await new Promise(r => setTimeout(r, 600));

    // Capture screenshot
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.resolve(__dirname, 'current_menu.png');
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot to:', outPath);

    cdp.close();
    chrome.kill();
    server.close();
}

run().catch(console.error);
