// Run with: node server.cjs. No npm packages are needed.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { handler } = require('./netlify/functions/enquiry.js');
const root = __dirname;
const port = Number(process.env.PORT || 3000);
const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.xml': 'application/xml',
    '.txt': 'text/plain'
};
const publicFiles = new Set([
    'index.html',
    'about.html',
    'services.html',
    'enquiry.html',
    'contact.html',
    'faq.html',
    'staff-login.html',
    'admin.html',
    'style.css',
    'script.js',
    'enquiry-check.js',
    'robots.txt',
    'sitemap.xml'
]);
http.createServer(async function (req, res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    try {
        const url = new URL(req.url, 'http://localhost');
        if (url.pathname === '/.netlify/functions/enquiry') {
            let body = '';
            for await (const chunk of req) {
                body += chunk;
                if (Buffer.byteLength(body) > 8192) {
                    res.writeHead(413, {
                        'Content-Type': 'application/json'
                    });
                    res.end(
                        JSON.stringify({
                            error: 'The message is too large.'
                        })
                    );
                    return;
                }
            }
            const output = await handler({
                httpMethod: req.method,
                headers: req.headers,
                body
            });
            res.writeHead(output.statusCode, output.headers);
            res.end(output.body);
            return;
        }
        if (!['GET', 'HEAD'].includes(req.method)) {
            res.writeHead(405, {
                Allow: 'GET, HEAD'
            });
            res.end();
            return;
        }
        const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
        const filepath = path.resolve(root, relative);
        if (
            !filepath.startsWith(root + path.sep) ||
            (!publicFiles.has(relative) && !/^(images|data|vendor)\//.test(relative))
        ) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        const body = await fs.readFile(filepath);
        res.writeHead(200, {
            'Content-Type': types[path.extname(filepath)] || 'application/octet-stream'
        });
        res.end(req.method === 'HEAD' ? undefined : body);
    } catch (error) {
        res.writeHead(404);
        res.end('Not found');
    }
}).listen(port, '127.0.0.1', function () {
    return console.log(`Open http://localhost:${port} in your browser. Press Ctrl+C to stop.`);
});
