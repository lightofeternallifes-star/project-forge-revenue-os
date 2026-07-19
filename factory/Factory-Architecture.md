# Digital Employee Factory Architecture

## Scope

The factory is a control plane for Digital Employee records and lifecycle transitions. It owns generation, validation, approvals, registry updates, and audit references. It does not own model inference, provider credentials, customer business data, or external communications.

## Layers

| Layer | Responsibility | Durable output |
| --- | --- | --- |
| Definition | Validate employee identity, role, assignment, scope, and brand references | Versioned employee definition |
| Template | Render parameterized documents from the definition and stage context | Generated artifact set |
| Lifecycle | Advance an employee through approved stages | Lifecycle transition record |
| Evidence | Attach source references, decisions, signatures, and outcomes | Evidence manifest |
| Quality | Enforce structural, semantic, identity, date, and branding gates | Validation report |
| Registry | Maintain canonical identity and current employment state | Registry record |
| Archive | Preserve historical packages and retirement disposition | Archive manifest |

## Boundaries

The factory may request work from Digital Employee Operations, Audit, Knowledge, and department managers through canonical contracts. It must not call Explee, Apollo, Clay, OpenAI, Gemini, CRM, or another provider directly. Provider routing belongs to the Provider Router and its contracts.

## Data Flow

`Employee Definition -> Preflight Validation -> Package Generation -> Human/Executive Approvals -> Lifecycle Gates -> Registry -> Deployment -> Learning -> Archive`

Every transition emits an auditable event and references the exact definition, template versions, evidence set, actor, timestamp, and resulting artifact checksums.
