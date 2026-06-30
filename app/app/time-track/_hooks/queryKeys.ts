export const timeTrackKeys = {
  all: ["time-track"] as const,
  today: (date: string) => ["time-track", "today", date] as const,
  dashboard: (start: string, end: string, search: string) =>
    ["time-track", "dashboard", start, end, search] as const,
  week: (start: string, end: string) => ["time-track", "week", start, end] as const,
  taskPicker: ["tasks", "all", "time-track-picker"] as const,
}
