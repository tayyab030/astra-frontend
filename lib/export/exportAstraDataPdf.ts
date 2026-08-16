import { format } from "date-fns"
import jsPDF from "jspdf"
import autoTable, { type CellHookData } from "jspdf-autotable"
import { getLocalDateString } from "@/app/app/health/_utils/date"
import { fetchGoalsDashboard } from "@/lib/api/goals"
import { fetchHabits, fetchHabitsDay } from "@/lib/api/habits"
import { fetchHealthDashboard } from "@/lib/api/health"
import { fetchNotesDashboard } from "@/lib/api/notes"
import { fetchProjects, fetchTasks } from "@/lib/api/tasks"
import { fetchTimeTrackDashboard } from "@/lib/api/timeTrack"
import type { AuthUser } from "@/lib/api/user"
import { fetchWealthDashboard } from "@/lib/api/wealth"

export type ExportAstraDataOptions = {
  user: AuthUser
  formatCurrency: (amount: number) => string
}

const MARGIN_X = 14
const PAGE_WIDTH = 210
const CONTENT_RIGHT = PAGE_WIDTH - MARGIN_X
const HEAD_FILL: [number, number, number] = [8, 145, 178]
const ALT_ROW: [number, number, number] = [241, 247, 255]

function addFooter(doc: jsPDF, userName: string) {
  const pageCount = doc.getNumberOfPages()
  const timestamp = format(new Date(), "MMM-dd-yyyy @ hh:mm a")
  const who = userName.trim() || "you"
  const footerText = `ASTRA data export for ${who} · ${timestamp}`

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const pageHeight = doc.internal.pageSize.height
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text(footerText, MARGIN_X, pageHeight - 12)
    doc.text(`${i}/${pageCount}`, CONTENT_RIGHT, pageHeight - 12, {
      align: "right",
    })
    doc.setTextColor(0, 0, 0)
  }
}

function sectionTitle(doc: jsPDF, title: string, y: number) {
  const pageHeight = doc.internal.pageSize.height
  if (y > pageHeight - 40) {
    doc.addPage()
    y = 20
  }
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text(title, MARGIN_X, y)
  doc.setDrawColor(148, 163, 184)
  doc.setLineWidth(0.4)
  doc.line(MARGIN_X, y + 2, CONTENT_RIGHT, y + 2)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(0, 0, 0)
  return y + 8
}

function zebraBody(data: CellHookData) {
  if (data.section !== "body") return
  data.cell.styles.fillColor =
    data.row.index % 2 === 0 ? ALT_ROW : [255, 255, 255]
}

function nextTableStart(doc: jsPDF, fallback = 40) {
  const last = (doc as jsPDF & { lastAutoTable?: { finalY: number } })
    .lastAutoTable
  return last ? last.finalY + 12 : fallback
}

function emptyRow(cols: number): string[] {
  return Array.from({ length: cols }, (_, i) => (i === 0 ? "No data" : "—"))
}

function clip(value: string | null | undefined, max = 60) {
  const text = (value ?? "").trim() || "—"
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

function tableDefaults() {
  return {
    styles: { fontSize: 8, cellPadding: 2.5, overflow: "linebreak" as const },
    headStyles: {
      fillColor: HEAD_FILL,
      textColor: 255 as const,
      fontStyle: "bold" as const,
      fontSize: 8,
    },
    margin: { left: MARGIN_X, right: MARGIN_X, bottom: 22 },
    didParseCell: zebraBody,
  }
}

async function fetchAllNotes() {
  const pageSize = 100
  let page = 1
  let hasMore = true
  const notes: Awaited<ReturnType<typeof fetchNotesDashboard>>["notes"] = []

  while (hasMore && page <= 20) {
    const dash = await fetchNotesDashboard({
      page,
      page_size: pageSize,
      sort_field: "updated_at",
      sort_order: "desc",
    })
    notes.push(...(dash.notes ?? []))
    hasMore = Boolean(dash.pagination?.has_more)
    page += 1
  }

  return notes
}

export async function exportAstraDataPdf(options: ExportAstraDataOptions) {
  const { user, formatCurrency } = options
  const today = getLocalDateString()
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const lookback = new Date(now)
  lookback.setDate(lookback.getDate() - 30)
  const lookbackStart = getLocalDateString(lookback)

  const [
    tasksDash,
    projects,
    goalsDash,
    habits,
    habitsDay,
    wealth,
    health,
    time,
    notes,
  ] = await Promise.all([
    fetchTasks({ filter: "all" }),
    fetchProjects().catch(() => []),
    fetchGoalsDashboard({ mode: "month", year, month }).catch(() => null),
    fetchHabits().catch(() => []),
    fetchHabitsDay(today).catch(() => null),
    fetchWealthDashboard({ mode: "month", year, month }).catch(() => null),
    fetchHealthDashboard({
      start_date: lookbackStart,
      end_date: today,
      today_date: today,
    }).catch(() => null),
    fetchTimeTrackDashboard({
      start_date: lookbackStart,
      end_date: today,
    }).catch(() => null),
    fetchAllNotes().catch(() => []),
  ])

  const doc = new jsPDF()
  const generatedAt = format(now, "MMM d, yyyy · h:mm a")
  const dateStamp = format(now, "yyyy-MM-dd")
  const userName =
    [user.first_name, user.last_name].filter(Boolean).join(" ").trim() ||
    user.username ||
    user.email
  const filename = `astra-data-export-${dateStamp}.pdf`

  // Cover / header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.setTextColor(8, 145, 178)
  doc.text("ASTRA", MARGIN_X, 22)

  doc.setFontSize(14)
  doc.setTextColor(15, 23, 42)
  doc.text("Complete Data Export", MARGIN_X, 30)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(71, 85, 105)
  doc.text("Assistant for Scheduling, Tasks, Routines & Analytics", MARGIN_X, 37)
  doc.text(`Generated: ${generatedAt}`, MARGIN_X, 44)
  doc.text(`Account: ${user.email || user.username}`, MARGIN_X, 49)

  doc.setDrawColor(8, 145, 178)
  doc.setLineWidth(0.8)
  doc.line(MARGIN_X, 53, CONTENT_RIGHT, 53)

  // Profile
  let y = sectionTitle(doc, "1. Profile", 62)
  autoTable(doc, {
    startY: y,
    head: [["Field", "Value"]],
    body: [
      ["Name", userName],
      ["Username", user.username || "—"],
      ["Email", user.email || "—"],
      ["Timezone", user.timezone || "—"],
      ["Currency", user.currency || "—"],
      ["Country", user.country || "—"],
      ["Theme", user.theme || "—"],
      ["AI insights", user.ai_insights ? "On" : "Off"],
      ["AI personality", user.ai_personality || "—"],
    ],
    ...tableDefaults(),
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold" },
      1: { cellWidth: "auto" },
    },
  })

  // Tasks summary + list
  const tasks = tasksDash.tasks ?? []
  const summary = tasksDash.summary
  y = sectionTitle(doc, "2. Tasks", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Count"]],
    body: [
      ["Total", String(summary?.total ?? tasks.length)],
      ["Upcoming", String(summary?.upcoming ?? "—")],
      ["Overdue", String(summary?.overdue ?? "—")],
      ["Completed", String(summary?.completed ?? "—")],
      ["Undated", String(summary?.undated ?? "—")],
    ],
    ...tableDefaults(),
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold" },
      1: { cellWidth: 40 },
    },
  })

  y = sectionTitle(doc, "Task list", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Title", "Status", "Priority", "Due", "Project / Goal"]],
    body:
      tasks.length > 0
        ? tasks.map((t) => [
            clip(t.title, 40),
            t.completed ? "done" : clip(t.status, 14),
            clip(String(t.priority), 10),
            clip(t.due_date_label || t.due_date, 16),
            clip(t.project_title || t.goal_title, 28),
          ])
        : [emptyRow(5)],
    ...tableDefaults(),
  })

  // Projects
  y = sectionTitle(doc, "3. Projects", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Title", "Status", "Due", "Tasks"]],
    body:
      projects.length > 0
        ? projects.map((p) => [
            clip(p.title, 45),
            clip(p.status_label || String(p.status), 16),
            clip(p.due_date, 16),
            `${p.linked_tasks?.completed ?? 0}/${p.linked_tasks?.total ?? 0}`,
          ])
        : [emptyRow(4)],
    ...tableDefaults(),
  })

  // Goals
  const goals = goalsDash?.goals ?? []
  y = sectionTitle(doc, "4. Goals", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Goal", "Category", "Priority", "Progress", "Target"]],
    body:
      goals.length > 0
        ? goals.map((g) => [
            clip(g.title, 40),
            clip(g.category_label || g.category, 16),
            clip(g.priority, 10),
            `${g.progress}%`,
            clip(g.target_date, 14),
          ])
        : [emptyRow(5)],
    ...tableDefaults(),
  })

  const milestoneRows: string[][] = []
  for (const g of goals) {
    for (const m of g.milestones ?? []) {
      milestoneRows.push([
        clip(g.title, 28),
        clip(m.title, 36),
        clip(m.due_date, 14),
        m.completed ? "Done" : "Open",
      ])
    }
  }
  y = sectionTitle(doc, "Milestones", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Goal", "Milestone", "Due", "Status"]],
    body: milestoneRows.length > 0 ? milestoneRows : [emptyRow(4)],
    ...tableDefaults(),
  })

  // Habits
  y = sectionTitle(doc, "5. Habits", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Habit", "Streak", "Frequency", "Reminder", "Priority"]],
    body:
      habits.length > 0
        ? habits.map((h) => [
            clip(h.name, 36),
            String(h.streak),
            clip(h.frequency, 12),
            clip(h.reminderTime, 10),
            clip(h.priority, 10),
          ])
        : [emptyRow(5)],
    ...tableDefaults(),
  })

  if (habitsDay) {
    y = sectionTitle(doc, `Habits today (${habitsDay.date})`, nextTableStart(doc))
    autoTable(doc, {
      startY: y,
      head: [["Habit", "Status", "Progress"]],
      body:
        habitsDay.items.length > 0
          ? habitsDay.items.map((h) => [
              clip(h.name, 40),
              clip(h.status || (h.completed ? "done" : "pending"), 14),
              `${h.current}/${h.target}`,
            ])
          : [emptyRow(3)],
      ...tableDefaults(),
    })
  }

  // Wealth
  y = sectionTitle(doc, "6. Wealth (this month)", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: wealth
      ? [
          ["Net worth", formatCurrency(wealth.net_worth)],
          ["Monthly income", formatCurrency(wealth.monthly_income)],
          ["Monthly expenses", formatCurrency(wealth.monthly_expenses)],
          ["Net savings", formatCurrency(wealth.net_savings)],
          ["Waste spending", formatCurrency(wealth.waste_spending)],
        ]
      : [emptyRow(2)],
    ...tableDefaults(),
    columnStyles: {
      0: { cellWidth: 55, fontStyle: "bold" },
      1: { cellWidth: "auto" },
    },
  })

  y = sectionTitle(doc, "Budgets", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Category", "Spent", "Limit", "Status"]],
    body:
      wealth && wealth.category_budgets.length > 0
        ? wealth.category_budgets.map((b) => [
            clip(b.label || b.category, 28),
            formatCurrency(b.spent),
            formatCurrency(b.limit),
            clip(b.status, 14),
          ])
        : [emptyRow(4)],
    ...tableDefaults(),
  })

  y = sectionTitle(doc, "Recent transactions", nextTableStart(doc))
  const txns = (wealth?.transactions ?? []).slice(0, 80)
  autoTable(doc, {
    startY: y,
    head: [["Date", "Description", "Category", "Amount"]],
    body:
      txns.length > 0
        ? txns.map((t) => [
            clip(t.date, 12),
            clip(t.description, 40),
            clip(t.category, 16),
            formatCurrency(t.amount),
          ])
        : [emptyRow(4)],
    ...tableDefaults(),
  })

  // Health
  y = sectionTitle(doc, "7. Health", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Today", "Target"]],
    body: health
      ? [
          [
            "Water (glasses)",
            String(health.today.waterGlasses),
            String(health.targets.waterGlasses),
          ],
          [
            "Sleep (hours)",
            String(health.today.sleepHours),
            String(health.targets.sleepHours),
          ],
          [
            "Exercise (min)",
            String(health.today.exerciseMinutes),
            String(health.targets.exerciseMinutes),
          ],
          ["Health score", String(health.healthScore), "—"],
          [
            "Latest weight",
            health.latestWeightKg != null ? `${health.latestWeightKg} kg` : "—",
            "—",
          ],
          ["Mood today", clip(health.moodToday?.mood, 20), "—"],
        ]
      : [emptyRow(3)],
    ...tableDefaults(),
  })

  if (health && health.workouts.length > 0) {
    y = sectionTitle(doc, "Recent workouts", nextTableStart(doc))
    autoTable(doc, {
      startY: y,
      head: [["Date", "Type", "Duration", "Calories"]],
      body: health.workouts.slice(0, 40).map((w) => [
        clip(w.date, 12),
        clip(w.type, 24),
        `${w.duration} min`,
        String(w.calories),
      ]),
      ...tableDefaults(),
    })
  }

  // Time track
  y = sectionTitle(doc, "8. Time tracking (last 30 days)", nextTableStart(doc))
  const totalHours = time
    ? (time.summary.totalSeconds / 3600).toFixed(1)
    : "—"
  const todayHours = time
    ? (time.summary.todayTotalSeconds / 3600).toFixed(1)
    : "—"
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: time
      ? [
          ["Total focus hours", `${totalHours} h`],
          ["Today focus hours", `${todayHours} h`],
          ["Sessions", String(time.summary.sessionCount)],
          ["Entries listed", String(time.entries.length)],
        ]
      : [emptyRow(2)],
    ...tableDefaults(),
    columnStyles: {
      0: { cellWidth: 55, fontStyle: "bold" },
      1: { cellWidth: "auto" },
    },
  })

  const entries = time?.entries ?? []
  if (entries.length > 0) {
    y = sectionTitle(doc, "Time entries", nextTableStart(doc))
    autoTable(doc, {
      startY: y,
      head: [["Date", "Task", "Start", "End", "Duration"]],
      body: entries.slice(0, 80).map((e) => {
        const mins = Math.round(e.durationSeconds / 60)
        const durationLabel =
          mins >= 60 ? `${(mins / 60).toFixed(1)} h` : `${mins} min`
        return [
          clip(e.date, 12),
          clip(e.taskTitle, 40),
          clip(e.startTime, 10),
          clip(e.endTime, 10),
          durationLabel,
        ]
      }),
      ...tableDefaults(),
    })
  }

  // Notes
  y = sectionTitle(doc, "9. Notes", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Title", "Type", "Status", "Priority", "Updated"]],
    body:
      notes.length > 0
        ? notes.map((n) => [
            clip(n.title || "Untitled", 36),
            clip(n.note_type, 16),
            clip(n.status, 12),
            clip(n.priority, 10),
            clip(n.updated_at?.slice(0, 10), 12),
          ])
        : [emptyRow(5)],
    ...tableDefaults(),
  })

  // TOC-style closing summary
  y = sectionTitle(doc, "10. Export summary", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Domain", "Records included"]],
    body: [
      ["Tasks", String(tasks.length)],
      ["Projects", String(projects.length)],
      ["Goals", String(goals.length)],
      ["Milestones", String(milestoneRows.length)],
      ["Habits", String(habits.length)],
      ["Transactions", String(txns.length)],
      ["Budgets", String(wealth?.category_budgets.length ?? 0)],
      ["Notes", String(notes.length)],
      ["Time entries", String(Math.min(entries.length, 80))],
      ["Workouts", String(Math.min(health?.workouts.length ?? 0, 40))],
    ],
    ...tableDefaults(),
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold" },
      1: { cellWidth: 40 },
    },
  })

  addFooter(doc, userName)
  doc.save(filename)
  return filename
}
