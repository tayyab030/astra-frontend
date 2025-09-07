"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Calendar,
  Trophy,
  CheckCircle,
  Star,
  Flame,
  BarChart3,
  Brain,
  Heart,
  DollarSign,
  Briefcase,
} from "lucide-react"

export default function GoalsPage() {
  const [selectedView, setSelectedView] = useState("overview")
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)

  const goals = [
    {
      id: 1,
      title: "Save $10,000 Emergency Fund",
      category: "Wealth",
      categoryIcon: DollarSign,
      categoryColor: "green",
      progress: 65,
      startDate: "2024-01-01",
      targetDate: "2024-12-31",
      priority: "High",
      motivation: "Financial security and peace of mind for unexpected expenses",
      milestones: [
        { title: "Save $2,500", completed: true, dueDate: "2024-03-31" },
        { title: "Save $5,000", completed: true, dueDate: "2024-06-30" },
        { title: "Save $7,500", completed: false, dueDate: "2024-09-30" },
        { title: "Save $10,000", completed: false, dueDate: "2024-12-31" },
      ],
      linkedTasks: 8,
      streak: 45,
    },
    {
      id: 2,
      title: "Run a Half Marathon",
      category: "Health",
      categoryIcon: Heart,
      categoryColor: "pink",
      progress: 40,
      startDate: "2024-02-01",
      targetDate: "2024-10-15",
      priority: "Medium",
      motivation: "Improve cardiovascular health and achieve a personal fitness milestone",
      milestones: [
        { title: "Run 5K consistently", completed: true, dueDate: "2024-04-01" },
        { title: "Run 10K", completed: false, dueDate: "2024-07-01" },
        { title: "Run 15K", completed: false, dueDate: "2024-09-01" },
        { title: "Complete Half Marathon", completed: false, dueDate: "2024-10-15" },
      ],
      linkedTasks: 12,
      streak: 23,
    },
    {
      id: 3,
      title: "Launch Personal Portfolio Website",
      category: "Work",
      categoryIcon: Briefcase,
      categoryColor: "blue",
      progress: 80,
      startDate: "2024-01-15",
      targetDate: "2024-04-30",
      priority: "High",
      motivation: "Showcase my skills and attract better career opportunities",
      milestones: [
        { title: "Design wireframes", completed: true, dueDate: "2024-02-15" },
        { title: "Develop frontend", completed: true, dueDate: "2024-03-30" },
        { title: "Add portfolio projects", completed: false, dueDate: "2024-04-15" },
        { title: "Deploy and launch", completed: false, dueDate: "2024-04-30" },
      ],
      linkedTasks: 15,
      streak: 12,
    },
  ]

  const categoryColors = {
    Wealth: "from-cyan-500 to-blue-600",
    Health: "from-cyan-400 to-blue-500",
    Work: "from-blue-500 to-cyan-600",
    Knowledge: "from-cyan-500 to-blue-600",
    Relationships: "from-blue-400 to-cyan-500",
  }

  const renderLifeBalanceWheel = () => {
    const categories = [
      { name: "Health", value: 75, color: "cyan" },
      { name: "Wealth", value: 85, color: "blue" },
      { name: "Work", value: 90, color: "cyan" },
      { name: "Knowledge", value: 60, color: "blue" },
      { name: "Relationships", value: 70, color: "cyan" },
    ]

    return (
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-poppins flex items-center text-cyan-300">
            <BarChart3 className="mr-2 h-5 w-5 text-cyan-400" />
            Life Balance Wheel
          </CardTitle>
          <CardDescription className="text-slate-300">Your goal distribution across life areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-200">{category.name}</span>
                  <span className="text-cyan-400">{category.value}%</span>
                </div>
                <Progress value={category.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderGoalCard = (goal) => {
    const CategoryIcon = goal.categoryIcon
    const completedMilestones = goal.milestones.filter((m) => m.completed).length
    const totalMilestones = goal.milestones.length

    return (
      <Card
        key={goal.id}
        className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className={`bg-gradient-to-r ${categoryColors[goal.category]} text-white border-0`}>
                  <CategoryIcon className="mr-1 h-3 w-3" />
                  {goal.category}
                </Badge>
                <Badge
                  variant={
                    goal.priority === "High" ? "destructive" : goal.priority === "Medium" ? "default" : "secondary"
                  }
                  className={
                    goal.priority === "High"
                      ? "bg-red-500/20 text-red-300 border-red-500/30"
                      : goal.priority === "Medium"
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                        : "bg-slate-500/20 text-slate-300 border-slate-500/30"
                  }
                >
                  {goal.priority}
                </Badge>
              </div>
              <CardTitle className="font-poppins text-lg text-cyan-300">{goal.title}</CardTitle>
              <CardDescription className="font-inter text-sm text-slate-300">{goal.motivation}</CardDescription>
            </div>
            <div className="text-right space-y-1">
              <div className="text-2xl font-bold font-poppins text-cyan-400">{goal.progress}%</div>
              <div className="text-xs text-slate-400">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={goal.progress} className="h-3" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center text-slate-400">
                <Calendar className="mr-1 h-3 w-3" />
                Target Date
              </div>
              <div className="font-medium text-slate-200">{new Date(goal.targetDate).toLocaleDateString()}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-slate-400">
                <CheckCircle className="mr-1 h-3 w-3" />
                Milestones
              </div>
              <div className="font-medium text-slate-200">
                {completedMilestones}/{totalMilestones}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-600/50">
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center">
                <Flame className="mr-1 h-3 w-3 text-orange-400" />
                {goal.streak} day streak
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-3 w-3 text-cyan-400" />
                {goal.linkedTasks} tasks
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50 bg-transparent"
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-2xl animate-pulse delay-2000" />

      {/* Holographic rings */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-cyan-500/20 rounded-full animate-spin-slow" />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-blue-500/20 rounded-full animate-spin-slow delay-1000" />

      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-cyan-300">Goals Dashboard 🎯</h1>
            <p className="text-slate-300 font-inter mt-1">
              "A goal is a dream with a deadline." - Track your journey to success.
            </p>
          </div>
          <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25">
                <Plus className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 text-slate-100">
              <DialogHeader>
                <DialogTitle className="text-cyan-300">Create New Goal</DialogTitle>
                <DialogDescription className="text-slate-300">
                  Set a new goal to track your progress and achieve success.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Goal Title</label>
                  <Input
                    placeholder="e.g., Save $5,000 for vacation"
                    className="bg-slate-700/50 border-slate-600 text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Category</label>
                    <Select>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-100">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="wealth">💰 Wealth</SelectItem>
                        <SelectItem value="health">❤️ Health</SelectItem>
                        <SelectItem value="work">💼 Work</SelectItem>
                        <SelectItem value="knowledge">📚 Knowledge</SelectItem>
                        <SelectItem value="relationships">👥 Relationships</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Priority</label>
                    <Select>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-100">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Start Date</label>
                    <Input type="date" className="bg-slate-700/50 border-slate-600 text-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Target Date</label>
                    <Input type="date" className="bg-slate-700/50 border-slate-600 text-slate-100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Motivation (Why this matters)</label>
                  <Textarea
                    placeholder="Describe why this goal is important to you..."
                    className="bg-slate-700/50 border-slate-600 text-slate-100"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddGoalOpen(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-cyan-300">Active Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-cyan-400">3</div>
              <p className="text-xs text-cyan-500">1 high priority</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-blue-300">Avg Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-blue-400">62%</div>
              <p className="text-xs text-blue-500">+15% this month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-cyan-300">Longest Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-cyan-400">45</div>
              <p className="text-xs text-cyan-500">days</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-blue-300">Completed Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-blue-400">7</div>
              <p className="text-xs text-blue-500">this year</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-poppins flex items-center">
              <Brain className="mr-2 h-5 w-5 text-yellow-400" />
              <span className="text-cyan-300">AI Goal Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
                <p className="text-sm font-inter text-slate-200">
                  🎯 You're on track to complete your portfolio website 5 days early!
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30 backdrop-blur-sm">
                <p className="text-sm font-inter text-slate-200">
                  💡 Consider breaking down "Run Half Marathon" into weekly distance milestones.
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-lg border border-cyan-400/30 backdrop-blur-sm">
                <p className="text-sm font-inter text-slate-200">
                  ⚡ Your savings goal needs $400/month to stay on track. Current pace: $350/month.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold font-poppins text-cyan-300">Your Goals</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50 bg-transparent"
                >
                  All
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700/50">
                  In Progress
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700/50">
                  Completed
                </Button>
              </div>
            </div>
            <div className="space-y-4">{goals.map(renderGoalCard)}</div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {renderLifeBalanceWheel()}

            {/* Achievements */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-poppins flex items-center text-cyan-300">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Goal Crusher</p>
                      <p className="text-xs text-slate-400">Completed 5 goals this year</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <Flame className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Streak Master</p>
                      <p className="text-xs text-slate-400">45-day consistency streak</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
