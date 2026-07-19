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
  return { employees: scopeRecords(user, store.employees), missions: scopeRecords(user, store.missions), contracts: scopeRecords(user, store.contracts), audits: scopeRecords(user, store.audits), opportunities: scopeRecords(user, store.opportunities), timeline: scopeRecords(user, store.timeline), knowledgeRecords: scopeRecords(user, store.knowledgeRecords || []), evidenceRecords: scopeRecords(user, store.evidenceRecords || []), performanceMetrics: scopeRecords(user, store.performanceMetrics || []) };
}

export function createOrganizationProvisioning(store, input) {
  const id = `org-${store.createId()}`;
  const organization = createOrganization(input, id, store.platform.id);
  store.organizations.push(organization);
  return organization;
}
