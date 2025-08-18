# Stripe Integration Setup Guide

## 1. Get Your Stripe Test Keys

1. Log into your [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in top-left)
3. Go to **Developers** → **API keys**
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)

## 2. Add Environment Variables to AWS Amplify

In your AWS Amplify console:
1. Go to **App Settings** → **Environment Variables**
2. Add these variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your publishable key
   - `NEXT_PUBLIC_STRIPE_SECRET_KEY` = your secret key

## 3. Test Cards for Development

Use these test card numbers in Stripe test mode:
- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

## 4. Webhook Setup (Optional for Production)

For production, you may want to set up webhooks to handle payment confirmations:
1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the webhook secret and add as `STRIPE_WEBHOOK_SECRET` environment variable

## 5. Going Live

When ready for production:
1. Switch to **Live mode** in Stripe Dashboard
2. Get your live API keys
3. Update environment variables with live keys
4. Test with real cards (start with small amounts!)
