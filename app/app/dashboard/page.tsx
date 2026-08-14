"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Heart,
  FileText,
  BarChart3,
  Star,
  Plus,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

export default function DashboardPage() {
  const { formatCurrency } = useCurrency();

  return (
    <div className="astra-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="astra-title">
            Good morning, Tayyab 🚀
          </h1>
          <p className="astra-subtitle mt-1">
            &quot;Success is the sum of small efforts repeated day in and day out.&quot;
          </p>
        </div>
        <Badge
          variant="secondary"
          className="astra-score-badge text-lg px-4 py-2"
        >
          <Star className="mr-2 h-4 w-4" />
          Life Score: 85
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="astra-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">
              Tasks Due Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              5
            </div>
            <p className="text-xs text-muted-foreground">2 completed</p>
          </CardContent>
        </Card>

        <Card className="astra-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">
              Daily Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(47)}
            </div>
            <p className="text-xs text-muted-foreground">Budget: {formatCurrency(80)}</p>
          </CardContent>
        </Card>

        <Card className="astra-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">
              Health Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Water</span>
                <span>6/8 glasses</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="astra-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">
              Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              3.2h
            </div>
            <p className="text-xs text-muted-foreground">4 Pomodoros</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="text-primary">
              Weekly Expenses
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your spending vs income this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <BarChart3 className="h-12 w-12" />
              <span className="ml-2">Chart visualization</span>
            </div>
          </CardContent>
        </Card>

        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="text-primary">
              Habit Streaks
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your consistency over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <TrendingUp className="h-12 w-12" />
              <span className="ml-2">Streak visualization</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="astra-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5 text-primary" />
            <span className="text-primary">Smart Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 astra-panel">
              <p className="text-sm">
                🎉 You spent 20% less this week than last week!
              </p>
            </div>
            <div className="p-3 astra-panel">
              <p className="text-sm">
                🔥 You&apos;ve kept a 10-day streak on workouts—keep going!
              </p>
            </div>
            <div className="p-3 astra-panel">
              <p className="text-sm">
                ⚠️ 3 tasks are overdue. Suggest rescheduling?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="astra-card">
        <CardHeader>
          <CardTitle className="text-primary">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-20 flex-col astra-panel text-primary hover:text-primary"
            >
              <Plus className="h-5 w-5 mb-2" />
              <span>Add Task</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col astra-panel text-primary hover:text-primary"
            >
              <DollarSign className="h-5 w-5 mb-2" />
              <span>Log Expense</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col astra-panel text-primary hover:text-primary"
            >
              <Heart className="h-5 w-5 mb-2" />
              <span>Log Habit</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col astra-panel text-primary hover:text-primary"
            >
              <FileText className="h-5 w-5 mb-2" />
              <span>Quick Note</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
