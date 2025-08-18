import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { saveLicenceApplication } from "@/lib/dynamodb-test"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Payment confirmation API called")

    const body = await request.json()
    const { paymentIntentId, formData } = body

    console.log("[v0] Confirming payment for:", paymentIntentId)

    // Retrieve the payment intent to verify it was successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      console.log("[v0] Payment not successful:", paymentIntent.status)
      return NextResponse.json({ error: "Payment was not successful" }, { status: 400 })
    }

    console.log("[v0] Payment confirmed, saving to database...")

    // Save the licence application to DynamoDB with payment info
    const applicationData = {
      ...formData,
      paymentStatus: "paid",
      paymentIntentId: paymentIntentId,
      stripePaymentId: paymentIntent.id,
      amountPaid: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      paymentMethod: "card",
    }

    const result = await saveLicenceApplication(applicationData)

    console.log("[v0] Application saved successfully:", result.id)

    return NextResponse.json({
      success: true,
      applicationId: result.id,
      paymentStatus: "succeeded",
    })
  } catch (error) {
    console.error("[v0] Payment confirmation error:", error)

    return NextResponse.json(
      {
        error: "Failed to confirm payment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
