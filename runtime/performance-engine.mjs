export function updatePerformance(employee, mission) {
  const history = employee.missionHistory || [];
  const alreadyRecorded = history.some((item) => item.id === mission.id);
  const completed = history.filter((item) => item.status === 'Completed').length + (alreadyRecorded ? 0 : 1);
  const total = history.length + (alreadyRecorded ? 0 : 1);
  const qualityScore = mission.performance?.qualityScore || 100;
  const current = employee.performanceMetrics || {};
  employee.performanceMetrics = { ...current, missionCount: total, completionRate: Number((completed / total * 100).toFixed(1)), averageDurationMinutes: current.averageDurationMinutes || 0, successRate: Number((completed / total * 100).toFixed(1)), score: Math.round(((current.score || 0) + qualityScore) / 2), missionSuccessRate: Number((completed / total * 100).toFixed(1)), evidenceCoverage: 100, revenueGenerated: Number(current.revenueGenerated || 0) + Number(mission.roi?.revenueImpact || 0), knowledgeAdded: Number(current.knowledgeAdded || 0) + 1, customerImpact: mission.roi?.customerImpact || current.customerImpact || '' };
  employee.revenueGenerated = Number(employee.revenueGenerated || 0) + Number(mission.roi?.revenueImpact || 0);
  employee.version += 1;
  employee.updatedAt = new Date().toISOString();
  return employee.performanceMetrics;
}
