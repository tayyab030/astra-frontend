"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  DollarSign,
  Heart,
  Calendar,
  BookOpen,
  Mail,
  BarChart3,
  Zap,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Shield,
  Users,
} from "lucide-react"
import { useTheme } from "next-themes"
import { AstraLogo } from "@/components/astra-logo"

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)

  const coreModules = [
    {
      id: "wealth",
      icon: DollarSign,
      title: "Wealth Management",
      description: "Track expenses, budgets, investments & detect spending waste",
      gradient: "from-emerald-500 to-teal-600",
      features: ["Expense Tracking", "Investment Log", "Smart Insights", "Waste Detector"],
    },
    {
      id: "health",
      icon: Heart,
      title: "Health & Wellness",
      description: "Monitor habits, workouts, nutrition & sleep patterns",
      gradient: "from-rose-500 to-pink-600",
      features: ["Habit Tracker", "Exercise Log", "Nutrition Tracking", "Sleep Analytics"],
    },
    {
      id: "work",
      icon: Calendar,
      title: "Work & Productivity",
      description: "Manage tasks, goals, projects with smart prioritization",
      gradient: "from-blue-500 to-cyan-600",
      features: ["Task Manager", "Goal Tracking", "Focus Timer", "Calendar Sync"],
    },
    {
      id: "knowledge",
      icon: BookOpen,
      title: "Knowledge & Notes",
      description: "Organize notes, summaries & build your knowledge base",
      gradient: "from-purple-500 to-indigo-600",
      features: ["Smart Notes", "Book Summaries", "Knowledge Base", "AI Search"],
    },
    {
      id: "communication",
      icon: Mail,
      title: "Communication",
      description: "Smart email management with AI-powered insights",
      gradient: "from-orange-500 to-amber-600",
      features: ["Email Rules", "Smart Alerts", "Inbox Summaries", "Priority Detection"],
      isPro: true,
    },
  ]

  const stats = [
    { label: "Life Areas Managed", value: "5+", icon: Target },
    { label: "AI Features", value: "20+", icon: Brain },
    { label: "Integrations", value: "50+", icon: Zap },
    { label: "Users Worldwide", value: "10K+", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-900/80 border-b border-cyan-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <AstraLogo className="text-cyan-400" />
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/product" className="text-slate-300 hover:text-cyan-400 font-medium transition-colors">
                Product
              </a>
              <a href="/features" className="text-slate-300 hover:text-cyan-400 font-medium transition-colors">
                Features
              </a>
              <Link href="/pricing" className="text-slate-300 hover:text-cyan-400 font-medium transition-colors">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10">
                  Sign in
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-6 shadow-lg shadow-cyan-500/25">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/6 w-24 h-24 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <Badge
            variant="secondary"
            className="mb-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Next-Generation Life OS
          </Badge>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight font-mono">
            Meet ASTRA
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-6 leading-relaxed max-w-4xl mx-auto">
            The modular digital assistant that manages every aspect of your life with AI-powered intelligence.
          </p>

          <div className="mb-12 p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl border border-cyan-500/20 backdrop-blur-sm max-w-2xl mx-auto">
            <p className="text-sm text-cyan-300 mb-2 font-mono">ASTRA PROTOCOL:</p>
            <p className="text-lg font-semibold text-white">
              <span className="text-cyan-400">A</span>ssistant for <span className="text-cyan-400">S</span>cheduling,{" "}
              <span className="text-cyan-400">T</span>asks, <span className="text-cyan-400">R</span>outines &{" "}
              <span className="text-cyan-400">A</span>nalytics
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-10 py-4 rounded-full shadow-2xl shadow-cyan-500/25 border border-cyan-400/20"
              >
                Initialize ASTRA
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-4 rounded-full bg-slate-800/50 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/50 backdrop-blur-sm"
            >
              Neural Demo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20 group-hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-sm">
                  <stat.icon className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Holographic rings */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cyan-500/20 rounded-full animate-spin"
            style={{ animationDuration: "20s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-blue-500/20 rounded-full animate-spin"
            style={{ animationDuration: "15s", animationDirection: "reverse" }}
          ></div>

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30"
            >
              <Brain className="w-4 h-4 mr-2" />
              Modular Architecture
            </Badge>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Neural Life Management
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Like quantum processors for your digital existence. Each module operates independently while sharing
              intelligence across your entire life ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreModules.map((module) => (
              <Card
                key={module.id}
                className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm group ${hoveredFeature === module.id ? "ring-2 ring-cyan-500/50 border-cyan-500/30" : ""
                  }`}
                onMouseEnter={() => setHoveredFeature(module.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${module.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                    >
                      <module.icon className="w-7 h-7 text-white" />
                    </div>
                    {module.isPro && (
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Neural+
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-cyan-300 transition-colors">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-base text-slate-400 group-hover:text-slate-300 transition-colors">
                    {module.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  <div className="space-y-3">
                    {module.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-slate-400 group-hover:text-slate-300 transition-colors"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mr-3 animate-pulse" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-16">
            <Badge
              variant="secondary"
              className="mb-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30"
            >
              <Brain className="w-4 h-4 mr-2" />
              Quantum Intelligence
            </Badge>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Neural Life Assistant
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              ASTRA's quantum neural networks learn your behavioral patterns and optimize every decision across your
              digital existence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 group-hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                <Zap className="w-10 h-10 text-blue-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-cyan-300 transition-colors">
                Quantum Automation
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                Neural pathways automate complex workflows and predict optimal decisions before you even think of them.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20 group-hover:border-purple-400/40 transition-all duration-300 backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-purple-500/20">
                <BarChart3 className="w-10 h-10 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-purple-300 transition-colors">
                Dimensional Analytics
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                Multi-dimensional life scoring with predictive modeling and quantum-level behavioral insights.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 group-hover:border-emerald-400/40 transition-all duration-300 backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-emerald-500/20">
                <Shield className="w-10 h-10 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-emerald-300 transition-colors">
                Quantum Encryption
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                Military-grade quantum encryption with distributed processing ensures your neural data remains
                sovereign.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)]"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Initialize Your Neural Evolution
          </h2>
          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Join the quantum leap in personal optimization. Thousands have already transcended traditional productivity
            limits with ASTRA's neural architecture.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-12 py-4 rounded-full shadow-2xl shadow-cyan-500/25 border border-cyan-400/20"
              >
                Begin Neural Sync
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-12 py-4 rounded-full bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 backdrop-blur-sm"
            >
              <Link href="/pricing">Quantum Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <AstraLogo className="mb-4 md:mb-0 text-cyan-400" />

            <div className="text-sm text-slate-400">
              © 2024 ASTRA Neural Systems. Quantum-powered life optimization for the digital age.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
