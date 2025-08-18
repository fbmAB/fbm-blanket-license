import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({
  region: process.env.FILMBANK_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.FILMBANK_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.FILMBANK_AWS_SECRET_ACCESS_KEY!,
  },
})

const docClient = DynamoDBDocumentClient.from(client)

const TABLE_NAME = "filmbankmedia-licence-applications"

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
  status: "submitted" | "processing" | "completed" | "failed"
}

export async function saveLicenceApplication(application: LicenceApplication): Promise<void> {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: application,
  })

  await docClient.send(command)
}

export async function getLicenceApplication(id: string, submissionDate: string): Promise<LicenceApplication | null> {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      id,
      submissionDate,
    },
  })

  const result = await docClient.send(command)
  return (result.Item as LicenceApplication) || null
}

export async function getLicenceApplicationsByIndustry(industry: string): Promise<LicenceApplication[]> {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "industry-date-index",
    KeyConditionExpression: "selectedIndustry = :industry",
    ExpressionAttributeValues: {
      ":industry": industry,
    },
    ScanIndexForward: false, // Most recent first
  })

  const result = await docClient.send(command)
  return (result.Items as LicenceApplication[]) || []
}
