"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Bot, Menu, MessageSquarePlus, Mic, Send, Square, User, Volume2, VolumeX } from "lucide-react"

import { ConversationSidebar } from "@/components/assistant/ConversationSidebar"
import { LanguageSelect } from "@/components/assistant/LanguageSelect"
import { VoiceWaveform } from "@/components/assistant/VoiceWaveform"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  createAssistantConversation,
  deleteAssistantConversation,
  fetchAssistantSpeechWav,
  getAssistantConversation,
  getAssistantErrorMessage,
  listAssistantConversations,
  sendAssistantMessage,
  transcribeAssistantAudioFile,
  updateAssistantConversation,
  type AssistantChatMessage,
  type AssistantConversation,
} from "@/lib/api/assistant"
import { chunkForSpeech } from "@/lib/assistant/chunkSpeech"
import { formatMessageTime, groupByDay } from "@/lib/assistant/chatDate"
import { fetchCurrentUser, updateCurrentUser } from "@/lib/api/user"
import { DEFAULT_AI_VOICE_MODE } from "@/lib/ai-settings"
import { setUser } from "@/store/slice/userSlice"
import { useAppDispatch } from "@/store/hooks"
import {
  DEFAULT_AI_LANGUAGE,
  isAiLanguage,
  type AiLanguage,
} from "@/lib/ai-language"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const WELCOME: Message = {
  id: "welcome",
  content:
    "Good day. I am Astra. I know your profile and wealth data. Click the mic to speak, or type a message.",
  role: "assistant",
  timestamp: new Date(),
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function mapApiMessage(message: AssistantChatMessage): Message {
  return {
    id: message.id,
    content: message.content,
    role: message.role,
    timestamp: new Date(message.created_at),
  }
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
  const [speakReplies, setSpeakReplies] = useState(DEFAULT_AI_VOICE_MODE)
  const [aiLanguage, setAiLanguage] = useState<AiLanguage>(DEFAULT_AI_LANGUAGE)
  const [error, setError] = useState<string | null>(null)
  const [micStream, setMicStream] = useState<MediaStream | null>(null)
  const [conversations, setConversations] = useState<AssistantConversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [activeTitle, setActiveTitle] = useState("New chat")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [historyBusy, setHistoryBusy] = useState(false)

  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const { data: me } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
  })

  useEffect(() => {
    if (!me) return
    setSpeakReplies(
      typeof me.ai_voice_mode === "boolean" ? me.ai_voice_mode : DEFAULT_AI_VOICE_MODE
    )
    setAiLanguage(isAiLanguage(me.ai_language) ? me.ai_language : DEFAULT_AI_LANGUAGE)
  }, [me])

  const { mutate: saveLanguage, isPending: isSavingLanguage } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (user) => {
      setAiLanguage(isAiLanguage(user.ai_language) ? user.ai_language : DEFAULT_AI_LANGUAGE)
      dispatch(setUser(user))
      queryClient.setQueryData(["auth", "me"], user)
      void queryClient.invalidateQueries({ queryKey: ["daily-quote"] })
      void queryClient.invalidateQueries({ queryKey: ["goals-quote"] })
      void queryClient.invalidateQueries({ queryKey: ["ai-insight"] })
      toast.success("Language updated")
    },
    onError: (error) => {
      toast.error(getAssistantErrorMessage(error, "Failed to update language"))
    },
  })

  const handleLanguageChange = (value: string) => {
    if (!isAiLanguage(value) || value === aiLanguage || isSavingLanguage) return
    setAiLanguage(value)
    saveLanguage({ ai_language: value })
  }

  const conversationIdRef = useRef<string | null>(null)
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

  const unlockAudio = async () => {
    const audio = ensureAudioElement()
    try {
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
      // Ignore unlock failures.
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, isSpeaking, isRecording, isTranscribing])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const list = await listAssistantConversations()
        if (cancelled) return
        setConversations(list)
        const latest = list[0]
        if (!latest) return
        const detail = await getAssistantConversation(latest.id)
        if (cancelled) return
        conversationIdRef.current = detail.conversation.id
        setActiveConversationId(detail.conversation.id)
        setActiveTitle(detail.conversation.title)
        if (detail.messages.length > 0) {
          setMessages(detail.messages.map(mapApiMessage))
        }
      } catch {
        // Keep welcome message if history cannot load.
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

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
      throw new Error("Invalid audio from assistant (expected WAV).")
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
          reject(new Error("Browser could not decode audio."))
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

  const speakReply = async (text: string) => {
    stopSpeechRef.current = false
    setIsSpeaking(true)

    try {
      const chunks = chunkForSpeech(text)
      for (const chunk of chunks) {
        if (stopSpeechRef.current) break
        const bytes = await fetchAssistantSpeechWav(chunk)
        if (!bytes.byteLength) {
          throw new Error("Empty audio returned.")
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

    const optimistic: Message = {
      id: createId(),
      content: text,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, optimistic])
    setInput("")
    setError(null)
    setIsLoading(true)
    stopSpeech()
    stopSpeechRef.current = false

    try {
      const result = await sendAssistantMessage({
        message: text,
        conversationId: conversationIdRef.current,
      })
      conversationIdRef.current = result.conversation.id
      setActiveConversationId(result.conversation.id)
      setActiveTitle(result.conversation.title)

      const userMessage = mapApiMessage(result.user_message)
      const assistantMessage = mapApiMessage(result.assistant_message)

      setMessages((prev) => {
        const withoutOptimistic = prev.filter((item) => item.id !== optimistic.id)
        return [...withoutOptimistic, userMessage, assistantMessage]
      })

      try {
        const list = await listAssistantConversations()
        setConversations(list)
      } catch {
        // Keep chat usable if list refresh fails.
      }

      if (speakRepliesRef.current) {
        try {
          await speakReply(assistantMessage.content)
        } catch (speechError) {
          console.warn("[assistant-tts]", speechError)
          setError(
            getAssistantErrorMessage(speechError, "Reply ready, but speech failed.")
          )
        }
      }
    } catch (err) {
      const message = getAssistantErrorMessage(err, "Failed to reach Astra.")
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          content: message,
          role: "assistant",
          timestamp: new Date(),
        },
      ])
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
      setMicStream(stream)
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
            setMicStream(null)

            if (blob.size < 1000) {
              setError("Recording was too short. Hold a bit longer, then tap mic again.")
              return
            }

            setIsTranscribing(true)
            const extension = blobType.includes("mp4")
              ? "mp4"
              : blobType.includes("ogg")
                ? "ogg"
                : "webm"
            const text = await transcribeAssistantAudioFile(blob, `voice.${extension}`)
            await handleSendText(text)
          } catch (err) {
            setError(getAssistantErrorMessage(err, "Voice transcription failed."))
          } finally {
            setIsTranscribing(false)
            setIsRecording(false)
            setMicStream(null)
          }
        })()
      }

      recorder.start()
      setIsRecording(true)
      setError(null)
    } catch (err) {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
      setMicStream(null)
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
      setMicStream(null)
      return
    }
    setIsRecording(false)
    recorder.stop()
  }

  const refreshConversations = async () => {
    const list = await listAssistantConversations()
    setConversations(list)
    return list
  }

  const selectConversation = async (id: string) => {
    if (isLoading || historyBusy) return
    setHistoryBusy(true)
    setError(null)
    try {
      stopSpeech()
      const detail = await getAssistantConversation(id)
      conversationIdRef.current = detail.conversation.id
      setActiveConversationId(detail.conversation.id)
      setActiveTitle(detail.conversation.title)
      setMessages(
        detail.messages.length > 0
          ? detail.messages.map(mapApiMessage)
          : [{ ...WELCOME, id: createId(), timestamp: new Date() }]
      )
      setInput("")
    } catch (err) {
      setError(getAssistantErrorMessage(err, "Could not open that chat."))
    } finally {
      setHistoryBusy(false)
    }
  }

  const createNewChat = async () => {
    if (isLoading || historyBusy) return
    setHistoryBusy(true)
    setError(null)
    try {
      stopSpeech()
      if (isRecording) stopRecording()
      const conversation = await createAssistantConversation("New chat")
      conversationIdRef.current = conversation.id
      setActiveConversationId(conversation.id)
      setActiveTitle(conversation.title)
      setMessages([{ ...WELCOME, id: createId(), timestamp: new Date() }])
      setInput("")
      await refreshConversations()
    } catch (err) {
      conversationIdRef.current = null
      setActiveConversationId(null)
      setActiveTitle("New chat")
      setMessages([{ ...WELCOME, id: createId(), timestamp: new Date() }])
      setError(getAssistantErrorMessage(err, "Could not start a new chat."))
    } finally {
      setHistoryBusy(false)
    }
  }

  const renameConversation = async (id: string, title: string) => {
    const nextTitle = title.trim()
    if (!nextTitle) return
    setHistoryBusy(true)
    setError(null)
    try {
      const updated = await updateAssistantConversation(id, nextTitle)
      setConversations((prev) => prev.map((item) => (item.id === id ? updated : item)))
      if (conversationIdRef.current === id) {
        setActiveTitle(updated.title)
      }
    } catch (err) {
      setError(getAssistantErrorMessage(err, "Could not rename chat."))
    } finally {
      setHistoryBusy(false)
    }
  }

  const removeConversation = async (id: string) => {
    setHistoryBusy(true)
    setError(null)
    try {
      stopSpeech()
      await deleteAssistantConversation(id)
      const list = await refreshConversations()
      if (conversationIdRef.current === id) {
        const next = list[0]
        if (next) {
          const detail = await getAssistantConversation(next.id)
          conversationIdRef.current = detail.conversation.id
          setActiveConversationId(detail.conversation.id)
          setActiveTitle(detail.conversation.title)
          setMessages(
            detail.messages.length > 0
              ? detail.messages.map(mapApiMessage)
              : [{ ...WELCOME, id: createId(), timestamp: new Date() }]
          )
        } else {
          conversationIdRef.current = null
          setActiveConversationId(null)
          setActiveTitle("New chat")
          setMessages([{ ...WELCOME, id: createId(), timestamp: new Date() }])
        }
      }
    } catch (err) {
      setError(getAssistantErrorMessage(err, "Could not delete chat."))
    } finally {
      setHistoryBusy(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSendText(input)
    }
  }

  const messageDays = useMemo(
    () => groupByDay(messages, (message) => message.timestamp),
    [messages]
  )

  const statusLabel = isRecording
    ? "Listening… click send to finish"
    : isTranscribing
      ? "Transcribing…"
      : isLoading
        ? "Astra is thinking…"
        : isSpeaking
          ? "Astra is speaking…"
          : null

  const sendDisabled =
    isTranscribing || isLoading || (!isRecording && !input.trim())

  const onSendPress = () => {
    if (isRecording) {
      stopRecording()
      return
    }
    void handleSendText(input)
  }

  return (
    <div className="astra-page font-mono">
      <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-6xl gap-0 overflow-hidden rounded-xl border border-border md:gap-4 md:border-0">
        <ConversationSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          conversations={conversations}
          activeId={activeConversationId}
          busy={historyBusy || isLoading}
          onNewChat={() => void createNewChat()}
          onSelect={(id) => void selectConversation(id)}
          onRename={(id, title) => void renameConversation(id, title)}
          onDelete={(id) => void removeConversation(id)}
        />

        <div className="flex min-w-0 flex-1 flex-col p-3 md:p-0">
        <div className="mb-4 flex items-start justify-between gap-4 md:mb-6">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open chats"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="min-w-0 text-left">
              <h1 className="astra-title truncate">
                {activeTitle || "AI Assistant"}
              </h1>
              <p className="astra-subtitle mt-1">Chats save automatically</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <LanguageSelect
              value={aiLanguage}
              onValueChange={handleLanguageChange}
              disabled={isSavingLanguage}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => void createNewChat()}
              disabled={historyBusy || isLoading}
              aria-label="New chat"
            >
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
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
          </div>
        </div>

        <Card className="astra-card mb-4 flex-1 overflow-hidden">
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messageDays.map((day) => (
                <div key={day.key} className="space-y-4">
                  <div className="sticky top-0 z-10 flex justify-center py-1">
                    <span className="rounded-full border border-border bg-muted/90 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur">
                      {day.label}
                    </span>
                  </div>

                  {day.items.map((message) => (
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
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
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
            <div className="flex items-center gap-2">
              <div
                className={`overflow-hidden transition-all duration-200 ease-out ${
                  isRecording
                    ? "pointer-events-none w-0 scale-95 opacity-0"
                    : "w-10 scale-100 opacity-100"
                }`}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => void startRecording()}
                  disabled={isLoading || isSpeaking || isTranscribing || isRecording}
                  aria-label="Start recording"
                  className="h-10 w-10"
                >
                  {isTranscribing ? (
                    <span className="h-4 w-4 animate-pulse rounded-full bg-muted-foreground/50" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="relative min-h-10 flex-1">
                <div
                  className={`transition-all duration-200 ease-out ${
                    isRecording
                      ? "pointer-events-none absolute inset-0 -translate-y-1 opacity-0"
                      : "relative translate-y-0 opacity-100"
                  }`}
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask Astra anything..."
                    className="astra-input w-full"
                    disabled={isLoading || isRecording || isTranscribing}
                  />
                </div>

                <div
                  className={`transition-all duration-200 ease-out ${
                    isRecording
                      ? "relative translate-y-0 opacity-100"
                      : "pointer-events-none absolute inset-0 translate-y-1 opacity-0"
                  }`}
                >
                  <VoiceWaveform stream={micStream} active={isRecording} />
                </div>
              </div>

              <Button
                onClick={onSendPress}
                disabled={sendDisabled}
                className="astra-btn-primary"
                aria-label={isRecording ? "Stop and send" : "Send message"}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
        </div>
      </div>
    </div>
  )
}
