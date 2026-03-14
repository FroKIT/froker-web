import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'

export function getElevenLabsClient() {
  return new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY || 'placeholder',
  })
}

export const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'
