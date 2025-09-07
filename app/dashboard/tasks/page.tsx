"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Filter,
  Calendar,
  List,
  Kanban,
  Clock,
  Zap,
  Brain,
  Target,
  CheckCircle2,
  Circle,
  Star,
  Flag,
  Timer,
  BarChart3,
  Bot,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"

export default function TasksPage() {
  const [currentView, setCurrentView] = useState("list")
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [timerSeconds, setTimerSeconds] = useState(0)

  const tasks = [
    {
      id: 1,
      title: "Complete ASTRA dashboard design",
      description: "Finalize the dashboard layout with all modules integrated",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-01-15",
      tags: ["design", "ui/ux"],
      category: "work",
      subtasks: 3,
      completedSubtasks: 1,
    },
    {
      id: 2,
      title: "Review quarterly budget",
      description: "Analyze spending patterns and adjust budget for next quarter",
      priority: "medium",
      status: "todo",
      dueDate: "2024-01-20",
      tags: ["finance", "planning"],
      category: "personal",
      subtasks: 5,
      completedSubtasks: 0,
    },
    {
      id: 3,
      title: "Morning workout routine",
      description: "30-minute cardio + strength training",
      priority: "low",
      status: "completed",
      dueDate: "2024-01-10",
      tags: ["health", "routine"],
      category: "health",
      subtasks: 2,
      completedSubtasks: 2,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimerMinutes(25)
    setTimerSeconds(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
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

      {/* Holographic rings */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cyan-500/10 rounded-full animate-spin pointer-events-none"
        style={{ animationDuration: "20s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-blue-500/10 rounded-full animate-spin pointer-events-none"
        style={{ animationDuration: "15s", animationDirection: "reverse" }}
      ></div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-40 pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        ></div>
      ))}

      <div className="relative z-10 p-6 space-y-6">
        {/* Header with AI Assistant */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Task Command Center
            </h1>
            <p className="text-slate-300 font-mono mt-1">Your productivity hub powered by AI insights</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* AI Assistant */}
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 text-cyan-300 border-cyan-500/30 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4" />
                  <span className="text-sm font-mono">AI suggests: Focus on high-priority tasks first</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Add */}
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border border-cyan-400/20 font-mono shadow-lg shadow-cyan-500/25">
              <Plus className="mr-2 h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/20 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono text-cyan-300">Total Tasks</p>
                  <p className="text-2xl font-bold font-mono text-cyan-200">24</p>
                </div>
                <Target className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-green-500/20 shadow-2xl shadow-green-500/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono text-green-300">Completed</p>
                  <p className="text-2xl font-bold font-mono text-green-200">18</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-orange-500/20 shadow-2xl shadow-orange-500/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono text-orange-300">Overdue</p>
                  <p className="text-2xl font-bold font-mono text-orange-200">3</p>
                </div>
                <Flag className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-purple-500/20 shadow-2xl shadow-purple-500/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono text-purple-300">Focus Time</p>
                  <p className="text-2xl font-bold font-mono text-purple-200">4.2h</p>
                </div>
                <Brain className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
            <Input
              placeholder="Search tasks or type natural language (e.g., 'Remind me to call Ali tomorrow at 3 PM')"
              className="pl-10 font-mono bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 backdrop-blur-sm"
            />
          </div>
          <Button
            variant="outline"
            className="bg-slate-900/50 border-slate-600/50 text-cyan-300 hover:bg-slate-800/50 hover:text-cyan-200 font-mono backdrop-blur-sm"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* View Tabs and Focus Timer */}
        <div className="flex items-center justify-between">
          <Tabs value={currentView} onValueChange={setCurrentView} className="w-auto">
            <TabsList className="bg-slate-800/50 border-slate-600/50 backdrop-blur-sm">
              <TabsTrigger
                value="list"
                className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <List className="mr-2 h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger
                value="board"
                className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Kanban className="mr-2 h-4 w-4" />
                Board
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger
                value="focus"
                className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Zap className="mr-2 h-4 w-4" />
                Focus
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Pomodoro Timer */}
          <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-red-500/20 shadow-2xl shadow-red-500/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm font-mono text-red-300">Focus Timer</p>
                  <p className="text-xl font-bold font-mono text-red-200">
                    {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={toggleTimer}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border border-red-400/20 shadow-lg shadow-red-500/25"
                  >
                    {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetTimer}
                    className="border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Views */}
        <Tabs value={currentView} onValueChange={setCurrentView}>
          <TabsContent value="list" className="space-y-4">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600/30 hover:border-cyan-500/30 transition-all duration-200 backdrop-blur-sm shadow-lg"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getStatusIcon(task.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold font-mono text-slate-200">{task.title}</h3>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-700/50 text-cyan-300 border-cyan-500/30"
                          >
                            {task.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 font-mono mb-2">{task.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>Due: {task.dueDate}</span>
                          <span>
                            Subtasks: {task.completedSubtasks}/{task.subtasks}
                          </span>
                          <div className="flex space-x-1">
                            {task.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs border-slate-600/50 text-slate-400">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {task.subtasks > 0 && (
                          <Progress value={(task.completedSubtasks / task.subtasks) * 100} className="mt-2 h-1" />
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-700/50"
                    >
                      <Timer className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="board">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["To Do", "In Progress", "Done"].map((column) => (
                <Card
                  key={column}
                  className="bg-gradient-to-b from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm"
                >
                  <CardHeader>
                    <CardTitle className="font-mono text-center text-slate-200">{column}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tasks
                      .filter((task) => {
                        if (column === "To Do") return task.status === "todo"
                        if (column === "In Progress") return task.status === "in-progress"
                        return task.status === "completed"
                      })
                      .map((task) => (
                        <Card
                          key={task.id}
                          className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors cursor-pointer border-slate-600/30 backdrop-blur-sm"
                        >
                          <CardContent className="p-3">
                            <h4 className="font-semibold font-mono text-sm mb-1 text-slate-200">{task.title}</h4>
                            <p className="text-xs text-slate-400 font-mono mb-2">{task.description}</p>
                            <div className="flex items-center justify-between">
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                              <span className="text-xs text-slate-500">{task.dueDate}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center">
                  <Calendar className="h-16 w-16 mx-auto text-cyan-400 mb-4" />
                  <h3 className="text-lg font-semibold font-mono mb-2 text-slate-200">Calendar View</h3>
                  <p className="text-slate-400 font-mono">
                    Drag and drop tasks into your calendar for better scheduling
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="focus">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-purple-500/20 shadow-2xl shadow-purple-500/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center">
                  <Zap className="h-16 w-16 mx-auto text-purple-400 mb-4" />
                  <h3 className="text-lg font-semibold font-mono mb-2 text-purple-200">Focus Mode</h3>
                  <p className="text-purple-400 font-mono mb-6">Distraction-free environment for deep work</p>
                  <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border border-purple-400/20 font-mono shadow-lg shadow-purple-500/25">
                    Start Focus Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-green-500/20 shadow-2xl shadow-green-500/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-mono flex items-center text-green-300">
                <BarChart3 className="mr-2 h-5 w-5" />
                Productivity Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-mono text-slate-300">Tasks Completed This Week</span>
                    <span className="font-semibold text-green-300">18/24</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-mono text-slate-300">Focus Time Goal</span>
                    <span className="font-semibold text-green-300">4.2h/6h</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/20 shadow-2xl shadow-blue-500/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-mono flex items-center text-blue-300">
                <Star className="mr-2 h-5 w-5" />
                Achievement Streaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-slate-300">Daily Task Completion</span>
                  <Badge className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-300 border-yellow-500/30 backdrop-blur-sm">
                    🔥 7 days
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-slate-300">Focus Sessions</span>
                  <Badge className="bg-gradient-to-r from-blue-400/20 to-purple-500/20 text-blue-300 border-blue-500/30 backdrop-blur-sm">
                    ⚡ 12 days
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
