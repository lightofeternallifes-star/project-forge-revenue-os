export function createEvidence(mission, label, content, source = 'execution-engine') {
  return { id: `${mission.id}-evidence-${mission.evidence.length + 1}`, missionId: mission.id, label, content, source, capturedAt: new Date().toISOString(), provenance: { missionType: mission.type, objective: mission.objective } };
}

export function attachEvidence(mission, input) {
  const label = String(input.label || '').trim();
  const content = String(input.content || '').trim();
  if (!label || !content) return { ok: false, error: 'Evidence label and content are required.' };
  const evidence = createEvidence(mission, label, content, input.source || 'human-review');
  mission.evidence.push(evidence);
  mission.updatedAt = evidence.capturedAt;
  mission.logs.push({ state: mission.state, at: evidence.capturedAt, actor: input.actor || 'Executive User', comment: `Evidence attached: ${label}.` });
  return { ok: true, evidence };
}
