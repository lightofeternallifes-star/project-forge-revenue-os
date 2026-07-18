# Core

## Purpose
Provide runtime-independent coordination primitives for Revenue OS workflows.

## Responsibilities
Define orchestration, workflow lifecycle, memory access, and event contracts. Keep coordination separate from domain policy and provider behavior.

## Inputs
Typed commands, workflow definitions, domain events, actor context, policy decisions, and provider capabilities exposed through interfaces.

## Outputs
Workflow transitions, execution records, memory operations, events, and human or Digital Employee action requests.

## Future APIs
Orchestrator.start, WorkflowRegistry.register, MemoryPort.read/write, and EventBus.publish.

## Dependencies
Shared types, knowledge policies, and provider-neutral ports. No direct provider dependency.
