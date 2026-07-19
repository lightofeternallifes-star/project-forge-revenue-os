# Executive Document Design System 1.0

The Digital Credentials Engine uses a three-layer design system:

- Primitive tokens: color, spacing, type, radius, and shadow values in `design-system.json`.
- Semantic tokens: page, paper, ink, primary, accent, rule, and security roles.
- Component tokens: header, footer, seal, QR reference, signature, and grid dimensions.

Reusable renderer components are implemented in `credentials/engine.mjs`:

- Executive Header and Footer
- Security Pattern and diagonal watermark
- Seal Component
- QR Verification Reference Component
- Executive Signature Component
- Document Grid and data tables
- Passport Cover variant
- Employee ID Card variant
- Certificate and Diploma frame variants

All generated HTML remains A4 print-ready and references the canonical Carriersfy AI logo path. The logo asset remains provisional until the Corporate Brand Repository supplies the approved artwork.
