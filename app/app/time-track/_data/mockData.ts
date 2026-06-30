import { subDays, format } from "date-fns"
import type { AvailableTask, TimeEntry } from "../_types/timeTrack.types"

export const MOCK_AVAILABLE_TASKS: AvailableTask[] = [
  { id: "task-1", title: "Design landing page mockups", project_title: "Website Redesign", priority: "high" },
  { id: "task-2", title: "Implement auth flow", project_title: "Backend API", priority: "high" },
  { id: "task-3", title: "Write unit tests for tasks module", project_title: "Backend API", priority: "medium" },
  { id: "task-4", title: "Review pull requests", project_title: null, priority: "low" },
  { id: "task-5", title: "Update documentation", project_title: "Website Redesign", priority: "medium" },
  { id: "task-6", title: "Fix dashboard chart bugs", project_title: "Frontend", priority: "high" },
  { id: "task-7", title: "Plan sprint backlog", project_title: null, priority: "medium" },
  { id: "task-8", title: "Optimize database queries", project_title: "Backend API", priority: "high" },
  { id: "task-9", title: "Create marketing email template", project_title: "Marketing", priority: "low" },
  { id: "task-10", title: "Research competitor features", project_title: "Product", priority: "medium" },
]

function createEntry(
  daysAgo: number,
  taskId: string,
  taskTitle: string,
  startHour: number,
  durationMinutes: number,
  index: number
): TimeEntry {
  const date = subDays(new Date(), daysAgo)
  const dateStr = format(date, "yyyy-MM-dd")
  const start = new Date(date)
  start.setHours(startHour, 0, 0, 0)
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000)

  return {
    id: `mock-entry-${index}`,
    taskId,
    taskTitle,
    date: dateStr,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    durationSeconds: durationMinutes * 60,
  }
}

export const MOCK_TIME_ENTRIES: TimeEntry[] = [
  createEntry(0, "task-1", "Design landing page mockups", 9, 90, 1),
  createEntry(0, "task-2", "Implement auth flow", 11, 120, 2),
  createEntry(1, "task-3", "Write unit tests for tasks module", 10, 60, 3),
  createEntry(1, "task-6", "Fix dashboard chart bugs", 14, 45, 4),
  createEntry(2, "task-1", "Design landing page mockups", 9, 120, 5),
  createEntry(2, "task-8", "Optimize database queries", 13, 90, 6),
  createEntry(3, "task-4", "Review pull requests", 10, 30, 7),
  createEntry(3, "task-5", "Update documentation", 11, 60, 8),
  createEntry(4, "task-2", "Implement auth flow", 9, 150, 9),
  createEntry(5, "task-7", "Plan sprint backlog", 10, 45, 10),
  createEntry(5, "task-6", "Fix dashboard chart bugs", 14, 75, 11),
  createEntry(6, "task-1", "Design landing page mockups", 9, 105, 12),
  createEntry(7, "task-9", "Create marketing email template", 11, 40, 13),
  createEntry(8, "task-10", "Research competitor features", 10, 55, 14),
  createEntry(9, "task-3", "Write unit tests for tasks module", 9, 80, 15),
  createEntry(10, "task-2", "Implement auth flow", 13, 100, 16),
  createEntry(11, "task-8", "Optimize database queries", 10, 70, 17),
  createEntry(12, "task-5", "Update documentation", 9, 50, 18),
  createEntry(13, "task-4", "Review pull requests", 15, 35, 19),
  createEntry(13, "task-6", "Fix dashboard chart bugs", 16, 60, 20),
]
