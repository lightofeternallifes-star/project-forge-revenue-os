import { createMission, validateMissionInput } from './mission-domain.mjs';
import { completeMission, executeMission, loadEmployeeKnowledge, transitionMission } from './execution-engine.mjs';
import { executeWithEmployeeAdapter } from './execution-adapter.mjs';
import { buildMissionReport, writeMissionEvidencePackage } from './mission-reporter.mjs';

export async function deployAtlas(store, root) {
  const existing = store.missions.find((mission) => mission.deploymentKey === 'MISSION-015-ATLAS-REPOSITORY-AUDIT');
  if (existing) return existing;
  const employee = store.employees.find((item) => item.employeeNumber === 'DE-012A');
  const input = validateMissionInput({ title: 'Mission 015: Repository Analysis', type: 'Repository Audit', objective: 'Analyze the PROJECT FORGE repository structure, documentation, runtime, tests, and package configuration; produce evidence and an executive report.', employeeId: employee.employeeId, revenueImpact: 0, hoursSaved: 0, customerImpact: 'Repository governance and workforce readiness' }, store.employees);
  if (!input.ok) throw new Error(input.error);
  const mission = { ...createMission(input.input, 'mission-015-atlas-repository-audit', 'Executive Office'), organizationId: store.organizations[0].id };
  mission.deploymentKey = 'MISSION-015-ATLAS-REPOSITORY-AUDIT';
  store.missions.unshift(mission);
  transitionMission(mission, 'Assigned', 'Executive Office', 'Mission 015 automatically assigned to DE-012A.');
  transitionMission(mission, 'Preparing', employee.employeeName, 'Atlas accepted the repository analysis mission.');
  loadEmployeeKnowledge(mission, employee, employee.employeeName);
  transitionMission(mission, 'Knowledge Loaded', employee.employeeName, 'Atlas knowledge profile loaded.');
  transitionMission(mission, 'Executing', employee.employeeName, 'Atlas began repository analysis.');
  await executeMission(mission, employee, employee.employeeName, (currentMission, currentEmployee) => executeWithEmployeeAdapter(currentMission, currentEmployee, root));
  const completed = completeMission(mission, employee, employee.employeeName);
  if (!completed.ok) throw new Error(completed.error);
  mission.report = buildMissionReport(mission);
  mission.reportArtifact = await writeMissionEvidencePackage(mission, root);
  mission.logs.push({ state: 'Completed', at: new Date().toISOString(), actor: employee.employeeName, comment: 'Mission report and permanent evidence package written.' });
  store.dispatchLog.push({ missionId: mission.id, action: 'Automatic Atlas deployment', at: new Date().toISOString(), actor: 'Execution Engine' });
  return mission;
}
