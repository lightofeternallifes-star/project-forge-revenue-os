import { canTransition } from './mission-domain.mjs';
import { attachEvidence, createEvidence } from './evidence-engine.mjs';
import { calculateRoi } from './roi-calculator.mjs';
import { updatePerformance } from './performance-engine.mjs';
import { createKnowledgeFeedback } from './knowledge-loop.mjs';
import { evaluatePromotion } from './promotion-engine.mjs';
import { recordEmployeeExperience, recordMissionTimeline } from './employee-recorders.mjs';

export function transitionMission(mission, nextState, actor, comment = '') {
  if (!canTransition(mission.state, nextState)) return { ok: false, error: `Mission cannot transition from ${mission.state} to ${nextState}.` };
  const now = new Date().toISOString();
  mission.state = nextState;
  mission.updatedAt = now;
  if (nextState === 'Assigned') mission.assignedAt = now;
  if (nextState === 'Executing' && !mission.startedAt) mission.startedAt = now;
  if (nextState === 'Completed') mission.completedAt = now;
  mission.logs.push({ state: nextState, at: now, actor, comment: comment || `Mission moved to ${nextState}.` });
  return { ok: true, mission };
}

export function loadEmployeeKnowledge(mission, employee, actor) {
  const knowledge = { domains: employee.knowledgeProfile.domains, ownership: employee.knowledgeProfile.ownership, level: employee.knowledgeProfile.level, memoryScope: employee.knowledgeProfile.memoryScope, documents: employee.documents.slice(0, 5).map((document) => document.reference) };
  mission.execution = { ...(mission.execution || {}), knowledgeLoaded: knowledge, knowledgeLoadedAt: new Date().toISOString() };
  mission.logs.push({ state: 'Knowledge Loaded', at: mission.execution.knowledgeLoadedAt, actor, comment: `Loaded ${knowledge.domains.length} knowledge domains and ${knowledge.documents.length} document references.` });
  return knowledge;
}

export async function executeMission(mission, employee, actor, adapter = null) {
  const now = new Date().toISOString();
  const knowledge = mission.execution?.knowledgeLoaded;
  if (!knowledge) return { ok: false, error: 'Employee knowledge must be loaded before execution.' };
  const output = adapter ? await adapter(mission, employee) : { missionType: mission.type, objective: mission.objective, employee: employee.employeeName, knowledgeDomains: knowledge.domains, completedWork: `Executed ${mission.type.toLowerCase()} mission: ${mission.title}.`, constraints: 'Provider-agnostic local execution; no external side effects performed.', generatedAt: now };
  mission.execution = { ...mission.execution, output, executedAt: now, status: 'Work completed; awaiting mission closure.' };
  const evidence = createEvidence(mission, 'Execution output', JSON.stringify(output), 'execution-engine');
  mission.evidence.push(evidence);
  mission.logs.push({ state: 'Executing', at: now, actor, comment: 'Execution completed and output evidence captured.' });
  return { ok: true, output, evidence };
}

export function completeMission(mission, employee, actor) {
  if (mission.state !== 'Executing') return { ok: false, error: `Mission must be Executing before completion; current state is ${mission.state}.` };
  const performance = { qualityScore: mission.evidence.length ? 100 : 0 };
  mission.performance = performance;
  mission.roi = calculateRoi(mission);
  const transition = transitionMission(mission, 'Completed', actor, 'Mission completed after execution output and evidence review.');
  if (!transition.ok) return transition;
  const feedback = createKnowledgeFeedback(mission, employee);
  mission.knowledgeFeedback = feedback;
  mission.evidence.push(createEvidence(mission, 'Knowledge feedback', JSON.stringify(feedback), 'knowledge-feedback-loop'));
  employee.evidence.push(...mission.evidence.map((evidence) => ({ label: evidence.label, reference: mission.id, record: evidence.id })));
  employee.knowledgeProfile = { ...employee.knowledgeProfile, lastMissionId: mission.id, lastUpdated: new Date().toISOString(), knowledgeRecordsAdded: Number(employee.knowledgeProfile.knowledgeRecordsAdded || 0) + 1, lastLessonsLearned: feedback.lessonsLearned };
  employee.missionHistory.push({ id: mission.id, title: mission.title, type: mission.type, status: 'Completed', score: performance.qualityScore, completedAt: mission.completedAt, evidence: mission.evidence.map((item) => item.id), lessons: feedback.lessonsLearned });
  recordMissionTimeline(employee, mission);
  recordEmployeeExperience(employee, mission);
  employee.missionStatus = 'Completed';
  updatePerformance(employee, mission);
  mission.promotionEvaluation = evaluatePromotion(employee);
  return { ok: true, mission, employee };
}

export function requestHumanReview(mission, actor, reason) {
  mission.logs.push({ state: mission.state, at: new Date().toISOString(), actor, comment: `Human review requested: ${reason || 'Executive review requested.'}` });
  mission.reviewRequested = { requested: true, reason: reason || 'Executive review requested.', requestedAt: new Date().toISOString(), requestedBy: actor };
  return mission.reviewRequested;
}

export { attachEvidence };
