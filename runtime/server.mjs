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

const root = fileURLToPath(new URL('../', import.meta.url));
const publicDir = join(root, 'public');
const credentialsDir = join(root, 'credentials');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
const store = createStore();
const withCredentials = (employee) => ({ ...employee, credentialLinks: credentialLinks(employee.employeeNumber) });

const json = (res, status, body, headers = {}) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(body));
};

async function body(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try { return raw ? JSON.parse(raw) : {}; } catch { return null; }
}

function sessionUser(req) {
  const token = (req.headers.cookie || '').split(';').map((item) => item.trim()).find((item) => item.startsWith('forge_session='))?.split('=')[1];
  return token ? store.sessions.get(token) : null;
}

function requireAuth(req, res) {
  const user = sessionUser(req);
  if (!user) { json(res, 401, { error: 'Authentication required.' }); return null; }
  return user;
}

async function api(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { status: 'ok', product: 'PROJECT FORGE Digital Employee Portal', phase: 'I' });
  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const input = await body(req);
    const user = store.users.find((item) => item.email === input?.email && item.password === input?.password);
    if (!user) return json(res, 401, { error: 'Invalid email or password.' });
    const token = store.createId();
    store.sessions.set(token, { id: user.id, email: user.email, name: user.name, role: user.role });
    return json(res, 200, { user: store.sessions.get(token) }, { 'set-cookie': `forge_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800` });
  }
  if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
    const token = (req.headers.cookie || '').split(';').map((item) => item.trim()).find((item) => item.startsWith('forge_session='))?.split('=')[1];
    if (token) store.sessions.delete(token);
    return json(res, 200, { ok: true }, { 'set-cookie': 'forge_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' });
  }
  const user = requireAuth(req, res);
  if (!user) return;
  if (req.method === 'GET' && url.pathname === '/api/bootstrap') return json(res, 200, { user, stages, opportunities: store.opportunities, timeline: store.timeline, kpis: calculateKpis(store.opportunities), insights: generateInsights(store.opportunities, store.timeline), settings: store.settings, employees: store.employees.map(withCredentials), missions: store.missions, contracts: store.contracts, execution: executionDashboard(store.missions, store.employees, store.automationJobs, { modules: ecosystemModules }), contractsDashboard: workContractDashboard(store.contracts, store.employees), portal: portalMetrics(store.employees, store.automationJobs, store.audits), ecosystem: { modules: ecosystemModules, plannedEmployees, metrics: ecosystemMetrics(store.employees, store.opportunities, store.automationJobs, store.audits) }, audits: store.audits });
  if (req.method === 'GET' && url.pathname === '/api/ecosystem') return json(res, 200, { data: { modules: ecosystemModules, plannedEmployees, metrics: ecosystemMetrics(store.employees, store.opportunities, store.automationJobs, store.audits) }, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/workforce') return json(res, 200, { data: { employees: store.employees, plannedEmployees, metrics: ecosystemMetrics(store.employees, store.opportunities, store.automationJobs, store.audits) }, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/knowledge') return json(res, 200, { data: { records: store.employees.flatMap((employee) => employee.knowledgeProfile.domains.map((domain) => ({ domain, owner: employee.employeeName, usage: employee.evidence.length, status: 'Canonical' }))), metrics: ecosystemMetrics(store.employees, store.opportunities, store.automationJobs, store.audits) }, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/revenue') return json(res, 200, { data: { contributions: store.employees.map((employee) => ({ employeeNumber: employee.employeeNumber, employeeName: employee.employeeName, revenueGenerated: employee.revenueGenerated, missionCount: employee.missionHistory.length })), metrics: ecosystemMetrics(store.employees, store.opportunities, store.automationJobs, store.audits) }, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/execution/dashboard') return json(res, 200, { data: executionDashboard(store.missions, store.employees, store.automationJobs, { modules: ecosystemModules }), errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/contracts/dashboard') return json(res, 200, { data: workContractDashboard(store.contracts, store.employees), errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/contracts') { const status = url.searchParams.get('status'); const priority = url.searchParams.get('priority'); const contracts = store.contracts.filter((contract) => (!status || contract.status === status) && (!priority || contract.priority === priority)); return json(res, 200, { data: contracts, meta: { total: contracts.length }, errors: [] }); }
  if (req.method === 'POST' && url.pathname === '/api/contracts') { const result = validateWorkContractInput(await body(req), store.employees); if (!result.ok) return json(res, 400, { error: result.error }); const contract = createWorkContract(result.input, result.input.contractId || ('contract-' + store.createId()), user.name); store.contracts.unshift(contract); return json(res, 201, { data: contract, errors: [] }); }
  if (req.method === 'GET' && url.pathname === '/api/employees') {
    const search = String(url.searchParams.get('search') || '').toLowerCase();
    const status = url.searchParams.get('status');
    const department = url.searchParams.get('department');
    const employees = store.employees.filter((employee) => (!search || [employee.employeeNumber, employee.employeeName, employee.role, employee.department, employee.manager].join(' ').toLowerCase().includes(search)) && (!status || employee.employmentStatus === status) && (!department || employee.department === department));
    return json(res, 200, { data: employees.map(withCredentials), meta: { total: employees.length }, errors: [] });
  }
  const credentialMatch = url.pathname.match(/^\/api\/employees\/([^/]+)\/credentials$/);
  if (req.method === 'GET' && credentialMatch) {
    const employee = store.employees.find((item) => item.employeeId === credentialMatch[1] || item.employeeNumber === credentialMatch[1]);
    if (!employee) return json(res, 404, { error: 'Employee not found.' });
    return json(res, 200, { data: credentialLinks(employee.employeeNumber), errors: [] });
  }
  const employeeMatch = url.pathname.match(/^\/api\/employees\/([^/]+)$/);
  if (req.method === 'GET' && employeeMatch) {
    const employee = store.employees.find((item) => item.employeeId === employeeMatch[1] || item.employeeNumber === employeeMatch[1]);
    if (!employee) return json(res, 404, { error: 'Employee not found.' });
    return json(res, 200, { data: withCredentials(employee), meta: { version: employee.version }, errors: [] });
  }
  if (req.method === 'POST' && url.pathname === '/api/employees') {
    const result = validateEmployeeInput(await body(req), store.employees);
    if (!result.ok) return json(res, 400, { error: result.error });
    const employee = { ...result.employee, employeeId: store.createId(), hireDate: result.employee.hireDate || new Date().toISOString().slice(0, 10), version: 1, documents: generateFactoryDocumentReferences(), timeline: [{ type: 'Created', date: new Date().toISOString().slice(0, 10), department: 'Digital Employee Operations', comment: 'Portal generation request accepted.', evidence: 'factory/generators/Digital-Employee-Generator.md' }] };
    store.employees.unshift(employee);
    const audit = auditEmployee(employee);
    store.audits.unshift(audit);
    store.automationJobs.unshift({ id: store.createId(), command: 'Create Digital Employee', status: 'Queued', employeeNumber: employee.employeeNumber, updatedAt: new Date().toISOString() });
    return json(res, 202, { data: employee, meta: { request_id: store.createId(), audit }, errors: [] });
  }
  if (req.method === 'GET' && url.pathname === '/api/missions') {
    const stateFilter = url.searchParams.get('state');
    const employeeFilter = url.searchParams.get('employeeId');
    const missions = store.missions.filter((mission) => (!stateFilter || mission.state === stateFilter) && (!employeeFilter || mission.employeeId === employeeFilter));
    return json(res, 200, { data: missions, meta: { total: missions.length, states: missionStates, types: missionTypes }, errors: [] });
  }
  if (req.method === 'POST' && url.pathname === '/api/missions') {
    const result = validateMissionInput(await body(req), store.employees);
    if (!result.ok) return json(res, 400, { error: result.error });
    const mission = createMission(result.input, `mission-${store.createId()}`, user.name);
    store.missions.unshift(mission);
    store.dispatchLog.push({ missionId: mission.id, action: 'Created', at: mission.createdAt, actor: user.name });
    return json(res, 201, { data: mission, errors: [] });
  }
  const contractMatch = url.pathname.match(/^\/api\/contracts\/([^/]+)$/);
  const contractActionMatch = url.pathname.match(/^\/api\/contracts\/([^/]+)\/(assign|review|cancel)$/);
  const contractId = contractMatch?.[1] || contractActionMatch?.[1];
  const contract = contractId ? store.contracts.find((item) => item.contractId === contractId || item.id === contractId) : null;
  if (contractId && !contract) return json(res, 404, { error: 'Contract not found.' });
  if (req.method === 'GET' && contractMatch) return json(res, 200, { data: contract, errors: [] });
  if (req.method === 'POST' && contractActionMatch) { const input = await body(req); let result; if (contractActionMatch[2] === 'assign') result = assignContract(contract, store.employees, user.name, input.employeeId || null); if (contractActionMatch[2] === 'review') result = reviewContract(contract, input.decision, user.name, input.comments || input.reason || ''); if (contractActionMatch[2] === 'cancel') result = reviewContract(contract, 'Cancelled', user.name, input.reason || 'Contract cancelled by executive command.'); if (!result?.ok) return json(res, 400, { error: result?.error || 'Contract action failed.' }); return json(res, 200, { data: contract, errors: [] }); }
  const missionMatch = url.pathname.match(/^\/api\/missions\/([^/]+)$/);
  const missionActionMatch = url.pathname.match(/^\/api\/missions\/([^/]+)\/(assign|accept|reject|start|pause|resume|complete|cancel|archive|evidence|report|review|timeline)$/);
  const missionId = missionMatch?.[1] || missionActionMatch?.[1];
  const mission = missionId ? store.missions.find((item) => item.id === missionId) : null;
  if (missionId && !mission) return json(res, 404, { error: 'Mission not found.' });
  if (req.method === 'GET' && missionMatch) return json(res, 200, { data: mission, errors: [] });
  if (req.method === 'GET' && missionActionMatch?.[2] === 'timeline') return json(res, 200, { data: mission.logs, errors: [] });
  if (req.method === 'POST' && missionActionMatch) {
    const action = missionActionMatch[2];
    const input = await body(req);
    const employee = store.employees.find((item) => item.employeeId === (input.employeeId || mission.employeeId));
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
  if (req.method === 'GET' && url.pathname === '/api/certifications') return json(res, 200, { data: store.employees.map((employee) => ({ employeeNumber: employee.employeeNumber, employeeName: employee.employeeName, level: employee.certificationLevel, graduationDate: employee.graduationDate, documents: employee.documents.filter((document) => ['Graduation Certificate', 'Diploma', 'Executive Audit'].includes(document.name)) })), errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/promotions') return json(res, 200, { data: store.employees.flatMap((employee) => employee.timeline.filter((event) => event.type === 'Promotion').map((event) => ({ ...event, employeeNumber: employee.employeeNumber, employeeName: employee.employeeName }))), errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/hall-of-fame') return json(res, 200, { data: store.employees.filter((employee) => employee.hallOfFameStatus === 'Published'), errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/audits') return json(res, 200, { data: store.audits, errors: [] });
  if (req.method === 'POST' && url.pathname === '/api/audits') {
    const input = await body(req);
    const employee = store.employees.find((item) => item.employeeId === input?.employeeId);
    if (!employee) return json(res, 404, { error: 'Employee not found.' });
    const audit = auditEmployee(employee);
    store.audits.unshift(audit);
    return json(res, 200, { data: audit, errors: [] });
  }
  if (req.method === 'GET' && url.pathname === '/api/factory/status') return json(res, 200, { data: { templates: 'Ready', generator: 'Ready', lifecycle: 'Ready', registry: 'Healthy', brandResolver: 'Canonical', queue: store.automationJobs }, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/opportunities') return json(res, 200, { opportunities: store.opportunities, stages });
  if (req.method === 'POST' && url.pathname === '/api/opportunities') {
    const result = validateOpportunity(await body(req));
    if (!result.ok) return json(res, 400, { error: result.error });
    const opportunity = { id: store.createId(), ...result.opportunity, owner: user.name, updatedAt: new Date().toISOString() };
    store.opportunities.unshift(opportunity);
    return json(res, 201, { opportunity });
  }
  const opportunityMatch = url.pathname.match(/^\/api\/opportunities\/([^/]+)$/);
  if (req.method === 'PATCH' && opportunityMatch) {
    const opportunity = store.opportunities.find((item) => item.id === opportunityMatch[1]);
    if (!opportunity) return json(res, 404, { error: 'Opportunity not found.' });
    const input = await body(req);
    if (input.stage && stages.includes(input.stage)) opportunity.stage = input.stage;
    if (input.probability !== undefined) opportunity.probability = Math.max(0, Math.min(100, Number(input.probability)));
    opportunity.updatedAt = new Date().toISOString();
    return json(res, 200, { opportunity });
  }
  if (req.method === 'GET' && url.pathname === '/api/settings') return json(res, 200, { settings: store.settings });
  if (req.method === 'PATCH' && url.pathname === '/api/settings') {
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
