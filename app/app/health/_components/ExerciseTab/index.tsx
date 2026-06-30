"use client"

import { Activity, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export function ExerciseTab() {
  const { workouts } = useHealthContext()

  if (workouts.length === 0) {
    return (
      <HealthEmptyState
        icon={Activity}
        title="No workouts logged"
        description="Record your first workout to track exercise minutes and calories burned."
        actionLabel="Log Workout"
      />
    )
  }

  return (
    <div className="pb-6">
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-mono flex items-center text-cyan-300">
              <Activity className="mr-2 h-5 w-5 text-cyan-400" />
              Workout Log
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-cyan-500/25 font-mono"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Log Workout
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 text-slate-100">
                <DialogHeader>
                  <DialogTitle className="text-cyan-300 font-mono">Log Workout</DialogTitle>
                  <DialogDescription className="text-slate-300 font-mono">
                    Record your exercise session
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-200 font-mono">Workout Type</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-100 font-mono">
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
                    <Label className="text-slate-200 font-mono">Duration (minutes)</Label>
                    <Input
                      type="number"
                      placeholder="30"
                      className="bg-slate-700/50 border-slate-600 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-200 font-mono">Calories Burned</Label>
                    <Input
                      type="number"
                      placeholder="250"
                      className="bg-slate-700/50 border-slate-600 text-slate-100 font-mono"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 font-mono">
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
                  <p className="font-mono font-medium text-slate-200">{workout.type}</p>
                  <p className="text-sm text-slate-400 font-mono">{workout.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-200 font-mono">{workout.duration}m</p>
                  <p className="text-xs text-slate-400 font-mono">{workout.calories} cal</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
