"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Bot, User } from "lucide-react"

interface Message {
    id: string
    content: string
    role: "user" | "assistant"
    timestamp: Date
}

export default function AssistantPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            content: "Hello! I'm your AI assistant. How can I help you today?",
            role: "assistant",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            role: "user",
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        // Simulate AI response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                content:
                    "I understand your message. This is a simulated response from the AI assistant. In a real implementation, this would connect to an AI service.",
                role: "assistant",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, assistantMessage])
            setIsLoading(false)
        }, 1000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="astra-page font-mono">
            <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
                <div className="mb-6 text-center">
                    <h1 className="astra-title text-4xl mb-2">
                        AI Assistant
                    </h1>
                    <p className="astra-subtitle">Your intelligent companion for any task</p>
                </div>

                <Card className="astra-card flex-1 mb-4 overflow-hidden">
                    <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-secondary-foreground"
                                            }`}
                                    >
                                        {message.role === "user" ? (
                                            <User className="w-4 h-4" />
                                        ) : (
                                            <Bot className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className={`max-w-[70%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                                        <div
                                            className={`inline-block p-3 rounded-lg ${message.role === "user"
                                                    ? "astra-panel text-foreground"
                                                    : "bg-muted border border-border text-foreground"
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{message.timestamp.toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-muted border border-border p-3 rounded-lg">
                                        <div className="flex space-x-1">
                                            <div
                                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                                style={{ animationDelay: "0ms" }}
                                            />
                                            <div
                                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                                style={{ animationDelay: "150ms" }}
                                            />
                                            <div
                                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                                style={{ animationDelay: "300ms" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </Card>

                <Card className="astra-card">
                    <div className="p-4">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="astra-input flex-1"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="astra-btn-primary"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
