# Digital Employee Portal™

The Digital Employee Portal is the executive management surface for Carriersfy AI Digital Employees. It is the single interface for viewing, creating, training, certifying, promoting, auditing, deploying, monitoring, and archiving employees.

The portal consumes Revenue OS, PROJECT PHOENIX, Knowledge Vault, and the Digital Employee Factory through provider-agnostic service contracts. It does not recreate templates, lifecycle rules, branding logic, or registry rules.

## Runtime

The current portal is implemented as a dependency-free browser application served by the existing Node HTTP runtime. `public/` contains the UI; `runtime/` contains the canonical read model and API adapters; this directory documents the bounded portal modules and contracts.

## Navigation

Dashboard, Ecosystem, Workforce, Employee Registry, Missions, Training, Certifications, Promotions, Hall of Fame, Factory, Audit, Analytics, Knowledge Vault, and Settings are route-level views over one canonical employee model.
