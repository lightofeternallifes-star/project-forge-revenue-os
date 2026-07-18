export const stages = ['Discovery', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export function calculateKpis(opportunities) {
  const active = opportunities.filter((item) => !['Won', 'Lost'].includes(item.stage));
  const pipelineValue = active.reduce((sum, item) => sum + item.value, 0);
  const wonValue = opportunities.filter((item) => item.stage === 'Won').reduce((sum, item) => sum + item.value, 0);
  const weightedPipeline = active.reduce((sum, item) => sum + item.value * (item.probability / 100), 0);
  const winRateBase = opportunities.filter((item) => ['Won', 'Lost'].includes(item.stage));

  return {
    pipelineValue,
    wonValue,
    weightedPipeline,
    winRate: winRateBase.length ? Math.round((winRateBase.filter((item) => item.stage === 'Won').length / winRateBase.length) * 100) : 0,
    activeOpportunities: active.length,
    averageDealSize: opportunities.length ? Math.round(opportunities.reduce((sum, item) => sum + item.value, 0) / opportunities.length) : 0
  };
}

export function generateInsights(opportunities, timeline) {
  const insights = [];
  const now = Date.now();
  const stale = opportunities.filter((item) => !['Won', 'Lost'].includes(item.stage) && now - new Date(item.updatedAt).getTime() > 1000 * 60 * 60 * 24 * 7);
  const highValue = opportunities.filter((item) => !['Won', 'Lost'].includes(item.stage) && item.value >= 50000);
  const proposals = opportunities.filter((item) => item.stage === 'Proposal');

  if (stale.length) {
    insights.push({ id: 'stale-opportunities', type: 'attention', title: `${stale.length} opportunity${stale.length === 1 ? '' : 'ies'} need a next step`, body: 'Active opportunities have not changed in seven days. Review ownership and schedule the next action.', evidence: stale.map((item) => item.name), confidence: 0.96 });
  }
  if (highValue.length) {
    insights.push({ id: 'high-value-focus', type: 'opportunity', title: 'Focus on high-value pipeline', body: `${highValue.length} active deal${highValue.length === 1 ? '' : 's'} represent meaningful upside. Prioritize executive coverage and evidence-backed next steps.`, evidence: highValue.map((item) => item.name), confidence: 0.91 });
  }
  if (proposals.length >= 2) {
    insights.push({ id: 'proposal-conversion', type: 'trend', title: 'Proposal volume is building', body: 'Several opportunities are in proposal. Review decision criteria and follow-up timing to protect conversion.', evidence: proposals.map((item) => item.name), confidence: 0.88 });
  }
  const recentActivity = timeline.filter((event) => now - new Date(event.occurredAt).getTime() < 1000 * 60 * 60 * 24 * 14);
  insights.push({ id: 'activity-health', type: 'signal', title: recentActivity.length ? 'Customer activity is visible' : 'Customer activity needs attention', body: recentActivity.length ? `${recentActivity.length} customer timeline events were recorded in the last 14 days.` : 'No recent customer timeline events were recorded. Confirm data connections or add a customer touchpoint.', evidence: recentActivity.slice(0, 3).map((event) => event.title), confidence: 0.84 });
  return insights;
}

export function validateOpportunity(input) {
  const name = String(input.name ?? '').trim();
  const company = String(input.company ?? '').trim();
  const value = Number(input.value);
  if (!name || !company || !Number.isFinite(value) || value <= 0) return { ok: false, error: 'Name, company, and a positive value are required.' };
  const stage = stages.includes(input.stage) ? input.stage : 'Discovery';
  return { ok: true, opportunity: { name, company, value, stage, probability: Number(input.probability) || (stage === 'Proposal' ? 55 : 25) } };
}
