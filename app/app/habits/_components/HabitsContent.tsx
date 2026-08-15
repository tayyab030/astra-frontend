"use client"

import { useState } from "react"
import { CheckCircle2, Flame, Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Habit } from "../_types/habits.types"
import { useHabits } from "../_hooks/useHabits"

export function HabitsContent() {
  const {
    habits,
    completedCount,
    longestStreak,
    isLoading,
    isSaving,
    toggleHabit,
    createHabit,
    updateHabit,
    deleteHabit,
  } = useHabits()

  const [habitName, setHabitName] = useState("")
  const [frequency, setFrequency] = useState("daily")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [editName, setEditName] = useState("")
  const [editFrequency, setEditFrequency] = useState("daily")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleCreateHabit = async () => {
    if (!habitName.trim()) return
    await createHabit(habitName.trim(), frequency)
    setHabitName("")
    setFrequency("daily")
    setDialogOpen(false)
  }

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setEditName(habit.name)
    setEditFrequency(habit.frequency || "daily")
  }

  const handleUpdateHabit = async () => {
    if (!editingHabit || !editName.trim()) return
    await updateHabit(editingHabit.id, {
      name: editName.trim(),
      frequency: editFrequency,
    })
    setEditingHabit(null)
  }

  const handleDeleteHabit = async () => {
    if (!deleteId) return
    await deleteHabit(deleteId)
    setDeleteId(null)
  }

  return (
    <div className="astra-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="astra-title">Habits</h1>
          <p className="astra-subtitle mt-1">
            Build streaks and track daily routines in one place.
          </p>
        </div>
        <Button className="astra-btn-primary" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Active Habits",
            value: habits.length,
            subtitle: "tracked routines",
          },
          {
            title: "Completed Today",
            value: `${completedCount}/${habits.length || 0}`,
            subtitle: "done for today",
          },
          {
            title: "Longest Streak",
            value: longestStreak,
            subtitle: "days",
          },
        ].map((card) => (
          <Card key={card.title} className="astra-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-primary">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="astra-card">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Flame className="mr-2 h-5 w-5 text-orange-500" />
            Habit Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Flame className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg text-foreground mb-2">No habits yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                Create your first habit to start building streaks and tracking daily progress.
              </p>
              <Button className="astra-btn-primary" onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Habit
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-secondary/30"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Button
                      size="sm"
                      variant={habit.completed ? "default" : "outline"}
                      className={
                        habit.completed
                          ? "astra-btn-primary shrink-0"
                          : "shrink-0 border-border"
                      }
                      onClick={() => toggleHabit(habit.id)}
                      disabled={isSaving}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{habit.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Flame className="h-3 w-3 text-orange-500" />
                        <span>{habit.streak} day streak</span>
                        {habit.frequency ? (
                          <span className="capitalize">· {habit.frequency}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="text-right mr-1">
                      <p className="text-sm font-medium text-foreground">
                        {habit.current}/{habit.target}
                      </p>
                      <Progress
                        value={habit.target ? (habit.current / habit.target) * 100 : 0}
                        className="w-16 h-1 mt-1"
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => openEdit(habit)}
                      aria-label={`Edit ${habit.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteId(habit.id)}
                      aria-label={`Delete ${habit.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setHabitName("")
            setFrequency("daily")
          }
        }}
      >
        <DialogContent className="astra-card border-border">
          <DialogHeader>
            <DialogTitle className="text-primary">Create New Habit</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new habit to track
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="habit-name">Habit Name</Label>
              <Input
                id="habit-name"
                placeholder="e.g., Drink 8 glasses of water"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="habit-frequency">Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger id="habit-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full astra-btn-primary"
              onClick={handleCreateHabit}
              disabled={!habitName.trim() || isSaving}
            >
              Create Habit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingHabit)}
        onOpenChange={(open) => {
          if (!open) setEditingHabit(null)
        }}
      >
        <DialogContent className="astra-card border-border">
          <DialogHeader>
            <DialogTitle className="text-primary">Edit Habit</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update habit name or frequency
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-habit-name">Habit Name</Label>
              <Input
                id="edit-habit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-habit-frequency">Frequency</Label>
              <Select value={editFrequency} onValueChange={setEditFrequency}>
                <SelectTrigger id="edit-habit-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full astra-btn-primary"
              onClick={handleUpdateHabit}
              disabled={!editName.trim() || isSaving}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="astra-card border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete habit?</AlertDialogTitle>
            <AlertDialogDescription>
              This habit and its streak will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteHabit}
              disabled={isSaving}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
