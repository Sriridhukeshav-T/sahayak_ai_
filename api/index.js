// SAHAYAK AI — Vercel Serverless API Handler
// Connects to MongoDB Atlas Cloud in production on Vercel
import { dbService } from '../backend/db.js';

function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }
  if (typeof req.body === 'string') {
    try {
      return Promise.resolve(JSON.parse(req.body));
    } catch {
      return Promise.resolve({});
    }
  }
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Handle URL path parsing (Vercel sets req.url)
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  let pathname = url.pathname;
  
  // Normalize pathname: ensure it has /api prefix or strip if needed
  if (!pathname.startsWith('/api')) {
    pathname = '/api' + (pathname.startsWith('/') ? pathname : '/' + pathname);
  }

  const sendJson = (status, data) => {
    res.status(status).json(data);
  };

  try {
    // 1. Health & Database Engine check
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
      const userId = url.searchParams.get('userId') || req.query?.userId;
      const apps = await dbService.getApplications(userId);
      return sendJson(200, apps);
    }

    if (pathname === '/api/applications' && req.method === 'POST') {
      const body = await parseBody(req);
      const result = await dbService.createApplication(body);
      return sendJson(201, result);
    }

    if (pathname.startsWith('/api/applications/') && req.method === 'PUT') {
      const id = pathname.split('/')[3] || req.query?.id;
      const body = await parseBody(req);
      const result = await dbService.updateApplication(id, body);
      return sendJson(result.success ? 200 : 404, result);
    }

    if (pathname.startsWith('/api/applications/') && req.method === 'DELETE') {
      const id = pathname.split('/')[3] || req.query?.id;
      const result = await dbService.deleteApplication(id);
      return sendJson(200, result);
    }

    // 4. Notifications
    if (pathname === '/api/notifications' && req.method === 'GET') {
      const notifs = await dbService.getNotifications();
      return sendJson(200, notifs);
    }

    // 5. Reset to initial seed
    if (pathname === '/api/reset' && req.method === 'POST') {
      const result = await dbService.resetDatabase();
      return sendJson(200, result);
    }

    sendJson(404, { error: `Endpoint ${pathname} not found on Vercel Serverless Gateway` });
  } catch (err) {
    console.error('Vercel API error:', err);
    sendJson(500, { error: 'Internal Server Error', details: String(err) });
  }
}
