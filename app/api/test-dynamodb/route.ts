import { NextResponse } from "next"
import { DynamoDBClient, ListTablesCommand, DescribeTableCommand, PutItemCommand } from "@aws-sdk/client-dynamodb"

const dynamoClient = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_FILMBANK_AWS_REGION || "us-east-1",
})

export async function GET() {
  try {
    console.log("[v0] Testing DynamoDB connection...")

    // Test 1: List tables
    console.log("[v0] Step 1: Listing tables...")
    const listCommand = new ListTablesCommand({})
    const tables = await dynamoClient.send(listCommand)
    console.log("[v0] Available tables:", tables.TableNames)

    // Test 2: Check if our table exists
    const tableName = "filmbankmedia-licence-applications"
    const tableExists = tables.TableNames?.includes(tableName)
    console.log(`[v0] Table "${tableName}" exists:`, tableExists)

    if (!tableExists) {
      return NextResponse.json({
        success: false,
        error: "Table does not exist",
        availableTables: tables.TableNames,
        message: "You need to create the DynamoDB table first",
      })
    }

    // Test 3: Describe table
    console.log("[v0] Step 2: Describing table...")
    const describeCommand = new DescribeTableCommand({ TableName: tableName })
    const tableDescription = await dynamoClient.send(describeCommand)
    console.log("[v0] Table status:", tableDescription.Table?.TableStatus)

    // Test 4: Try a simple write
    console.log("[v0] Step 3: Testing write operation...")
    const testItem = {
      id: { S: "test-" + Date.now() },
      testField: { S: "test-value" },
      createdAt: { S: new Date().toISOString() },
    }

    const putCommand = new PutItemCommand({
      TableName: tableName,
      Item: testItem,
    })

    await dynamoClient.send(putCommand)
    console.log("[v0] Test write successful!")

    return NextResponse.json({
      success: true,
      message: "DynamoDB connection and permissions working correctly",
      tableStatus: tableDescription.Table?.TableStatus,
      availableTables: tables.TableNames,
    })
  } catch (error: any) {
    console.error("[v0] DynamoDB test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        errorName: error.name,
        errorCode: error.$metadata?.httpStatusCode,
      },
      { status: 500 },
    )
  }
}
