"use client"

import { NotesProvider } from "./_context/NotesProvider"
import { NavigationTabs } from "./_components/NavigationTabs"
import { NotesStatsRow } from "./_components/NotesStatsRow"
import { NotesContent } from "./_components/NotesContent"
import { useNotes } from "./_hooks/useNotes"

function NotesPageInner() {
  const { activeTab, setActiveTab } = useNotes()

  return (
    <div className="astra-page">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="astra-title text-3xl md:text-4xl">
            Notes & Knowledge
          </h1>
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
