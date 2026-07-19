import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStore } from '../runtime/store.mjs';
import { createAuthService } from '../runtime/auth-service.mjs';
import { createPlatformApi } from '../runtime/platform-api.mjs';
import { visibleRecords } from '../runtime/tenant-service.mjs';

function responseCapture() {
  let result;
  return { response: { writeHead(status) { this.status = status; }, end(body) { result = JSON.parse(body); } }, get result() { return result; } };
}

test('platform API enforces platform authorization and tenant-scoped organization listing', async () => {
  const store = createStore();
  const auth = await createAuthService(store, await mkdtemp(join(tmpdir(), 'forge-platform-api-')));
  const api = createPlatformApi(store, auth);
  const organizationId = store.organizations[0].id;
  const user = await auth.createUser({ email: 'company-admin@example.test', name: 'Company Admin', password: 'a-long-password-123', role: 'COMPANY_ADMIN' }, organizationId);
  const captured = responseCapture();
  const handled = await api({ method: 'GET', headers: {} }, captured.response, { pathname: '/api/platform' }, { ...user, role: 'COMPANY_ADMIN' }, visibleRecords(store, { ...user, role: 'COMPANY_ADMIN' }), async () => ({}), (res, status, body) => { res.writeHead(status); res.end(JSON.stringify(body)); });
  assert.equal(handled, true);
  assert.equal(captured.response.status, 403);
  const orgs = responseCapture();
  await api({ method: 'GET', headers: {} }, orgs.response, { pathname: '/api/organizations' }, { ...user, role: 'COMPANY_ADMIN' }, visibleRecords(store, { ...user, role: 'COMPANY_ADMIN' }), async () => ({}), (res, status, body) => { res.writeHead(status); res.end(JSON.stringify(body)); });
  assert.deepEqual(orgs.result.data.map((organization) => organization.id), [organizationId]);
});
