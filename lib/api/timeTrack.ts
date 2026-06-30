import { authApi } from "./simpleApi"
import { API_ENDPOINTS } from "./endpoints"

const { TIME_TRACK } = API_ENDPOINTS

export interface TimeTrackFilterParams {
  start_date: string
  end_date: string
  search?: string
}

export interface TimeTrackSettingsApi {
  hours_per_week: number
  activity_bar_visible: boolean
  last_selected_task_id: string | null
}

export interface TimeTrackDashboardApi {
  filter: { start_date: string; end_date: string }
  weekly_target: { hours_per_week: number }
  settings: TimeTrackSettingsApi
  tracked_tasks: TrackedTaskApi[]
  entries: TimeEntryApi[]
  summary: {
    total_seconds: number
    today_total_seconds: number
    session_count: number
  }
}

export interface TimeEntryApi {
  id: string
  task_id: string
  task_title: string
  date: string
  start_time: string
  end_time: string
  duration_seconds: number
}

export interface TrackedTaskApi {
  task_id: string
  title: string
  project_title: string | null
  total_seconds_today: number
  is_active: boolean
}

export interface CreateTimeEntryPayload {
  task_id: string
  duration_seconds: number
  start_time: string
  end_time?: string
  entry_date?: string
}

export interface AddTrackedTaskPayload {
  task_id: string
  track_date?: string
}

export interface UpdateTimeTrackSettingsPayload {
  hours_per_week?: number
  activity_bar_visible?: boolean
  last_selected_task_id?: string | null
}

function mapEntry(entry: TimeEntryApi) {
  return {
    id: entry.id,
    taskId: entry.task_id,
    taskTitle: entry.task_title,
    date: entry.date,
    startTime: entry.start_time,
    endTime: entry.end_time,
    durationSeconds: entry.duration_seconds,
  }
}

function mapTrackedTask(task: TrackedTaskApi) {
  return {
    taskId: task.task_id,
    title: task.title,
    projectTitle: task.project_title,
    totalSecondsToday: task.total_seconds_today,
    isActive: task.is_active,
  }
}

function mapSettings(settings: TimeTrackSettingsApi) {
  return {
    hoursPerWeek: settings.hours_per_week,
    activityBarVisible: settings.activity_bar_visible,
    lastSelectedTaskId: settings.last_selected_task_id,
  }
}

export function mapTimeTrackDashboard(data: TimeTrackDashboardApi) {
  return {
    filter: {
      startDate: data.filter.start_date,
      endDate: data.filter.end_date,
    },
    weeklyTarget: { hoursPerWeek: data.settings?.hours_per_week ?? data.weekly_target.hours_per_week },
    settings: mapSettings(data.settings ?? {
      hours_per_week: data.weekly_target.hours_per_week,
      activity_bar_visible: true,
      last_selected_task_id: null,
    }),
    trackedTasks: data.tracked_tasks.map(mapTrackedTask),
    entries: data.entries.map(mapEntry),
    summary: {
      totalSeconds: data.summary.total_seconds,
      todayTotalSeconds: data.summary.today_total_seconds,
      sessionCount: data.summary.session_count,
    },
  }
}

export function mapTaskItemToAvailableTask(task: {
  id: string
  title: string
  project_title: string | null
  priority: string
}) {
  return {
    id: task.id,
    title: task.title,
    project_title: task.project_title,
    priority: task.priority,
  }
}

export function getTimeTrackErrorMessage(error: unknown, fallback: string) {
  const responseData = (error as { response?: { data?: Record<string, unknown> } })?.response?.data

  if (!responseData) return fallback

  if (typeof responseData.detail === "string") return responseData.detail
  if (typeof responseData.message === "string") return responseData.message

  const firstFieldError = Object.values(responseData).find(
    (value) => Array.isArray(value) && typeof value[0] === "string"
  ) as string[] | undefined

  return firstFieldError?.[0] ?? fallback
}

export async function fetchTimeTrackDashboard(params: TimeTrackFilterParams) {
  const response = await authApi.get<TimeTrackDashboardApi>(TIME_TRACK.DASHBOARD, {
    params,
  })
  return mapTimeTrackDashboard(response.data)
}

export async function createTimeEntry(payload: CreateTimeEntryPayload) {
  const response = await authApi.post<TimeEntryApi>(TIME_TRACK.ENTRIES, payload)
  return mapEntry(response.data)
}

export async function deleteTimeEntry(id: string) {
  const response = await authApi.delete<{ message: string }>(TIME_TRACK.ENTRY(id))
  return response.data
}

export async function addTrackedTask(payload: AddTrackedTaskPayload) {
  const response = await authApi.post<TrackedTaskApi>(TIME_TRACK.TRACKED_TASKS, payload)
  return mapTrackedTask(response.data)
}

export async function removeTrackedTask(taskId: string, trackDate?: string) {
  const response = await authApi.delete<{ message: string }>(TIME_TRACK.TRACKED_TASK(taskId), {
    params: trackDate ? { track_date: trackDate } : undefined,
  })
  return response.data
}

export async function updateTimeTrackSettings(payload: UpdateTimeTrackSettingsPayload) {
  const response = await authApi.patch<TimeTrackSettingsApi>(
    TIME_TRACK.SETTINGS,
    payload
  )
  return mapSettings(response.data)
}
