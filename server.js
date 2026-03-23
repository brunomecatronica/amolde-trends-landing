const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((request, response) => {
    // 🛡️ Segurança: Bloqueia acesso a arquivos ocultos (que começam com ponto)
    if (request.url.includes('/.') || request.url.startsWith('.')) {
        response.writeHead(403, { 'Content-Type': 'text/plain' });
        response.end('403 Forbidden: Access Denied', 'utf-8');
        return;
    }

    let urlPath = request.url === '/' ? '/index.html' : request.url;
    // Remove query parameters if any (ex: index.html?v=1)
    urlPath = urlPath.split('?')[0];
    
    const filePath = path.join(PUBLIC_DIR, urlPath);

    // 🛡️ Segurança: Garante que o arquivo solicitado está DENTRO da pasta public
    if (!filePath.startsWith(PUBLIC_DIR)) {
        response.writeHead(403, { 'Content-Type': 'text/plain' });
        response.end('403 Forbidden: Out of scope', 'utf-8');
        return;
    }

    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.end(`<h1>404 Not Found</h1>`, 'utf-8');
            } else {
                response.writeHead(500);
                response.end(`Server Error: ${error.code}`);
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Landing Page (AMOLDE TRENDS) rodando em http://localhost:${PORT}`);
});

