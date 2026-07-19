import { generateFactoryDocumentReferences } from './factory-adapter.mjs';
import { auditEmployee, normalizeEmployee, validateEmployeeInput } from './employee-domain.mjs';
import { createOrganizationProvisioning } from './tenant-service.mjs';

export async function provisionOrganization(store, auth, input) {
  const organization = createOrganizationProvisioning(store, { name: input.organization?.name, slug: input.organization?.slug, plan: input.organization?.plan || 'foundation' });
  const admin = await auth.createUser({ email: input.admin?.email, name: input.admin?.name, password: input.admin?.password, passwordHash: input.admin?.passwordHash, role: 'COMPANY_ADMIN' }, organization.id);
  const validation = validateEmployeeInput(input.firstEmployee || {}, store.employees.filter((employee) => employee.organizationId === organization.id));
  if (!validation.ok) throw new Error(validation.error);
  const employee = normalizeEmployee({ ...validation.employee, employeeId: store.createId(), organizationId: organization.id, hireDate: validation.employee.hireDate || new Date().toISOString().slice(0, 10), version: 1, documents: generateFactoryDocumentReferences(), timeline: [{ type: 'Created', date: new Date().toISOString().slice(0, 10), department: 'Digital Employee Operations', comment: 'Employee created during organization provisioning.', evidence: 'factory/generators/Digital-Employee-Generator.md' }] });
  store.employees.unshift(employee);
  const audit = auditEmployee(employee);
  store.audits.unshift({ ...audit, organizationId: organization.id });
  store.knowledgeRecords.unshift({ id: store.createId(), platformId: store.platform.id, organizationId: organization.id, title: 'Organization knowledge foundation', content: 'Knowledge repository initialized during provisioning.', sourceEvidenceIds: [], createdBy: admin.id, createdAt: new Date().toISOString(), version: 1 });
  store.missionQueues ||= [];
  store.missionQueues.unshift({ id: store.createId(), organizationId: organization.id, name: 'Executive Mission Queue', status: 'Ready', createdAt: new Date().toISOString() });
  return { organization, admin, employee, status: 'Ready' };
}
