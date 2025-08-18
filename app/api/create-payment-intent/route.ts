import { type NextRequest, NextResponse } from "next/server"
import { stripe, formatAmountForStripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Payment Intent API called")

    const body = await request.json()
    const { amount, currency = "gbp", formData } = body

    console.log("[v0] Payment amount:", amount)
    console.log("[v0] Form data received:", formData)

    // Validate required fields
    if (!amount || amount <= 0) {
      console.log("[v0] Invalid amount:", amount)
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 })
    }

    if (!formData?.email) {
      console.log("[v0] Missing email in form data")
      return NextResponse.json({ error: "Email is required for payment processing" }, { status: 400 })
    }

    // Create Payment Intent
    console.log("[v0] Creating Stripe Payment Intent...")
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount),
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        organisationName: formData.organisationName || "",
        email: formData.email,
        industry: formData.industry || "",
        quantity: formData.quantity?.toString() || "1",
        coverageArea: formData.coverageArea || "",
      },
      receipt_email: formData.email,
      description: `Filmbankmedia Blanket Licence - ${formData.organisationName || "Organisation"}`,
    })

    console.log("[v0] Payment Intent created successfully:", paymentIntent.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("[v0] Payment Intent creation error:", error)

    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
