import { type NextRequest, NextResponse } from "next/server"
import { saveLicenceApplication, type LicenceApplication } from "@/lib/dynamodb-test"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Test API route called")
    const body = await request.json()

    // Generate unique ID and timestamp
    const id = randomUUID()
    const submissionDate = new Date().toISOString()

    // Create simplified test object
    const licenceApplication: LicenceApplication = {
      id,
      submissionDate,
      selectedIndustry: body.selectedIndustry || "test",
      quantity: 1,
      unitPrice: 25,
      subtotal: 25,
      total: 25,
      organisationName: body.organisationName || "Test Org",
      firstName: body.firstName || "Test",
      lastName: body.lastName || "User",
      telephone: body.telephone || "123456789",
      jobTitle: body.jobTitle || "Test",
      email: body.email || "test@test.com",
      billingAddress: {
        street: "Test Street",
        addressLine2: "",
        city: "Test City",
        county: "Test County",
        country: "United Kingdom",
        postalCode: "12345",
      },
      premisesAddress: {
        street: "Test Street",
        addressLine2: "",
        city: "Test City",
        county: "Test County",
        country: "United Kingdom",
        postalCode: "12345",
      },
      sameAsBilling: true,
      agreeToTerms: true,
      paymentMethod: "card",
      status: "submitted",
    }

    // Save to DynamoDB
    await saveLicenceApplication(licenceApplication)

    return NextResponse.json({
      success: true,
      applicationId: id,
      message: "Test submission successful",
    })
  } catch (error) {
    console.error("[v0] Test API error:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
