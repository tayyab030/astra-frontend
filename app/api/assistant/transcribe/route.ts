import { NextResponse } from "next/server"

import { hasGroqApiKey, transcribeAudioBlob } from "@/lib/groq"

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

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 })
  }

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required." }, { status: 400 })
  }

  try {
    const text = await transcribeAudioBlob(file, file.name || "voice.webm")
    return NextResponse.json({ text })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to transcribe audio."
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
