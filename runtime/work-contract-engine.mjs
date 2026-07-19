import { canTransitionContract, contractDecisions } from './work-contract-domain.mjs';
import { selectEmployeeForContract } from './assignment-engine.mjs';

export function transitionContract(contract, nextStatus, actor, comment = '') {
  if (!canTransitionContract(contract.status, nextStatus)) return { ok: false, error: `Contract cannot transition from ${contract.status} to ${nextStatus}.` };
  const now = new Date().toISOString();
  contract.status = nextStatus;
  contract.updatedAt = now;
  if (nextStatus === 'Assigned') contract.assignedAt ||= now;
  if (nextStatus === 'In Progress') contract.startedAt ||= now;
  if (nextStatus === 'Approved') contract.approvedAt = now;
  if (nextStatus === 'Archived') contract.archivedAt = now;
  contract.logs.push({ status: nextStatus, at: now, actor, comment: comment || `Contract moved to ${nextStatus}.` });
  return { ok: true, contract };
}

export function assignContract(contract, employees, actor, employeeId = null) {
  const selection = employeeId ? employees.map((employee) => employee.employeeId === employeeId ? { employeeId: employee.employeeId, employeeName: employee.employeeName, score: 999, matchedSkills: contract.requiredSkills } : null).find(Boolean) : selectEmployeeForContract(contract, employees);
  if (!selection?.available && !employeeId) return { ok: false, error: 'No available employee matches this contract.' };
  if (!selection) return { ok: false, error: 'Assigned employee was not found.' };
  contract.assignedEmployeeId = selection.employeeId;
  contract.assignment = { ...selection, assignedAt: new Date().toISOString(), policy: employeeId ? 'Executive override' : 'Priority and skill match' };
  return transitionContract(contract, 'Assigned', actor, `Contract assigned to ${selection.employeeName}.`);
}

export function syncContractFromMission(contract, mission) {
  contract.missionId = mission.id;
  contract.evidence = mission.evidence.map((item) => ({ id: item.id, label: item.label, source: item.source }));
  contract.metrics = { ...contract.metrics, durationMinutes: mission.startedAt && mission.completedAt ? Math.max(0, Math.round((new Date(mission.completedAt) - new Date(mission.startedAt)) / 60000)) : 0, successRate: mission.state === 'Completed' ? 100 : 0, evidenceQuality: mission.evidence.length ? 100 : 0, knowledgeCreated: mission.knowledgeFeedback ? 1 : 0, revenueContribution: Number(mission.roi?.revenueImpact || 0), promotionScore: mission.performance?.qualityScore || 0 };
  if (mission.state === 'Completed') return transitionContract(contract, 'Waiting Review', 'Execution Engine', 'Mission completed; contract is waiting for supervisor review.');
  return { ok: true, contract };
}

export function reviewContract(contract, decision, reviewer, comments = '') {
  if (!contractDecisions.includes(decision)) return { ok: false, error: 'Unsupported supervisor decision.' };
  const result = transitionContract(contract, decision, reviewer, comments || `Supervisor decision: ${decision}.`);
  if (!result.ok) return result;
  contract.approval = { status: decision, reviewer, comments, decidedAt: new Date().toISOString() };
  return result;
}
