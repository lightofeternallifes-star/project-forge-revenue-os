import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function writeWorkContractPackage(contract, root) {
  const directory = join(root, 'artifacts', 'contracts');
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, `${contract.contractId}.json`), JSON.stringify(contract, null, 2));
  await writeFile(join(directory, `${contract.contractId}.md`), `# Work Contract ${contract.contractId}\n\n- Status: ${contract.status}\n- Client: ${contract.client}\n- Project: ${contract.project}\n- Assigned employee: ${contract.assignedEmployeeId}\n- Mission: ${contract.missionId}\n- Supervisor decision: ${contract.approval?.status || 'Pending'}\n- Evidence records: ${contract.evidence.length}\n- Knowledge records: ${contract.metrics.knowledgeCreated}\n\n## Objective\n\n${contract.businessObjective}\n\n## Deliverable\n\n${contract.expectedDeliverable}\n`);
  return { json: `artifacts/contracts/${contract.contractId}.json`, markdown: `artifacts/contracts/${contract.contractId}.md` };
}
