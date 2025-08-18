import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { saveLicenceApplication } from "@/lib/dynamodb"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Payment confirmation API called")

    const body = await request.json()
    const { paymentIntentId, formData } = body

    console.log("[v0] Confirming payment for:", paymentIntentId)
    console.log("[v0] Form data received:", JSON.stringify(formData, null, 2))

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

    console.log("[v0] Application data to save:", JSON.stringify(applicationData, null, 2))

    let result
    try {
      console.log("[v0] Attempting to save to DynamoDB...")
      result = await saveLicenceApplication(applicationData)
      console.log("[v0] DynamoDB save successful:", result)
    } catch (dbError) {
      console.error("[v0] DynamoDB save failed:", dbError)
      console.error("[v0] DynamoDB error details:", {
        name: dbError instanceof Error ? dbError.name : "Unknown",
        message: dbError instanceof Error ? dbError.message : "Unknown error",
        stack: dbError instanceof Error ? dbError.stack : "No stack trace",
      })
      throw new Error(`Database save failed: ${dbError instanceof Error ? dbError.message : "Unknown error"}`)
    }

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
