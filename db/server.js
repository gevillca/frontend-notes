import { readFileSync, writeFileSync } from 'fs';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
const dbPath = join(__dirname, 'db.json');

// Helper para generar token JWT simulado (base64)
function generateToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 horas
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Helper para decodificar token
function decodeToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    return payload;
  } catch {
    return null;
  }
}

// Helper para leer DB
function readDB() {
  return JSON.parse(readFileSync(dbPath, 'utf-8'));
}

// Helper para parsear body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Helper para enviar JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

// Middleware para verificar autenticación
function authenticate(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, error: 'Token not provided' };
  }

  const token = authHeader.substring(7);
  const payload = decodeToken(token);

  if (!payload) {
    return { authenticated: false, error: 'Invalid token' };
  }

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return { authenticated: false, error: 'Token expired' };
  }

  return { authenticated: true, userId: payload.sub };
}

// Servidor HTTP
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  try {
    // ============================================
    // RUTAS DE AUTENTICACIÓN
    // ============================================

    // POST /auth/login
    if (method === 'POST' && path === '/auth/login') {
      const body = await parseBody(req);
      const { email, password } = body;

      if (!email || !password) {
        return sendJSON(res, 400, {
          ok: false,
          msg: 'Email and password are required',
        });
      }

      const db = readDB();
      const user = db.users.find((u) => u.email === email && u.password === password);

      if (!user) {
        return sendJSON(res, 401, {
          ok: false,
          msg: 'Invalid credentials',
        });
      }

      const token = generateToken(user);
      const { password: _, ...userWithoutPassword } = user;

      return sendJSON(res, 200, {
        ok: true,
        user: userWithoutPassword,
        token,
      });
    }

    // POST /auth/register
    if (method === 'POST' && path === '/auth/register') {
      const body = await parseBody(req);
      const { email, password } = body;

      if (!email || !password) {
        return sendJSON(res, 400, {
          ok: false,
          msg: 'Email and password are required',
        });
      }

      const db = readDB();
      const existingUser = db.users.find((u) => u.email === email);

      if (existingUser) {
        return sendJSON(res, 409, {
          ok: false,
          msg: 'Email is already registered',
        });
      }

      const newUser = {
        id: `user-${String(db.users.length + 1).padStart(2, '0')}`,
        email,
        password,
        avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
        createdAt: new Date().toISOString(),
      };

      // ✅ GUARDAR el nuevo usuario en db.json
      db.users.push(newUser);
      writeFileSync(dbPath, JSON.stringify(db, null, 2));

      const token = generateToken(newUser);
      const { password: _, ...userWithoutPassword } = newUser;

      return sendJSON(res, 201, {
        ok: true,
        user: userWithoutPassword,
        token,
      });
    }

    // GET /auth/check-status
    if (method === 'GET' && path === '/auth/check-status') {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendJSON(res, 401, {
          ok: false,
          msg: 'Token not provided',
        });
      }

      const token = authHeader.substring(7);
      const payload = decodeToken(token);

      if (!payload) {
        return sendJSON(res, 401, {
          ok: false,
          msg: 'Token invalid',
        });
      }

      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return sendJSON(res, 401, {
          ok: false,
          msg: 'Token expired',
        });
      }

      const db = readDB();
      const user = db.users.find((u) => u.id === payload.sub);

      if (!user) {
        return sendJSON(res, 404, {
          ok: false,
          msg: 'User not found',
        });
      }

      const { password: _, ...userWithoutPassword } = user;

      return sendJSON(res, 200, {
        ok: true,
        user: userWithoutPassword,
        token,
      });
    }

    // ============================================
    // RUTAS DE RECURSOS (notes, tags, etc.)
    // ============================================

    // GET /notes (filtrado por usuario autenticado)
    if (method === 'GET' && path === '/notes') {
      const auth = authenticate(req);

      if (!auth.authenticated) {
        return sendJSON(res, 401, {
          ok: false,
          msg: auth.error,
        });
      }

      const db = readDB();
      let notes = db.notes.filter((note) => note.ownerId === auth.userId);

      // Aplicar otros filtros de query params
      const archived = url.searchParams.get('archived');
      if (archived !== null) {
        notes = notes.filter((note) => note.archived === (archived === 'true'));
      }

      const tags = url.searchParams.get('tags');
      if (tags) {
        notes = notes.filter((note) => note.tags && note.tags.includes(tags));
      }

      return sendJSON(res, 200, notes);
    }

    // GET /notes/:id
    if (method === 'GET' && path.startsWith('/notes/')) {
      const auth = authenticate(req);

      if (!auth.authenticated) {
        return sendJSON(res, 401, {
          ok: false,
          msg: auth.error,
        });
      }

      const id = path.split('/')[2];
      const db = readDB();
      const note = db.notes.find((n) => n.id === id && n.ownerId === auth.userId);

      if (!note) {
        return sendJSON(res, 404, {
          ok: false,
          msg: 'Note not found or access denied',
        });
      }

      return sendJSON(res, 200, note);
    }

    // POST /notes
    if (method === 'POST' && path === '/notes') {
      const auth = authenticate(req);

      if (!auth.authenticated) {
        return sendJSON(res, 401, {
          ok: false,
          msg: auth.error,
        });
      }

      const body = await parseBody(req);
      const db = readDB();

      const newNote = {
        id: `note-${String(db.notes.length + 1).padStart(3, '0')}`,
        ...body,
        ownerId: auth.userId, // Asignar automáticamente el usuario autenticado
        createdAt: body.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.notes.push(newNote);
      writeFileSync(dbPath, JSON.stringify(db, null, 2));

      return sendJSON(res, 201, newNote);
    }

    // PUT /notes/:id
    if (method === 'PUT' && path.startsWith('/notes/')) {
      const auth = authenticate(req);

      if (!auth.authenticated) {
        return sendJSON(res, 401, {
          ok: false,
          msg: auth.error,
        });
      }

      const id = path.split('/')[2];
      const body = await parseBody(req);
      const db = readDB();

      const index = db.notes.findIndex((n) => n.id === id && n.ownerId === auth.userId);
      if (index === -1) {
        return sendJSON(res, 404, {
          ok: false,
          msg: 'Note not found or access denied',
        });
      }

      db.notes[index] = {
        ...db.notes[index],
        ...body,
        ownerId: auth.userId, // Mantener el ownerId original
        updatedAt: new Date().toISOString(),
      };
      writeFileSync(dbPath, JSON.stringify(db, null, 2));

      return sendJSON(res, 200, db.notes[index]);
    }

    // DELETE /notes/:id
    if (method === 'DELETE' && path.startsWith('/notes/')) {
      const auth = authenticate(req);

      if (!auth.authenticated) {
        return sendJSON(res, 401, {
          ok: false,
          msg: auth.error,
        });
      }

      const id = path.split('/')[2];
      const db = readDB();

      const index = db.notes.findIndex((n) => n.id === id && n.ownerId === auth.userId);
      if (index === -1) {
        return sendJSON(res, 404, {
          ok: false,
          msg: 'Note not found or access denied',
        });
      }

      db.notes.splice(index, 1);
      writeFileSync(dbPath, JSON.stringify(db, null, 2));

      return sendJSON(res, 204, {});
    }

    // GET /tags
    if (method === 'GET' && path === '/tags') {
      const auth = authenticate(req);

      if (!auth.authenticated) {
        return sendJSON(res, 401, {
          ok: false,
          msg: auth.error,
        });
      }

      const db = readDB();
      return sendJSON(res, 200, db.tags);
    }

    // GET /users (solo para admin o debugging - podría removerse en producción)
    if (method === 'GET' && path === '/users') {
      const auth = authenticate(req);

      if (!auth.authenticated) {
        return sendJSON(res, 401, {
          ok: false,
          msg: auth.error,
        });
      }

      const db = readDB();
      // Remover passwords de la respuesta
      const usersWithoutPasswords = db.users.map(({ password, ...user }) => user);
      return sendJSON(res, 200, usersWithoutPasswords);
    }

    // Ruta no encontrada
    return sendJSON(res, 404, { error: 'Not found' });
  } catch (error) {
    console.error('Error:', error);
    return sendJSON(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 JSON Server con Auth corriendo en http://localhost:${PORT}`);
  console.log(`\n📝 Auth endpoints (públicos):`);
  console.log(`   POST http://localhost:${PORT}/auth/login`);
  console.log(`   POST http://localhost:${PORT}/auth/register`);
  console.log(`   GET  http://localhost:${PORT}/auth/check-status (requiere token)`);
  console.log(`\n� Recursos protegidos (requieren token Bearer):`);
  console.log(`   GET    http://localhost:${PORT}/notes (filtrado por usuario)`);
  console.log(`   GET    http://localhost:${PORT}/notes/:id`);
  console.log(`   POST   http://localhost:${PORT}/notes`);
  console.log(`   PUT    http://localhost:${PORT}/notes/:id`);
  console.log(`   DELETE http://localhost:${PORT}/notes/:id`);
  console.log(`   GET    http://localhost:${PORT}/tags`);
  console.log(`   GET    http://localhost:${PORT}/users`);
  console.log(`\n💡 Tip: Todas las operaciones de notas están protegidas y filtradas por usuario`);
  console.log(`🔐 Envía el header: Authorization: Bearer <token>`);
});
