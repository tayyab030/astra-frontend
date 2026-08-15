import { format } from "date-fns"
import jsPDF from "jspdf"
import autoTable, { type CellHookData } from "jspdf-autotable"
import type { AnalyticsComputed } from "./computeAnalytics"

export type ExportAnalyticsOptions = {
  formatCurrency: (amount: number) => string
  userName?: string
}

const MARGIN_X = 14
const PAGE_WIDTH = 210
const CONTENT_RIGHT = PAGE_WIDTH - MARGIN_X
const HEAD_FILL: [number, number, number] = [100, 116, 139]
const ALT_ROW: [number, number, number] = [241, 247, 255]

function deltaLabel(current: number, previous: number) {
  const delta = current - previous
  if (delta === 0) return "0"
  return delta > 0 ? `+${delta}` : `${delta}`
}

function addFooter(doc: jsPDF, userName: string) {
  const pageCount = doc.getNumberOfPages()
  const timestamp = format(new Date(), "MMM-dd-yyyy @ hh:mm a")
  const who = userName.trim() || "you"
  const footerText = `Report generated for ${who} on ${timestamp}`

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const pageHeight = doc.internal.pageSize.height
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text(footerText, MARGIN_X, pageHeight - 12)
    doc.text(`${i}/${pageCount}`, CONTENT_RIGHT, pageHeight - 12, { align: "right" })
    doc.setTextColor(0, 0, 0)
  }
}

function sectionTitle(doc: jsPDF, title: string, y: number) {
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
  data.cell.styles.fillColor = data.row.index % 2 === 0 ? ALT_ROW : [255, 255, 255]
}

function nextTableStart(doc: jsPDF, fallback = 40) {
  const last = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
  return last ? last.finalY + 12 : fallback
}

export function exportAnalyticsReport(
  analytics: AnalyticsComputed,
  options: ExportAnalyticsOptions
) {
  const { formatCurrency, userName = "" } = options
  const doc = new jsPDF()
  const generatedAt = format(new Date(), "MMM d, yyyy · h:mm a")
  const dateStamp = format(new Date(), "yyyy-MM-dd")
  const filename = `astra-analytics-${analytics.period}-${dateStamp}.pdf`

  // Header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.setTextColor(8, 145, 178)
  doc.text("Astra Analytics Report", MARGIN_X, 20)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105)
  doc.text("Personal Life Intelligence Report", MARGIN_X, 27)

  doc.setFontSize(9)
  doc.text(`Period: ${analytics.periodLabel} (${analytics.period})`, MARGIN_X, 35)
  doc.text(`Generated: ${generatedAt}`, MARGIN_X, 40)

  doc.setDrawColor(8, 145, 178)
  doc.setLineWidth(0.8)
  doc.line(MARGIN_X, 44, CONTENT_RIGHT, 44)

  // Life Score overview
  let y = sectionTitle(doc, "Life Score", 54)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(22)
  doc.setTextColor(8, 145, 178)
  doc.text(`${analytics.lifeScoreOverall}`, MARGIN_X, y + 8)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(71, 85, 105)
  doc.text(
    `Previous period: ${analytics.previousLifeScoreOverall}  ·  Δ ${deltaLabel(
      analytics.lifeScoreOverall,
      analytics.previousLifeScoreOverall
    )}`,
    MARGIN_X + 28,
    y + 8
  )
  doc.setTextColor(0, 0, 0)

  autoTable(doc, {
    startY: y + 14,
    head: [["Category", "Score", "Previous", "Change", "Trend"]],
    body: analytics.categories.map((category) => [
      category.name,
      String(category.score),
      String(category.previousScore),
      deltaLabel(category.score, category.previousScore),
      category.trend,
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: HEAD_FILL, textColor: 255, fontStyle: "bold" },
    margin: { left: MARGIN_X, right: MARGIN_X, bottom: 22 },
    didParseCell: zebraBody,
  })

  // Snapshot
  const snapshot = analytics.dailySnapshot
  y = sectionTitle(doc, "Period Snapshot", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Tasks completed", String(snapshot.tasksCompleted)],
      ["Tasks pending", String(snapshot.tasksPending)],
      ["Spending", formatCurrency(snapshot.spending)],
      ["Budget", formatCurrency(snapshot.budget)],
      [
        "Exercise",
        `${snapshot.exerciseMinutes} / ${snapshot.exerciseGoal} min`,
      ],
      ["Notes created", String(snapshot.notesCreated)],
      ["Focus hours", String(snapshot.focusHours)],
    ],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: HEAD_FILL, textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 70, fontStyle: "bold" },
      1: { cellWidth: "auto" },
    },
    margin: { left: MARGIN_X, right: MARGIN_X, bottom: 22 },
    didParseCell: zebraBody,
  })

  // Summary
  y = sectionTitle(doc, "Summary", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Overdue tasks", String(analytics.summary.overdueTasks)],
      ["Active goals", String(analytics.summary.activeGoals)],
      ["Habit streak", String(analytics.summary.habitStreak)],
      ["Net savings", formatCurrency(analytics.summary.netSavings)],
      [
        "Sleep (today)",
        `${analytics.summary.sleepHoursToday} / ${analytics.summary.sleepTarget} h`,
      ],
      ["Notes this week", String(analytics.summary.notesThisWeek)],
      ["Notes in period", String(analytics.summary.notesInPeriod)],
      ["Budgets over", String(analytics.summary.budgetsOver)],
    ],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: HEAD_FILL, textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 70, fontStyle: "bold" },
      1: { cellWidth: "auto" },
    },
    margin: { left: MARGIN_X, right: MARGIN_X, bottom: 22 },
    didParseCell: zebraBody,
  })

  // Goals
  y = sectionTitle(doc, "Goal Progress", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Goal", "Category", "Progress"]],
    body:
      analytics.goalProgress.length > 0
        ? analytics.goalProgress.map((goal) => [
            goal.title,
            goal.categoryLabel,
            `${goal.progress}%`,
          ])
        : [["No goals in this period", "—", "—"]],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: HEAD_FILL, textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 45 },
      2: { cellWidth: 30 },
    },
    margin: { left: MARGIN_X, right: MARGIN_X, bottom: 22 },
    didParseCell: zebraBody,
  })

  // Highlights
  y = sectionTitle(doc, "Highlights", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Highlight", "Value"]],
    body:
      analytics.weeklyHighlights.length > 0
        ? analytics.weeklyHighlights.map((item) => [item.title, item.value])
        : [["None", "—"]],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: HEAD_FILL, textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: "bold" },
      1: { cellWidth: "auto" },
    },
    margin: { left: MARGIN_X, right: MARGIN_X, bottom: 22 },
    didParseCell: zebraBody,
  })

  // Achievements
  y = sectionTitle(doc, "Achievements", nextTableStart(doc))
  autoTable(doc, {
    startY: y,
    head: [["Status", "Achievement", "Description"]],
    body: analytics.achievements.map((item) => [
      item.earned ? "Earned" : "Locked",
      item.name,
      item.description,
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: HEAD_FILL, textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 45 },
      2: { cellWidth: "auto" },
    },
    margin: { left: MARGIN_X, right: MARGIN_X, bottom: 22 },
    didParseCell: zebraBody,
  })

  // Expenses
  if (analytics.expenseDistribution.length > 0) {
    y = sectionTitle(doc, "Expense Distribution", nextTableStart(doc))
    autoTable(doc, {
      startY: y,
      head: [["Category", "Amount"]],
      body: analytics.expenseDistribution.map((slice) => [
        slice.label || slice.category,
        formatCurrency(slice.value),
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: HEAD_FILL, textColor: 255, fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 50 },
      },
      margin: { left: MARGIN_X, right: MARGIN_X, bottom: 22 },
      didParseCell: zebraBody,
    })
  }

  addFooter(doc, userName)
  doc.save(filename)
  return filename
}
