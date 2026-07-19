import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorkContract, validateWorkContractInput } from '../runtime/work-contract-domain.mjs';
import { assignContract, reviewContract, syncContractFromMission, transitionContract } from '../runtime/work-contract-engine.mjs';
import { workContractDashboard } from '../runtime/work-contract-dashboard.mjs';

const employee = { employeeId: 'employee-001', employeeNumber: 'DE-012A', employeeName: 'ATLAS ANALYST', employmentStatus: 'Active', missionStatus: 'No mission', specializations: ['Knowledge Governance Specialist'], competencies: ['Evidence quality'], knowledgeProfile: { domains: ['Repository analysis'] } };
const input = { client: 'Internal', project: 'Readiness', businessObjective: 'Inspect the repository.', expectedDeliverable: 'Evidence report.', priority: 'High', requiredSkills: ['Knowledge governance', 'Evidence quality', 'Repository analysis'], reviewer: 'Executive User', dueDate: '2026-07-20T00:00:00.000Z', successCriteria: 'All findings have evidence.', completionRequirements: 'Mission and review complete.', roiTarget: 0 };

test('work contract validates required fields and skill requirements', () => {
  assert.equal(validateWorkContractInput(input, [employee]).ok, true);
  assert.equal(validateWorkContractInput({ ...input, requiredSkills: [] }, [employee]).ok, false);
});

test('assignment, mission sync, supervisor approval, and dashboard are coherent', () => {
  const contract = createWorkContract({ ...input, contractId: 'contract-test' }, 'contract-test', 'Executive Office');
  assert.equal(assignContract(contract, [employee], 'Executive Queue').ok, true);
  assert.equal(contract.assignedEmployeeId, employee.employeeId);
  assert.equal(transitionContract(contract, 'In Progress', 'Execution Engine').ok, true);
  const mission = { id: 'mission-test', state: 'Completed', evidence: [{ id: 'evidence-1', label: 'Output', source: 'test' }], startedAt: '2026-07-19T00:00:00.000Z', completedAt: '2026-07-19T00:05:00.000Z', knowledgeFeedback: { lessonsLearned: 'Evidence first.' }, performance: { qualityScore: 100 }, roi: { revenueImpact: 0 } };
  assert.equal(syncContractFromMission(contract, mission).ok, true);
  assert.equal(contract.status, 'Waiting Review');
  assert.equal(reviewContract(contract, 'Approved', 'Executive User', 'Passed').ok, true);
  assert.equal(transitionContract(contract, 'Archived', 'Executive User').ok, true);
  const dashboard = workContractDashboard([contract], [employee]);
  assert.equal(dashboard.completedToday.length, 1);
  assert.equal(dashboard.knowledgeProduced, 1);
});
