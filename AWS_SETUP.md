# AWS DynamoDB Setup Guide

This guide will help you set up AWS DynamoDB for the Filmbankmedia Licence Form application.

## Prerequisites

1. AWS Account
2. AWS CLI installed (optional but recommended)
3. Appropriate IAM permissions for DynamoDB

## Step 1: Create DynamoDB Table

### Option A: Using AWS Console

1. Go to AWS DynamoDB Console
2. Click "Create table"
3. Configure the table:
   - **Table name**: `filmbankmedia-licence-applications`
   - **Partition key**: `id` (String)
   - **Sort key**: `submissionDate` (String)
   - **Billing mode**: On-demand (recommended for variable workloads)

4. After table creation, add Global Secondary Index:
   - **Index name**: `industry-date-index`
   - **Partition key**: `selectedIndustry` (String)
   - **Sort key**: `submissionDate` (String)
   - **Projection**: All attributes

### Option B: Using AWS CLI

Run the commands from the SQL script file:

\`\`\`bash
# Create the main table
aws dynamodb create-table \
  --table-name filmbankmedia-licence-applications \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=submissionDate,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
    AttributeName=submissionDate,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Add Global Secondary Index
aws dynamodb update-table \
  --table-name filmbankmedia-licence-applications \
  --attribute-definitions \
    AttributeName=selectedIndustry,AttributeType=S \
    AttributeName=submissionDate,AttributeType=S \
  --global-secondary-index-updates \
    '[{
      "Create": {
        "IndexName": "industry-date-index",
        "KeySchema": [
          {"AttributeName": "selectedIndustry", "KeyType": "HASH"},
          {"AttributeName": "submissionDate", "KeyType": "RANGE"}
        ],
        "Projection": {"ProjectionType": "ALL"},
        "BillingMode": "PAY_PER_REQUEST"
      }
    }]'
\`\`\`

## Step 2: Create IAM User and Permissions

1. Go to AWS IAM Console
2. Create a new user for the application
3. Attach the following policy (or create a custom policy):

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:UpdateItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/filmbankmedia-licence-applications",
        "arn:aws:dynamodb:*:*:table/filmbankmedia-licence-applications/index/*"
      ]
    }
  ]
}
\`\`\`

4. Generate Access Keys for the user
5. Save the Access Key ID and Secret Access Key securely

## Step 3: Configure Environment Variables

### For Local Development

1. Copy `.env.example` to `.env.local`:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Update the values in `.env.local`:
   \`\`\`env
   FILMBANK_AWS_REGION=us-east-1
   FILMBANK_AWS_ACCESS_KEY_ID=your_actual_access_key_id
   FILMBANK_AWS_SECRET_ACCESS_KEY=your_actual_secret_access_key
   \`\`\`

### For AWS Amplify Deployment

1. In AWS Amplify Console, go to your app
2. Navigate to "Environment variables" in the left sidebar
3. Add the following environment variables:
   - `FILMBANK_AWS_REGION`: `us-east-1` (or your preferred region)
   - `FILMBANK_AWS_ACCESS_KEY_ID`: Your AWS Access Key ID
   - `FILMBANK_AWS_SECRET_ACCESS_KEY`: Your AWS Secret Access Key

### For Vercel Deployment

1. In Vercel Dashboard, go to your project
2. Navigate to Settings → Environment Variables
3. Add the same environment variables as above

## Step 4: Test the Setup

1. Deploy your application
2. Submit a test form
3. Check the DynamoDB table in AWS Console to verify data is being stored

## Security Best Practices

1. **Never commit AWS credentials to version control**
2. Use IAM roles with minimal required permissions
3. Rotate access keys regularly
4. Consider using AWS Secrets Manager for production environments
5. Enable CloudTrail logging for audit purposes

## Troubleshooting

### Common Issues

1. **Access Denied Error**: Check IAM permissions and ensure the user has the correct policy attached
2. **Table Not Found**: Verify the table name matches exactly (case-sensitive)
3. **Region Mismatch**: Ensure the `FILMBANK_AWS_REGION` environment variable matches where your table was created
4. **Invalid Credentials**: Double-check your `FILMBANK_AWS_ACCESS_KEY_ID` and `FILMBANK_AWS_SECRET_ACCESS_KEY`

### Monitoring

- Use AWS CloudWatch to monitor DynamoDB metrics
- Set up alarms for error rates and throttling
- Review AWS CloudTrail logs for API calls

## Cost Optimization

- Use On-Demand billing for variable workloads
- Consider Provisioned billing for predictable traffic
- Enable DynamoDB auto-scaling if using Provisioned mode
- Set up billing alerts to monitor costs
