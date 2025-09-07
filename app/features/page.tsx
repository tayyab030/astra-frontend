"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DollarSign,
    Heart,
    CheckSquare,
    BookOpen,
    Mail,
    BarChart3,
    Bot,
    Zap,
    Shield,
    Calendar,
    Target,
    Brain,
    Smartphone,
    Globe,
    Star,
    Sparkles,
    Activity,
    TrendingUp,
    MessageSquare,
    Clock,
    Database,
    Mic,
    Volume2,
} from "lucide-react"

export default function FeaturesPage() {
    const [activeModule, setActiveModule] = useState("core")

    const coreFeatures = [
        {
            icon: Shield,
            title: "Authentication & Authorization",
            description: "Secure login/signup with free vs pro tiers",
            status: "live",
        },
        {
            icon: Star,
            title: "Subscription Plans",
            description: "Free, Starter, and Pro plans with scalable features",
            status: "live",
        },
        {
            icon: Database,
            title: "REST API",
            description: "Robust API with future GraphQL support",
            status: "planned",
        },
        {
            icon: Zap,
            title: "Smart Notifications",
            description: "Web, email, and push notifications",
            status: "live",
        },
    ]

    const wealthFeatures = [
        {
            icon: DollarSign,
            title: "Expense & Income Tracking",
            description: "Real-time financial monitoring and categorization",
            status: "live",
        },
        {
            icon: Target,
            title: "Budgeting & Savings Goals",
            description: "Smart budget planning with automated goal tracking",
            status: "live",
        },
        {
            icon: TrendingUp,
            title: "Investment Log",
            description: "Portfolio tracking with performance analytics",
            status: "beta",
        },
        {
            icon: Brain,
            title: "Waste Detector",
            description: "AI-powered spending analysis and optimization",
            status: "beta",
        },
    ]

    const healthFeatures = [
        {
            icon: Heart,
            title: "Habit Tracker",
            description: "Daily routines with streak tracking and insights",
            status: "live",
        },
        {
            icon: Activity,
            title: "Exercise & Workout Log",
            description: "Comprehensive fitness tracking and progress monitoring",
            status: "live",
        },
        {
            icon: Sparkles,
            title: "Nutrition & Water Intake",
            description: "Smart nutrition logging with health recommendations",
            status: "beta",
        },
        {
            icon: Clock,
            title: "Sleep Analytics",
            description: "Sleep pattern analysis with optimization suggestions",
            status: "beta",
        },
    ]

    const productivityFeatures = [
        {
            icon: CheckSquare,
            title: "Task Manager",
            description: "Priority-based task management with smart deadlines",
            status: "live",
        },
        {
            icon: Calendar,
            title: "Calendar Integration",
            description: "Seamless calendar sync with intelligent scheduling",
            status: "live",
        },
        {
            icon: Target,
            title: "Goal Tracking",
            description: "Short and long-term goal management with milestones",
            status: "live",
        },
        {
            icon: Clock,
            title: "Focus Timer",
            description: "Pomodoro technique with productivity analytics",
            status: "beta",
        },
    ]

    const knowledgeFeatures = [
        {
            icon: BookOpen,
            title: "Notes & Journaling",
            description: "Markdown-supported note-taking with smart organization",
            status: "live",
        },
        {
            icon: Brain,
            title: "Book Summaries",
            description: "AI-generated summaries with key insights extraction",
            status: "beta",
        },
        {
            icon: Database,
            title: "Knowledge Base",
            description: "Organized learning repository with smart search",
            status: "live",
        },
        {
            icon: Sparkles,
            title: "Smart Search",
            description: "AI-powered search across all your data",
            status: "beta",
        },
    ]

    const communicationFeatures = [
        {
            icon: Mail,
            title: "Email Rules",
            description: "Auto-delete, mute, and smart notification management",
            status: "pro",
        },
        {
            icon: Zap,
            title: "Smart Alerts",
            description: "Priority-based alerts for important communications",
            status: "pro",
        },
        {
            icon: MessageSquare,
            title: "Inbox Summaries",
            description: "AI-generated email summaries and insights",
            status: "pro",
        },
    ]

    const analyticsFeatures = [
        {
            icon: BarChart3,
            title: "Daily Dashboard",
            description: "Today's tasks, habits, and spending overview",
            status: "live",
        },
        {
            icon: TrendingUp,
            title: "Weekly Insights",
            description: "Comprehensive charts and trend analysis",
            status: "live",
        },
        {
            icon: Activity,
            title: "Monthly Reports",
            description: "Detailed monthly trends and performance reports",
            status: "live",
        },
        {
            icon: Star,
            title: "Life Score",
            description: "Combined health, wealth, and productivity metric",
            status: "live",
        },
    ]

    const assistantFeatures = [
        {
            icon: Bot,
            title: "Text Commands",
            description: "Natural language task management and queries",
            status: "live",
        },
        {
            icon: Volume2,
            title: "Voice Output (TTS)",
            description: "Text-to-speech for hands-free interaction",
            status: "beta",
        },
        {
            icon: Mic,
            title: "Voice Input",
            description: "Speech-to-text for voice commands",
            status: "planned",
        },
        {
            icon: Sparkles,
            title: "AI Add-ons",
            description: "Smart summaries, insights, and habit recommendations",
            status: "beta",
        },
    ]

    const futureModules = [
        {
            icon: Globe,
            title: "Lifestyle Module",
            description: "Travel log, shopping wishlist, bills & utilities management",
            status: "planned",
        },
        {
            icon: TrendingUp,
            title: "Career Module",
            description: "Job applications, learning tracker, resume vault",
            status: "planned",
        },
        {
            icon: Heart,
            title: "Mental Health Module",
            description: "Mood journal, gratitude log, stress tracker",
            status: "planned",
        },
        {
            icon: Smartphone,
            title: "Digital Life Module",
            description: "Subscription tracker, password vault, digital cleanup",
            status: "planned",
        },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case "live":
                return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
            case "beta":
                return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
            case "pro":
                return "bg-purple-500/20 text-purple-300 border-purple-500/30"
            case "planned":
                return "bg-slate-500/20 text-slate-300 border-slate-500/30"
            default:
                return "bg-slate-500/20 text-slate-300 border-slate-500/30"
        }
    }

    const FeatureCard = ({ feature }: { feature: any }) => (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                            <feature.icon className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                            <CardTitle className="text-white font-mono text-sm">{feature.title}</CardTitle>
                        </div>
                    </div>
                    <Badge className={`text-xs font-mono ${getStatusColor(feature.status)}`}>{feature.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <CardDescription className="text-slate-300 font-mono text-xs leading-relaxed">
                    {feature.description}
                </CardDescription>
            </CardContent>
        </Card>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-mono relative overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
                        backgroundSize: "50px 50px",
                        animation: "grid-move 20s linear infinite",
                    }}
                />
            </div>

            {/* Floating Orbs */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000" />
            <div className="absolute bottom-32 left-32 w-28 h-28 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse delay-2000" />

            {/* Holographic Rings */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-cyan-500/20 rounded-full animate-spin-slow" />
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 border border-purple-500/20 rounded-full animate-spin-slow-reverse" />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${10 + Math.random() * 20}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                        <Sparkles className="h-4 w-4 text-cyan-400" />
                        <span className="text-cyan-300 text-sm font-mono">ASTRA Features</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Life OS Features
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Your personal digital assistant that manages every aspect of life — Wealth, Health, Work, Knowledge,
                        Communication & More.
                    </p>
                </div>

                {/* Feature Categories */}
                <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 mb-12">
                        <TabsTrigger
                            value="core"
                            className="font-mono text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                        >
                            Core
                        </TabsTrigger>
                        <TabsTrigger
                            value="wealth"
                            className="font-mono text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                        >
                            Wealth
                        </TabsTrigger>
                        <TabsTrigger
                            value="health"
                            className="font-mono text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                        >
                            Health
                        </TabsTrigger>
                        <TabsTrigger
                            value="productivity"
                            className="font-mono text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                        >
                            Work
                        </TabsTrigger>
                        <TabsTrigger
                            value="knowledge"
                            className="font-mono text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                        >
                            Knowledge
                        </TabsTrigger>
                        <TabsTrigger
                            value="communication"
                            className="font-mono text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                        >
                            Comm
                        </TabsTrigger>
                        <TabsTrigger
                            value="analytics"
                            className="font-mono text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                        >
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger
                            value="assistant"
                            className="font-mono text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                        >
                            AI
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="core" className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Core Foundations</h2>
                            <p className="text-slate-300">Essential infrastructure and security features</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {coreFeatures.map((feature, index) => (
                                <FeatureCard key={index} feature={feature} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="wealth" className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Wealth Management</h2>
                            <p className="text-slate-300">Complete financial tracking and optimization</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {wealthFeatures.map((feature, index) => (
                                <FeatureCard key={index} feature={feature} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="health" className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Health & Wellness</h2>
                            <p className="text-slate-300">Comprehensive health tracking and optimization</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {healthFeatures.map((feature, index) => (
                                <FeatureCard key={index} feature={feature} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="productivity" className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Work & Productivity</h2>
                            <p className="text-slate-300">Advanced task management and goal tracking</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {productivityFeatures.map((feature, index) => (
                                <FeatureCard key={index} feature={feature} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="knowledge" className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Knowledge & Notes</h2>
                            <p className="text-slate-300">Intelligent note-taking and knowledge management</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {knowledgeFeatures.map((feature, index) => (
                                <FeatureCard key={index} feature={feature} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="communication" className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Communication (Pro)</h2>
                            <p className="text-slate-300">Smart email management and communication tools</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {communicationFeatures.map((feature, index) => (
                                <FeatureCard key={index} feature={feature} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Analytics Dashboard</h2>
                            <p className="text-slate-300">Comprehensive insights and performance tracking</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {analyticsFeatures.map((feature, index) => (
                                <FeatureCard key={index} feature={feature} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="assistant" className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-2">AI Assistant</h2>
                            <p className="text-slate-300">Intelligent automation and voice interaction</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {assistantFeatures.map((feature, index) => (
                                <FeatureCard key={index} feature={feature} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Future Modules */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-cyan-400 mb-4">Future Modules</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto">
                            Upcoming modular expansions to make ASTRA your complete Life OS
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {futureModules.map((feature, index) => (
                            <FeatureCard key={index} feature={feature} />
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-20 text-center">
                    <Card className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm border-cyan-500/20 max-w-4xl mx-auto">
                        <CardContent className="p-12">
                            <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Life?</h3>
                            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                                Join thousands of users who have revolutionized their productivity, health, and wealth with ASTRA Life
                                OS.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-mono px-8 py-3">
                                    Start Free Trial
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 font-mono px-8 py-3 bg-transparent"
                                >
                                    View Pricing
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
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
          50% { transform: translateY(-100px) translateX(50px); opacity: 1; }
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
      `}</style>
        </div>
    )
}
