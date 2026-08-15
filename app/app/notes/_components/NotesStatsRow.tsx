"use client"

import {
  FileText,
  TrendingUp,
  Lightbulb,
  BookOpen,
  Star,
  Link,
  Brain,
  Gavel,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useNotes } from "../_hooks/useNotes"
import { cardClassName } from "./constants"

export function NotesStatsRow() {
  const { stats } = useNotes()

  const cards = [
    { title: "Total Notes", value: stats.totalNotes, icon: FileText, color: "cyan" },
    { title: "This Week", value: stats.notesThisWeek, icon: TrendingUp, color: "blue" },
    { title: "Ideas", value: stats.ideasCreated, icon: Lightbulb, color: "yellow" },
    { title: "Books Read", value: stats.booksRead, icon: BookOpen, color: "purple" },
    { title: "Journal Streak", value: `${stats.journalStreak}d`, icon: Star, color: "cyan" },
    { title: "Research Done", value: stats.researchCompleted, icon: Brain, color: "green" },
    { title: "Decision Accuracy", value: `${stats.decisionAccuracy}%`, icon: Gavel, color: "orange" },
    { title: "Top Tag", value: stats.topTags[0]?.tag ?? "—", icon: Link, color: "blue" },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.title}
            className={`${cardClassName} border-${card.color}-500/20 hover:shadow-lg transition-shadow`}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-inter text-slate-400 truncate">{card.title}</p>
                  <p className="text-lg font-bold font-poppins text-cyan-300 truncate">{card.value}</p>
                </div>
                <Icon className="h-5 w-5 text-cyan-400 shrink-0" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
