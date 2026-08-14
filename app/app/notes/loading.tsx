import { Skeleton } from "@/components/ui/skeleton"

export default function NotesLoading() {
  return (
    <div className="astra-page">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </div>
  )
}
