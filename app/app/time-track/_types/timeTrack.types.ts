export interface AvailableTask {
  id: string
  title: string
  project_title: string | null
  priority: string
}

export interface TrackedTask {
  taskId: string
  title: string
  projectTitle: string | null
  totalSecondsToday: number
  isActive: boolean
}

export interface TimeEntry {
  id: string
  taskId: string
  taskTitle: string
  date: string
  startTime: string
  endTime: string
  durationSeconds: number
}

export type DateRangePreset = "today" | "week" | "month" | "custom"

export interface DateRangeFilter {
  preset: DateRangePreset
  startDate: string
  endDate: string
}

export interface WeeklyTarget {
  hoursPerWeek: number
}

export type TimerStatus = "idle" | "running" | "paused"

export interface ActiveTimerState {
  taskId: string | null
  status: TimerStatus
  elapsedSeconds: number
  sessionStartTime: string | null
}

export interface TimeTrackPersistedState {
  trackedTasks: TrackedTask[]
  entries: TimeEntry[]
  activeTimer: ActiveTimerState
  weeklyTarget: WeeklyTarget
}
