import test from 'node:test';
import assert from 'node:assert/strict';
import { auditEmployee, validateEmployeeInput } from '../runtime/employee-domain.mjs';
import { createEmployeeStore } from '../runtime/employee-store.mjs';

test('canonical Atlas record passes portal quality gates', () => {
  const employee = createEmployeeStore().employees[0];
  const audit = auditEmployee(employee);
  assert.equal(audit.status, 'All gates passed');
  assert.equal(audit.score, 100);
});

test('employee definitions reject duplicate employee numbers', () => {
  const employee = createEmployeeStore().employees[0];
  const result = validateEmployeeInput({ employeeNumber: employee.employeeNumber, employeeName: 'SOFIA', division: 'Commercial', department: 'Sales', role: 'Executive', manager: 'Manager', specializations: ['Customer Success'] }, [employee]);
  assert.equal(result.ok, false);
  assert.match(result.error, /already exists/);
});
