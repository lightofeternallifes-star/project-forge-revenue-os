# Digital Employee Ecosystem Architecture

## Operating Center

The Digital Employee Portal is the control surface. Revenue OS, PROJECT PHOENIX, Knowledge Vault, Digital Employee Factory, and Digital Employees expose service contracts into the Portal; they do not create competing UI sources of truth.

## Integration Registry

| System | Portal responsibility | Canonical source |
| --- | --- | --- |
| Revenue OS | Revenue pipeline and contribution context | Revenue OS runtime |
| PROJECT PHOENIX | Opportunity intelligence connection status | Phoenix integration contract |
| Knowledge Vault | Domain ownership and usage | Digital Brain knowledge contract |
| Digital Employee Factory | Production, templates, lifecycle, queue | `factory/` |
| Atlas Analyst | Active employee record and knowledge ownership | DE-012A records |
| Sofia and Max | Planned workforce intake | Factory intake profiles |
| Future Employees | Capacity and creation pipeline | Factory command contract |

## Evidence Rules

Revenue generated is zero until an attributable revenue event exists. Knowledge growth is zero until a versioned knowledge snapshot exists. Planned employees have no mission, training, or performance outcome until created through the Factory. The Portal displays those states explicitly.
