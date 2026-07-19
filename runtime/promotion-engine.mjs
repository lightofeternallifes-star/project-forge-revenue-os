export function evaluatePromotion(employee) {
  const metrics = employee.performanceMetrics || {};
  const eligible = Number(metrics.missionCount || employee.missionHistory.length) >= 3 && Number(metrics.successRate || 0) >= 90 && Number(metrics.score || 0) >= 85;
  return { eligible, currentRank: employee.currentRank, reason: eligible ? 'Mission volume, success rate, and quality thresholds passed.' : 'Promotion requires three completed missions, 90% success, and an 85 quality score.', evaluatedAt: new Date().toISOString() };
}
