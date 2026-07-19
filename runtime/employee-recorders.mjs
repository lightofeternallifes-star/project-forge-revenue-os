export function recordMissionTimeline(employee, mission) {
  employee.timeline.push({ type: 'Mission Completed', date: mission.completedAt.slice(0, 10), department: employee.department, comment: `${mission.title} completed by ${employee.employeeName}.`, evidence: mission.id });
  employee.updatedAt = new Date().toISOString();
  return employee.timeline.at(-1);
}

export function recordEmployeeExperience(employee, mission) {
  employee.experience = employee.experience || [];
  employee.experience.push({ missionId: mission.id, type: mission.type, title: mission.title, completedAt: mission.completedAt, evidenceCount: mission.evidence.length, knowledgeAdded: Boolean(mission.knowledgeFeedback) });
  return employee.experience.at(-1);
}
