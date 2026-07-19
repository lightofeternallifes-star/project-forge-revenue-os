export function createKnowledgeRepository(store) {
  store.knowledgeRecords ||= [];
  return {
    list(user) { return store.knowledgeRecords.filter((record) => user.role === 'SUPER_ADMIN' || record.organizationId === user.organizationId); },
    add(input, user) { const record = { id: store.createId(), platformId: store.platform.id, organizationId: user.organizationId, employeeId: input.employeeId || null, missionId: input.missionId || null, title: String(input.title).trim(), content: String(input.content).trim(), sourceEvidenceIds: input.sourceEvidenceIds || [], createdBy: user.id, createdAt: new Date().toISOString(), version: 1 }; store.knowledgeRecords.unshift(record); return record; }
  };
}
