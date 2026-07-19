# Registry Module

## Purpose

Maintain the canonical corporate identity and current status of every Digital Employee.

## Responsibilities

Reserve IDs, prevent duplicates, record employment state, update timelines, index artifacts, and expose read-only lookup contracts.

## Inputs

Approved identity package, lifecycle events, promotion decisions, archive events, artifact manifest, and organization assignment.

## Outputs

Registry record, database entry, employee index, timeline entry, archive link, and registry events.

## Future APIs

`reserveEmployeeId()`, `registerEmployee(package)`, `getEmployee(employeeId)`, `appendTimelineEvent(employeeId, event)`.

## Dependencies

Generators, Lifecycle, Identity, Organization, Archive, Audit, and Digital Brain.
