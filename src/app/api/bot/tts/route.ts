import { NextRequest, NextResponse } from 'next/server'
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { getUser } from '@/lib/auth/getUser'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY || 'placeholder',
  })
  try {
    const { text } = await request.json()
    if (!text) return NextResponse.json({ message: 'Text required' }, { status: 400 })

    const voiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'

    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      text: (text as string).slice(0, 500), // limit for speed
      modelId: 'eleven_turbo_v2_5',
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.75,
      },
    })

    // Drain ReadableStream into a buffer using getReader()
    const chunks: Uint8Array[] = []
    const reader = audioStream.getReader()
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) chunks.push(value)
      }
    } finally {
      reader.releaseLock()
    }

    const audioBuffer = Buffer.concat(chunks.map(c => Buffer.from(c)))

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    })
  } catch (err) {
    console.error('TTS error:', err)
    return NextResponse.json({ message: 'TTS failed' }, { status: 500 })
  }
}
