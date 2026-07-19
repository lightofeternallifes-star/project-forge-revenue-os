import { createOrganization, createPlatform, scopeRecords } from './platform-domain.mjs';

export function initializeTenancy(store) {
  store.platform = store.platform || createPlatform();
  const internalId = 'org-carriersfy-ai';
  store.organizations = store.organizations?.length ? store.organizations : [createOrganization({ name: 'Carriersfy AI', slug: 'carriersfy-ai', plan: 'internal' }, internalId, store.platform.id)];
  const organizationId = store.organizations[0].id;
  const stamp = (records) => records.forEach((record) => { if (!record.organizationId) record.organizationId = organizationId; });
  stamp(store.employees); stamp(store.missions); stamp(store.contracts); stamp(store.audits); stamp(store.opportunities); stamp(store.timeline); stamp(store.knowledgeRecords); stamp(store.evidenceRecords); stamp(store.performanceMetrics);
  return store;
}

export function visibleRecords(store, user) {
  const activeOrganizations = new Set(store.organizations.filter((organization) => organization.status === 'active').map((organization) => organization.id));
  const allowed = (record) => user.role === 'SUPER_ADMIN' || (activeOrganizations.has(user.organizationId) && record.organizationId === user.organizationId);
  return { employees: store.employees.filter(allowed), missions: store.missions.filter(allowed), contracts: store.contracts.filter(allowed), audits: store.audits.filter(allowed), opportunities: store.opportunities.filter(allowed), timeline: store.timeline.filter(allowed), knowledgeRecords: (store.knowledgeRecords || []).filter(allowed), evidenceRecords: (store.evidenceRecords || []).filter(allowed), performanceMetrics: (store.performanceMetrics || []).filter(allowed) };
}

export function createOrganizationProvisioning(store, input) {
  const id = `org-${store.createId()}`;
  const organization = createOrganization(input, id, store.platform.id);
  store.organizations.push(organization);
  return organization;
}
