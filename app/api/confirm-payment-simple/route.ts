import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Simple payment confirmation API called")

    const body = await request.json()
    const { paymentIntentId, formData } = body

    console.log("[v0] Payment Intent ID:", paymentIntentId)

    // Just verify the payment intent exists
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    console.log("[v0] Payment status:", paymentIntent.status)

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment was not successful" }, { status: 400 })
    }

    console.log("[v0] Returning success without database save")

    return NextResponse.json({
      success: true,
      applicationId: "test-" + Date.now(),
      paymentStatus: "succeeded",
    })
  } catch (error) {
    console.error("[v0] Simple API error:", error)
    return NextResponse.json(
      { error: "API test failed", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    )
  }
}
