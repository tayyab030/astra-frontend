import { Skeleton } from "@/components/ui/skeleton"

export default function NotesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 space-y-6">
      <Skeleton className="h-10 w-64 bg-slate-800/50" />
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 bg-slate-800/50" />
        ))}
      </div>
      <Skeleton className="h-10 w-full bg-slate-800/50" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 bg-slate-800/50" />
        ))}
      </div>
    </div>
  )
}
