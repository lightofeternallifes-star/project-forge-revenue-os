# Digital Workforce Platform

Mission 018 turns the Mission 017 foundation into the organization operating system for PROJECT FORGE Revenue OS.

## Tenancy

The platform is the only shared boundary. Organizations are isolated by `organizationId`; users, employees, missions, contracts, knowledge, reports, audits, notifications, and metrics are owned by one active organization. `SUPER_ADMIN` can operate across organizations; all company roles are scoped to their organization before resource lookup.

## Services

The runtime service layer contains Organization, Tenant, User, Employee, Mission, Contract, Knowledge, Dashboard, Audit, and Notification services. The platform API adapter mounts these services ahead of the legacy execution routes, preserving the existing mission state machine and Digital Employee adapters.

## Lifecycle

Organizations use active, suspended, archived, deleted, and restored states. Users use invited, active, and disabled states with centralized role management and session revocation on password reset. Provisioning initializes the organization, company admin, first employee, knowledge foundation, and mission queue through a single application service.

## Dashboards

Platform, organization, employee, mission, revenue, and contract dashboards are service responses. The portal shell consumes bootstrap, organization, and notification APIs; it does not calculate business metrics or own resource state.

## Persistence

The current repository persists runtime collections and auth records behind replaceable repository boundaries. A managed database, distributed sessions, key management, billing provider, and external identity provider can replace these adapters without changing the domain contracts.
