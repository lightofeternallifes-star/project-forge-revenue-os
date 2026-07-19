import { runAtlasRepositoryAnalysis } from './atlas-worker.mjs';

export function resolveEmployeeAdapter(employee) {
  if (employee.employeeNumber === 'DE-012A') return 'atlas-repository-analysis';
  return 'generic-local-execution';
}

export async function executeWithEmployeeAdapter(mission, employee, root) {
  if (resolveEmployeeAdapter(employee) === 'atlas-repository-analysis') return runAtlasRepositoryAnalysis(mission, employee, root);
  return null;
}
