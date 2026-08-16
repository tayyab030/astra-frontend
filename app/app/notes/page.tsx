"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { NotesProvider } from "./_context/NotesProvider"
import { NavigationTabs } from "./_components/NavigationTabs"
import { NotesStatsRow } from "./_components/NotesStatsRow"
import { NotesContent } from "./_components/NotesContent"
import { useNotes } from "./_hooks/useNotes"
import type { NoteTabId } from "./_types/notes.types"
import { NOTES_TABS } from "./_components/constants"

function isNoteTab(value: string | null): value is NoteTabId {
  return NOTES_TABS.some((tab) => tab.id === value) || value === "archive"
}

function NotesPageInner() {
  const { activeTab, setActiveTab } = useNotes()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (isNoteTab(tab)) setActiveTab(tab)
  }, [searchParams, setActiveTab])

  return (
    <div className="astra-page">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="astra-title">Notes</h1>
          <p className="astra-subtitle mt-1">
            Your personal second brain — capture, organize, and connect ideas
          </p>
        </div>
      </div>

      <NotesStatsRow />

      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <NotesContent />
    </div>
  )
}

export default function NotesPage() {
  return (
    <NotesProvider>
      <NotesPageInner />
    </NotesProvider>
  )
}
