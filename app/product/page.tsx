"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Brain, Target, TrendingUp, Users } from "lucide-react"

export default function ProductPage() {
    const [selectedPlan, setSelectedPlan] = useState("pro")

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-mono relative overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
            </div>

            {/* Floating Orbs */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000" />
            <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse delay-2000" />

            {/* Holographic Rings */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-cyan-500/30 rounded-full animate-spin-slow" />
            <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-purple-500/30 rounded-full animate-spin-slow-reverse" />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-cyan-500/20 text-cyan-100 border-cyan-500/30">ASTRA Life OS v2.0</Badge>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-cyan-100">
                        Your Digital Life,
                        <br />
                        <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                            Perfectly Orchestrated
                        </span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                        ASTRA is the ultimate personal digital assistant that unifies wealth management, health tracking,
                        productivity tools, and AI-powered insights into one seamless experience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 text-lg">
                            Start Free Trial
                        </Button>
                        <Button
                            variant="outline"
                            className="border-cyan-500/50 text-cyan-100 hover:bg-cyan-500/10 px-8 py-3 text-lg bg-transparent"
                        >
                            Watch Demo
                        </Button>
                    </div>
                </div>

                {/* Key Benefits */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
                        <CardHeader>
                            <Brain className="w-12 h-12 text-cyan-400 mb-4" />
                            <CardTitle className="text-cyan-100">AI-Powered Intelligence</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-300">
                                Advanced AI analyzes your patterns and provides personalized insights to optimize every aspect of your
                                life.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
                        <CardHeader>
                            <Target className="w-12 h-12 text-purple-400 mb-4" />
                            <CardTitle className="text-purple-100">Unified Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-300">
                                All your life metrics in one place - wealth, health, productivity, and goals seamlessly integrated.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-emerald-500/30 backdrop-blur-sm">
                        <CardHeader>
                            <TrendingUp className="w-12 h-12 text-emerald-400 mb-4" />
                            <CardTitle className="text-emerald-100">Continuous Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-300">
                                Track progress across all life areas with detailed analytics and actionable recommendations.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Feature Highlights */}
                <div className="mb-16">
                    <h2 className="text-4xl font-bold text-center mb-12 text-cyan-100">Everything You Need to Thrive</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: "💰", title: "Wealth Management", desc: "Budget tracking, investments, financial goals" },
                            { icon: "🏃", title: "Health & Wellness", desc: "Fitness tracking, nutrition, sleep optimization" },
                            { icon: "⚡", title: "Productivity Suite", desc: "Tasks, calendar, focus timer, goal tracking" },
                            { icon: "🧠", title: "Knowledge Base", desc: "Notes, journaling, book summaries, insights" },
                            { icon: "📧", title: "Smart Communication", desc: "Email automation, smart alerts, summaries" },
                            { icon: "📊", title: "Life Analytics", desc: "Daily insights, weekly reports, life score" },
                            { icon: "🤖", title: "AI Assistant", desc: "Voice commands, smart suggestions, automation" },
                            { icon: "🔒", title: "Privacy First", desc: "End-to-end encryption, local data processing" },
                        ].map((feature, index) => (
                            <Card
                                key={index}
                                className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300"
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="text-3xl mb-3">{feature.icon}</div>
                                    <h3 className="font-semibold text-cyan-100 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-400">{feature.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="mb-16">
                    <h2 className="text-4xl font-bold text-center mb-12 text-cyan-100">Choose Your Plan</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Plan */}
                        <Card
                            className={`bg-slate-800/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 ${selectedPlan === "free" ? "border-cyan-500/50 scale-105" : ""}`}
                        >
                            <CardHeader>
                                <CardTitle className="text-slate-200">Free</CardTitle>
                                <CardDescription className="text-slate-400">Perfect for getting started</CardDescription>
                                <div className="text-3xl font-bold text-cyan-100">
                                    $0<span className="text-lg text-slate-400">/month</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 mb-6">
                                    {[
                                        "Basic task management",
                                        "Simple expense tracking",
                                        "Health metrics logging",
                                        "Limited AI insights",
                                        "Community support",
                                    ].map((feature, index) => (
                                        <li key={index} className="flex items-center text-slate-300">
                                            <Check className="w-4 h-4 text-cyan-400 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant={selectedPlan === "free" ? "default" : "outline"}
                                    className={
                                        selectedPlan === "free" ? "bg-cyan-500 hover:bg-cyan-600" : "border-slate-600 text-slate-300"
                                    }
                                    onClick={() => setSelectedPlan("free")}
                                >
                                    Get Started Free
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Pro Plan */}
                        <Card
                            className={`bg-slate-800/50 border-cyan-500/50 backdrop-blur-sm transition-all duration-300 relative ${selectedPlan === "pro" ? "scale-105" : ""}`}
                        >
                            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                                Most Popular
                            </Badge>
                            <CardHeader>
                                <CardTitle className="text-cyan-100">Pro</CardTitle>
                                <CardDescription className="text-slate-400">For serious life optimization</CardDescription>
                                <div className="text-3xl font-bold text-cyan-100">
                                    $19<span className="text-lg text-slate-400">/month</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 mb-6">
                                    {[
                                        "Advanced AI insights & automation",
                                        "Unlimited tracking & analytics",
                                        "Investment portfolio management",
                                        "Smart goal recommendations",
                                        "Priority support",
                                        "API access & integrations",
                                    ].map((feature, index) => (
                                        <li key={index} className="flex items-center text-slate-300">
                                            <Check className="w-4 h-4 text-cyan-400 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 w-full"
                                    onClick={() => setSelectedPlan("pro")}
                                >
                                    Start Pro Trial
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Enterprise Plan */}
                        <Card
                            className={`bg-slate-800/50 border-purple-500/50 backdrop-blur-sm transition-all duration-300 ${selectedPlan === "enterprise" ? "border-purple-500/50 scale-105" : ""}`}
                        >
                            <CardHeader>
                                <CardTitle className="text-purple-100">Enterprise</CardTitle>
                                <CardDescription className="text-slate-400">For teams and organizations</CardDescription>
                                <div className="text-3xl font-bold text-purple-100">
                                    $49<span className="text-lg text-slate-400">/month</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 mb-6">
                                    {[
                                        "Everything in Pro",
                                        "Team collaboration features",
                                        "Advanced security & compliance",
                                        "Custom integrations",
                                        "Dedicated account manager",
                                        "White-label options",
                                    ].map((feature, index) => (
                                        <li key={index} className="flex items-center text-slate-300">
                                            <Check className="w-4 h-4 text-purple-400 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant={selectedPlan === "enterprise" ? "default" : "outline"}
                                    className={
                                        selectedPlan === "enterprise"
                                            ? "bg-purple-500 hover:bg-purple-600"
                                            : "border-slate-600 text-slate-300"
                                    }
                                    onClick={() => setSelectedPlan("enterprise")}
                                >
                                    Contact Sales
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-cyan-100">Trusted by Life Optimizers</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Chen",
                                role: "Entrepreneur",
                                content:
                                    "ASTRA transformed how I manage my business and personal life. The AI insights are incredibly accurate.",
                                rating: 5,
                            },
                            {
                                name: "Marcus Rodriguez",
                                role: "Software Engineer",
                                content:
                                    "Finally, a tool that understands the complexity of modern life. The automation features save me hours daily.",
                                rating: 5,
                            },
                            {
                                name: "Dr. Emily Watson",
                                role: "Healthcare Professional",
                                content:
                                    "The health tracking integration is phenomenal. It's like having a personal life coach powered by AI.",
                                rating: 5,
                            },
                        ].map((testimonial, index) => (
                            <Card key={index} className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-slate-300 mb-4 italic">"{testimonial.content}"</p>
                                    <div>
                                        <p className="font-semibold text-cyan-100">{testimonial.name}</p>
                                        <p className="text-sm text-slate-400">{testimonial.role}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm max-w-4xl mx-auto">
                        <CardContent className="p-12">
                            <h2 className="text-4xl font-bold mb-4 text-cyan-100">Ready to Transform Your Life?</h2>
                            <p className="text-xl text-slate-300 mb-8">
                                Join thousands of users who have already optimized their lives with ASTRA. Start your free trial today
                                and experience the future of personal management.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 text-lg">
                                    <Zap className="w-5 h-5 mr-2" />
                                    Start Free Trial
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-cyan-500/50 text-cyan-100 hover:bg-cyan-500/10 px-8 py-3 text-lg bg-transparent"
                                >
                                    <Users className="w-5 h-5 mr-2" />
                                    Schedule Demo
                                </Button>
                            </div>
                            <p className="text-sm text-slate-400 mt-4">
                                No credit card required • 14-day free trial • Cancel anytime
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}
