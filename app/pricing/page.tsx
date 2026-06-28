"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Star,
  Zap,
  Brain,
  ArrowRight,
  Sparkles,
  Crown,
} from "lucide-react";
import { AstraLogo } from "@/components/astra-logo";
import { ROUTES } from "@/constants/routes";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started with ASTRA",
      price: { monthly: 0, annual: 0 },
      badge: null,
      icon: Sparkles,
      gradient: "from-slate-600 to-slate-700",
      features: [
        "Basic Task Management",
        "Simple Note Taking",
        "Basic Health Tracking",
        "Limited AI Insights",
        "5 Goals Maximum",
        "Basic Analytics",
        "Community Support",
      ],
      limitations: [
        "No Advanced AI Features",
        "Limited Integrations",
        "Basic Reporting Only",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Starter",
      description: "Enhanced productivity for serious users",
      price: { monthly: 9, annual: 7 },
      badge: "Most Popular",
      icon: Zap,
      gradient: "from-cyan-500 to-blue-600",
      features: [
        "Everything in Free",
        "Advanced Task Management",
        "Smart Goal Tracking",
        "Enhanced Health Analytics",
        "AI-Powered Insights",
        "Unlimited Goals",
        "Advanced Analytics",
        "Email Support",
        "Calendar Integration",
        "Basic Automation",
      ],
      limitations: ["Limited AI Assistant Usage", "Basic Integrations Only"],
      cta: "Choose Starter",
      popular: true,
    },
    {
      name: "Pro",
      description: "Complete life optimization with full AI power",
      price: { monthly: 19, annual: 15 },
      badge: "Neural+",
      icon: Crown,
      gradient: "from-purple-500 to-pink-600",
      features: [
        "Everything in Starter",
        "Full AI Assistant Access",
        "Smart Email Management",
        "Advanced Automation",
        "All Integrations",
        "Predictive Analytics",
        "Custom Workflows",
        "Priority Support",
        "Advanced Reporting",
        "API Access",
        "White-label Options",
        "Neural Life Score",
      ],
      limitations: [],
      cta: "Go Neural+",
      popular: false,
    },
  ];

  const features = [
    {
      category: "Core Modules",
      items: [
        {
          name: "Task Management",
          free: "Basic",
          starter: "Advanced",
          pro: "Neural+",
        },
        {
          name: "Goal Tracking",
          free: "5 Goals",
          starter: "Unlimited",
          pro: "Unlimited + AI",
        },
        {
          name: "Health Tracking",
          free: "Basic",
          starter: "Enhanced",
          pro: "Complete",
        },
        {
          name: "Wealth Management",
          free: "Basic",
          starter: "Advanced",
          pro: "AI-Powered",
        },
        {
          name: "Notes & Knowledge",
          free: "Simple",
          starter: "Smart",
          pro: "Neural Search",
        },
        { name: "Communication", free: "❌", starter: "❌", pro: "✅" },
      ],
    },
    {
      category: "AI Features",
      items: [
        {
          name: "AI Insights",
          free: "Limited",
          starter: "Enhanced",
          pro: "Full Access",
        },
        {
          name: "Smart Automation",
          free: "❌",
          starter: "Basic",
          pro: "Advanced",
        },
        { name: "Predictive Analytics", free: "❌", starter: "❌", pro: "✅" },
        { name: "Neural Life Score", free: "❌", starter: "❌", pro: "✅" },
      ],
    },
    {
      category: "Integrations",
      items: [
        { name: "Calendar Sync", free: "❌", starter: "✅", pro: "✅" },
        {
          name: "Email Integration",
          free: "❌",
          starter: "Basic",
          pro: "Advanced",
        },
        {
          name: "Third-party Apps",
          free: "❌",
          starter: "Limited",
          pro: "All",
        },
        { name: "API Access", free: "❌", starter: "❌", pro: "✅" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30"
            >
              <Brain className="w-4 h-4 mr-2" />
              Neural Pricing Matrix
            </Badge>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight font-mono">
              Choose Your Neural Level
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Unlock the full potential of your digital existence with ASTRA's
              quantum-powered life optimization system.
            </p>

            <div className="flex items-center justify-center mb-12">
              <span
                className={`text-sm font-medium mr-3 ${!isAnnual ? "text-cyan-400" : "text-slate-400"
                  }`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAnnual
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                  : "bg-slate-600"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
              <span
                className={`text-sm font-medium ml-3 ${isAnnual ? "text-cyan-400" : "text-slate-400"
                  }`}
              >
                Annual
              </span>
              {isAnnual && (
                <Badge className="ml-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30">
                  Save 20%
                </Badge>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${plan.popular
                  ? "ring-2 ring-cyan-500/50 border-cyan-500/30 shadow-2xl shadow-cyan-500/10"
                  : "border-slate-600/50"
                  } bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                />

                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="relative text-center pb-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>

                  <CardTitle className="text-2xl text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-slate-400 mb-6">
                    {plan.description}
                  </CardDescription>

                  <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-2">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                      {plan.price.monthly > 0 && (
                        <span className="text-lg text-slate-400 font-normal">
                          /month
                        </span>
                      )}
                    </div>
                    {isAnnual && plan.price.monthly > 0 && (
                      <div className="text-sm text-slate-400">
                        Billed annually (${plan.price.annual * 12}/year)
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  <Link href={ROUTES.AUTH.LOGIN}>
                    <Button
                      className={`w-full mb-6 ${plan.popular
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25"
                        : "bg-slate-700 hover:bg-slate-600 text-white"
                        } rounded-full py-3`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm text-slate-300"
                      >
                        <Check className="w-4 h-4 text-emerald-400 mr-3 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-slate-600/50">
                      <div className="text-xs text-slate-500 mb-2">
                        Limitations:
                      </div>
                      {plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="text-xs text-slate-500 mb-1">
                          • {limitation}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Feature Comparison Matrix
            </h2>

            <div className="overflow-x-auto">
              <div className="min-w-full bg-slate-800/50 rounded-2xl border border-slate-600/50 backdrop-blur-sm">
                {features.map((category, categoryIdx) => (
                  <div key={category.category}>
                    <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 px-6 py-4 border-b border-slate-600/50">
                      <h3 className="text-lg font-semibold text-cyan-300">
                        {category.category}
                      </h3>
                    </div>

                    {category.items.map((item, itemIdx) => (
                      <div
                        key={item.name}
                        className={`grid grid-cols-4 gap-4 px-6 py-4 ${itemIdx < category.items.length - 1
                          ? "border-b border-slate-700/50"
                          : ""
                          } ${categoryIdx < features.length - 1 &&
                            itemIdx === category.items.length - 1
                            ? "border-b border-slate-600/50"
                            : ""
                          }`}
                      >
                        <div className="text-slate-300 font-medium">
                          {item.name}
                        </div>
                        <div className="text-center text-slate-400">
                          {item.free}
                        </div>
                        <div className="text-center text-cyan-300">
                          {item.starter}
                        </div>
                        <div className="text-center text-purple-300">
                          {item.pro}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gradient-to-r from-slate-700/30 to-slate-600/30">
                  <div className="font-semibold text-white">Plan</div>
                  <div className="text-center">
                    <Badge
                      variant="outline"
                      className="border-slate-500 text-slate-300"
                    >
                      Free
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30">
                      Starter
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
                      <Crown className="w-3 h-3 mr-1" />
                      Neural+
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl border border-cyan-500/20 backdrop-blur-sm p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Ready to Optimize Your Life?
              </h2>
              <p className="text-slate-300 mb-8 text-lg leading-relaxed">
                Join thousands of users who have transformed their productivity
                and life balance with ASTRA's neural architecture.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={ROUTES.AUTH.LOGIN}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-10 py-4 rounded-full shadow-2xl shadow-cyan-500/25"
                  >
                    Start Your Neural Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-4 rounded-full bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 backdrop-blur-sm"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
