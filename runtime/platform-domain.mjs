export const roles = ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'SUPERVISOR', 'STAFF', 'VIEWER'];
export const permissions = {
  SUPER_ADMIN: ['platform:read', 'platform:write', 'organization:read', 'organization:write', 'resource:read', 'resource:write', 'mission:execute', 'audit:read'],
  COMPANY_ADMIN: ['organization:read', 'organization:write', 'resource:read', 'resource:write', 'mission:execute', 'audit:read'],
  MANAGER: ['organization:read', 'resource:read', 'resource:write', 'mission:execute', 'audit:read'],
  SUPERVISOR: ['organization:read', 'resource:read', 'mission:execute', 'audit:read'],
  STAFF: ['organization:read', 'resource:read', 'mission:execute'],
  VIEWER: ['organization:read', 'resource:read', 'audit:read']
};

export function createPlatform() {
  return { id: 'platform-project-forge', name: 'PROJECT FORGE Revenue OS', status: 'active', version: 1, createdAt: '2026-07-19T00:00:00.000Z' };
}

export function createOrganization(input, id, platformId) {
  const now = new Date().toISOString();
  return { id, platformId, name: String(input.name).trim(), slug: String(input.slug || input.name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), status: 'active', plan: input.plan || 'foundation', createdAt: now, updatedAt: now };
}

export function createUser(input, id, passwordHash, organizationId = null) {
  const now = new Date().toISOString();
  return { id, organizationId, email: String(input.email).trim().toLowerCase(), name: String(input.name).trim(), role: input.role, passwordHash, status: 'active', createdAt: now, updatedAt: now };
}

export function can(user, permission) { return Boolean(user && permissions[user.role]?.includes(permission)); }
export function owns(user, record) { return user?.role === 'SUPER_ADMIN' || Boolean(user?.organizationId && record?.organizationId === user.organizationId); }
export function scopeRecords(user, records) { return records.filter((record) => owns(user, record)); }
export function assertRole(role) { if (!roles.includes(role)) throw new Error('Unsupported role.'); return role; }
