import { generateFactoryDocumentReferences } from './factory-adapter.mjs';
import { normalizeEmployee, auditEmployee } from './employee-domain.mjs';
import { provisionOrganization } from './provisioning-service.mjs';
import { createMission, validateMissionInput } from './mission-domain.mjs';

const steps = ['trial_started', 'industry_selected', 'plan_selected', 'payment_approved', 'organization_created', 'tenant_created', 'database_created', 'admin_created', 'dashboard_created', 'knowledge_vault_created', 'atlas_installed', 'sofia_installed', 'max_installed', 'first_mission_created', 'welcome_email_queued', 'ready'];

function publicSession(session) { const { adminPassword, adminPasswordHash, ...safe } = session; return safe; }
function advance(session, step) { const index = steps.indexOf(step); for (let i = 0; i <= index; i += 1) session.steps[steps[i]] = { status: 'completed', completedAt: session.steps[steps[i]]?.completedAt || new Date().toISOString() }; session.currentStep = step; session.updatedAt = new Date().toISOString(); }

function installEmployee(store, organizationId, definition) {
  const employee = normalizeEmployee({ ...definition, employeeId: store.createId(), organizationId, employeeStatus: 'Active', employmentStatus: 'Active', deploymentStatus: 'Active', missionStatus: 'No mission', documents: generateFactoryDocumentReferences(), timeline: [{ type: 'Installed', date: new Date().toISOString().slice(0, 10), department: definition.department, comment: 'Digital Employee installed during customer onboarding.', evidence: 'factory/generators/Digital-Employee-Generator.md' }] });
  store.employees.unshift(employee);
  const audit = auditEmployee(employee);
  store.audits.unshift({ ...audit, organizationId });
  store.knowledgeRecords.unshift({ id: store.createId(), platformId: store.platform.id, organizationId, employeeId: employee.employeeId, title: `${employee.employeeName} operating knowledge`, content: `${employee.employeeName} installed with bounded ${employee.role} capabilities.`, sourceEvidenceIds: [], createdBy: 'platform-onboarding', createdAt: new Date().toISOString(), version: 1 });
  return employee;
}

export function createOnboardingService(store, auth) {
  store.onboardingSessions ||= [];
  store.emailOutbox ||= [];
  return {
    async createTrial(input) {
      if (!input.companyName || !input.adminName || !input.email || !input.password) throw new Error('Company, administrator, email, and password are required.');
      if (store.onboardingSessions.some((session) => session.email === String(input.email).trim().toLowerCase() && !['ready', 'cancelled'].includes(session.status))) throw new Error('An active onboarding session already exists for this email.');
      const now = new Date().toISOString();
      const session = { id: `onboarding-${store.createId()}`, companyName: String(input.companyName).trim(), adminName: String(input.adminName).trim(), email: String(input.email).trim().toLowerCase(), adminPasswordHash: await auth.hashPassword(String(input.password)), industry: null, plan: null, payment: null, organizationId: null, employeeIds: [], missionId: null, status: 'trial', currentStep: 'trial_started', steps: Object.fromEntries(steps.map((step) => [step, { status: 'pending' }])), createdAt: now, updatedAt: now };
      advance(session, 'trial_started'); store.onboardingSessions.unshift(session); return publicSession(session);
    },
    get(id) { const session = store.onboardingSessions.find((item) => item.id === id); return session ? publicSession(session) : null; },
    selectIndustry(id, industry) { const session = store.onboardingSessions.find((item) => item.id === id); if (!session) return null; session.industry = String(industry || '').trim(); if (!session.industry) throw new Error('Industry is required.'); session.status = 'industry_selected'; advance(session, 'industry_selected'); return publicSession(session); },
    selectPlan(id, plan) { const session = store.onboardingSessions.find((item) => item.id === id); if (!session) return null; session.plan = String(plan || '').trim(); if (!session.plan) throw new Error('Plan is required.'); session.status = 'payment_pending'; advance(session, 'plan_selected'); return publicSession(session); },
    async recordVerifiedPayment(id, payment) {
      const session = store.onboardingSessions.find((item) => item.id === id); if (!session) return null;
      if (payment.provider !== 'stripe' || payment.status !== 'approved' || !payment.providerEventId || payment.verified !== true) throw new Error('A verified approved payment event is required.');
      if (session.organizationId) return publicSession(session);
      session.payment = { provider: payment.provider, providerEventId: payment.providerEventId, plan: session.plan, approvedAt: new Date().toISOString() }; session.status = 'provisioning'; advance(session, 'payment_approved');
      const provisioned = await provisionOrganization(store, auth, { organization: { name: session.companyName, slug: session.companyName, plan: session.plan }, admin: { name: session.adminName, email: session.email, passwordHash: session.adminPasswordHash }, firstEmployee: { employeeNumber: 'DE-012A', employeeName: 'ATLAS ANALYST™', division: 'PROJECT FORGE Intelligence Division™', department: 'Atlas Intelligence', manager: 'PROJECT FORGE Platform', role: 'Knowledge Intelligence Analyst™', specializations: ['Knowledge Governance Specialist™', 'Repository Analysis'] } });
      session.organizationId = provisioned.organization.id; session.employeeIds.push(provisioned.employee.employeeId); advance(session, 'organization_created'); advance(session, 'tenant_created'); advance(session, 'database_created'); advance(session, 'admin_created'); advance(session, 'dashboard_created'); advance(session, 'knowledge_vault_created'); advance(session, 'atlas_installed');
      const sofia = installEmployee(store, session.organizationId, { employeeNumber: 'DE-013A', employeeName: 'SOFÍA™', division: 'PROJECT FORGE Commercial Division™', department: 'Customer Success', manager: 'PROJECT FORGE Platform', role: 'Customer Success Digital Employee™', specializations: ['Customer Success', 'Communication'] }); session.employeeIds.push(sofia.employeeId); advance(session, 'sofia_installed');
      const max = installEmployee(store, session.organizationId, { employeeNumber: 'DE-014A', employeeName: 'MAX™', division: 'PROJECT FORGE Revenue Operations™', department: 'Revenue Operations', manager: 'PROJECT FORGE Platform', role: 'Revenue Operations Digital Employee™', specializations: ['Revenue Intelligence', 'Operations'] }); session.employeeIds.push(max.employeeId); advance(session, 'max_installed');
      const missionInput = validateMissionInput({ title: 'Customer onboarding knowledge intake', type: 'Knowledge', objective: 'Collect customer-provided documents and establish the first organization knowledge baseline.', employeeId: provisioned.employee.employeeId, organizationId: session.organizationId, customerId: session.organizationId, revenueImpact: 0, hoursSaved: 0, customerImpact: 'Customer activation', reusableKnowledge: 'Customer onboarding knowledge baseline.' }, store.employees); if (!missionInput.ok) throw new Error(missionInput.error);
      const mission = { ...createMission(missionInput.input, `mission-${store.createId()}`, 'PROJECT FORGE Onboarding'), organizationId: session.organizationId, customerId: session.organizationId }; store.missions.unshift(mission); session.missionId = mission.id; advance(session, 'first_mission_created');
      store.emailOutbox.unshift({ id: store.createId(), organizationId: session.organizationId, to: session.email, template: 'customer-welcome', subject: 'Your PROJECT FORGE workspace is ready', payload: { organizationId: session.organizationId, missionId: mission.id }, status: 'queued', createdAt: new Date().toISOString() }); advance(session, 'welcome_email_queued'); session.status = 'ready'; advance(session, 'ready'); return publicSession(session);
    }
  };
}
