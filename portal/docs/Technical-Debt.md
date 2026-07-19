# Portal Technical Debt

- The current store is process-local and not durable.
- Authentication is a development placeholder and must be replaced by SSO and RBAC.
- API responses need schema validation and pagination at the transport boundary.
- Background automation, signed documents, artifact checksums, and audit persistence are future runtime work.
- The current UI uses vanilla browser modules; a component framework can be introduced only if it preserves the API and canonical model contracts.
