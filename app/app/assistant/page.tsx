"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Bot, Mic, Send, Square, Trash2, User, Volume2, VolumeX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { chunkForSpeech, type ChatMessage } from "@/lib/groq"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const WELCOME: Message = {
  id: "welcome",
  content:
    "Good day. I am Astra. Click the mic to speak, or type a message. I listen with Groq Whisper and reply with voice.",
  role: "assistant",
  timestamp: new Date(),
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function pickRecorderMimeType() {
  if (typeof MediaRecorder === "undefined") return ""
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg",
  ]
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? ""
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [speakReplies, setSpeakReplies] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const historyRef = useRef<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const stopSpeechRef = useRef(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const speakRepliesRef = useRef(speakReplies)
  const blobUrlRef = useRef<string | null>(null)
  speakRepliesRef.current = speakReplies

  const ensureAudioElement = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = "auto"
    }
    return audioRef.current
  }

  /** Unlock autoplay during a user gesture (send / mic). */
  const unlockAudio = async () => {
    const audio = ensureAudioElement()
    try {
      // Tiny silent wav to unlock playback for later async TTS.
      audio.src =
        "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"
      audio.muted = true
      await audio.play()
      audio.pause()
      audio.currentTime = 0
      audio.muted = false
      audio.removeAttribute("src")
      audio.load()
    } catch {
      // Ignore unlock failures; real playback may still work after a click.
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, isSpeaking, isRecording, isTranscribing])

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop()
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const stopSpeech = () => {
    stopSpeechRef.current = true
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setIsSpeaking(false)
  }

  const playWavBytes = async (bytes: ArrayBuffer) => {
    const header = new TextDecoder().decode(bytes.slice(0, 4))
    if (header !== "RIFF") {
      throw new Error("Invalid audio from Groq (expected WAV).")
    }

    const blob = new Blob([bytes], { type: "audio/wav" })
    const url = URL.createObjectURL(blob)
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    blobUrlRef.current = url

    const audio = ensureAudioElement()
    audio.muted = false
    audio.src = url

    const waitForElementEnd = () =>
      new Promise<void>((resolve, reject) => {
        const onEnded = () => {
          cleanup()
          resolve()
        }
        const onError = () => {
          cleanup()
          reject(new Error("Browser could not decode Groq audio."))
        }
        const cleanup = () => {
          audio.removeEventListener("ended", onEnded)
          audio.removeEventListener("error", onError)
        }
        audio.addEventListener("ended", onEnded)
        audio.addEventListener("error", onError)
      })

    try {
      await audio.play()
      await waitForElementEnd()
    } catch {
      // Fallback for browsers that reject HTMLAudioElement after async delays.
      const context = new AudioContext()
      try {
        if (context.state === "suspended") {
          await context.resume()
        }
        const decoded = await context.decodeAudioData(bytes.slice(0))
        await new Promise<void>((resolve, reject) => {
          const source = context.createBufferSource()
          source.buffer = decoded
          source.connect(context.destination)
          source.onended = () => resolve()
          try {
            source.start(0)
          } catch (error) {
            reject(error)
          }
        })
      } finally {
        void context.close()
      }
    } finally {
      if (blobUrlRef.current === url) {
        URL.revokeObjectURL(url)
        blobUrlRef.current = null
      }
    }
  }

  const speakWithGroq = async (text: string) => {
    stopSpeechRef.current = false
    setIsSpeaking(true)

    try {
      const chunks = chunkForSpeech(text)
      for (const chunk of chunks) {
        if (stopSpeechRef.current) break

        const response = await fetch("/api/assistant/speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: chunk }),
        })

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as { error?: string } | null
          throw new Error(data?.error ?? `Speech failed (${response.status})`)
        }

        const bytes = await response.arrayBuffer()
        if (!bytes.byteLength) {
          throw new Error("Empty audio returned from Groq.")
        }

        await playWavBytes(bytes)
      }
    } finally {
      setIsSpeaking(false)
    }
  }

  const handleSendText = async (rawText: string) => {
    const text = rawText.trim()
    if (!text || isLoading) return

    await unlockAudio()

    const userMessage: Message = {
      id: createId(),
      content: text,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setError(null)
    setIsLoading(true)
    historyRef.current = [...historyRef.current, { role: "user", content: text }]
    stopSpeech()
    stopSpeechRef.current = false

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyRef.current }),
      })

      const data = (await response.json()) as { content?: string; error?: string }
      if (!response.ok || !data.content) {
        throw new Error(data.error ?? `Request failed (${response.status})`)
      }

      const assistantMessage: Message = {
        id: createId(),
        content: data.content,
        role: "assistant",
        timestamp: new Date(),
      }

      historyRef.current = [
        ...historyRef.current,
        { role: "assistant", content: data.content },
      ]
      setMessages((prev) => [...prev, assistantMessage])

      if (speakRepliesRef.current) {
        try {
          await speakWithGroq(data.content)
        } catch (speechError) {
          console.warn("[groq-tts]", speechError)
          setError(
            speechError instanceof Error
              ? `Reply ready, but speech failed: ${speechError.message}`
              : "Reply ready, but speech failed."
          )
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reach Astra."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const startRecording = async () => {
    if (isLoading || isSpeaking || isTranscribing) return

    try {
      await unlockAudio()
      stopSpeech()
      stopSpeechRef.current = false
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      chunksRef.current = []

      const mimeType = pickRecorderMimeType()
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)

      mediaRecorderRef.current = recorder
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        void (async () => {
          try {
            const blobType = recorder.mimeType || mimeType || "audio/webm"
            const blob = new Blob(chunksRef.current, { type: blobType })
            mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
            mediaStreamRef.current = null

            if (blob.size < 1000) {
              setError("Recording was too short. Hold a bit longer, then tap mic again.")
              return
            }

            setIsTranscribing(true)
            const formData = new FormData()
            const extension = blobType.includes("mp4")
              ? "mp4"
              : blobType.includes("ogg")
                ? "ogg"
                : "webm"
            formData.append("file", blob, `voice.${extension}`)

            const response = await fetch("/api/assistant/transcribe", {
              method: "POST",
              body: formData,
            })
            const data = (await response.json()) as { text?: string; error?: string }
            if (!response.ok || !data.text) {
              throw new Error(data.error ?? `Transcription failed (${response.status})`)
            }

            await handleSendText(data.text)
          } catch (err) {
            setError(err instanceof Error ? err.message : "Voice transcription failed.")
          } finally {
            setIsTranscribing(false)
            setIsRecording(false)
          }
        })()
      }

      recorder.start()
      setIsRecording(true)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Microphone access was denied or unavailable."
      )
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === "inactive") {
      setIsRecording(false)
      return
    }
    recorder.stop()
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
      return
    }
    void startRecording()
  }

  const clearChat = () => {
    stopSpeech()
    if (isRecording) stopRecording()
    historyRef.current = []
    setMessages([{ ...WELCOME, id: createId(), timestamp: new Date() }])
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSendText(input)
    }
  }

  const statusLabel = isRecording
    ? "Listening… click mic to send"
    : isTranscribing
      ? "Transcribing with Whisper…"
      : isLoading
        ? "Astra is thinking…"
        : isSpeaking
          ? "Astra is speaking…"
          : null

  return (
    <div className="astra-page font-mono">
      <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="astra-title mb-2 text-4xl">AI Assistant</h1>
            <p className="astra-subtitle">Whisper in · Groq chat · Orpheus out</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setSpeakReplies((value) => !value)}
              aria-label={speakReplies ? "Mute speech" : "Enable speech"}
            >
              {speakReplies ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={stopSpeech}
              disabled={!isSpeaking}
              aria-label="Stop speech"
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={clearChat}
              aria-label="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="astra-card mb-4 flex-1 overflow-hidden">
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[70%] ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block rounded-lg p-3 ${
                        message.role === "user"
                          ? "astra-panel text-foreground"
                          : "border border-border bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {statusLabel && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
                    {statusLabel}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </Card>

        {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}

        <Card className="astra-card">
          <div className="p-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={toggleRecording}
                disabled={isLoading || isSpeaking || isTranscribing}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isRecording ? "Listening…" : "Ask Astra anything..."}
                className="astra-input flex-1"
                disabled={isLoading || isRecording || isTranscribing}
              />
              <Button
                onClick={() => void handleSendText(input)}
                disabled={!input.trim() || isLoading || isRecording || isTranscribing}
                className="astra-btn-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
