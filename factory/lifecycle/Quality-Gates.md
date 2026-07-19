# Factory Quality Gates

## Mandatory Checks

| Gate | Check | Failure action |
| --- | --- | --- |
| Identity uniqueness | No duplicate employee number, email, passport, badge, or signature IDs | Block generation |
| Required artifacts | Every stage-required template exists and renders | Block stage transition |
| Token binding | No unbound `{{token}}` remains in generated output | Reject artifact |
| Unresolved work markers | No open work marker or unresolved system instruction | Reject package |
| Signatures | Required signer, signature record, date, and authority exist | Block approval |
| References | Internal links and artifact IDs resolve | Reject package |
| Timeline | Every material lifecycle event has date, actor, and evidence | Block registry update |
| Dates | Effective, review, certification, promotion, and retirement dates are ordered | Reject transition |
| Branding | Only canonical Carriersfy AI references are used | Escalate to Branding |
| Employment completeness | Contract, NDA, manager, department, assignment, and permissions exist | Block onboarding |
| Evidence | Claims have provenance, source, confidence, and reviewer where required | Block certification |
| Permissions | Capabilities are explicit, bounded, and approved | Block deployment |
| Versioning | Definition, templates, policy, and artifacts have versions | Block publication |

## Generated Output Rule

Quality gates inspect rendered output, not just the input definition. A package can be structurally valid but still fail for broken links, inconsistent dates, missing evidence, or brand violations.

## Exception Rule

Exceptions require an exception record, risk owner, expiry date, compensating control, executive approval, and independent audit acknowledgement. Exceptions never silently convert a failure into a pass.
