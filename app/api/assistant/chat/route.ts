import { NextResponse } from "next/server"

import { createChatCompletion, hasGroqApiKey, type ChatMessage } from "@/lib/groq"

type ChatRequestBody = {
  messages?: ChatMessage[]
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

  let body: ChatRequestBody
  try {
    body = (await request.json()) as ChatRequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const history = (body.messages ?? []).filter(
    (message): message is ChatMessage =>
      Boolean(message) &&
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim().length > 0
  )

  if (history.length === 0) {
    return NextResponse.json({ error: "messages are required." }, { status: 400 })
  }

  try {
    const content = await createChatCompletion(history)
    return NextResponse.json({ content })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reach Astra."
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
