import test from 'node:test';
import assert from 'node:assert/strict';
import { checkoutParams, stripeSignature, verifyStripeSignature } from '../runtime/stripe-commerce.mjs';

test('Stripe checkout carries tenant-provisioning metadata and both prices', () => {
  const body = checkoutParams({ id: 'onboarding-123', email: 'owner@example.com', plan: 'Growth' }, {
    STRIPE_PRICE_ONE_TIME: 'price_setup',
    STRIPE_PRICE_MONTHLY: 'price_monthly',
    STRIPE_SUCCESS_URL: 'https://carriersfy.ai/payment-success.html',
  });
  assert.match(body, /line_items%5B0%5D%5Bprice%5D=price_setup/);
  assert.match(body, /line_items%5B1%5D%5Bprice%5D=price_monthly/);
  assert.match(body, /metadata%5Bonboarding_id%5D=onboarding-123/);
  assert.match(body, /subscription_data%5Bmetadata%5D%5Bplan%5D=Growth/);
});

test('Stripe signatures verify and reject tampering', () => {
  const payload = JSON.stringify({ id: 'evt_1', type: 'checkout.session.completed' });
  const header = stripeSignature(payload, 'secret', 1000);
  assert.equal(verifyStripeSignature(payload, header, 'secret', 300, 1000000), true);
  assert.equal(verifyStripeSignature(payload + 'x', header, 'secret', 300, 1000000), false);
  assert.equal(verifyStripeSignature(payload, header, 'wrong', 300, 1000000), false);
});
