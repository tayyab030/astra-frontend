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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden font-mono">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />

            <div
                className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-full blur-xl animate-bounce"
                style={{ animationDelay: "0s", animationDuration: "3s" }}
            />
            <div
                className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-xl animate-bounce"
                style={{ animationDelay: "1s", animationDuration: "4s" }}
            />
            <div
                className="absolute bottom-32 left-40 w-28 h-28 bg-gradient-to-r from-emerald-400/20 to-teal-600/20 rounded-full blur-xl animate-bounce"
                style={{ animationDelay: "2s", animationDuration: "3.5s" }}
            />

            <div
                className="absolute top-1/4 right-1/4 w-64 h-64 border border-cyan-400/30 rounded-full animate-spin"
                style={{ animationDuration: "20s" }}
            >
                <div
                    className="absolute inset-4 border border-cyan-400/20 rounded-full animate-spin"
                    style={{ animationDuration: "15s", animationDirection: "reverse" }}
                >
                    <div
                        className="absolute inset-4 border border-cyan-400/10 rounded-full animate-spin"
                        style={{ animationDuration: "10s" }}
                    />
                </div>
            </div>

            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                />
            ))}

            <div className="relative z-10 flex flex-col h-screen max-w-4xl mx-auto p-4">
                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
                        AI Assistant
                    </h1>
                    <p className="text-cyan-300/80">Your intelligent companion for any task</p>
                </div>

                {/* Messages Container */}
                <Card className="flex-1 bg-slate-900/50 backdrop-blur-xl border-cyan-400/30 shadow-2xl shadow-cyan-400/10 mb-4 overflow-hidden">
                    <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === "user"
                                                ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                                : "bg-gradient-to-r from-emerald-500 to-teal-500"
                                            }`}
                                    >
                                        {message.role === "user" ? (
                                            <User className="w-4 h-4 text-white" />
                                        ) : (
                                            <Bot className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                    <div className={`max-w-[70%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                                        <div
                                            className={`inline-block p-3 rounded-lg backdrop-blur-sm ${message.role === "user"
                                                    ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 text-cyan-100"
                                                    : "bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500/30 text-slate-100"
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500/30 backdrop-blur-sm p-3 rounded-lg">
                                        <div className="flex space-x-1">
                                            <div
                                                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "0ms" }}
                                            />
                                            <div
                                                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "150ms" }}
                                            />
                                            <div
                                                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
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

                {/* Input Area */}
                <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-400/30 shadow-2xl shadow-cyan-400/10">
                    <div className="p-4">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 bg-slate-800/50 border-slate-600/50 text-cyan-100 placeholder-slate-400 focus:border-cyan-400/50 focus:ring-cyan-400/20"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-400/20"
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
