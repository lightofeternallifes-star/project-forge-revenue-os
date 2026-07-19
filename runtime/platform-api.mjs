import { can } from './platform-domain.mjs';
import { createOrganizationService } from './services/organization-service.mjs';
import { createUserService } from './services/user-service.mjs';
import { createEmployeeService } from './services/employee-service.mjs';
import { createMissionService } from './services/mission-service.mjs';
import { createContractService } from './services/contract-service.mjs';
import { createKnowledgeService } from './services/knowledge-service.mjs';
import { createAuditService } from './services/audit-service.mjs';
import { createNotificationService } from './services/notification-service.mjs';
import { executiveDashboard } from './dashboard-service.mjs';

export function createPlatformApi(store, auth) {
  const organizations = createOrganizationService(store);
  const users = createUserService(store, auth);
  const employees = createEmployeeService(store);
  const missions = createMissionService(store);
  const contracts = createContractService(store);
  const knowledge = createKnowledgeService(store);
  const audits = createAuditService(store);
  const notifications = createNotificationService(store);
  const permitted = (user, permission, res, json) => can(user, permission) || (json(res, 403, { error: 'Insufficient permission.' }), false);
  const inOrg = (user, record) => user.role === 'SUPER_ADMIN' || record?.organizationId === user.organizationId;

  return async function handle(req, res, url, user, visible, body, json) {
    const path = url.pathname;
    if (req.method === 'GET' && path === '/api/platform') { if (!permitted(user, 'platform:read', res, json)) return true; return json(res, 200, { data: store.platform, errors: [] }); }
    if (req.method === 'GET' && path === '/api/organizations') return json(res, 200, { data: organizations.list(user), errors: [] });
    if (req.method === 'POST' && path === '/api/organizations') { if (!permitted(user, 'platform:write', res, json)) return true; try { return json(res, 201, { data: organizations.create(await body(req), user), errors: [] }); } catch (error) { return json(res, 400, { error: error.message }); } }
    const organizationMatch = path.match(/^\/api\/organizations\/([^/]+)$/);
    const organizationAction = path.match(/^\/api\/organizations\/([^/]+)\/(suspend|archive|delete|restore)$/);
    if (organizationMatch && req.method === 'PATCH') { if (!permitted(user, 'organization:write', res, json)) return true; const updated = organizations.update(user, organizationMatch[1], await body(req)); return updated ? json(res, 200, { data: updated, errors: [] }) : json(res, 404, { error: 'Organization not found.' }); }
    if (organizationAction && req.method === 'POST') { if (!permitted(user, 'organization:write', res, json)) return true; const status = { suspend: 'suspended', archive: 'archived', delete: 'deleted', restore: 'active' }[organizationAction[2]]; const updated = organizations.transition(user, organizationAction[1], status); return updated ? json(res, 200, { data: updated, errors: [] }) : json(res, 404, { error: 'Organization not found.' }); }

    if (req.method === 'GET' && path === '/api/users') return json(res, 200, { data: users.list(user), errors: [] });
    if (req.method === 'POST' && path === '/api/users/invite') { if (!permitted(user, 'organization:write', res, json)) return true; try { return json(res, 201, { data: await users.invite(await body(req), user), errors: [] }); } catch (error) { return json(res, 400, { error: error.message }); } }
    const userAction = path.match(/^\/api\/users\/([^/]+)\/(activate|disable|invite|role|password-reset)$/);
    if (userAction && req.method === 'POST') { if (!permitted(user, 'organization:write', res, json)) return true; const input = await body(req); try { const result = ['activate', 'disable', 'invite'].includes(userAction[2]) ? await users.transition(user, userAction[1], userAction[2] === 'disable' ? 'disabled' : userAction[2] === 'invite' ? 'invited' : 'active') : userAction[2] === 'role' ? await users.changeRole(user, userAction[1], input.role) : await users.resetPassword(user, userAction[1], input.password); return result ? json(res, 200, { data: result, errors: [] }) : json(res, 404, { error: 'User not found.' }); } catch (error) { return json(res, 400, { error: error.message }); } }

    const employeeDashboard = path.match(/^\/api\/employees\/([^/]+)\/dashboard$/);
    const employeeSupervisor = path.match(/^\/api\/employees\/([^/]+)\/supervisor$/);
    if (employeeDashboard && req.method === 'GET') { const employee = employees.get(user, employeeDashboard[1]); return employee ? json(res, 200, { data: { employee, missions: visible.missions.filter((mission) => mission.employeeId === employee.employeeId), performance: employee.performanceMetrics, knowledge: employee.knowledgeProfile }, errors: [] }) : json(res, 404, { error: 'Employee not found.' }); }
    if (employeeSupervisor && req.method === 'POST') { if (!permitted(user, 'resource:write', res, json)) return true; const employee = employees.assignSupervisor(user, employeeSupervisor[1], (await body(req)).supervisorId); return employee ? json(res, 200, { data: employee, errors: [] }) : json(res, 404, { error: 'Employee or supervisor not found.' }); }

    if (req.method === 'GET' && path === '/api/missions/dashboard') return json(res, 200, { data: missions.dashboard(user), errors: [] });
    if (req.method === 'GET' && path === '/api/contracts/dashboard') return json(res, 200, { data: contracts.dashboard(user), errors: [] });
    if (req.method === 'GET' && path === '/api/reports') return json(res, 200, { data: visible.missions.filter((mission) => mission.report).map((mission) => ({ id: mission.id, organizationId: mission.organizationId, title: mission.title, report: mission.report, reportArtifact: mission.reportArtifact || null })), errors: [] });
    if (req.method === 'GET' && path === '/api/knowledge/records') return json(res, 200, { data: knowledge.list(user), errors: [] });
    if (req.method === 'GET' && path === '/api/audit') return json(res, 200, { data: audits.list(user), errors: [] });
    if (req.method === 'POST' && path === '/api/audit') { if (!permitted(user, 'audit:read', res, json)) return true; return json(res, 201, { data: audits.record(await body(req), user), errors: [] }); }
    if (req.method === 'GET' && path === '/api/notifications') return json(res, 200, { data: notifications.list(user), errors: [] });
    const notificationMatch = path.match(/^\/api\/notifications\/([^/]+)\/read$/);
    if (notificationMatch && req.method === 'POST') { const notification = notifications.read(user, notificationMatch[1]); return notification ? json(res, 200, { data: notification, errors: [] }) : json(res, 404, { error: 'Notification not found.' }); }

    if (req.method === 'GET' && path === '/api/dashboard/platform') { if (!permitted(user, 'platform:read', res, json)) return true; return json(res, 200, { data: executiveDashboard({ organizations: store.organizations, employees: store.employees, missions: store.missions, contracts: store.contracts, knowledgeRecords: store.knowledgeRecords, evidenceRecords: store.evidenceRecords }), errors: [] }); }
    if (req.method === 'GET' && path === '/api/dashboard/organization') return json(res, 200, { data: executiveDashboard({ organizations: organizations.list(user), employees: visible.employees, missions: visible.missions, contracts: visible.contracts, knowledgeRecords: visible.knowledgeRecords, evidenceRecords: visible.evidenceRecords }), errors: [] });
    const dashboardEmployee = path.match(/^\/api\/dashboard\/employee\/([^/]+)$/);
    if (dashboardEmployee && req.method === 'GET') { const employee = employees.get(user, dashboardEmployee[1]); return employee ? json(res, 200, { data: { employee, missions: visible.missions.filter((mission) => mission.employeeId === employee.employeeId), performance: employee.performanceMetrics }, errors: [] }) : json(res, 404, { error: 'Employee not found.' }); }
    if (req.method === 'GET' && path === '/api/dashboard/mission') return json(res, 200, { data: missions.dashboard(user), errors: [] });
    if (req.method === 'GET' && path === '/api/dashboard/revenue') return json(res, 200, { data: { employees: visible.employees.map((employee) => ({ employeeNumber: employee.employeeNumber, revenueGenerated: employee.revenueGenerated })), contracts: contracts.dashboard(user) }, errors: [] });
    return false;
  };
}
