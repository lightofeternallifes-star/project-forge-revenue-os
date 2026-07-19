import test from 'node:test';
import assert from 'node:assert/strict';
import { ecosystemMetrics, ecosystemModules, plannedEmployees } from '../runtime/ecosystem-domain.mjs';
import { createEmployeeStore } from '../runtime/employee-store.mjs';

test('ecosystem exposes connected modules and explicit future workforce profiles', () => {
  const store = createEmployeeStore();
  const metrics = ecosystemMetrics(store.employees, [{ value: 1000 }], store.automationJobs, store.audits);
  assert.equal(ecosystemModules.some((module) => module.name === 'Revenue OS' && module.status === 'Connected'), true);
  assert.deepEqual(plannedEmployees.map((employee) => employee.name), ['Sofia', 'Max']);
  assert.equal(metrics.revenueGenerated, 0);
  assert.equal(metrics.knowledgeGrowth, 0);
});
