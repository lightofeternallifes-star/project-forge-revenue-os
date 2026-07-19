import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export function buildMissionReport(mission) {
  return { missionId: mission.id, title: mission.title, employeeId: mission.employeeId, state: mission.state, generatedAt: new Date().toISOString(), objective: mission.objective, execution: mission.execution, evidence: mission.evidence, performance: mission.performance, roi: mission.roi, knowledgeFeedback: mission.knowledgeFeedback, promotionEvaluation: mission.promotionEvaluation, timeline: mission.logs };
}

export async function writeMissionEvidencePackage(mission, root) {
  const directory = join(root, 'artifacts', 'execution', 'DE-012A');
  await mkdir(directory, { recursive: true });
  const report = buildMissionReport(mission);
  await writeFile(join(directory, `${mission.id}.json`), JSON.stringify(report, null, 2));
  const markdown = [`# ${mission.title}`, '', `- Mission ID: ${mission.id}`, `- Employee: DE-012A ATLAS ANALYST™`, `- State: ${mission.state}`, `- Objective: ${mission.objective}`, '', '## Execution Summary', '', report.execution?.output?.completedWork || 'Execution output recorded.', '', '## Evidence', '', ...mission.evidence.map((evidence) => `- ${evidence.label}: ${evidence.id}`), '', '## Knowledge Feedback', '', report.knowledgeFeedback?.lessonsLearned || 'No feedback recorded.', ''].join('\n');
  await writeFile(join(directory, `${mission.id}.md`), markdown);
  return { directory, report, files: [`artifacts/execution/DE-012A/${mission.id}.json`, `artifacts/execution/DE-012A/${mission.id}.md`] };
}
