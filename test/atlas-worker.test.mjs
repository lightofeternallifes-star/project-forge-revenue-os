import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmployeeStore } from '../runtime/employee-store.mjs';
import { runAtlasRepositoryAnalysis } from '../runtime/atlas-worker.mjs';

test('Atlas worker performs repository analysis and returns evidence-ready output', async () => {
  const employee = createEmployeeStore().employees[0];
  const result = await runAtlasRepositoryAnalysis({ title: 'Worker test', objective: 'Inspect repository.', type: 'Repository Audit' }, employee, process.cwd());
  assert.equal(result.workType, 'Repository Analysis');
  assert.equal(result.repository.filesInspected > 0, true);
  assert.equal(result.repository.markdownFiles > 0, true);
  assert.equal(result.repository.testFiles > 0, true);
  assert.equal(result.constraints.includes('Read-only'), true);
  assert.equal(result.repository.rootReference, '.');
});
