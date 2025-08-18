import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_FILMBANK_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_FILMBANK_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_FILMBANK_AWS_SECRET_ACCESS_KEY || "",
  },
})

const docClient = DynamoDBDocumentClient.from(client)

export interface LicenceApplication {
  id: string
  submissionDate: string
  selectedIndustry: string
  quantity: number
  coverageArea?: string
  unitPrice: number
  subtotal: number
  total: number
  organisationName: string
  firstName: string
  lastName: string
  telephone: string
  jobTitle: string
  email: string
  billingAddress: {
    street: string
    addressLine2: string
    city: string
    county: string
    country: string
    postalCode: string
  }
  premisesAddress: {
    street: string
    addressLine2: string
    city: string
    county: string
    country: string
    postalCode: string
  }
  sameAsBilling: boolean
  agreeToTerms: boolean
  paymentMethod: string
  status: string
}

export async function saveLicenceApplication(application: LicenceApplication): Promise<void> {
  console.log("[v0] DynamoDB save function called")
  console.log("[v0] Environment variables check:")
  console.log("[v0] Region:", process.env.NEXT_PUBLIC_FILMBANK_AWS_REGION ? "Set" : "Missing")
  console.log("[v0] Access Key:", process.env.NEXT_PUBLIC_FILMBANK_AWS_ACCESS_KEY_ID ? "Set" : "Missing")
  console.log("[v0] Secret Key:", process.env.NEXT_PUBLIC_FILMBANK_AWS_SECRET_ACCESS_KEY ? "Set" : "Missing")

  try {
    const command = new PutCommand({
      TableName: "filmbankmedia-licence-applications",
      Item: application,
    })

    console.log("[v0] About to execute DynamoDB PutCommand")
    await docClient.send(command)
    console.log("[v0] DynamoDB PutCommand successful")
  } catch (error) {
    console.error("[v0] DynamoDB error:", error)
    throw error
  }
}

export async function getLicenceApplication(id: string, submissionDate: string): Promise<LicenceApplication | null> {
  try {
    const command = new GetCommand({
      TableName: "filmbankmedia-licence-applications",
      Key: { id, submissionDate },
    })

    const result = await docClient.send(command)
    return result.Item as LicenceApplication | null
  } catch (error) {
    console.error("Error getting licence application:", error)
    throw error
  }
}
