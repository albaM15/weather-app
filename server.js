import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8000;
const BASE_DIR = __dirname;

const server = http.createServer((req, res) => {
    let filePath = path.join(BASE_DIR, req.url === '/' ? 'index.html' : req.url);

    // Securidad: evitar acceso fuera del directorio
    if (!filePath.startsWith(BASE_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Acceso denegado');
        return;
    }

    // Si es un directorio, servir index.html
    try {
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
    } catch (err) {
        // El archivo no existe
    }

    // Leer y servir el archivo
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Archivo no encontrado');
            return;
        }

        const ext = path.extname(filePath);
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, 'localhost', () => {
    console.log(`🚀 Weather App ejecutándose en http://localhost:${PORT}`);
    console.log('📁 Sirviendo desde:', BASE_DIR);
    console.log('⏹️  Presiona Ctrl+C para detener');
});
