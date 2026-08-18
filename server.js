
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'site.json');
const sessions = new Map();

if (!ADMIN_PASSWORD) {
  console.warn('⚠️ ADMIN_PASSWORD n\'est pas défini. Définis-le avant la mise en ligne.');
}

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
function parseCookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1));
  }
  return out;
}
function requireAuth(req, res, next) {
  const sid = parseCookies(req).admin_session;
  if (!sid || !sessions.has(sid)) return res.status(401).json({ error: 'Non authentifié' });
  next();
}
function safeEqual(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

app.get('/api/content', (req, res) => res.json(readData()));

app.post('/api/login', (req, res) => {
  if (!ADMIN_PASSWORD) return res.status(500).json({ error: 'ADMIN_PASSWORD non configuré' });
  if (!safeEqual(req.body.password || '', ADMIN_PASSWORD)) return res.status(401).json({ error: 'Mot de passe incorrect' });
  const sid = crypto.randomBytes(32).toString('hex');
  sessions.set(sid, Date.now());
  res.setHeader('Set-Cookie', `admin_session=${sid}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`);
  res.json({ ok: true });
});

app.post('/api/logout', requireAuth, (req, res) => {
  const sid = parseCookies(req).admin_session;
  sessions.delete(sid);
  res.setHeader('Set-Cookie', 'admin_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
  res.json({ ok: true });
});

app.get('/api/admin/content', requireAuth, (req, res) => res.json(readData()));

app.put('/api/admin/content', requireAuth, (req, res) => {
  const current = readData();
  const allowed = Object.keys(current);
  const next = { ...current };
  for (const key of allowed) {
    if (typeof req.body[key] === 'string') next[key] = req.body[key].trim();
  }
  writeData(next);
  res.json({ ok: true, data: next });
});

app.use(express.static(ROOT, { extensions: ['html'] }));

app.get('/admin', (req, res) => res.sendFile(path.join(ROOT, 'admin', 'index.html')));
app.get('/admin/', (req, res) => res.sendFile(path.join(ROOT, 'admin', 'index.html')));

app.listen(PORT, () => console.log(`FaZe_Elbossito69 : http://localhost:${PORT}`));
