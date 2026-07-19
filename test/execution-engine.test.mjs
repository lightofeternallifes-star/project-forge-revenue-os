import test from 'node:test';
import assert from 'node:assert/strict';
import { createMission, validateMissionInput } from '../runtime/mission-domain.mjs';
import { completeMission, executeMission, loadEmployeeKnowledge, transitionMission } from '../runtime/execution-engine.mjs';
import { createEmployeeStore } from '../runtime/employee-store.mjs';

test('digital employee executes a mission through evidence, performance, and knowledge feedback', () => {
  const employee = createEmployeeStore().employees[0];
  const startingMissionCount = employee.missionHistory.length;
  const input = validateMissionInput({ title: 'Runtime knowledge review', objective: 'Review the canonical knowledge operating model.', type: 'Knowledge', employeeId: employee.employeeId, revenueImpact: 0, hoursSaved: 2 }, [employee]);
  assert.equal(input.ok, true);
  const mission = createMission(input.input, 'mission-test-001', 'Executive User');
  assert.equal(transitionMission(mission, 'Assigned', 'Executive User').ok, true);
  assert.equal(transitionMission(mission, 'Preparing', employee.employeeName).ok, true);
  loadEmployeeKnowledge(mission, employee, employee.employeeName);
  assert.equal(transitionMission(mission, 'Knowledge Loaded', employee.employeeName).ok, true);
  assert.equal(transitionMission(mission, 'Executing', employee.employeeName).ok, true);
  assert.equal(executeMission(mission, employee, employee.employeeName).ok, true);
  const result = completeMission(mission, employee, employee.employeeName);
  assert.equal(result.ok, true);
  assert.equal(mission.state, 'Completed');
  assert.equal(mission.evidence.length >= 2, true);
  assert.equal(Boolean(mission.knowledgeFeedback.lessonsLearned), true);
  assert.equal(employee.missionHistory.at(-1).id, mission.id);
  assert.equal(employee.performanceMetrics.missionCount, startingMissionCount + 1);
});

test('mission state machine rejects invalid transitions', () => {
  const mission = createMission({ title: 'Invalid path', objective: 'Test state safety.', type: 'Operations', employeeId: null, dueDate: null, revenueImpact: 0, hoursSaved: 0, customerImpact: '', lessonsLearned: '', reusableKnowledge: '', recommendedImprovements: '', automationCandidates: '' }, 'mission-test-002', 'Executive User');
  assert.equal(transitionMission(mission, 'Completed', 'Executive User').ok, false);
});
