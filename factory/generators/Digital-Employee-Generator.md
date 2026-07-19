# Digital Employee Generator Specification

## Purpose

Generate a complete, versioned Digital Employee package from an approved definition.

## Input Contract

| Field | Required | Rules |
| --- | --- | --- |
| `employee_number` | Yes | Globally unique, reserved before rendering |
| `employee_name` | Yes | Canonical display name and normalized search name |
| `division` | Yes | Existing organization unit |
| `department` | Yes | Existing accountable department |
| `manager` | Yes | Active authorized manager |
| `role` | Yes | Approved role definition |
| `specializations` | Yes | One or more approved specializations |
| `mission` | Yes | Bounded mission with owner and outcome criteria |
| `certification` | Yes | Certification policy and evaluator |
| `brand_assets` | Yes | References to canonical Carriersfy AI assets only |
| `effective_date` | Yes | ISO date approved by HR and department owner |
| `permission_profile` | Yes | Explicit capabilities and prohibitions |

## Output Contract

The generator returns a package manifest containing every required artifact, artifact ID, template ID and version, definition version, evidence requirements, lifecycle stage, owner, checksum, and validation result. It also returns required approvals and any blocked conditions.

## Idempotency

The generation key is `(organization_id, employee_number, definition_version, request_key)`. A repeated request returns the existing generation job and cannot create duplicate records.

## Generation Rules

1. Validate schema, uniqueness, authority, dates, and brand references.
2. Reserve the employee number.
3. Select the artifact set from the stage plan.
4. Render each template with typed tokens.
5. Reject unbound tokens, forbidden external assets, missing signatures, and invalid links.
6. Persist the package as `DRAFT` until approvals pass.
7. Emit `employee.package.generated` and open onboarding.

## Example Command

```text
Create Digital Employee
Name: {{employee_name}}
Role: {{role}}
Department: {{department}}
Specializations: {{specializations}}
Mission: {{mission_id}}
```

The example is a command shape only. It does not create an employee or bypass approvals.
