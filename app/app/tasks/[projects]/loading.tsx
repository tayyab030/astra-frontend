import {
  ListRowsSkeleton,
  PageHeaderSkeleton,
  TabStripSkeleton,
} from "@/components/skeletons"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="astra-page space-y-6">
      <PageHeaderSkeleton withActions />
      <TabStripSkeleton count={4} />
      <Card className="astra-card">
        <CardContent className="p-4">
          <ListRowsSkeleton count={6} />
        </CardContent>
      </Card>
    </div>
  )
}
