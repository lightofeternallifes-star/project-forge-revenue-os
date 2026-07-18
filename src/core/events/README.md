# Events

## Purpose
Define durable, provider-neutral facts about changes in revenue workflows.

## Responsibilities
Specify envelopes, names, versions, causation, correlation, ordering, privacy classification, and delivery semantics.

## Inputs
Domain changes, provider observations, workflow transitions, approvals, and outcome signals.

## Outputs
Versioned events, subscriptions, delivery records, and replay or audit requirements.

## Future APIs
EventBus.publish, subscribe, acknowledge, and replay.

## Dependencies
Shared types and policy metadata; provider formats cannot leak through this boundary.
