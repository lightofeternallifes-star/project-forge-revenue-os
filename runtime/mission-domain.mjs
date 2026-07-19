export const missionStates = ['Created', 'Assigned', 'Preparing', 'Knowledge Loaded', 'Executing', 'Waiting', 'Completed', 'Failed', 'Cancelled', 'Archived'];
export const missionTypes = ['Research', 'Development', 'Sales', 'Marketing', 'Support', 'Knowledge', 'Operations', 'Security', 'Architecture', 'Creative', 'Finance', 'Administration'];

export const missionTransitions = {
  Created: ['Assigned', 'Cancelled'],
  Assigned: ['Preparing', 'Cancelled'],
  Preparing: ['Knowledge Loaded', 'Waiting', 'Failed', 'Cancelled'],
  'Knowledge Loaded': ['Executing', 'Waiting', 'Failed', 'Cancelled'],
  Executing: ['Waiting', 'Completed', 'Failed', 'Cancelled'],
  Waiting: ['Executing', 'Cancelled', 'Failed'],
  Completed: ['Archived'],
  Failed: ['Preparing', 'Archived'],
  Cancelled: ['Archived'],
  Archived: []
};

export function validateMissionInput(input, employees) {
  const title = String(input.title || '').trim();
  const objective = String(input.objective || '').trim();
  const type = String(input.type || '').trim();
  if (!title || !objective || !type) return { ok: false, error: 'Title, objective, and mission type are required.' };
  if (!missionTypes.includes(type)) return { ok: false, error: 'Unsupported mission type.' };
  if (input.employeeId && !employees.some((employee) => employee.employeeId === input.employeeId)) return { ok: false, error: 'Assigned employee was not found.' };
  const revenueImpact = Number(input.revenueImpact || 0);
  const hoursSaved = Number(input.hoursSaved || 0);
  if (!Number.isFinite(revenueImpact) || revenueImpact < 0 || !Number.isFinite(hoursSaved) || hoursSaved < 0) return { ok: false, error: 'Revenue impact and hours saved must be non-negative numbers.' };
  return { ok: true, input: { title, objective, type, employeeId: input.employeeId || null, dueDate: input.dueDate || null, revenueImpact, hoursSaved, customerImpact: String(input.customerImpact || '').trim(), lessonsLearned: String(input.lessonsLearned || '').trim(), reusableKnowledge: String(input.reusableKnowledge || '').trim(), recommendedImprovements: String(input.recommendedImprovements || '').trim(), automationCandidates: String(input.automationCandidates || '').trim() } };
}

export function canTransition(currentState, nextState) { return missionTransitions[currentState]?.includes(nextState) || false; }

export function createMission(input, id, actor) {
  const now = new Date().toISOString();
  return { id, title: input.title, objective: input.objective, type: input.type, employeeId: input.employeeId, dueDate: input.dueDate, state: 'Created', createdAt: now, updatedAt: now, createdBy: actor, assignedAt: null, startedAt: null, completedAt: null, execution: null, evidence: [], logs: [{ state: 'Created', at: now, actor, comment: 'Mission created by executive command.' }], report: null, performance: null, knowledgeFeedback: null, promotionEvaluation: null, roi: { revenueImpact: input.revenueImpact, hoursSaved: input.hoursSaved, customerImpact: input.customerImpact, roi: null }, context: { lessonsLearned: input.lessonsLearned, reusableKnowledge: input.reusableKnowledge, recommendedImprovements: input.recommendedImprovements, automationCandidates: input.automationCandidates } };
}
