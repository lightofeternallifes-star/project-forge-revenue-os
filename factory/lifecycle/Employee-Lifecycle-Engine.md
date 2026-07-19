# Employee Lifecycle Engine

## State Model

`RECRUITMENT -> IDENTITY -> ONBOARDING -> TRAINING -> PROBATION -> MISSION -> EVIDENCE -> PERFORMANCE -> EXECUTIVE_AUDIT -> CERTIFICATION -> GRADUATION -> PROMOTION -> REGISTRY -> DEPLOYMENT -> CONTINUOUS_LEARNING -> RETIREMENT`

Suspension and rejection are side states. Retirement is future-capable and requires an explicit authorized event.

## Gate Catalog

| Stage | Entry criteria | Exit criteria | Evidence | Responsible owner | Approvals |
| --- | --- | --- | --- | --- | --- |
| Recruitment | Approved business need and role | Definition accepted | Requisition, scope, risk | Executive Office + department | Executive + department |
| Identity | Unique approved definition | Identity package complete | ID, passport, badge, signature | Digital Employee Operations | HR operations |
| Onboarding | Identity accepted | Employment and assignment active | Contract, NDA, assignment | Digital Employee Operations | Manager + Compliance |
| Training | Onboarding complete | Required learning passed | Learning record, skills, competency | Manager + Learning | Manager |
| Probation | Training passed | Bounded mission readiness | Permission scope, supervision plan | Manager | Department owner |
| Mission Assignment | Probation passed | Mission accepted | Mission brief, success criteria | Department | Manager |
| Mission Execution | Mission accepted | Work complete or stopped | Outputs, events, escalation | Assigned employee + manager | Manager for closure |
| Evidence Collection | Work output exists | Evidence manifest complete | Sources, citations, provenance | Evidence Engine | Evidence reviewer |
| Performance | Evidence complete | Review decision recorded | KPI result, review, productivity | Manager | Department owner |
| Executive Audit | Performance passed | Audit decision recorded | Audit report, exceptions | Audit | Independent auditor |
| Certification | Audit passed | Certificate issued or rejected | Certification assessment | Learning + Digital Employee Ops | Certification authority |
| Graduation | Certification passed | Graduation package issued | Certificate, diploma, executive decision | Executive Office | Executive approval |
| Promotion | Graduation and criteria passed | New scope activated | Promotion letter, permission delta | Department owner | Executive + Audit acknowledgement |
| Registry | Promotion or graduation complete | Canonical records updated | Registry, database, timeline | Registry | Registry owner |
| Deployment | Registry active and permissions granted | Operational status active | Capability grant, readiness check | Digital Employee Operations | Security + manager |
| Continuous Learning | Active status | Review cycle complete | Learning update, performance trend | Learning + manager | Manager |
| Retirement | Authorized retirement decision | Capabilities revoked and archive sealed | Revocation, archive, retention | Digital Employee Operations | Compliance + Audit |

## Transition Rules

Only the named owner or delegated approver may advance a stage. Every transition is idempotent, append-only, evidence-backed, and reversible only through a new authorized transition. No employee can approve its own transition.
