# Lifecycle Module

## Purpose

Control legal and auditable transitions across the Digital Employee lifecycle.

## Responsibilities

Define states, entry and exit criteria, approvals, evidence, events, retries, suspension, and amendments.

## Inputs

Current employee state, requested transition, evidence manifest, approval decisions, policy version, and actor identity.

## Outputs

Transition decision, updated timeline, lifecycle event, gate report, and escalation task when needed.

## Future APIs

`getLifecycleState(employeeId)`, `requestTransition(employeeId, transition)`, `approveTransition(transitionId)`.

## Dependencies

Quality Gates, Evidence, Approval Matrix, Registry, Audit, and Digital Brain contracts.
