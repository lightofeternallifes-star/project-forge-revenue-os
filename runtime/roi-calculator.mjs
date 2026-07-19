export function calculateRoi(mission) {
  const revenueImpact = Number(mission.roi?.revenueImpact || 0);
  const hoursSaved = Number(mission.roi?.hoursSaved || 0);
  const cost = Number(mission.roi?.cost || 0);
  const realizedValue = revenueImpact;
  const roi = cost > 0 ? Number(((realizedValue - cost) / cost).toFixed(4)) : null;
  return { revenueImpact, hoursSaved, customerImpact: mission.roi?.customerImpact || '', realizedValue, cost, roi };
}
