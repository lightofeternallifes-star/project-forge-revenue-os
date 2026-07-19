export function createContractService(store) {
  return {
    list(user) { return store.contracts.filter((contract) => user.role === 'SUPER_ADMIN' || contract.organizationId === user.organizationId); },
    get(user, id) { return this.list(user).find((contract) => contract.id === id || contract.contractId === id) || null; },
    dashboard(user) { const contracts = this.list(user); return { total: contracts.length, open: contracts.filter((contract) => !['Approved', 'Archived', 'Cancelled'].includes(contract.status)).length, approved: contracts.filter((contract) => ['Approved', 'Archived'].includes(contract.status)).length, revenue: contracts.reduce((sum, contract) => sum + Number(contract.metrics?.revenueContribution || 0), 0) }; }
  };
}
