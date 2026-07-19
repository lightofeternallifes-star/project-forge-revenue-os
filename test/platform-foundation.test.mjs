import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStore } from '../runtime/store.mjs';
import { createAuthService, hashPassword, verifyPassword } from '../runtime/auth-service.mjs';
import { createOrganizationProvisioning, visibleRecords } from '../runtime/tenant-service.mjs';
import { createKnowledgeRepository } from '../runtime/knowledge-repository.mjs';
import { executiveDashboard } from '../runtime/dashboard-service.mjs';
import { provisionOrganization } from '../runtime/provisioning-service.mjs';

test('authentication stores a password hash and returns role-scoped sessions', async () => {
  const root = await mkdtemp(join(tmpdir(), 'forge-auth-'));
  const store = createStore();
  const auth = await createAuthService(store, root);
  const organization = createOrganizationProvisioning(store, { name: 'Tenant One', slug: 'tenant-one' });
  const created = await auth.createUser({ email: 'admin@tenant-one.test', name: 'Tenant Admin', role: 'COMPANY_ADMIN', password: 'long-secure-password' }, organization.id);
  assert.equal(created.role, 'COMPANY_ADMIN');
  assert.equal(store.users[0].passwordHash.includes('long-secure-password'), false);
  assert.equal(await verifyPassword('long-secure-password', store.users[0].passwordHash), true);
  assert.equal((await auth.authenticate('admin@tenant-one.test', 'long-secure-password')).user.organizationId, organization.id);
  assert.equal(await verifyPassword('wrong-password', store.users[0].passwordHash), false);
});

test('organization provisioning creates admin, employee, knowledge, and queue atomically', async () => {
  const root = await mkdtemp(join(tmpdir(), 'forge-provision-'));
  const store = createStore();
  const auth = await createAuthService(store, root);
  const result = await provisionOrganization(store, auth, { organization: { name: 'Provisioned Company', slug: 'provisioned-company' }, admin: { email: 'owner@provisioned.test', name: 'Company Owner', password: 'long-secure-password' }, firstEmployee: { employeeNumber: 'DE-900A', employeeName: 'RESEARCH ANALYST', division: 'Revenue', department: 'Research', manager: 'Company Owner', role: 'Research Analyst', specializations: ['Research'] } });
  assert.equal(result.status, 'Ready');
  assert.equal(result.employee.organizationId, result.organization.id);
  assert.equal(store.missionQueues.some((queue) => queue.organizationId === result.organization.id), true);
  assert.equal(store.knowledgeRecords.some((record) => record.organizationId === result.organization.id), true);
});

test('tenant scope excludes another organization and dashboard reads services', () => {
  const store = createStore();
  const first = store.organizations[0];
  const second = createOrganizationProvisioning(store, { name: 'Second Company', slug: 'second-company' });
  const user = { role: 'COMPANY_ADMIN', organizationId: second.id };
  assert.equal(visibleRecords(store, user).employees.some((employee) => employee.organizationId === first.id), false);
  const dashboard = executiveDashboard({ organizations: [second], employees: [], missions: [], contracts: [], knowledgeRecords: [], evidenceRecords: [] });
  assert.deepEqual(dashboard, { organizations: 1, employees: 0, runningMissions: 0, completedMissions: 0, averagePerformance: 0, knowledgeGrowth: 0, evidenceGenerated: 0, revenueMetrics: { generated: 0, contracts: 0 } });
});

test('knowledge repository enforces organization ownership', () => {
  const store = createStore();
  const repository = createKnowledgeRepository(store);
  const user = { id: 'user-1', role: 'COMPANY_ADMIN', organizationId: store.organizations[0].id };
  const record = repository.add({ title: 'Operating policy', content: 'Evidence-backed policy.' }, user);
  assert.equal(repository.list(user).some((item) => item.id === record.id), true);
  assert.equal(repository.list({ role: 'COMPANY_ADMIN', organizationId: 'other-org' }).some((item) => item.id === record.id), false);
});

test('password hashing rejects short credentials', async () => {
  await assert.rejects(() => hashPassword('short'), /at least 12 characters/);
});
