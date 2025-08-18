import { type NextRequest, NextResponse } from "next/server"
import { saveLicenceApplication, type LicenceApplication } from "@/lib/dynamodb"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "selectedIndustry",
      "quantity",
      "organisationName",
      "firstName",
      "lastName",
      "telephone",
      "email",
      "agreeToTerms",
      "paymentMethod",
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate terms agreement
    if (!body.agreeToTerms) {
      return NextResponse.json({ error: "Must agree to terms and conditions" }, { status: 400 })
    }

    // Generate unique ID and timestamp
    const id = randomUUID()
    const submissionDate = new Date().toISOString()

    // Create the licence application object
    const licenceApplication: LicenceApplication = {
      id,
      submissionDate,
      selectedIndustry: body.selectedIndustry,
      quantity: Number(body.quantity),
      coverageArea: body.coverageArea || undefined,
      unitPrice: Number(body.unitPrice),
      subtotal: Number(body.subtotal),
      total: Number(body.total),
      organisationName: body.organisationName,
      firstName: body.firstName,
      lastName: body.lastName,
      telephone: body.telephone,
      jobTitle: body.jobTitle || "",
      email: body.email,
      billingAddress: {
        street: body.billingAddress?.street || "",
        addressLine2: body.billingAddress?.addressLine2 || "",
        city: body.billingAddress?.city || "",
        county: body.billingAddress?.county || "",
        country: body.billingAddress?.country || "United Kingdom",
        postalCode: body.billingAddress?.postalCode || "",
      },
      premisesAddress: {
        street: body.premisesAddress?.street || "",
        addressLine2: body.premisesAddress?.addressLine2 || "",
        city: body.premisesAddress?.city || "",
        county: body.premisesAddress?.county || "",
        country: body.premisesAddress?.country || "United Kingdom",
        postalCode: body.premisesAddress?.postalCode || "",
      },
      sameAsBilling: Boolean(body.sameAsBilling),
      agreeToTerms: Boolean(body.agreeToTerms),
      paymentMethod: body.paymentMethod,
      status: "submitted",
    }

    // Save to DynamoDB
    await saveLicenceApplication(licenceApplication)

    // Return success response with application ID
    return NextResponse.json({
      success: true,
      applicationId: id,
      message: "Licence application submitted successfully",
    })
  } catch (error) {
    console.error("Error saving licence application:", error)

    return NextResponse.json(
      {
        error: "Failed to submit licence application",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const submissionDate = searchParams.get("submissionDate")

  if (!id || !submissionDate) {
    return NextResponse.json({ error: "Missing required parameters: id and submissionDate" }, { status: 400 })
  }

  try {
    const { getLicenceApplication } = await import("@/lib/dynamodb")
    const application = await getLicenceApplication(id, submissionDate)

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error retrieving licence application:", error)

    return NextResponse.json(
      {
        error: "Failed to retrieve licence application",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
