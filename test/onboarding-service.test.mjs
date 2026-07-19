import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStore } from '../runtime/store.mjs';
import { createAuthService } from '../runtime/auth-service.mjs';
import { createOnboardingService } from '../runtime/onboarding-service.mjs';

test('customer onboarding provisions an isolated workforce after verified payment', async () => {
  const root = await mkdtemp(join(tmpdir(), 'forge-onboarding-'));
  try {
    const store = createStore();
    const auth = await createAuthService(store, root);
    const onboarding = createOnboardingService(store, auth);
    const trial = await onboarding.createTrial({ companyName: 'Northstar Restaurants', adminName: 'Avery Owner', email: 'owner@northstar.example', password: 'a-long-password-123' });
    assert.equal(trial.adminPasswordHash, undefined);
    assert.equal(trial.currentStep, 'trial_started');
    onboarding.selectIndustry(trial.id, 'Restaurant');
    onboarding.selectPlan(trial.id, 'Growth');
    await assert.rejects(() => onboarding.recordVerifiedPayment(trial.id, { provider: 'stripe', status: 'approved', providerEventId: 'evt_unverified' }), /verified approved payment/);
    const ready = await onboarding.recordVerifiedPayment(trial.id, { provider: 'stripe', status: 'approved', providerEventId: 'evt_001', verified: true });
    assert.equal(ready.status, 'ready');
    assert.equal(ready.employeeIds.length, 3);
    assert.ok(ready.organizationId);
    assert.ok(ready.missionId);
    const employees = store.employees.filter((employee) => employee.organizationId === ready.organizationId);
    assert.deepEqual(employees.map((employee) => employee.employeeNumber).sort(), ['DE-012A', 'DE-013A', 'DE-014A']);
    assert.equal(store.missions.find((mission) => mission.id === ready.missionId).organizationId, ready.organizationId);
    assert.equal(store.missions.find((mission) => mission.id === ready.missionId).employeeId, employees.find((employee) => employee.employeeNumber === 'DE-012A').employeeId);
    assert.equal(store.emailOutbox[0].status, 'queued');
    const repeat = await onboarding.recordVerifiedPayment(trial.id, { provider: 'stripe', status: 'approved', providerEventId: 'evt_001', verified: true });
    assert.equal(repeat.organizationId, ready.organizationId);
    assert.equal(store.employees.filter((employee) => employee.organizationId === ready.organizationId).length, 3);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
