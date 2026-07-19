import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateKpis, generateInsights, stages, validateOpportunity } from './domain.mjs';
import { auditEmployee, portalMetrics, validateEmployeeInput } from './employee-domain.mjs';
import { generateFactoryDocumentReferences } from './factory-adapter.mjs';
import { ecosystemMetrics, ecosystemModules, plannedEmployees } from './ecosystem-domain.mjs';
import { createStore } from './store.mjs';
import { credentialLinks } from '../credentials/engine.mjs';
import { missionStates, missionTypes, createMission, validateMissionInput } from './mission-domain.mjs';
import { attachEvidence, completeMission, executeMission, loadEmployeeKnowledge, requestHumanReview, transitionMission } from './execution-engine.mjs';
import { executionDashboard } from './execution-dashboard.mjs';
import { executeWithEmployeeAdapter } from './execution-adapter.mjs';
import { buildMissionReport, writeMissionEvidencePackage } from './mission-reporter.mjs';
import { deployAtlas } from './atlas-deployment.mjs';
import { validateWorkContractInput, createWorkContract } from './work-contract-domain.mjs';
import { assignContract, reviewContract } from './work-contract-engine.mjs';
import { workContractDashboard } from './work-contract-dashboard.mjs';
import { deployFirstWorkContract } from './work-contract-deployment.mjs';
import { createAuthService } from './auth-service.mjs';
import { visibleRecords, createOrganizationProvisioning } from './tenant-service.mjs';
import { can } from './platform-domain.mjs';
import { createKnowledgeRepository } from './knowledge-repository.mjs';
import { executiveDashboard } from './dashboard-service.mjs';
import { hydrateStore, createStorePersistence } from './store-persistence.mjs';
import { provisionOrganization } from './provisioning-service.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicDir = join(root, 'public');
const credentialsDir = join(root, 'credentials');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
const store = await hydrateStore(createStore(), root);
const persistStore = createStorePersistence(store, root);
const auth = await createAuthService(store, root);
const knowledgeRepository = createKnowledgeRepository(store);
const withCredentials = (employee) => ({ ...employee, credentialLinks: credentialLinks(employee.employeeNumber) });

const json = (res, status, body, headers = {}) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(body));
  void persistStore();
};

async function body(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try { return raw ? JSON.parse(raw) : {}; } catch { return null; }
}

function sessionUser(req) { return auth.userFromRequest(req); }

function requireAuth(req, res) { const user = sessionUser(req); if (!user) { json(res, 401, { error: "Authentication required." }); return null; } return user; }

function requirePermission(user, res, permission) { if (!can(user, permission)) { json(res, 403, { error: "Insufficient permission." }); return false; } return true; }

async function api(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { status: 'ok', product: 'PROJECT FORGE Digital Employee Portal', phase: 'I' });
  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const input = await body(req);
    const authenticated = await auth.authenticate(input?.email, input?.password);
    if (!authenticated) return json(res, 401, { error: 'Invalid credentials.' });
    return json(res, 200, { user: authenticated.user }, { 'set-cookie': 'forge_session=' + authenticated.token + '; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800' });
  }
  if (req.method === 'POST' && url.pathname === '/api/platform/provision') {
    if (!process.env.FORGE_PROVISIONING_KEY || req.headers['x-forge-provisioning-key'] !== process.env.FORGE_PROVISIONING_KEY) return json(res, 403, { error: 'Provisioning authorization required.' });
    try { const result = await provisionOrganization(store, auth, await body(req)); return json(res, 201, { data: result, errors: [] }); } catch (error) { return json(res, 400, { error: error.message }); }
  }
  if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
    auth.logout(req);
    return json(res, 200, { ok: true }, { 'set-cookie': 'forge_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' });
  }
  const user = requireAuth(req, res);
  if (!user) return;
  const visible = visibleRecords(store, user);
  const visibleOrganizations = store.organizations.filter((organization) => user.role === "SUPER_ADMIN" || organization.id === user.organizationId);
  const actorOrganizationId = user.organizationId || store.organizations[0]?.id;
  if (req.method === 'GET' && url.pathname === '/api/organizations') return json(res, 200, { data: visibleOrganizations, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/dashboard') return json(res, 200, { data: executiveDashboard({ organizations: visibleOrganizations, employees: visible.employees, missions: visible.missions, contracts: visible.contracts, knowledgeRecords: visible.knowledgeRecords, evidenceRecords: visible.evidenceRecords }), errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/knowledge/records') return json(res, 200, { data: knowledgeRepository.list(user), errors: [] });
  if (req.method === 'POST' && url.pathname === '/api/knowledge/records') { if (!can(user, 'resource:write')) return json(res, 403, { error: 'Knowledge write permission required.' }); try { return json(res, 201, { data: knowledgeRepository.add(await body(req), user), errors: [] }); } catch (error) { return json(res, 400, { error: error.message }); } }
  if (req.method === 'GET' && url.pathname === '/api/bootstrap') return json(res, 200, { user, organizations: visibleOrganizations, dashboard: executiveDashboard({ organizations: visibleOrganizations, employees: visible.employees, missions: visible.missions, contracts: visible.contracts, knowledgeRecords: visible.knowledgeRecords, evidenceRecords: visible.evidenceRecords }), stages, opportunities: visible.opportunities, timeline: visible.timeline, kpis: calculateKpis(visible.opportunities), insights: generateInsights(visible.opportunities, visible.timeline), settings: store.settings, employees: visible.employees.map(withCredentials), missions: visible.missions, contracts: visible.contracts, execution: executionDashboard(visible.missions, visible.employees, store.automationJobs, { modules: ecosystemModules }), contractsDashboard: workContractDashboard(visible.contracts, visible.employees), portal: portalMetrics(visible.employees, store.automationJobs, visible.audits), ecosystem: { modules: ecosystemModules, plannedEmployees, metrics: ecosystemMetrics(visible.employees, visible.opportunities, store.automationJobs, visible.audits) }, audits: visible.audits });
  if (req.method === 'GET' && url.pathname === '/api/ecosystem') return json(res, 200, { data: { modules: ecosystemModules, plannedEmployees, metrics: ecosystemMetrics(visible.employees, visible.opportunities, store.automationJobs, visible.audits) }, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/workforce') return json(res, 200, { data: { employees: visible.employees, plannedEmployees, metrics: ecosystemMetrics(visible.employees, visible.opportunities, store.automationJobs, visible.audits) }, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/knowledge') return json(res, 200, { data: { records: visible.employees.flatMap((employee) => employee.knowledgeProfile.domains.map((domain) => ({ domain, owner: employee.employeeName, usage: employee.evidence.length, status: 'Canonical' }))), metrics: ecosystemMetrics(visible.employees, visible.opportunities, store.automationJobs, visible.audits) }, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/revenue') return json(res, 200, { data: { contributions: visible.employees.map((employee) => ({ employeeNumber: employee.employeeNumber, employeeName: employee.employeeName, revenueGenerated: employee.revenueGenerated, missionCount: employee.missionHistory.length })), metrics: ecosystemMetrics(visible.employees, visible.opportunities, store.automationJobs, visible.audits) }, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/execution/dashboard') return json(res, 200, { data: executionDashboard(visible.missions, visible.employees, store.automationJobs, { modules: ecosystemModules }), errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/contracts/dashboard') return json(res, 200, { data: workContractDashboard(visible.contracts, visible.employees), errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/contracts') { const status = url.searchParams.get('status'); const priority = url.searchParams.get('priority'); const contracts = visible.contracts.filter((contract) => (!status || contract.status === status) && (!priority || contract.priority === priority)); return json(res, 200, { data: contracts, meta: { total: contracts.length }, errors: [] }); }
  if (req.method === 'POST' && url.pathname === '/api/contracts') { if (!requirePermission(user, res, 'resource:write')) return; const result = validateWorkContractInput(await body(req), visible.employees); if (!result.ok) return json(res, 400, { error: result.error }); const contract = { ...createWorkContract(result.input, result.input.contractId || ('contract-' + store.createId()), user.name), organizationId: actorOrganizationId }; store.contracts.unshift(contract); return json(res, 201, { data: contract, errors: [] }); }
  if (req.method === 'GET' && url.pathname === '/api/employees') {
    const search = String(url.searchParams.get('search') || '').toLowerCase();
    const status = url.searchParams.get('status');
    const department = url.searchParams.get('department');
    const employees = visible.employees.filter((employee) => (!search || [employee.employeeNumber, employee.employeeName, employee.role, employee.department, employee.manager].join(' ').toLowerCase().includes(search)) && (!status || employee.employmentStatus === status) && (!department || employee.department === department));
    return json(res, 200, { data: employees.map(withCredentials), meta: { total: employees.length }, errors: [] });
  }
  const credentialMatch = url.pathname.match(/^\/api\/employees\/([^/]+)\/credentials$/);
  if (req.method === 'GET' && credentialMatch) {
    const employee = visible.employees.find((item) => item.employeeId === credentialMatch[1] || item.employeeNumber === credentialMatch[1]);
    if (!employee) return json(res, 404, { error: 'Employee not found.' });
    return json(res, 200, { data: credentialLinks(employee.employeeNumber), errors: [] });
  }
  const employeeMatch = url.pathname.match(/^\/api\/employees\/([^/]+)$/);
  if (req.method === 'GET' && employeeMatch) {
    const employee = visible.employees.find((item) => item.employeeId === employeeMatch[1] || item.employeeNumber === employeeMatch[1]);
    if (!employee) return json(res, 404, { error: 'Employee not found.' });
    return json(res, 200, { data: withCredentials(employee), meta: { version: employee.version }, errors: [] });
  }
  if (req.method === 'POST' && url.pathname === '/api/employees') { if (!requirePermission(user, res, 'resource:write')) return;
    const result = validateEmployeeInput(await body(req), visible.employees);
    if (!result.ok) return json(res, 400, { error: result.error });
    const employee = { ...result.employee, organizationId: actorOrganizationId, employeeId: store.createId(), hireDate: result.employee.hireDate || new Date().toISOString().slice(0, 10), version: 1, documents: generateFactoryDocumentReferences(), timeline: [{ type: 'Created', date: new Date().toISOString().slice(0, 10), department: 'Digital Employee Operations', comment: 'Portal generation request accepted.', evidence: 'factory/generators/Digital-Employee-Generator.md' }] };
    store.employees.unshift(employee);
    const audit = { ...auditEmployee(employee), organizationId: employee.organizationId };
    store.audits.unshift(audit);
    store.automationJobs.unshift({ id: store.createId(), command: 'Create Digital Employee', status: 'Queued', employeeNumber: employee.employeeNumber, updatedAt: new Date().toISOString() });
    return json(res, 202, { data: employee, meta: { request_id: store.createId(), audit }, errors: [] });
  }
  if (req.method === 'GET' && url.pathname === '/api/missions') {
    const stateFilter = url.searchParams.get('state');
    const employeeFilter = url.searchParams.get('employeeId');
    const missions = visible.missions.filter((mission) => (!stateFilter || mission.state === stateFilter) && (!employeeFilter || mission.employeeId === employeeFilter));
    return json(res, 200, { data: missions, meta: { total: missions.length, states: missionStates, types: missionTypes }, errors: [] });
  }
  if (req.method === 'POST' && url.pathname === '/api/missions') { if (!requirePermission(user, res, 'mission:execute')) return;
    const result = validateMissionInput(await body(req), visible.employees);
    if (!result.ok) return json(res, 400, { error: result.error });
    const mission = { ...createMission(result.input, "mission-" + store.createId(), user.name), organizationId: actorOrganizationId };
    store.missions.unshift(mission);
    store.dispatchLog.push({ missionId: mission.id, action: 'Created', at: mission.createdAt, actor: user.name });
    return json(res, 201, { data: mission, errors: [] });
  }
  const contractMatch = url.pathname.match(/^\/api\/contracts\/([^/]+)$/);
  const contractActionMatch = url.pathname.match(/^\/api\/contracts\/([^/]+)\/(assign|review|cancel)$/);
  const contractId = contractMatch?.[1] || contractActionMatch?.[1];
  const contract = contractId ? visible.contracts.find((item) => item.contractId === contractId || item.id === contractId) : null;
  if (contractId && !contract) return json(res, 404, { error: 'Contract not found.' });
  if (req.method === 'GET' && contractMatch) return json(res, 200, { data: contract, errors: [] });
  if (req.method === 'POST' && contractActionMatch) { if (!requirePermission(user, res, 'resource:write')) return; const input = await body(req); let result; if (contractActionMatch[2] === 'assign') result = assignContract(contract, visible.employees, user.name, input.employeeId || null); if (contractActionMatch[2] === 'review') result = reviewContract(contract, input.decision, user.name, input.comments || input.reason || ''); if (contractActionMatch[2] === 'cancel') result = reviewContract(contract, 'Cancelled', user.name, input.reason || 'Contract cancelled by executive command.'); if (!result?.ok) return json(res, 400, { error: result?.error || 'Contract action failed.' }); return json(res, 200, { data: contract, errors: [] }); }
  const missionMatch = url.pathname.match(/^\/api\/missions\/([^/]+)$/);
  const missionActionMatch = url.pathname.match(/^\/api\/missions\/([^/]+)\/(assign|accept|reject|start|pause|resume|complete|cancel|archive|evidence|report|review|timeline)$/);
  const missionId = missionMatch?.[1] || missionActionMatch?.[1];
  const mission = missionId ? visible.missions.find((item) => item.id === missionId) : null;
  if (missionId && !mission) return json(res, 404, { error: 'Mission not found.' });
  if (req.method === 'GET' && missionMatch) return json(res, 200, { data: mission, errors: [] });
  if (req.method === 'GET' && missionActionMatch?.[2] === 'timeline') return json(res, 200, { data: mission.logs, errors: [] });
  if (req.method === 'POST' && missionActionMatch) { if (!requirePermission(user, res, 'mission:execute')) return;
    const action = missionActionMatch[2];
    const input = await body(req);
    const employee = visible.employees.find((item) => item.employeeId === (input.employeeId || mission.employeeId));
    if (['assign', 'accept', 'start', 'complete', 'resume', 'pause'].includes(action) && !employee) return json(res, 400, { error: 'A valid employee assignment is required.' });
    let result;
    if (action === 'assign') { mission.employeeId = employee.employeeId; result = transitionMission(mission, 'Assigned', user.name, `Mission assigned to ${employee.employeeName}.`); }
    if (action === 'accept') { result = transitionMission(mission, 'Preparing', employee.employeeName, 'Employee accepted the mission.'); if (result.ok) { loadEmployeeKnowledge(mission, employee, employee.employeeName); result = transitionMission(mission, 'Knowledge Loaded', employee.employeeName, 'Employee knowledge loaded for execution.'); } }
    if (action === 'reject' || action === 'cancel') result = transitionMission(mission, 'Cancelled', employee?.employeeName || user.name, input.reason || 'Mission cancelled by authorized actor.');
    if (action === 'start') { if (mission.state === 'Assigned') { result = transitionMission(mission, 'Preparing', employee.employeeName, 'Dispatcher opened preparation.'); if (result.ok) { loadEmployeeKnowledge(mission, employee, employee.employeeName); result = transitionMission(mission, 'Knowledge Loaded', employee.employeeName, 'Knowledge loaded by dispatcher.'); } } if (result?.ok !== false && mission.state === 'Knowledge Loaded') result = transitionMission(mission, 'Executing', employee.employeeName, 'Employee began execution.'); if (result?.ok !== false && mission.state === 'Executing') result = await executeMission(mission, employee, employee.employeeName, (currentMission, currentEmployee) => executeWithEmployeeAdapter(currentMission, currentEmployee, root)); }
    if (action === 'pause') result = transitionMission(mission, 'Waiting', employee.employeeName, input.reason || 'Employee paused execution.');
    if (action === 'resume') result = transitionMission(mission, 'Executing', employee.employeeName, 'Employee resumed execution.');
    if (action === 'complete') result = completeMission(mission, employee, employee.employeeName);
    if (action === 'archive') result = transitionMission(mission, 'Archived', user.name, 'Mission archived after closure.');
    if (action === 'evidence') result = attachEvidence(mission, { ...input, actor: user.name });
    if (action === 'report') { mission.report = buildMissionReport(mission); if (employee?.employeeNumber === 'DE-012A') mission.reportArtifact = await writeMissionEvidencePackage(mission, root); result = { ok: true, report: mission.report }; }
    if (action === 'review') result = { ok: true, review: requestHumanReview(mission, user.name, input.reason) };
    if (!result?.ok) return json(res, 400, { error: result?.error || 'Mission action failed.' });
    if (employee) { employee.missionStatus = ['Preparing', 'Knowledge Loaded', 'Executing'].includes(mission.state) ? 'In progress' : mission.state === 'Waiting' ? 'Blocked' : mission.state === 'Completed' ? 'Completed' : 'No mission'; employee.updatedAt = new Date().toISOString(); }
    mission.updatedAt = new Date().toISOString();
    store.dispatchLog.push({ missionId: mission.id, action, at: mission.updatedAt, actor: user.name });
    store.executionLogs.push(...mission.logs.slice(-1));
    return json(res, 200, { data: mission, errors: [] });
  }
  if (req.method === 'GET' && url.pathname === '/api/certifications') return json(res, 200, { data: visible.employees.map((employee) => ({ employeeNumber: employee.employeeNumber, employeeName: employee.employeeName, level: employee.certificationLevel, graduationDate: employee.graduationDate, documents: employee.documents.filter((document) => ['Graduation Certificate', 'Diploma', 'Executive Audit'].includes(document.name)) })), errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/promotions') return json(res, 200, { data: visible.employees.flatMap((employee) => employee.timeline.filter((event) => event.type === 'Promotion').map((event) => ({ ...event, employeeNumber: employee.employeeNumber, employeeName: employee.employeeName }))), errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/hall-of-fame') return json(res, 200, { data: visible.employees.filter((employee) => employee.hallOfFameStatus === 'Published'), errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/audits') return json(res, 200, { data: visible.audits, errors: [] });
  if (req.method === 'POST' && url.pathname === '/api/audits') { if (!requirePermission(user, res, 'audit:read')) return;
    const input = await body(req);
    const employee = visible.employees.find((item) => item.employeeId === input?.employeeId);
    if (!employee) return json(res, 404, { error: 'Employee not found.' });
    const audit = auditEmployee(employee);
    store.audits.unshift(audit);
    return json(res, 200, { data: audit, errors: [] });
  }
  if (req.method === 'GET' && url.pathname === '/api/factory/status') return json(res, 200, { data: { templates: 'Ready', generator: 'Ready', lifecycle: 'Ready', registry: 'Healthy', brandResolver: 'Canonical', queue: store.automationJobs }, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/opportunities') return json(res, 200, { opportunities: visible.opportunities, stages });
  if (req.method === 'POST' && url.pathname === '/api/opportunities') { if (!requirePermission(user, res, 'resource:write')) return;
    const result = validateOpportunity(await body(req));
    if (!result.ok) return json(res, 400, { error: result.error });
    const opportunity = { id: store.createId(), organizationId: actorOrganizationId, ...result.opportunity, owner: user.name, updatedAt: new Date().toISOString() };
    store.opportunities.unshift(opportunity);
    return json(res, 201, { opportunity });
  }
  const opportunityMatch = url.pathname.match(/^\/api\/opportunities\/([^/]+)$/);
  if (req.method === 'PATCH' && opportunityMatch) { if (!requirePermission(user, res, 'resource:write')) return;
    const opportunity = visible.opportunities.find((item) => item.id === opportunityMatch[1]);
    if (!opportunity) return json(res, 404, { error: 'Opportunity not found.' });
    const input = await body(req);
    if (input.stage && stages.includes(input.stage)) opportunity.stage = input.stage;
    if (input.probability !== undefined) opportunity.probability = Math.max(0, Math.min(100, Number(input.probability)));
    opportunity.updatedAt = new Date().toISOString();
    return json(res, 200, { opportunity });
  }
  if (req.method === 'GET' && url.pathname === '/api/settings') return json(res, 200, { settings: store.settings });
  if (req.method === 'PATCH' && url.pathname === '/api/settings') { if (!requirePermission(user, res, 'resource:write')) return;
    const input = await body(req);
    Object.assign(store.settings, { workspaceName: String(input.workspaceName || store.settings.workspaceName).slice(0, 80), timezone: String(input.timezone || store.settings.timezone).slice(0, 60), defaultCurrency: String(input.defaultCurrency || store.settings.defaultCurrency).slice(0, 4), insightMode: String(input.insightMode || store.settings.insightMode).slice(0, 40) });
    return json(res, 200, { settings: store.settings });
  }
  return json(res, 404, { error: 'Route not found.' });
}

async function serve(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/')) return api(req, res, url);
  if (url.pathname.startsWith('/credentials/')) {
    const requestedCredential = url.pathname.slice(1);
    const file = normalize(join(root, requestedCredential));
    if (!file.startsWith(credentialsDir)) return json(res, 403, { error: 'Forbidden.' });
    try {
      const content = await readFile(file);
      const types = { '.html': 'text/html; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8' };
      res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
      res.end(content);
    } catch { json(res, 404, { error: 'Credential not found.' }); }
    return;
  }
  const requested = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const file = normalize(join(publicDir, requested));
  if (!file.startsWith(publicDir)) return json(res, 403, { error: 'Forbidden.' });
  try {
    const content = await readFile(file);
    const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
    res.end(content);
  } catch { json(res, 404, { error: 'Not found.' }); }
}

createServer(serve).listen(port, host, () => { console.log(`Digital Employee Portal running at http://localhost:${port}`); deployAtlas(store, root).then((mission) => { console.log(`Atlas deployment ${mission.id}: ${mission.state}`); return deployFirstWorkContract(store, root); }).then((contract) => console.log(`Work contract ${contract.contractId}: ${contract.status}`)).catch((error) => console.error(`Deployment failed: ${error.message}`)); });
