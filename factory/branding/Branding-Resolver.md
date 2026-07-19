# Branding Resolver Specification

## Canonical Source

The resolver reads only the official Carriersfy AI brand system referenced by [`branding/canonical/`](../../branding/canonical/). The factory stores references or URIs; it does not copy image assets.

## Resolution Contract

Input: artifact type, rendering target, policy version, and organization context.

Output: approved logo reference, brand naming rules, color reference, typography reference, usage constraints, and compliance status.

## Prohibited Actions

- Generating or redrawing a logo.
- Recoloring or modifying a logo.
- Embedding duplicate image assets in employee packages.
- Inventing local color or typography values.
- Publishing an artifact when the canonical source is unavailable or stale.

## Failure Handling

Missing or conflicting brand metadata blocks publication and creates a Branding escalation. A generated package may remain in draft, but cannot be certified, graduated, or published.
