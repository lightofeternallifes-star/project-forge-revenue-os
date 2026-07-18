import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateKpis, generateInsights, validateOpportunity } from '../runtime/domain.mjs';

const opportunities = [
  { name: 'A', value: 100, stage: 'Proposal', probability: 50, updatedAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  { name: 'B', value: 200, stage: 'Won', probability: 100, updatedAt: new Date().toISOString() },
  { name: 'C', value: 300, stage: 'Lost', probability: 0, updatedAt: new Date().toISOString() }
];

test('calculates transparent pipeline KPIs', () => {
  assert.deepEqual(calculateKpis(opportunities), { pipelineValue: 100, wonValue: 200, weightedPipeline: 50, winRate: 50, activeOpportunities: 1, averageDealSize: 200 });
});

test('generates evidence-backed stale and activity insights', () => {
  const insights = generateInsights(opportunities, []);
  assert.equal(insights.some((item) => item.id === 'stale-opportunities'), true);
  assert.equal(insights.some((item) => item.id === 'activity-health'), true);
  assert.equal(insights[0].evidence.includes('A'), true);
});

test('validates opportunity input and defaults stage', () => {
  assert.equal(validateOpportunity({ name: '', company: 'Acme', value: 1 }).ok, false);
  const result = validateOpportunity({ name: 'New deal', company: 'Acme', value: '5000' });
  assert.equal(result.ok, true);
  assert.equal(result.opportunity.stage, 'Discovery');
});
