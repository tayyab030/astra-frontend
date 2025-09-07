"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Activity,
  Moon,
  Droplets,
  Apple,
  Dumbbell,
  Brain,
  TrendingUp,
  Plus,
  Flame,
  Target,
  Zap,
  BarChart3,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
} from "lucide-react"

export default function HealthPage() {
  const [waterIntake, setWaterIntake] = useState(6)
  const [selectedMood, setSelectedMood] = useState("")
  const [habits, setHabits] = useState([
    { id: 1, name: "Drink 8 glasses of water", streak: 12, completed: true, target: 8, current: 6 },
    { id: 2, name: "Meditate 10 minutes", streak: 5, completed: false, target: 10, current: 0 },
    { id: 3, name: "Walk 10,000 steps", streak: 8, completed: true, target: 10000, current: 8500 },
    { id: 4, name: "Sleep 7+ hours", streak: 3, completed: false, target: 7, current: 6.5 },
  ])

  const healthScore = 78
  const todaysCalories = 1850
  const calorieTarget = 2200
  const exerciseMinutes = 45
  const exerciseTarget = 60
  const sleepHours = 6.5
  const sleepTarget = 7.5

  const workouts = [
    { id: 1, type: "Cardio", duration: 30, calories: 250, date: "Today" },
    { id: 2, type: "Strength", duration: 45, calories: 180, date: "Yesterday" },
    { id: 3, type: "Yoga", duration: 20, calories: 80, date: "2 days ago" },
  ]

  const moodOptions = [
    { value: "great", label: "Great", icon: Smile, color: "text-green-400" },
    { value: "good", label: "Good", icon: Smile, color: "text-blue-400" },
    { value: "okay", label: "Okay", icon: Meh, color: "text-yellow-400" },
    { value: "bad", label: "Bad", icon: Frown, color: "text-orange-400" },
    { value: "terrible", label: "Terrible", icon: Frown, color: "text-red-400" },
  ]

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
        {/* Health Overview */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-cyan-300">Health Dashboard</h1>
            <p className="text-slate-300 font-inter mt-1">Your wellness journey powered by AI insights</p>
          </div>
          <Badge
            variant="secondary"
            className="text-lg px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 shadow-lg shadow-cyan-500/25"
          >
            <Heart className="mr-2 h-4 w-4" />
            Health Score: {healthScore}
          </Badge>
        </div>

        {/* Today's Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-cyan-300 flex items-center">
                <Droplets className="mr-2 h-4 w-4" />
                Water Intake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-cyan-400">{waterIntake}/8</div>
              <Progress value={(waterIntake / 8) * 100} className="h-2 mt-2" />
              <p className="text-xs text-cyan-500 mt-1">glasses today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-blue-300 flex items-center">
                <Apple className="mr-2 h-4 w-4" />
                Nutrition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-blue-400">{todaysCalories}</div>
              <Progress value={(todaysCalories / calorieTarget) * 100} className="h-2 mt-2" />
              <p className="text-xs text-blue-500 mt-1">of {calorieTarget} cal target</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-cyan-300 flex items-center">
                <Dumbbell className="mr-2 h-4 w-4" />
                Exercise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-cyan-400">{exerciseMinutes}m</div>
              <Progress value={(exerciseMinutes / exerciseTarget) * 100} className="h-2 mt-2" />
              <p className="text-xs text-cyan-500 mt-1">of {exerciseTarget}m goal</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-blue-300 flex items-center">
                <Moon className="mr-2 h-4 w-4" />
                Sleep
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-blue-400">{sleepHours}h</div>
              <Progress value={(sleepHours / sleepTarget) * 100} className="h-2 mt-2" />
              <p className="text-xs text-blue-500 mt-1">of {sleepTarget}h target</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Rings & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-poppins flex items-center text-cyan-300">
                <Target className="mr-2 h-5 w-5 text-cyan-400" />
                Daily Progress Rings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-inter text-slate-200">Habits</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={75} className="w-24 h-2" />
                    <span className="text-sm text-slate-400">75%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-inter text-slate-200">Exercise</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(exerciseMinutes / exerciseTarget) * 100} className="w-24 h-2" />
                    <span className="text-sm text-slate-400">
                      {Math.round((exerciseMinutes / exerciseTarget) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-inter text-slate-200">Sleep</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(sleepHours / sleepTarget) * 100} className="w-24 h-2" />
                    <span className="text-sm text-slate-400">{Math.round((sleepHours / sleepTarget) * 100)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-poppins flex items-center text-cyan-300">
                <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                AI Health Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
                  <p className="text-sm font-inter text-slate-200">
                    💧 You're doing great with water intake! Keep it up.
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30 backdrop-blur-sm">
                  <p className="text-sm font-inter text-slate-200">
                    ⚠️ You've been sleeping 6h avg (target: 7.5h). Want me to adjust your bedtime reminders?
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-lg border border-cyan-400/30 backdrop-blur-sm">
                  <p className="text-sm font-inter text-slate-200">
                    🏃 Your cardio workouts are consistent, but no strength training this week. Add a 20-min session?
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Habit Tracker */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-poppins flex items-center text-cyan-300">
                <Flame className="mr-2 h-5 w-5 text-orange-400" />
                Habit Tracker
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-cyan-500/25"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Habit
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 text-slate-100">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-300">Create New Habit</DialogTitle>
                    <DialogDescription className="text-slate-300">Add a new daily habit to track</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="habit-name" className="text-slate-200">
                        Habit Name
                      </Label>
                      <Input
                        id="habit-name"
                        placeholder="e.g., Drink 8 glasses of water"
                        className="bg-slate-700/50 border-slate-600 text-slate-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="habit-frequency" className="text-slate-200">
                        Frequency
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-100">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0">
                      Create Habit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      variant={habit.completed ? "default" : "outline"}
                      className={
                        habit.completed
                          ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                          : "border-slate-600 text-slate-300 hover:bg-slate-700/50"
                      }
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <div>
                      <p className="font-inter font-medium text-slate-200">{habit.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-slate-400">
                        <Flame className="h-3 w-3 text-orange-400" />
                        <span>{habit.streak} day streak</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-200">
                      {habit.current}/{habit.target}
                    </p>
                    <Progress value={(habit.current / habit.target) * 100} className="w-16 h-1 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exercise & Mood Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-poppins flex items-center text-cyan-300">
                  <Activity className="mr-2 h-5 w-5 text-cyan-400" />
                  Workout Log
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-cyan-500/25"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Log Workout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 text-slate-100">
                    <DialogHeader>
                      <DialogTitle className="text-cyan-300">Log Workout</DialogTitle>
                      <DialogDescription className="text-slate-300">Record your exercise session</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="workout-type" className="text-slate-200">
                          Workout Type
                        </Label>
                        <Select>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-100">
                            <SelectValue placeholder="Select workout type" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="cardio">Cardio</SelectItem>
                            <SelectItem value="strength">Strength</SelectItem>
                            <SelectItem value="flexibility">Flexibility</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="duration" className="text-slate-200">
                          Duration (minutes)
                        </Label>
                        <Input
                          id="duration"
                          type="number"
                          placeholder="30"
                          className="bg-slate-700/50 border-slate-600 text-slate-100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="calories" className="text-slate-200">
                          Calories Burned
                        </Label>
                        <Input
                          id="calories"
                          type="number"
                          placeholder="250"
                          className="bg-slate-700/50 border-slate-600 text-slate-100"
                        />
                      </div>
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0">
                        Log Workout
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 backdrop-blur-sm"
                  >
                    <div>
                      <p className="font-inter font-medium text-slate-200">{workout.type}</p>
                      <p className="text-sm text-slate-400">{workout.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-200">{workout.duration}m</p>
                      <p className="text-xs text-slate-400">{workout.calories} cal</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-poppins flex items-center text-cyan-300">
                <Brain className="mr-2 h-5 w-5 text-blue-400" />
                Mood & Mental Wellness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-inter text-slate-200">How are you feeling today?</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {moodOptions.map((mood) => {
                      const Icon = mood.icon
                      return (
                        <Button
                          key={mood.value}
                          variant={selectedMood === mood.value ? "default" : "outline"}
                          size="sm"
                          className={`flex-col h-16 ${selectedMood === mood.value ? "bg-cyan-500 hover:bg-cyan-600 text-white" : "border-slate-600 text-slate-300 hover:bg-slate-700/50"}`}
                          onClick={() => setSelectedMood(mood.value)}
                        >
                          <Icon className={`h-4 w-4 ${mood.color}`} />
                          <span className="text-xs mt-1">{mood.label}</span>
                        </Button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <Label htmlFor="mood-notes" className="text-slate-200">
                    Notes (optional)
                  </Label>
                  <Textarea
                    id="mood-notes"
                    placeholder="How was your day? Any thoughts or feelings to record..."
                    className="mt-1 bg-slate-700/50 border-slate-600 text-slate-100"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0">
                  Save Mood Check-in
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Analytics */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-poppins flex items-center text-cyan-300">
              <BarChart3 className="mr-2 h-5 w-5 text-cyan-400" />
              Progress & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold font-poppins text-cyan-400">12</div>
                <p className="text-sm text-slate-400">Longest Habit Streak</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-poppins text-blue-400">180</div>
                <p className="text-sm text-slate-400">Weekly Exercise Minutes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-poppins text-cyan-400">7.2h</div>
                <p className="text-sm text-slate-400">Average Sleep</p>
              </div>
            </div>
            <div className="mt-6 h-48 flex items-center justify-center text-slate-400">
              <TrendingUp className="h-12 w-12" />
              <span className="ml-2">Health trends visualization</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
