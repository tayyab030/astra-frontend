import { NextResponse } from "next/server"

import { createSpeechWav, hasGroqApiKey } from "@/lib/groq"

type SpeechRequestBody = {
  text?: string
}

export async function POST(request: Request) {
  if (!hasGroqApiKey()) {
    return NextResponse.json(
      {
        error:
          "Missing CONSOLE_GROQ_API_KEY. Add it to your .env and restart the Next.js server.",
      },
      { status: 500 }
    )
  }

  let body: SpeechRequestBody
  try {
    body = (await request.json()) as SpeechRequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const text = typeof body.text === "string" ? body.text.trim() : ""
  if (!text) {
    return NextResponse.json({ error: "text is required." }, { status: 400 })
  }

  try {
    const wav = await createSpeechWav(text)
    const bytes = Buffer.from(wav)
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate speech."
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
