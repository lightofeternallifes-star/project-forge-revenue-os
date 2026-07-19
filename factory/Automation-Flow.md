# Automation Flow

## Command Contract

`Create Digital Employee` accepts a validated definition and returns a generation job ID, package manifest, validation report, and required approval list.

## Flow

1. Receive an approved definition.
2. Reserve and validate the employee number.
3. Resolve canonical branding references.
4. Render the template set with the definition and stage metadata.
5. Validate required files, bound tokens, dates, signatures, links, and cross-record identity.
6. Route the package to the responsible department and Digital Employee Operations.
7. Open lifecycle stage `RECRUITMENT` only after approval.
8. Generate stage artifacts as each gate passes.
9. Update registry and timeline through append-only events.
10. Publish graduation, promotion, and Hall of Fame records only when authorized.

## Failure Handling

Failures stop the transition, preserve the failed validation report, and create an escalation task. Partial packages are marked `INCOMPLETE` and cannot enter the registry as active employees.
