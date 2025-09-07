"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  Heart,
  CheckSquare,
  BarChart3,
  Bot,
  Star,
  Globe,
  Rocket,
  Target,
  DollarSign,
  BookOpen,
  Calendar,
  Mic,
  Volume2,
  MessageSquare,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const features = [
    { icon: DollarSign, title: "Wealth Management", description: "Track expenses, investments & financial goals" },
    { icon: Heart, title: "Health & Wellness", description: "Monitor habits, exercise, nutrition & sleep" },
    { icon: CheckSquare, title: "Productivity Hub", description: "Manage tasks, goals & time efficiently" },
    { icon: BookOpen, title: "Knowledge Base", description: "Notes, journaling & learning tracker" },
    { icon: BarChart3, title: "Analytics Dashboard", description: "Insights, trends & life score metrics" },
    { icon: Bot, title: "AI Assistant", description: "Voice commands & intelligent automation" },
  ]

  const stats = [
    { value: "10K+", label: "Active Users", icon: Star },
    { value: "50M+", label: "Tasks Completed", icon: CheckSquare },
    { value: "99.9%", label: "Uptime", icon: Zap },
    { value: "4.9/5", label: "User Rating", icon: Heart },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-mono relative overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-300">
                <Sparkles className="h-6 w-6 text-cyan-400 group-hover:animate-spin" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ASTRA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/product"
                className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-mono text-sm tracking-wider"
              >
                PRODUCT
              </Link>
              <Link
                href="/features"
                className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-mono text-sm tracking-wider"
              >
                FEATURES
              </Link>
              <a
                href="#pricing"
                className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-mono text-sm tracking-wider"
              >
                PRICING
              </a>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-full font-mono text-sm transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
              >
                SIGN UP
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800/50 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 text-cyan-400" /> : <Menu className="h-5 w-5 text-cyan-400" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-cyan-500/20">
              <div className="flex flex-col gap-4">
                <Link
                  href="/product"
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-mono text-sm tracking-wider py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  PRODUCT
                </Link>
                <Link
                  href="/features"
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-mono text-sm tracking-wider py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  FEATURES
                </Link>
                <a
                  href="#pricing"
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-mono text-sm tracking-wider py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  PRICING
                </a>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-full font-mono text-sm transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 text-center mt-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SIGN UP
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Animated Background Grid */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px),
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px, 50px 50px, 100px 100px, 100px 100px",
            animation: "grid-move 20s linear infinite, grid-pulse 4s ease-in-out infinite",
          }}
        />
      </div>

      {/* Dynamic Mouse-Following Orb */}
      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Multiple Floating Orbs with Enhanced Animation */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse-slow" />
      <div className="absolute top-40 right-32 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse-slow delay-1000" />
      <div className="absolute bottom-32 left-32 w-36 h-36 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl animate-pulse-slow delay-2000" />
      <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-2xl animate-pulse-slow delay-3000" />

      {/* Multiple Holographic Rings */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 border border-cyan-500/20 rounded-full animate-spin-slow" />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 border border-cyan-500/10 rounded-full animate-spin-slow delay-1000" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 border border-purple-500/20 rounded-full animate-spin-slow-reverse" />
      <div className="absolute bottom-1/3 left-1/3 w-56 h-56 border border-purple-500/10 rounded-full animate-spin-slow-reverse delay-2000" />

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float ${i % 4 === 0
                ? "w-2 h-2 bg-cyan-400/60"
                : i % 4 === 1
                  ? "w-1 h-1 bg-purple-400/60"
                  : i % 4 === 2
                    ? "w-1.5 h-1.5 bg-emerald-400/60"
                    : "w-1 h-1 bg-pink-400/60"
              }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 25}s`,
            }}
          />
        ))}
      </div>

      {/* Pulsing Energy Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-pulse-line" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-500/30 to-transparent animate-pulse-line delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20 pt-32">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-8 backdrop-blur-sm animate-glow">
            <Sparkles className="h-5 w-5 text-cyan-400 animate-spin-slow" />
            <span className="text-cyan-300 text-sm font-mono tracking-wider">INTRODUCING ASTRA</span>
            <Sparkles className="h-5 w-5 text-cyan-400 animate-spin-slow" />
          </div>

          <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Life OS
            </span>
            <br />
            <span className="text-white animate-fade-in-up delay-500">Reimagined</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12 animate-fade-in-up delay-1000">
            Your personal digital assistant that manages every aspect of life —
            <span className="text-cyan-400 font-semibold"> Wealth</span>,
            <span className="text-emerald-400 font-semibold"> Health</span>,
            <span className="text-purple-400 font-semibold"> Work</span>,
            <span className="text-pink-400 font-semibold"> Knowledge</span>, and
            <span className="text-yellow-400 font-semibold"> More</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up delay-1500">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-mono px-10 py-4 text-lg rounded-full shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 group">
              <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 font-mono px-10 py-4 text-lg rounded-full bg-transparent backdrop-blur-sm hover:border-cyan-400 transition-all duration-300"
            >
              <Globe className="mr-2 h-5 w-5" />
              Explore Features
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up delay-2000">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="bg-slate-800/30 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400 font-mono">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dynamic Feature Showcase */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Everything You Need,
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                All in One
              </span>
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Six powerful modules working together to transform your digital life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`bg-slate-800/40 backdrop-blur-sm border transition-all duration-500 cursor-pointer group hover:scale-105 ${currentFeature === index
                    ? "border-cyan-400/60 shadow-2xl shadow-cyan-500/20 bg-slate-800/60"
                    : "border-cyan-500/20 hover:border-cyan-400/40"
                  }`}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`p-4 rounded-2xl mx-auto mb-6 w-fit transition-all duration-300 ${currentFeature === index
                        ? "bg-cyan-500/20 scale-110"
                        : "bg-cyan-500/10 group-hover:bg-cyan-500/20"
                      }`}
                  >
                    <feature.icon
                      className={`h-8 w-8 transition-all duration-300 ${currentFeature === index ? "text-cyan-300" : "text-cyan-400"
                        }`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-mono">{feature.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI-Powered Section */}
        <div className="mb-20">
          <Card className="bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 backdrop-blur-sm border-cyan-500/30 max-w-6xl mx-auto overflow-hidden">
            <CardContent className="p-12 md:p-16 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-8">
                  <Brain className="h-6 w-6 text-purple-400 animate-pulse" />
                  <span className="text-purple-300 font-mono tracking-wider">AI-POWERED</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Intelligence That
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {" "}
                    Learns
                  </span>
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                  ASTRA's AI assistant understands your patterns, predicts your needs, and automates your routine tasks.
                  Experience the future of personal productivity.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm">
                    <Mic className="mr-2 h-4 w-4" />
                    Voice Commands
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm">
                    <Volume2 className="mr-2 h-4 w-4" />
                    Text-to-Speech
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Smart Insights
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm">
                    <Target className="mr-2 h-4 w-4" />
                    Predictive Analytics
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Choose Your
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Plan</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include core features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-slate-800/40 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                  <div className="text-3xl font-bold text-cyan-400 mb-1">Free</div>
                  <p className="text-slate-400 text-sm">Forever</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <CheckSquare className="h-4 w-4 text-cyan-400 mr-3" />
                    Basic task management
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckSquare className="h-4 w-4 text-cyan-400 mr-3" />
                    Simple expense tracking
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckSquare className="h-4 w-4 text-cyan-400 mr-3" />
                    Basic analytics
                  </li>
                </ul>
                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">Get Started</Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-b from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border-cyan-400/40 hover:border-cyan-300/60 transition-all duration-300 scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1">Most Popular</Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                  <div className="text-3xl font-bold text-cyan-400 mb-1">$19</div>
                  <p className="text-slate-400 text-sm">per month</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <CheckSquare className="h-4 w-4 text-cyan-400 mr-3" />
                    All Starter features
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckSquare className="h-4 w-4 text-cyan-400 mr-3" />
                    Advanced AI assistant
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckSquare className="h-4 w-4 text-cyan-400 mr-3" />
                    Investment tracking
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckSquare className="h-4 w-4 text-cyan-400 mr-3" />
                    Health monitoring
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-slate-800/40 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold text-cyan-400 mb-1">$49</div>
                  <p className="text-slate-400 text-sm">per month</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <CheckSquare className="h-4 w-4 text-cyan-400 mr-3" />
                    All Pro features
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckSquare className="h-4 w-4 text-cyan-400 mr-3" />
                    Custom integrations
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckSquare className="h-4 w-4 text-cyan-400 mr-3" />
                    Priority support
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckSquare className="h-4 w-4 text-cyan-400 mr-3" />
                    Advanced analytics
                  </li>
                </ul>
                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm border-cyan-500/30 max-w-5xl mx-auto overflow-hidden">
            <CardContent className="p-12 md:p-16 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Transform
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {" "}
                    Your Life?
                  </span>
                </h3>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
                  Join thousands of users who have revolutionized their productivity, health, and wealth with ASTRA Life
                  OS. Start your journey to a more organized, efficient, and fulfilling life.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-mono px-12 py-4 text-lg rounded-full shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 group">
                    <Zap className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 font-mono px-12 py-4 text-lg rounded-full bg-transparent backdrop-blur-sm hover:border-cyan-400 transition-all duration-300"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Demo
                  </Button>
                </div>
                <p className="text-sm text-slate-400 mt-6 font-mono">
                  No credit card required • 14-day free trial • Cancel anytime
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Simplified footer */}
      <footer className="relative z-10 bg-slate-900/80 backdrop-blur-md border-t border-cyan-500/20 mt-20">
        <div className="container mx-auto px-6 py-8">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-300">
                <Sparkles className="h-6 w-6 text-cyan-400 group-hover:animate-spin" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ASTRA
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
            <Link
              href="/product"
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-mono text-sm tracking-wider"
            >
              PRODUCT
            </Link>
            <Link
              href="/features"
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-mono text-sm tracking-wider"
            >
              FEATURES
            </Link>
            <a
              href="#pricing"
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-mono text-sm tracking-wider"
            >
              PRICING
            </a>
            <Link
              href="/signup"
              className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-mono text-sm tracking-wider"
            >
              SIGN UP
            </Link>
          </div>

          {/* Bottom Section */}
          <div className="pt-6 border-t border-cyan-500/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-slate-400 text-sm font-mono">© 2024 ASTRA Life OS. All rights reserved.</div>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm font-mono"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm font-mono"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm font-mono"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          25% { transform: translateY(-50px) translateX(25px); opacity: 0.7; }
          50% { transform: translateY(-100px) translateX(50px); opacity: 1; }
          75% { transform: translateY(-150px) translateX(75px); opacity: 0.7; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.6); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-line {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }
        .animate-pulse-line {
          animation: pulse-line 4s ease-in-out infinite;
        }
        .delay-500 { animation-delay: 0.5s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-1500 { animation-delay: 1.5s; }
        .delay-2000 { animation-delay: 2s; }
        .delay-3000 { animation-delay: 3s; }
      `}</style>
    </div>
  )
}
