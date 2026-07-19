# Customer Onboarding Flow

This document defines the first production onboarding boundary for Carriersfy AI customers entering PROJECT FORGE Revenue OS.

## Flow

1. A visitor starts a free trial at `www.carriersfy.ai`.
2. The customer selects an industry and plan.
3. Stripe processes the payment. The application does not provision from a browser redirect.
4. A server-to-server payment event must be verified with `FORGE_PAYMENT_WEBHOOK_KEY`, identify Stripe as the provider, contain an approved status, and include a provider event ID.
5. PROJECT FORGE provisions the organization, tenant identity, runtime persistence namespace, admin user, dashboard resources, knowledge foundation, mission queue, and initial Atlas employee through the existing provisioning services.
6. Sofia and Max are installed as organization-owned employees.
7. An initial knowledge intake mission is assigned to Atlas.
8. A welcome email is queued for the organization email delivery worker.
9. The customer logs in and can upload documents through the organization-scoped knowledge APIs.

## API sequence

`POST /api/onboarding/trial` creates a trial session. `POST /api/onboarding/:id/industry` and `POST /api/onboarding/:id/plan` record customer choices. `POST /api/onboarding/:id/payment` accepts the verified payment event and performs idempotent provisioning. `GET /api/onboarding/:id` exposes the safe progress record.

## Isolation and safety

The onboarding session owns the target organization ID once provisioning completes. All installed employees, missions, knowledge records, audits, and queued email records carry that organization ID. A trial session never exposes its password or password hash. Replaying the same approved payment event returns the existing onboarding result without creating duplicate employees or missions.

The current payment endpoint is a provider-neutral verification boundary. Stripe SDK/webhook delivery, email delivery, document storage, and background learning workers remain infrastructure integrations behind this contract and are intentionally not fabricated here.
