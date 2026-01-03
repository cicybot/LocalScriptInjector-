/**
 * Simple Node.js Server for Local Script Injector
 * Run with: node server.js
 */

import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 8282;
const FILE_TO_SERVE = 'inject.js';

const requestListener = function (req, res) {
  // --- CORS Configuration ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  // Critical for allowing Chrome to access localhost from public HTTPS sites (Private Network Access)
  res.setHeader('Access-Control-Allow-Private-Network', 'true');

  // Handle preflight OPTIONS request immediately
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle File Serving
  if (req.url === `/${FILE_TO_SERVE}` || req.url === '/') {
    fs.readFile(path.join(process.cwd(), FILE_TO_SERVE), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "File not found. Please create 'inject.js'" }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
};

const server = http.createServer(requestListener);

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n🚀 Local Injector Server running!`);
  console.log(`👉 http://127.0.0.1:${PORT}/${FILE_TO_SERVE}`);
  console.log(`\n1. Create a file named '${FILE_TO_SERVE}' in this folder.`);
  console.log(`2. Write your JS code there.`);
  console.log(`3. Use the Chrome Extension to inject it.`);
});