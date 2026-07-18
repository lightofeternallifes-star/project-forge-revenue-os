# Digital Brain Relationship Map

## Core Relationships

| From | Relationship | To | Ownership note |
| --- | --- | --- | --- |
| Organization | owns | User, Company, Contact, Digital Employee, Workflow, Campaign | Organization is the tenant boundary |
| Company | employs or relates to | Contact, Department, Location | Contact owns person detail |
| Company | may create | Lead, Opportunity, Proposal, Appointment | Domain engines own lifecycle |
| Lead | can convert to | Opportunity | Conversion emits a Revenue Event |
| Opportunity | may require | Proposal, Appointment, Task | Opportunity owns commercial context |
| Conversation | involves | Company, Contact, Lead, Opportunity | Channel engines own transport adapters |
| Campaign | targets | Company, Contact, Lead, Opportunity | Campaign owns membership policy |
| Digital Employee | performs | Task through Workflow | Capability and approval policies apply |
| Workflow | coordinates | Task, Notification, all business entities | Core owns execution state |
| Research Session | investigates | Company, Contact, Opportunity, Knowledge | Evidence supports findings |
| Knowledge Record | interprets or defines | any canonical entity | Knowledge owns publication and invalidation |
| Evidence Record | supports | any fact, inference, score, or event | Evidence owns source lineage |
| Memory | contextualizes | Workflow, Digital Employee, Conversation, entity | Memory scope and TTL are explicit |
| Appointment | schedules interaction between | User, Contact, Digital Employee, Company | Calendar is a routed capability |
| Notification | informs or requests | User, Digital Employee | Delivery channel is not semantic ownership |
| Revenue Event | records outcome for | Lead, Opportunity, Proposal, Appointment, Campaign | Analytics consumes immutable facts |
| Audit Record | records action on | every entity and permission decision | Audit is append-only |

## Relationship Rules

- Relationships use stable canonical IDs and may carry role, effective dates, confidence, evidence, and policy scope.
- A reference does not transfer ownership. A CRM reference to a Company does not make the CRM the Company owner.
- Deletion of a target creates a tombstone or redacted reference according to retention policy; historical audit and revenue events remain explainable.
- Cross-organization references are prohibited by default and require an explicit, audited sharing grant.
- Many-to-many relationships use first-class relationship records when attributes or lifecycle matter.
