# Commercial Stripe Integration

Revenue OS owns the commercial backend contract. The website calls the public onboarding and checkout routes through a thin proxy.

## Required environment

```text
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ONE_TIME=price_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_SUCCESS_URL=https://carriersfy.ai/payment-success.html
STRIPE_CANCEL_URL=https://carriersfy.ai/payment-cancelled.html
FORGE_COMMERCE_KEY=optional-shared-secret
```

## Checkout

`POST /api/commerce/checkout` accepts `{ "onboardingId": "..." }` after the existing onboarding service has recorded the plan. Revenue OS creates a Stripe subscription Checkout Session with the one-time setup price and recurring monthly price. Metadata contains the onboarding ID, selected plan, and source.

## Webhook

`POST /api/stripe/webhook` verifies the raw `Stripe-Signature` header. `checkout.session.completed` is mapped to the existing `recordVerifiedPayment` service. The service performs the existing idempotent provisioning flow; the webhook does not duplicate provisioning logic.

Billing events are recorded for later portal/billing read models. Stripe credentials never reach the website.
