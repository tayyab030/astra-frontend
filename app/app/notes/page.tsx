"use client"

import { NotesProvider } from "./_context/NotesProvider"
import { NotesPageBackground } from "./_components/NotesPageBackground"
import { NavigationTabs } from "./_components/NavigationTabs"
import { NotesStatsRow } from "./_components/NotesStatsRow"
import { NotesContent } from "./_components/NotesContent"
import { useNotes } from "./_hooks/useNotes"

function NotesPageInner() {
  const { activeTab, setActiveTab } = useNotes()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <NotesPageBackground />

      <div className="relative z-10 p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-poppins text-cyan-300">
              Notes & Knowledge
            </h1>
            <p className="text-slate-300 font-inter mt-1">
              Your personal second brain — capture, organize, and connect ideas
            </p>
          </div>
        </div>

        <NotesStatsRow />

        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <NotesContent />
      </div>
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
