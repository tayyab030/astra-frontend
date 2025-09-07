"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AstraLogo } from "@/components/astra-logo"
import { useTheme } from "next-themes"
import TasksPage from "./tasks/page"
import GoalsPage from "./goals/page"
import WealthPage from "./wealth/page"
import HealthPage from "./health/page"
import NotesPage from "./notes/page"
import CommunicationPage from "./communication/page"
import LifeScorePage from "./life-score/page"
import AnalyticsPage from "./analytics/page"
import SettingsPage from "./settings/page"
import {
  Sun,
  Moon,
  Home,
  CheckSquare,
  DollarSign,
  Heart,
  FileText,
  Bot,
  Mail,
  BarChart3,
  Star,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  Zap,
  Target,
} from "lucide-react"
import AssistantPage from "./assistant/page"

export default function DashboardPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "goals", label: "Goals", icon: Target },
    { id: "wealth", label: "Wealth", icon: DollarSign },
    { id: "health", label: "Health", icon: Heart },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "assistant", label: "Assistant", icon: Bot },
    { id: "communication", label: "Communication", icon: Mail },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "life-score", label: "Life Score", icon: Star },
  ]

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "tasks":
        return <TasksPage />
      case "goals":
        return <GoalsPage />
      case "wealth":
        return <WealthPage />
      case "health":
        return <HealthPage />
      case "notes":
        return <NotesPage />
      case "communication":
        return <CommunicationPage />
      case "analytics":
        return <AnalyticsPage />
      case "life-score":
        return <LifeScorePage />
      case "settings":
        return <SettingsPage />
      case "assistant":
        return <AssistantPage />
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-cyan-300">Good morning, Tayyab 🚀</h1>
            <p className="text-slate-300 font-inter mt-1">
              "Success is the sum of small efforts repeated day in and day out."
            </p>
          </div>
          <Badge
            variant="secondary"
            className="text-lg px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-lg shadow-cyan-500/25"
          >
            <Star className="mr-2 h-4 w-4" />
            Life Score: 85
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-cyan-300">Tasks Due Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-cyan-200">5</div>
              <p className="text-xs text-slate-400">2 completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/30 backdrop-blur-sm shadow-lg shadow-blue-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-blue-300">Daily Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-blue-200">$47</div>
              <p className="text-xs text-slate-400">Budget: $80</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-400/30 backdrop-blur-sm shadow-lg shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-cyan-300">Health Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Water</span>
                  <span>6/8 glasses</span>
                </div>
                <Progress value={75} className="h-2 bg-slate-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-400/30 backdrop-blur-sm shadow-lg shadow-blue-400/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-blue-300">Focus Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-blue-200">3.2h</div>
              <p className="text-xs text-slate-400">4 Pomodoros</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-poppins text-cyan-300">Weekly Expenses</CardTitle>
            <CardDescription className="font-inter text-slate-400">Your spending vs income this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-slate-400">
              <BarChart3 className="h-12 w-12" />
              <span className="ml-2">Chart visualization</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-poppins text-cyan-300">Habit Streaks</CardTitle>
            <CardDescription className="font-inter text-slate-400">Your consistency over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-slate-400">
              <TrendingUp className="h-12 w-12" />
              <span className="ml-2">Streak visualization</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-poppins flex items-center">
            <Zap className="mr-2 h-5 w-5 text-cyan-400" />
            <span className="text-cyan-300">Smart Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg border border-cyan-500/30">
              <p className="text-sm font-inter text-slate-200">🎉 You spent 20% less this week than last week!</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg border border-blue-500/30">
              <p className="text-sm font-inter text-slate-200">
                🔥 You've kept a 10-day streak on workouts—keep going!
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-slate-800/30 to-slate-700/30 rounded-lg border border-slate-500/30">
              <p className="text-sm font-inter text-slate-200">⚠️ 3 tasks are overdue. Suggest rescheduling?</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-poppins text-cyan-300">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-20 flex-col font-inter bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 hover:border-cyan-400/50 text-cyan-300 hover:text-cyan-200 backdrop-blur-sm"
            >
              <Plus className="h-5 w-5 mb-2" />
              <span>Add Task</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col font-inter bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/30 hover:border-blue-400/50 text-blue-300 hover:text-blue-200 backdrop-blur-sm"
            >
              <DollarSign className="h-5 w-5 mb-2" />
              <span>Log Expense</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col font-inter bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-400/30 hover:border-cyan-300/50 text-cyan-300 hover:text-cyan-200 backdrop-blur-sm"
            >
              <Heart className="h-5 w-5 mb-2" />
              <span>Log Habit</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col font-inter bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-400/30 hover:border-blue-300/50 text-blue-300 hover:text-blue-200 backdrop-blur-sm"
            >
              <FileText className="h-5 w-5 mb-2" />
              <span>Quick Note</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Grid Background */}
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
      <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse delay-2000" />

      {/* Holographic Rings */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-cyan-500/20 rounded-full animate-spin-slow" />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-blue-500/20 rounded-full animate-spin-slow delay-3000" />

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

      <header className="border-b border-slate-700/50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <AstraLogo className="h-8 w-auto" />

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
            >
              {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
            </Button>

            <Avatar className="h-8 w-8 ring-2 ring-cyan-400/50">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">TA</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r border-slate-700/50 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start font-inter transition-all duration-200 ${activeTab === item.id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
                    : "hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/50 text-slate-300 hover:text-cyan-300 border-transparent hover:border-cyan-500/30"
                    }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}

            <div className="pt-4 mt-4 border-t border-slate-700/50">
              <Button
                variant="ghost"
                className={`w-full justify-start font-inter transition-all duration-200 ${activeTab === "settings"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
                  : "hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/50 text-slate-300 hover:text-cyan-300 border-transparent hover:border-cyan-500/30"
                  }`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start font-inter text-red-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/20 border-transparent hover:border-red-500/30"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 relative z-10">{renderContent()}</main>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(30px) rotate(240deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
