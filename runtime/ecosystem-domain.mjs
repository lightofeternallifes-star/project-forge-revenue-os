export const ecosystemModules = [
  { id: 'revenue-os', name: 'Revenue OS', category: 'Commercial intelligence', status: 'Connected', owner: 'Revenue Operations', source: 'runtime/domain.mjs' },
  { id: 'phoenix', name: 'PROJECT PHOENIX', category: 'Opportunity intelligence', status: 'Connected', owner: 'Revenue Intelligence', source: 'Project integration contract' },
  { id: 'knowledge-vault', name: 'Knowledge Vault', category: 'Knowledge system', status: 'Connected', owner: 'Atlas Intelligence', source: 'Digital Brain knowledge contract' },
  { id: 'employee-factory', name: 'Digital Employee Factory', category: 'Workforce production', status: 'Ready', owner: 'Digital Employee Operations', source: 'factory/' },
  { id: 'atlas', name: 'Atlas Analyst', category: 'Digital Employee', status: 'Active', owner: 'Atlas Intelligence', source: 'docs/employees/DE-012A/' },
  { id: 'sofia', name: 'Sofia', category: 'Future Digital Employee', status: 'Planned', owner: 'Commercial Division', source: 'Factory intake' },
  { id: 'max', name: 'Max', category: 'Future Digital Employee', status: 'Planned', owner: 'Revenue Operations', source: 'Factory intake' },
  { id: 'future-employees', name: 'Future Employees', category: 'Workforce capacity', status: 'Available', owner: 'Executive Office', source: 'Factory capacity plan' }
];

export const plannedEmployees = [
  { id: 'planned-sofia', name: 'Sofia', employeeNumber: 'DE-013A', role: 'Sales Executive', department: 'Commercial Division', specialization: 'Customer Success', status: 'Planned', revenueGenerated: 0, knowledgeUsage: 0, missionStatus: 'Not assigned', trainingStatus: 'Not started' },
  { id: 'planned-max', name: 'Max', employeeNumber: 'DE-014A', role: 'Revenue Operations Specialist', department: 'Revenue Operations', specialization: 'Revenue Intelligence', status: 'Planned', revenueGenerated: 0, knowledgeUsage: 0, missionStatus: 'Not assigned', trainingStatus: 'Not started' }
];

export function ecosystemMetrics(employees, opportunities, automationJobs, audits) {
  const revenueGenerated = employees.reduce((sum, employee) => sum + Number(employee.revenueGenerated || 0), 0);
  const knowledgeUsage = employees.reduce((sum, employee) => sum + employee.evidence.length + employee.knowledgeProfile.domains.length, 0);
  const knowledgeRecords = employees.reduce((sum, employee) => sum + employee.knowledgeProfile.domains.length, 0);
  const completedTraining = employees.reduce((sum, employee) => sum + employee.trainingHistory.filter((item) => item.result === 'Passed').length, 0);
  const production = automationJobs.filter((job) => job.command === 'Create Digital Employee').length;
  return {
    revenueGenerated,
    revenuePipeline: opportunities.reduce((sum, opportunity) => sum + opportunity.value, 0),
    knowledgeUsage,
    knowledgeRecords,
    knowledgeGrowth: 0,
    completedTraining,
    factoryProduction: production,
    factoryCapacity: plannedEmployees.length,
    auditScore: audits.length ? Math.round(audits.reduce((sum, audit) => sum + audit.score, 0) / audits.length) : 100,
    modulesConnected: ecosystemModules.filter((module) => ['Connected', 'Ready', 'Active'].includes(module.status)).length,
    modulesTotal: ecosystemModules.length,
    plannedEmployees: plannedEmployees.length
  };
}
