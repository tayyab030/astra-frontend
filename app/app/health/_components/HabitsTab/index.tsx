"use client"

import { useState } from "react"
import { CheckCircle2, Flame, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useHealthContext } from "../../_context/HealthProvider"
import { HealthEmptyState } from "../shared/HealthEmptyState"

export function HabitsTab() {
  const { habits, toggleHabit, createHabit, isSaving } = useHealthContext()
  const [habitName, setHabitName] = useState("")
  const [frequency, setFrequency] = useState("daily")
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleCreateHabit = async () => {
    if (!habitName.trim()) return
    await createHabit(habitName.trim(), frequency)
    setHabitName("")
    setDialogOpen(false)
  }

  if (habits.length === 0) {
    return (
      <HealthEmptyState
        icon={Flame}
        title="No habits yet"
        description="Create your first habit to start building streaks and tracking daily progress."
        actionLabel="Add Habit"
      />
    )
  }

  return (
    <div className="pb-6">
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-mono flex items-center text-cyan-300">
              <Flame className="mr-2 h-5 w-5 text-orange-400" />
              Habit Tracker
            </CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-cyan-500/25 font-mono"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Habit
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 text-slate-100">
                <DialogHeader>
                  <DialogTitle className="text-cyan-300 font-mono">Create New Habit</DialogTitle>
                  <DialogDescription className="text-slate-300 font-mono">
                    Add a new daily habit to track
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="habit-name" className="text-slate-200 font-mono">
                      Habit Name
                    </Label>
                      <Input
                        id="habit-name"
                        placeholder="e.g., Drink 8 glasses of water"
                        value={habitName}
                        onChange={(e) => setHabitName(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-slate-100 font-mono"
                      />
                  </div>
                  <div>
                    <Label htmlFor="habit-frequency" className="text-slate-200 font-mono">
                      Frequency
                    </Label>
                      <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-100 font-mono">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                    <Button
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 font-mono"
                      onClick={handleCreateHabit}
                      disabled={!habitName.trim() || isSaving}
                    >
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
                    onClick={() => toggleHabit(habit.id)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  <div>
                    <p className="font-mono font-medium text-slate-200">{habit.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-slate-400 font-mono">
                      <Flame className="h-3 w-3 text-orange-400" />
                      <span>{habit.streak} day streak</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-200 font-mono">
                    {habit.current}/{habit.target}
                  </p>
                  <Progress value={(habit.current / habit.target) * 100} className="w-16 h-1 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
