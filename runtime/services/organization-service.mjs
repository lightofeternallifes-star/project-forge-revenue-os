import { createOrganization } from '../platform-domain.mjs';

export function createOrganizationService(store) {
  return {
    list(user) { return store.organizations.filter((organization) => user.role === 'SUPER_ADMIN' || organization.id === user.organizationId); },
    get(user, id) { return this.list(user).find((organization) => organization.id === id) || null; },
    create(input, actor) { const organization = createOrganization(input, `org-${store.createId()}`, store.platform.id); store.organizations.push(organization); store.missionQueues ||= []; store.missionQueues.push({ id: store.createId(), organizationId: organization.id, name: 'Executive Mission Queue', status: 'Ready', createdAt: new Date().toISOString() }); return organization; },
    update(user, id, input) { const organization = this.get(user, id); if (!organization) return null; if (input.name) organization.name = String(input.name).trim(); if (input.plan) organization.plan = String(input.plan).trim(); organization.updatedAt = new Date().toISOString(); return organization; },
    transition(user, id, status) { const organization = this.get(user, id); if (!organization || !['active', 'suspended', 'archived', 'deleted'].includes(status)) return null; organization.status = status; organization.updatedAt = new Date().toISOString(); return organization; }
  };
}
