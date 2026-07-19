import { randomUUID } from 'node:crypto';
import { createEmployeeStore } from './employee-store.mjs';
import { createMissionStore } from './mission-store.mjs';
import { createWorkContractStore } from './work-contract-store.mjs';
import { initializeTenancy } from './tenant-service.mjs';

const daysAgo = (days) => new Date(Date.now() - days * 86400000).toISOString();

export function createStore() {
  const employeeStore = createEmployeeStore();
  const missionStore = createMissionStore();
  const contractStore = createWorkContractStore();
  const opportunities = [
    { id: 'opp-001', name: 'Revenue intelligence rollout', company: 'Northstar Field Services', value: 84000, stage: 'Proposal', probability: 65, owner: 'Maya Chen', updatedAt: daysAgo(2) },
    { id: 'opp-002', name: 'Pipeline operating model', company: 'Harbor & Co.', value: 42000, stage: 'Qualified', probability: 40, owner: 'Jordan Lee', updatedAt: daysAgo(9) },
    { id: 'opp-003', name: 'Executive analytics pilot', company: 'Cedar Health', value: 125000, stage: 'Negotiation', probability: 75, owner: 'Maya Chen', updatedAt: daysAgo(4) },
    { id: 'opp-004', name: 'Team enablement workspace', company: 'Brightline Studio', value: 28000, stage: 'Won', probability: 100, owner: 'Jordan Lee', updatedAt: daysAgo(12) },
    { id: 'opp-005', name: 'Research workflow', company: 'Atlas Marine', value: 36000, stage: 'Discovery', probability: 20, owner: 'Maya Chen', updatedAt: daysAgo(15) }
  ];
  const timeline = [
    { id: 'event-001', company: 'Cedar Health', title: 'Executive review completed', detail: 'Stakeholders confirmed the analytics pilot decision path.', type: 'meeting', occurredAt: daysAgo(1) },
    { id: 'event-002', company: 'Northstar Field Services', title: 'Proposal shared', detail: 'Revenue intelligence rollout proposal sent to the buying committee.', type: 'proposal', occurredAt: daysAgo(3) },
    { id: 'event-003', company: 'Brightline Studio', title: 'Opportunity won', detail: 'Team enablement workspace moved to customer onboarding.', type: 'success', occurredAt: daysAgo(12) }
  ];
  const settings = { workspaceName: 'PROJECT FORGE Revenue OS', timezone: 'America/New_York', defaultCurrency: 'USD', insightMode: 'Evidence-first' };
  const sessions = new Map();
  const state = {
    opportunities,
    timeline,
    settings,
    sessions,
    users: [],
    employees: employeeStore.employees,
    audits: employeeStore.audits,
    automationJobs: employeeStore.automationJobs,
    missions: missionStore.missions,
    dispatchLog: missionStore.dispatchLog,
    executionLogs: missionStore.executionLogs,
    contracts: contractStore.contracts,
    platform: null,
    organizations: [],
    knowledgeRecords: [],
    evidenceRecords: [],
    performanceMetrics: [],
    missionQueues: [],
    contractLogs: contractStore.contractLogs,
    createId: () => randomUUID()
  };
  initializeTenancy(state);
  return state;
}
