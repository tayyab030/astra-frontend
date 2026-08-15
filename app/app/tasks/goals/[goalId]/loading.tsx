import {
  ListRowsSkeleton,
  PageHeaderSkeleton,
  StatCardsSkeleton,
} from "@/components/skeletons"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="astra-page space-y-6">
      <PageHeaderSkeleton withActions />
      <StatCardsSkeleton count={3} />
      <Card className="astra-card">
        <CardContent className="p-4">
          <ListRowsSkeleton count={5} />
        </CardContent>
      </Card>
    </div>
  )
}
