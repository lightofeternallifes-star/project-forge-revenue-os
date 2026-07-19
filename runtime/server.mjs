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
  if (req.method === 'GET' && url.pathname === '/api/bootstrap') return json(res, 200, { user, stages, opportunities: store.opportunities, timeline: store.timeline, kpis: calculateKpis(store.opportunities), insights: generateInsights(store.opportunities, store.timeline), settings: store.settings, employees: store.employees.map(withCredentials), portal: portalMetrics(store.employees, store.automationJobs, store.audits), ecosystem: { modules: ecosystemModules, plannedEmployees, metrics: ecosystemMetrics(store.employees, store.opportunities, store.automationJobs, store.audits) }, audits: store.audits });
  if (req.method === 'GET' && url.pathname === '/api/ecosystem') return json(res, 200, { data: { modules: ecosystemModules, plannedEmployees, metrics: ecosystemMetrics(store.employees, store.opportunities, store.automationJobs, store.audits) }, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/workforce') return json(res, 200, { data: { employees: store.employees, plannedEmployees, metrics: ecosystemMetrics(store.employees, store.opportunities, store.automationJobs, store.audits) }, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/knowledge') return json(res, 200, { data: { records: store.employees.flatMap((employee) => employee.knowledgeProfile.domains.map((domain) => ({ domain, owner: employee.employeeName, usage: employee.evidence.length, status: 'Canonical' }))), metrics: ecosystemMetrics(store.employees, store.opportunities, store.automationJobs, store.audits) }, errors: [] });
  if (req.method === 'GET' && url.pathname === '/api/revenue') return json(res, 200, { data: { contributions: store.employees.map((employee) => ({ employeeNumber: employee.employeeNumber, employeeName: employee.employeeName, revenueGenerated: employee.revenueGenerated, missionCount: employee.missionHistory.length })), metrics: ecosystemMetrics(store.employees, store.opportunities, store.automationJobs, store.audits) }, errors: [] });
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
  if (req.method === 'GET' && url.pathname === '/api/missions') return json(res, 200, { data: store.employees.flatMap((employee) => employee.missionHistory.map((mission) => ({ ...mission, employeeNumber: employee.employeeNumber, employeeName: employee.employeeName }))), errors: [] });
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

createServer(serve).listen(port, host, () => console.log(`Digital Employee Portal running at http://localhost:${port}`));
