export function createEmployeeService(store) {
  return {
    list(user) { return store.employees.filter((employee) => user.role === 'SUPER_ADMIN' || employee.organizationId === user.organizationId); },
    get(user, id) { return this.list(user).find((employee) => employee.employeeId === id || employee.employeeNumber === id) || null; },
    assignSupervisor(user, id, supervisorId) { const employee = this.get(user, id); const supervisor = store.users.find((candidate) => candidate.id === supervisorId && (user.role === 'SUPER_ADMIN' || candidate.organizationId === user.organizationId)); if (!employee || !supervisor) return null; employee.supervisorId = supervisor.id; employee.updatedAt = new Date().toISOString(); return employee; }
  };
}
