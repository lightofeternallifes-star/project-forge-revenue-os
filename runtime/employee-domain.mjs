export const employeeStatuses = ['Recruitment', 'Training', 'Active', 'Suspended', 'Retired'];
export const certificationLevels = ['Uncertified', 'In training', 'Certified', 'Graduated'];
export const deploymentStatuses = ['Undeployed', 'Ready', 'Active', 'Suspended'];
export const missionStatuses = ['No mission', 'In progress', 'Blocked', 'Completed'];
export const lifecycleStages = ['Recruitment', 'Identity', 'Onboarding', 'Training', 'Probation', 'Mission', 'Evidence', 'Performance', 'Executive Audit', 'Certification', 'Graduation', 'Promotion', 'Registry', 'Deployment', 'Continuous Learning', 'Retirement'];

export const requiredDocuments = [
  'Employee Profile', 'Corporate Passport', 'Employee ID', 'Executive Badge', 'Employment Contract', 'NDA',
  'Training Record', 'Mission Record', 'Performance Review', 'Executive Audit', 'Graduation Certificate',
  'Diploma', 'Promotion Letter', 'Digital Signature', 'Knowledge Profile', 'Competency Matrix', 'Organizational Assignment'
];

export function normalizeEmployee(input) {
  return {
    platformId: input.platformId || input.platform_id || null,
    organizationId: input.organizationId || input.organization_id || null,
    employeeId: String(input.employeeId || input.employee_id || '').trim(),
    employeeNumber: String(input.employeeNumber || input.employee_number || '').trim(),
    employeeName: String(input.employeeName || input.employee_name || '').trim(),
    division: String(input.division || '').trim(),
    department: String(input.department || '').trim(),
    role: String(input.role || '').trim(),
    specializations: Array.isArray(input.specializations) ? input.specializations.map(String) : String(input.specializations || '').split(',').map((value) => value.trim()).filter(Boolean),
    manager: String(input.manager || '').trim(),
    employmentStatus: input.employmentStatus || input.employment_status || 'Recruitment',
    certificationLevel: input.certificationLevel || input.certification_level || 'Uncertified',
    currentRank: String(input.currentRank || input.current_rank || input.role || '').trim(),
    hireDate: input.hireDate || input.hire_date || null,
    graduationDate: input.graduationDate || input.graduation_date || null,
    deploymentStatus: input.deploymentStatus || input.deployment_status || 'Undeployed',
    supervisorId: input.supervisorId || input.supervisor_id || null,
    missionStatus: input.missionStatus || input.mission_status || 'No mission',
    missionHistory: input.missionHistory || input.mission_history || [],
    trainingHistory: input.trainingHistory || input.training_history || [],
    awards: input.awards || [],
    competencies: input.competencies || [],
    knowledgeProfile: input.knowledgeProfile || input.knowledge_profile || { domains: [], ownership: 'Unassigned', level: 'Unassessed', memoryScope: 'None' },
    performanceMetrics: input.performanceMetrics || input.performance_metrics || { score: null, missionSuccessRate: null, evidenceCoverage: null },
    revenueGenerated: Number(input.revenueGenerated || input.revenue_generated || 0),
    evidence: input.evidence || [],
    timeline: input.timeline || [],
    documents: input.documents || [],
    brandAssets: input.brandAssets || input.brand_assets || { reference: 'branding/canonical/', status: 'Canonical reference' },
    digitalSignature: input.digitalSignature || input.digital_signature || null,
    hallOfFameStatus: input.hallOfFameStatus || input.hall_of_fame_status || 'Not eligible',
    version: Number(input.version || 1),
    createdAt: input.createdAt || input.created_at || new Date().toISOString(),
    updatedAt: input.updatedAt || input.updated_at || new Date().toISOString()
  };
}

export function validateEmployeeInput(input, existingEmployees = []) {
  const employee = normalizeEmployee(input);
  const required = ['employeeNumber', 'employeeName', 'division', 'department', 'role', 'manager'];
  const missing = required.filter((field) => !employee[field]);
  if (missing.length) return { ok: false, error: `Required fields missing: ${missing.join(', ')}.` };
  if (existingEmployees.some((item) => item.employeeNumber.toLowerCase() === employee.employeeNumber.toLowerCase())) return { ok: false, error: 'Employee number already exists.' };
  if (!employee.specializations.length) return { ok: false, error: 'At least one specialization is required.' };
  return { ok: true, employee };
}

export function auditEmployee(employee) {
  const issues = [];
  if (!employee.employeeNumber || !employee.employeeName) issues.push({ code: 'IDENTITY_MISSING', severity: 'critical', title: 'Canonical identity is incomplete', detail: 'Employee number and name are required.' });
  if (!employee.manager || !employee.department) issues.push({ code: 'ASSIGNMENT_MISSING', severity: 'high', title: 'Organizational assignment is incomplete', detail: 'Manager and department are required.' });
  const documentNames = new Set(employee.documents.map((document) => document.name));
  requiredDocuments.filter((name) => !documentNames.has(name)).forEach((name) => issues.push({ code: 'DOCUMENT_MISSING', severity: 'high', title: `${name} is missing`, detail: 'The employee package must reference this factory artifact.' }));
  if (!employee.brandAssets?.reference?.includes('branding/canonical')) issues.push({ code: 'BRAND_REFERENCE', severity: 'high', title: 'Canonical branding reference is missing', detail: 'Generated artifacts must resolve through the canonical Carriersfy AI branding system.' });
  if (!Array.isArray(employee.timeline) || !employee.timeline.length) issues.push({ code: 'TIMELINE_MISSING', severity: 'high', title: 'Timeline is missing', detail: 'Every employee requires an append-only lifecycle timeline.' });
  const score = issues.length ? Math.max(0, 100 - issues.filter((issue) => issue.severity === 'critical').length * 30 - issues.filter((issue) => issue.severity === 'high').length * 15) : 100;
  return { employeeNumber: employee.employeeNumber, score, status: issues.length ? 'Attention required' : 'All gates passed', issues, checkedAt: new Date().toISOString() };
}

export function portalMetrics(employees, jobs, audits) {
  const count = (predicate) => employees.filter(predicate).length;
  return {
    total: employees.length,
    active: count((employee) => employee.employmentStatus === 'Active'),
    training: count((employee) => employee.employmentStatus === 'Training'),
    certified: count((employee) => ['Certified', 'Graduated'].includes(employee.certificationLevel)),
    graduated: count((employee) => employee.certificationLevel === 'Graduated'),
    onMission: count((employee) => ['In progress', 'Blocked'].includes(employee.missionStatus)),
    retired: count((employee) => employee.employmentStatus === 'Retired'),
    recentGraduations: employees.filter((employee) => employee.graduationDate).sort((a, b) => b.graduationDate.localeCompare(a.graduationDate)).slice(0, 4),
    recentPromotions: employees.flatMap((employee) => employee.timeline.filter((event) => event.type === 'Promotion').map((event) => ({ ...event, employeeName: employee.employeeName, employeeNumber: employee.employeeNumber }))).slice(-4).reverse(),
    recentMissions: employees.flatMap((employee) => employee.missionHistory.map((mission) => ({ ...mission, employeeName: employee.employeeName, employeeNumber: employee.employeeNumber }))).slice(-6).reverse(),
    factoryStatus: { templates: 'Ready', generator: 'Ready', lifecycle: 'Ready', registry: 'Healthy', brandResolver: 'Canonical' },
    automationQueue: jobs.filter((job) => ['Queued', 'Running'].includes(job.status)),
    registryStatus: { status: 'Healthy', version: Math.max(...employees.map((employee) => employee.version), 1), lastSync: new Date().toISOString() },
    qualityGateStatus: { status: audits.every((audit) => audit.status === 'All gates passed') ? 'Passing' : 'Attention required', score: audits.length ? Math.round(audits.reduce((sum, audit) => sum + audit.score, 0) / audits.length) : 100 }
  };
}
