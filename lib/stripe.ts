import Stripe from "stripe"

// Server-side Stripe instance
export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

// Client-side Stripe configuration
export const stripePromise =
  typeof window !== "undefined"
    ? import("@stripe/stripe-js").then(({ loadStripe }) => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!))
    : null

// Helper function to format amount for Stripe (convert to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100)
}

// Helper function to format amount for display
export const formatAmountForDisplay = (amount: number): string => {
  return `£${(amount / 100).toFixed(2)}`
}
