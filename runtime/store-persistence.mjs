import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const fileName = 'data/runtime.json';
const collections = ['platform', 'organizations', 'employees', 'missions', 'contracts', 'opportunities', 'timeline', 'audits', 'automationJobs', 'dispatchLog', 'executionLogs', 'contractLogs', 'knowledgeRecords', 'evidenceRecords', 'performanceMetrics', 'missionQueues', 'settings'];

export async function hydrateStore(store, root) {
  try {
    const persisted = JSON.parse(await readFile(join(root, fileName), 'utf8'));
    for (const key of collections) if (persisted[key] !== undefined) store[key] = persisted[key];
  } catch {}
  return store;
}

export function createStorePersistence(store, root) {
  let pending = Promise.resolve();
  return () => {
    pending = pending.then(async () => {
      await mkdir(join(root, 'data'), { recursive: true });
      const snapshot = Object.fromEntries(collections.filter((key) => store[key] !== undefined).map((key) => [key, store[key]]));
      await writeFile(join(root, fileName), JSON.stringify(snapshot, null, 2));
    });
    return pending;
  };
}
