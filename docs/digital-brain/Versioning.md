# Digital Brain Versioning

## Version Dimensions

1. **Schema version:** meaning and shape of a canonical contract.
2. **Entity version:** immutable published state of an entity.
3. **Observation version:** append-only source claim.
4. **Policy version:** rules used for permissions, normalization, scoring, retention, or routing.
5. **Event version:** serialized event contract.
6. **Workflow version:** executable coordination definition pinned by an execution.

## Compatibility

Optional additions are backward compatible. Meaning changes, removals, required-field changes, and enum changes require a new compatible contract review and migration plan. Consumers declare supported versions and fail explicitly when a contract is unsupported.

## Corrections

Published records and events are immutable. Corrections create superseding versions with reason, actor, evidence, and audit references. Historical queries return the requested version or the latest version with the selection policy visible.

## Scale

Schema registry, migration manifests, replayable events, dual-read or dual-publish windows, and bounded compatibility support are required before high-volume rollout.
