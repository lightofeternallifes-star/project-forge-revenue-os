export function createAuditService(store) {
  return {
    list(user) { return store.audits.filter((audit) => user.role === 'SUPER_ADMIN' || audit.organizationId === user.organizationId); },
    record(input, actor) { const audit = { id: store.createId(), organizationId: actor.organizationId || input.organizationId, actorId: actor.id, action: input.action, resourceType: input.resourceType, resourceId: input.resourceId || null, outcome: input.outcome || 'recorded', metadata: input.metadata || {}, createdAt: new Date().toISOString() }; store.audits.unshift(audit); return audit; }
  };
}
