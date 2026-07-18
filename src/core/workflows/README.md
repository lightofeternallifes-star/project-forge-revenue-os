# Workflows

## Purpose
Define declarative, inspectable workflow contracts without implementing business actions.

## Responsibilities
Describe steps, inputs, outputs, branching, timeouts, approvals, compensation, and versioning.

## Inputs
Workflow definitions, typed commands, state snapshots, policy decisions, and event triggers.

## Outputs
Validated workflow plans, step contracts, transition records, and execution requirements.

## Future APIs
WorkflowRegistry.get, WorkflowValidator.validate, and WorkflowCompiler.plan.

## Dependencies
Shared types, policy knowledge, and event contracts; definitions must not import providers.
