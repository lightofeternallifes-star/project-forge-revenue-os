const normalize = (value) => String(value || '').toLowerCase();

export function scoreEmployeeForContract(contract, employee) {
  const skills = [...(employee.specializations || []), ...(employee.competencies || []), ...(employee.knowledgeProfile?.domains || [])].map(normalize);
  const matches = contract.requiredSkills.filter((required) => skills.some((skill) => skill.includes(normalize(required)) || normalize(required).includes(skill)));
  const available = employee.employmentStatus === 'Active' && ['No mission', 'Completed'].includes(employee.missionStatus);
  return { employeeId: employee.employeeId, employeeNumber: employee.employeeNumber, employeeName: employee.employeeName, available, matchedSkills: matches, score: (available ? 100 : 0) + matches.length * 25 };
}

export function selectEmployeeForContract(contract, employees) {
  return employees.map((employee) => scoreEmployeeForContract(contract, employee)).sort((a, b) => b.score - a.score)[0] || null;
}
