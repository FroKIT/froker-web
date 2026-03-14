import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime'

export const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-sonnet-4-5'
