// Netlify supplies URL automatically. Alternatively: node build.cjs https://your-live-address
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const raw = process.argv[2] || process.env.URL;
if (!raw) {
    console.error(
        'Supply the final website address: node build.cjs https://your-site.netlify.app'
    );
    process.exit(1);
}
const url = new URL(raw);
if (url.protocol !== 'https:' || url.search || url.hash) {
    throw new Error('Use the HTTPS site address, without query strings or fragments.');
}
const base = url.href.replace(/\/$/, '');
const publicPages = ['index', 'about', 'services', 'enquiry', 'faq', 'contact'];
const output = path.join(root, 'dist');
fs.rmSync(output, {
    recursive: true,
    force: true
});
fs.mkdirSync(output);
for (const file of [
    ...publicPages.map(function (p) {
        return p + '.html';
    }),
    'staff-login.html',
    'admin.html',
    'style.css',
    'script.js',
    'enquiry-check.js',
    '_headers'
]) {
    let text = fs.readFileSync(path.join(root, file), 'utf8');
    if (
        publicPages.some(function (p) {
            return file === p + '.html';
        })
    ) {
        const canonical = `${base}/${file}`;
        const tag = `<link rel="canonical" href="${canonical.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">`;
        text = text.replace('</head>', ` ${tag}\n</head>`);
    }
    fs.writeFileSync(path.join(output, file), text);
}
for (const folder of ['images', 'data', 'vendor']) {
    fs.cpSync(path.join(root, folder), path.join(output, folder), {
        recursive: true
    });
}
const xmlEscape = function (s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
};
fs.writeFileSync(
    path.join(output, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        publicPages
            .map(function (p) {
                return `  <url><loc>${xmlEscape(base)}/${p}.html</loc></url>`;
            })
            .join('\n') +
        '\n</urlset>\n'
);
fs.writeFileSync(
    path.join(output, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /.netlify/\n\nSitemap: ${base}/sitemap.xml\n`
);
console.log('Built dist with sitemap and canonical links for ' + base);
