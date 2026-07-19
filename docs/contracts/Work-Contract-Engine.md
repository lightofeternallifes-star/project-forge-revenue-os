# Digital Work Contract Engine

The Digital Work Contract is the commercial control plane for Digital Employee work. It captures business intent, required capability, priority, service-level expectations, evidence requirements, reviewer ownership, and ROI targets. A contract never reimplements execution: it creates and supervises a canonical Mission in the existing Execution Engine.

## Runtime Flow

CEO command creates an `Open` contract. The executive queue applies priority and skill matching, assigns an available employee, and starts the linked mission. The Execution Engine loads knowledge, runs the employee adapter, captures evidence, and completes the mission. The contract then enters `Waiting Review`; a supervisor records `Approved`, `Rejected`, `Needs Revision`, `Escalated`, `Reassigned`, or `Cancelled`. Approved work is archived with its evidence and metrics.

## Contract Ownership

Contracts own client, project, objective, deliverable, priority, skills, reviewer, due date, success criteria, evidence requirements, completion requirements, ROI target, SLA state, approval state, and contract metrics. Missions own execution state, execution output, evidence records, reports, and knowledge feedback. The Employee Registry owns identity and performance history.

## Interfaces

- `GET /api/contracts`
- `POST /api/contracts`
- `GET /api/contracts/:contractId`
- `POST /api/contracts/:contractId/assign`
- `POST /api/contracts/:contractId/review`
- `POST /api/contracts/:contractId/cancel`
- `GET /api/contracts/dashboard`

## Quality Gates

Assignment requires an active employee and a skill match unless an authorized executive override is supplied. Completion requires a completed linked mission, evidence, a report, and a supervisor decision. Contract artifacts are written under `artifacts/contracts/` and retain the contract, linked mission, evidence references, approval, and metrics.
