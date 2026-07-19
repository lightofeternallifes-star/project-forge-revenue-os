import { assertRole } from '../platform-domain.mjs';

export function createUserService(store, auth) {
  return {
    list(user) { return store.users.filter((candidate) => user.role === 'SUPER_ADMIN' || candidate.organizationId === user.organizationId).map(auth.publicUser); },
    get(user, id) { const candidate = store.users.find((item) => item.id === id && (user.role === 'SUPER_ADMIN' || item.organizationId === user.organizationId)); return candidate ? auth.publicUser(candidate) : null; },
    async invite(input, actor) { assertRole(input.role); return auth.createUser({ email: input.email, name: input.name, password: input.password, role: input.role }, actor.role === 'SUPER_ADMIN' ? input.organizationId : actor.organizationId); },
    async register(input, organizationId) { return auth.createUser({ email: input.email, name: input.name, password: input.password, role: 'STAFF' }, organizationId); },
    async transition(actor, id, status) { const candidate = store.users.find((item) => item.id === id && (actor.role === 'SUPER_ADMIN' || item.organizationId === actor.organizationId)); if (!candidate || !['active', 'disabled', 'invited'].includes(status)) return null; candidate.status = status; candidate.updatedAt = new Date().toISOString(); await auth.persist(); return auth.publicUser(candidate); },
    async changeRole(actor, id, role) { assertRole(role); const candidate = store.users.find((item) => item.id === id && (actor.role === 'SUPER_ADMIN' || item.organizationId === actor.organizationId)); if (!candidate) return null; candidate.role = role; candidate.updatedAt = new Date().toISOString(); await auth.persist(); return auth.publicUser(candidate); },
    async resetPassword(actor, id, password) { const candidate = store.users.find((item) => item.id === id && (actor.role === 'SUPER_ADMIN' || item.organizationId === actor.organizationId)); if (!candidate) return null; candidate.passwordHash = await auth.hashPassword(password); candidate.updatedAt = new Date().toISOString(); await auth.revokeUserSessions(id); await auth.persist(); return auth.publicUser(candidate); }
  };
}
