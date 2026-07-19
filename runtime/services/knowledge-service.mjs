export function createKnowledgeService(store) {
  return {
    list(user) { return store.knowledgeRecords.filter((record) => user.role === 'SUPER_ADMIN' || record.organizationId === user.organizationId); },
    get(user, id) { return this.list(user).find((record) => record.id === id) || null; }
  };
}
