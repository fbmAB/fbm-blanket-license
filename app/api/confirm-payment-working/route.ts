import { type NextRequest, NextResponse } from "next/server"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { v4 as uuidv4 } from "uuid"

const dynamoClient = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_FILMBANK_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_FILMBANK_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_FILMBANK_AWS_SECRET_ACCESS_KEY!,
  },
})

const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Confirm payment API called")

    const body = await request.json()
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const { paymentIntentId, formData } = body

    if (!paymentIntentId || !formData) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing payment intent ID or form data" }, { status: 400 })
    }

    // Generate application ID
    const applicationId = uuidv4()
    console.log("[v0] Generated application ID:", applicationId)

    // Prepare data for DynamoDB
    const applicationData = {
      id: applicationId,
      paymentIntentId,
      selectedIndustry: formData.selectedIndustry,
      quantity: formData.quantity,
      coverageArea: formData.coverageArea || null,
      organisationName: formData.organisationName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      telephone: formData.telephone,
      jobTitle: formData.jobTitle,
      email: formData.email,
      billingAddress: formData.billingAddress,
      premisesAddress: formData.sameAsBilling ? formData.billingAddress : formData.premisesAddress,
      sameAsBilling: formData.sameAsBilling,
      agreeToTerms: true,
      paymentMethod: "card",
      unitPrice: formData.unitPrice,
      coveragePrice: formData.coveragePrice || 0,
      subtotal: formData.subtotal,
      total: formData.total,
      submittedAt: new Date().toISOString(),
      status: "paid",
    }

    console.log("[v0] Attempting to save to DynamoDB...")

    // Save to DynamoDB
    const command = new PutCommand({
      TableName: "filmbankmedia-licence-applications",
      Item: applicationData,
    })

    await docClient.send(command)
    console.log("[v0] Successfully saved to DynamoDB")

    return NextResponse.json({
      success: true,
      applicationId,
      message: "Payment confirmed and application saved",
    })
  } catch (error) {
    console.error("[v0] Error in confirm payment:", error)
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
