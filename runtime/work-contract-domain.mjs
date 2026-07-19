export const contractStatuses = ['Open', 'Assigned', 'In Progress', 'Waiting Review', 'Approved', 'Rejected', 'Needs Revision', 'Escalated', 'Reassigned', 'Cancelled', 'Archived'];
export const contractPriorities = ['Critical', 'High', 'Normal', 'Low'];
export const contractDecisions = ['Approved', 'Rejected', 'Needs Revision', 'Escalated', 'Reassigned', 'Cancelled'];

export const contractTransitions = {
  Open: ['Assigned', 'Cancelled'],
  Assigned: ['In Progress', 'Reassigned', 'Cancelled'],
  'In Progress': ['Waiting Review', 'Escalated', 'Cancelled'],
  'Waiting Review': ['Approved', 'Rejected', 'Needs Revision', 'Escalated', 'Reassigned', 'Cancelled'],
  Approved: ['Archived'],
  Rejected: ['Assigned', 'Archived'],
  'Needs Revision': ['Assigned', 'Archived'],
  Escalated: ['Assigned', 'Cancelled', 'Archived'],
  Reassigned: ['Assigned', 'Archived'],
  Cancelled: ['Archived'],
  Archived: []
};

export function validateWorkContractInput(input, employees = []) {
  const required = ['client', 'project', 'businessObjective', 'expectedDeliverable', 'reviewer', 'dueDate', 'successCriteria', 'completionRequirements'];
  const missing = required.filter((field) => !String(input?.[field] || '').trim());
  if (missing.length) return { ok: false, error: `Required contract fields missing: ${missing.join(', ')}.` };
  if (!contractPriorities.includes(input.priority || 'Normal')) return { ok: false, error: 'Unsupported contract priority.' };
  const requiredSkills = Array.isArray(input.requiredSkills) ? input.requiredSkills.map((skill) => String(skill).trim()).filter(Boolean) : [];
  if (!requiredSkills.length) return { ok: false, error: 'At least one required skill is needed.' };
  if (input.assignedEmployeeId && !employees.some((employee) => employee.employeeId === input.assignedEmployeeId)) return { ok: false, error: 'Assigned employee was not found.' };
  const roiTarget = Number(input.roiTarget || 0);
  if (!Number.isFinite(roiTarget) || roiTarget < 0) return { ok: false, error: 'ROI target must be a non-negative number.' };
  return { ok: true, input: { contractId: String(input.contractId || '').trim(), client: String(input.client).trim(), project: String(input.project).trim(), businessObjective: String(input.businessObjective).trim(), expectedDeliverable: String(input.expectedDeliverable).trim(), priority: input.priority || 'Normal', requiredSkills, assignedEmployeeId: input.assignedEmployeeId || null, reviewer: String(input.reviewer).trim(), dueDate: String(input.dueDate).trim(), successCriteria: String(input.successCriteria).trim(), evidenceRequired: input.evidenceRequired !== false, completionRequirements: String(input.completionRequirements).trim(), roiTarget, missionTemplate: String(input.missionTemplate || 'Repository Health').trim() } };
}

export function createWorkContract(input, id, actor) {
  const now = new Date().toISOString();
  return { id, contractId: input.contractId || id, ...input, status: 'Open', createdAt: now, updatedAt: now, assignedAt: null, startedAt: null, completedAt: null, approvedAt: null, archivedAt: null, missionId: null, evidence: [], approval: null, sla: { dueDate: input.dueDate, status: 'On track', escalatedAt: null }, metrics: { hoursWorked: 0, durationMinutes: 0, successRate: 0, evidenceQuality: 0, knowledgeCreated: 0, revenueContribution: 0, customerSatisfaction: null, promotionScore: 0 }, logs: [{ status: 'Open', at: now, actor, comment: 'Work contract created by executive command.' }] };
}

export function canTransitionContract(current, next) { return contractTransitions[current]?.includes(next) || false; }
