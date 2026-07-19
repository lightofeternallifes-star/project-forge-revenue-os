# Canonical Employee Model

## Purpose

Define the single source of truth consumed by every Portal screen, factory workflow, document generator, lifecycle transition, and automation job.

## Core Record

| Field | Type | Ownership | Rule |
| --- | --- | --- | --- |
| `employee_id` | Identifier | Registry | Stable internal identity |
| `employee_number` | Identifier | Registry | Globally unique corporate number |
| `employee_name` | String | Identity | Canonical display name |
| `division` | Organization reference | Organization | Existing division only |
| `department` | Organization reference | Organization | Existing accountable department |
| `role` | Role reference | Organization | Versioned approved role |
| `specializations` | List | Knowledge | Approved specializations |
| `manager` | Person reference | Organization | Active accountable manager |
| `employment_status` | Enum | Lifecycle | Recruitment, active, suspended, retired |
| `certification_level` | Enum | Certification | Training and certification state |
| `current_rank` | String | Promotion | Current approved rank |
| `hire_date` | ISO date | Employment | Effective employment date |
| `graduation_date` | ISO date or null | Graduation | Set only after graduation |
| `deployment_status` | Enum | Deployment | Undeployed, ready, active, suspended |
| `mission_status` | Enum | Missions | No mission, in progress, blocked, complete |
| `mission_history` | Event list | Missions | Append-only mission events |
| `training_history` | Event list | Training | Courses and evaluations |
| `awards` | List | Recognition | Approved recognition records |
| `competencies` | Matrix | Learning | Required and assessed skills |
| `knowledge_profile` | Object | Knowledge | Domains, ownership, level, memory scope |
| `performance_metrics` | Object | Performance | KPI results with evidence |
| `evidence` | Evidence list | Evidence Engine | Provenance-backed references |
| `timeline` | Event list | Registry | Ordered lifecycle history |
| `documents` | Document references | Factory | Artifact IDs and versions |
| `brand_assets` | Canonical references | Branding | URI references only |
| `digital_signature` | Signature reference | Identity | Versioned signature record |
| `hall_of_fame_status` | Enum | Hall of Fame | Not eligible, eligible, published |
| `version` | Version | Registry | Optimistic concurrency and history |

## Invariants

- No screen maintains an independent employee copy.
- Updates are commands against the API and return a new model version.
- History, evidence, documents, and timeline are append-only.
- Provider IDs are references, never canonical identity.
- A missing field is explicit and reviewable; it is never silently guessed.
