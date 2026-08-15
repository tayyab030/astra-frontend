import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function PageHeaderSkeleton({
  withActions = false,
  className,
}: {
  withActions?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="space-y-2">
        <Skeleton className="h-9 w-48 sm:h-10 sm:w-72" />
        <Skeleton className="h-4 w-64 max-w-full sm:w-96" />
      </div>
      {withActions ? (
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-16" />
        </div>
      ) : null}
    </div>
  )
}

export function StatCardsSkeleton({
  count = 4,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 md:grid-cols-4",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="astra-card">
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function TabStripSkeleton({
  count = 5,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-9 w-24 rounded-lg" />
      ))}
    </div>
  )
}

export function ChartCardSkeleton({
  className,
  chartHeight = "h-48",
}: {
  className?: string
  chartHeight?: string
}) {
  return (
    <Card className={cn("astra-card", className)}>
      <CardHeader className="space-y-2 pb-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className={cn("w-full rounded-lg", chartHeight)} />
      </CardContent>
    </Card>
  )
}

export function ListRowSkeleton({
  withAvatar = true,
  withMeta = true,
}: {
  withAvatar?: boolean
  withMeta?: boolean
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card/60 p-3">
      {withAvatar ? <Skeleton className="h-10 w-10 shrink-0 rounded-full" /> : null}
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-40 sm:w-56" />
        {withMeta ? <Skeleton className="h-3 w-28 sm:w-40" /> : null}
      </div>
      <Skeleton className="h-6 w-14 shrink-0 rounded-full" />
    </div>
  )
}

export function ListRowsSkeleton({
  count = 5,
  withAvatar = true,
  className,
}: {
  count?: number
  withAvatar?: boolean
  className?: string
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <ListRowSkeleton key={index} withAvatar={withAvatar} />
      ))}
    </div>
  )
}

export function CardGridSkeleton({
  count = 6,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="astra-card">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ProgressBlockSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Generic tab body: metrics + chart/list panels — mimics most module tabs */
export function TabPanelSkeleton({
  tall = false,
  className,
}: {
  tall?: boolean
  className?: string
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <StatCardsSkeleton count={tall ? 4 : 3} />
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          tall ? "lg:grid-cols-2" : ""
        )}
      >
        <ChartCardSkeleton chartHeight={tall ? "h-56" : "h-40"} />
        {tall ? <ChartCardSkeleton chartHeight="h-56" /> : null}
      </div>
      {!tall ? <ListRowsSkeleton count={3} /> : null}
    </div>
  )
}

export function FormProfileSkeleton() {
  return (
    <Card className="astra-card">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function LifeScorePageSkeleton() {
  return (
    <div className="astra-page space-y-8">
      <PageHeaderSkeleton withActions />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="astra-card lg:col-span-2">
          <CardHeader className="space-y-4 pb-4 text-center">
            <Skeleton className="mx-auto h-20 w-20 rounded-full" />
            <Skeleton className="mx-auto h-14 w-32" />
            <Skeleton className="mx-auto h-6 w-24" />
          </CardHeader>
          <CardContent className="space-y-3 text-center">
            <Skeleton className="mx-auto h-5 w-48" />
            <Skeleton className="mx-auto h-4 w-64" />
          </CardContent>
        </Card>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="astra-card">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Card className="astra-card">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <ProgressBlockSkeleton count={4} />
        </CardContent>
      </Card>
    </div>
  )
}

export function AnalyticsPageSkeleton() {
  return (
    <div className="astra-page space-y-8">
      <PageHeaderSkeleton withActions />
      <Card className="astra-card">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <ProgressBlockSkeleton count={4} />
        </CardContent>
      </Card>
      <StatCardsSkeleton count={4} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <ChartCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

export function NotesPageSkeleton() {
  return (
    <div className="astra-page space-y-6">
      <PageHeaderSkeleton />
      <StatCardsSkeleton count={8} className="md:grid-cols-4 xl:grid-cols-8" />
      <TabStripSkeleton count={4} />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        <Card className="astra-card hidden lg:block">
          <CardContent className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-full" />
            ))}
          </CardContent>
        </Card>
        <CardGridSkeleton count={6} />
      </div>
    </div>
  )
}

export function DashboardPageSkeleton() {
  return (
    <div className="astra-page space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>
      <StatCardsSkeleton count={4} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="astra-card">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card className="astra-card">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </div>
      <Card className="astra-card">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </CardContent>
      </Card>
      <Card className="astra-card">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function SettingsPageSkeleton() {
  return (
    <div className="astra-page space-y-8">
      <PageHeaderSkeleton withActions />
      <TabStripSkeleton count={6} />
      <FormProfileSkeleton />
    </div>
  )
}

export function HabitsOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <StatCardsSkeleton count={4} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCardSkeleton chartHeight="h-56" />
        <ChartCardSkeleton chartHeight="h-56" />
      </div>
      <Card className="astra-card">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
