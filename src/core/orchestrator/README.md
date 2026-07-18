# Orchestrator

## Purpose
Coordinate bounded work across intelligence, provider adapters, employees, and future automation.

## Responsibilities
Accept commands, resolve workflows, enforce policy checkpoints, manage retries and idempotency, record state, and surface failures.

## Inputs
Typed commands, tenant context, actor identity, workflow IDs, policy context, and capability requests.

## Outputs
Execution receipts, state transitions, events, approval requests, and structured failures.

## Future APIs
start, resume, cancel, getStatus, and requestApproval.

## Dependencies
Workflow contracts, event contracts, memory ports, knowledge policies, and provider-neutral interfaces.
