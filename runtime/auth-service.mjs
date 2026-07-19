import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { assertRole, createUser, roles } from './platform-domain.mjs';

const scrypt = promisify(scryptCallback);
const authFile = 'data/auth.json';

export async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 12) throw new Error('Password must be at least 12 characters.');
  const salt = randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${Buffer.from(derived).toString('hex')}`;
}

export async function verifyPassword(password, encoded) {
  const [, salt, expected] = String(encoded || '').split('$');
  if (!salt || !expected) return false;
  const derived = Buffer.from(await scrypt(password, salt, 64));
  const target = Buffer.from(expected, 'hex');
  return derived.length === target.length && timingSafeEqual(derived, target);
}

async function loadAuth(root) {
  try { return JSON.parse(await readFile(join(root, authFile), 'utf8')); } catch { return { users: [] }; }
}

export async function createAuthService(store, root) {
  const persisted = await loadAuth(root);
  store.users = Array.isArray(persisted.users) ? persisted.users : [];
  store.sessions = new Map();
  const persist = async () => { await mkdir(join(root, 'data'), { recursive: true }); await writeFile(join(root, authFile), JSON.stringify({ users: store.users }, null, 2)); };
  if (!store.users.length && process.env.FORGE_BOOTSTRAP_EMAIL && process.env.FORGE_BOOTSTRAP_PASSWORD) { const user = createUser({ email: process.env.FORGE_BOOTSTRAP_EMAIL, name: process.env.FORGE_BOOTSTRAP_NAME || 'Platform Administrator', role: 'SUPER_ADMIN' }, randomUUID(), await hashPassword(process.env.FORGE_BOOTSTRAP_PASSWORD), null); store.users.push(user); await persist(); }
  const publicUser = (user) => user && ({ id: user.id, organizationId: user.organizationId, email: user.email, name: user.name, role: user.role, status: user.status });
  return {
    users: store.users,
    sessions: store.sessions,
    publicUser,
    async createUser(input, organizationId) {
      const email = String(input.email || '').trim().toLowerCase();
      if (!email || !String(input.name || '').trim()) throw new Error('Name and email are required.');
      assertRole(input.role);
      if (store.users.some((user) => user.email === email)) throw new Error('Email is already registered.');
      const user = createUser(input, randomUUID(), await hashPassword(input.password), organizationId);
      store.users.push(user);
      await persist();
      return publicUser(user);
    },
    async authenticate(email, password) {
      const user = store.users.find((candidate) => candidate.email === String(email || '').trim().toLowerCase() && candidate.status === 'active');
      if (!user || !(await verifyPassword(String(password || ''), user.passwordHash))) return null;
      const token = randomBytes(32).toString('hex');
      const session = { ...publicUser(user), issuedAt: new Date().toISOString() };
      store.sessions.set(token, session);
      return { token, user: session };
    },
    userFromRequest(req) {
      const token = (req.headers.cookie || '').split(';').map((item) => item.trim()).find((item) => item.startsWith('forge_session='))?.split('=')[1];
      return token ? store.sessions.get(token) : null;
    },
    logout(req) {
      const token = (req.headers.cookie || '').split(';').map((item) => item.trim()).find((item) => item.startsWith('forge_session='))?.split('=')[1];
      if (token) store.sessions.delete(token);
    },
    roles
  };
}
