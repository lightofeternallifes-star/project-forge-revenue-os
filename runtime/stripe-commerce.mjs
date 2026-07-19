import { createHmac, timingSafeEqual } from 'node:crypto';

function formEncode(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, '+');
}

export function stripeSignature(payload, secret, timestamp = Math.floor(Date.now() / 1000)) {
  const signed = `${timestamp}.${payload}`;
  const signature = createHmac('sha256', secret).update(signed).digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

export function verifyStripeSignature(payload, header, secret, toleranceSeconds = 300, now = Date.now()) {
  if (!header || !secret) return false;
  const parts = Object.create(null);
  for (const item of String(header).split(',')) {
    const [key, value] = item.split('=', 2);
    if (key === 't') parts.timestamp = value;
    if (key === 'v1') (parts.signatures ||= []).push(value);
  }
  const timestamp = Number(parts.timestamp);
  if (!Number.isFinite(timestamp) || Math.abs(now / 1000 - timestamp) > toleranceSeconds) return false;
  const expected = createHmac('sha256', secret).update(`${parts.timestamp}.${payload}`).digest('hex');
  return (parts.signatures || []).some((candidate) => {
    const left = Buffer.from(candidate, 'utf8');
    const right = Buffer.from(expected, 'utf8');
    return left.length === right.length && timingSafeEqual(left, right);
  });
}

export function checkoutParams(session, env) {
  const oneTimePrice = String(env.STRIPE_PRICE_ONE_TIME || '').trim();
  const monthlyPrice = String(env.STRIPE_PRICE_MONTHLY || '').trim();
  if (!oneTimePrice || !monthlyPrice) throw new Error('Stripe price configuration is incomplete.');
  const success = env.STRIPE_SUCCESS_URL || 'https://carriersfy.ai/payment-success.html';
  const cancel = env.STRIPE_CANCEL_URL || 'https://carriersfy.ai/payment-cancelled.html';
  const metadata = {
    onboarding_id: session.id,
    plan: session.plan,
    source: 'carriersfy.ai',
  };
  return [
    ['mode', 'subscription'],
    ['customer_email', session.email],
    ['client_reference_id', session.id],
    ['success_url', `${success}${success.includes('?') ? '&' : '?'}onboarding_id=${formEncode(session.id)}&session_id={CHECKOUT_SESSION_ID}`],
    ['cancel_url', cancel],
    ['line_items[0][price]', oneTimePrice],
    ['line_items[0][quantity]', '1'],
    ['line_items[1][price]', monthlyPrice],
    ['line_items[1][quantity]', '1'],
    ['metadata[onboarding_id]', metadata.onboarding_id],
    ['metadata[plan]', metadata.plan],
    ['metadata[source]', metadata.source],
    ['subscription_data[metadata][onboarding_id]', metadata.onboarding_id],
    ['subscription_data[metadata][plan]', metadata.plan],
  ].map(([key, value]) => `${formEncode(key)}=${formEncode(value)}`).join('&');
}

export async function createCheckoutSession(session, env, fetchImpl = fetch) {
  const secret = String(env.STRIPE_SECRET_KEY || '').trim();
  if (!secret) throw new Error('Stripe is not configured.');
  const response = await fetchImpl('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Idempotency-Key': `forge-checkout-${session.id}`,
    },
    body: checkoutParams(session, env),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.id || !data.url) throw new Error(data.error?.message || `Stripe checkout failed (${response.status}).`);
  return { id: data.id, url: data.url, customerId: data.customer || null, mode: data.mode };
}
