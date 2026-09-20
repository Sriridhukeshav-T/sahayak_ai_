// SAHAYAK AI — Real Persistent Backend Database Server
// Supports MongoDB Atlas Cloud Database and Local Disk JSON Store
import 'dotenv/config';
import http from 'http';
import { dbService } from './backend/db.js';

const PORT = process.env.PORT || 5001;

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', err => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  try {
    // 1. Health & Status
    if (pathname === '/api/health' && req.method === 'GET') {
      const health = await dbService.getHealth();
      return sendJson(200, health);
    }

    // 2. Users / Auth
    if (pathname === '/api/users' && req.method === 'GET') {
      const users = await dbService.getUsers();
      return sendJson(200, users);
    }

    if ((pathname === '/api/users' || pathname === '/api/auth/register') && req.method === 'POST') {
      const body = await parseBody(req);
      const result = await dbService.registerUser(body);
      return sendJson(result.success ? 201 : 400, result);
    }

    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await parseBody(req);
      const result = await dbService.loginUser(body.identifier, body.password);
      return sendJson(result.success ? 200 : 401, result);
    }

    // 3. Applications
    if (pathname === '/api/applications' && req.method === 'GET') {
      const userId = parsedUrl.searchParams.get('userId');
      const apps = await dbService.getApplications(userId);
      return sendJson(200, apps);
    }

    if (pathname === '/api/applications' && req.method === 'POST') {
      const body = await parseBody(req);
      const result = await dbService.createApplication(body);
      return sendJson(201, result);
    }

    if (pathname.startsWith('/api/applications/') && req.method === 'PUT') {
      const id = pathname.split('/')[3];
      const body = await parseBody(req);
      const result = await dbService.updateApplication(id, body);
      return sendJson(result.success ? 200 : 404, result);
    }

    if (pathname.startsWith('/api/applications/') && req.method === 'DELETE') {
      const id = pathname.split('/')[3];
      const result = await dbService.deleteApplication(id);
      return sendJson(200, result);
    }

    // 4. Notifications
    if (pathname === '/api/notifications' && req.method === 'GET') {
      const notifs = await dbService.getNotifications();
      return sendJson(200, notifs);
    }

    // 5. Reset to clean defaults
    if (pathname === '/api/reset' && req.method === 'POST') {
      const result = await dbService.resetDatabase();
      return sendJson(200, result);
    }

    // 404
    sendJson(404, { error: 'Endpoint not found' });
  } catch (error) {
    console.error('Server error:', error);
    sendJson(500, { error: 'Internal server error', details: String(error) });
  }
});

server.listen(PORT, async () => {
  console.log(`[SAHAYAK DB SERVER] Real Database Server is running at http://localhost:${PORT}`);
  try {
    const health = await dbService.getHealth();
    console.log(`[SAHAYAK DB SERVER] Active Storage Engine: ${health.databaseEngine}`);
  } catch (e) {
    console.log('[SAHAYAK DB SERVER] Storage Engine initialized.');
  }
});
