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

export default function DashboardPage() {
  // const renderContent = () => {
  //   switch (activeTab) {
  //     case "tasks":
  //       return <TasksPage />;
  //     case "goals":
  //       return <GoalsPage />;
  //     case "wealth":
  //       return <WealthPage />;
  //     case "health":
  //       return <HealthPage />;
  //     case "notes":
  //       return <NotesPage />;
  //     case "communication":
  //       return <CommunicationPage />;
  //     case "analytics":
  //       return <AnalyticsPage />;
  //     case "life-score":
  //       return <LifeScorePage />;
  //     case "settings":
  //       return <SettingsPage />;
  //     case "assistant":
  //       return <AssistantPage />;
  //     default:
  //       return renderDashboard();
  //   }
  // };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-cyan-300">
              Good morning, Tayyab 🚀
            </h1>
            <p className="text-slate-300 font-inter mt-1">
              "Success is the sum of small efforts repeated day in and day out."
            </p>
          </div>
          <Badge
            variant="secondary"
            className="text-lg px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-lg shadow-cyan-500/25"
          >
            <Star className="mr-2 h-4 w-4" />
            Life Score: 85
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-cyan-300">
                Tasks Due Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-cyan-200">
                5
              </div>
              <p className="text-xs text-slate-400">2 completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/30 backdrop-blur-sm shadow-lg shadow-blue-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-blue-300">
                Daily Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-blue-200">
                $47
              </div>
              <p className="text-xs text-slate-400">Budget: $80</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-400/30 backdrop-blur-sm shadow-lg shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-cyan-300">
                Health Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Water</span>
                  <span>6/8 glasses</span>
                </div>
                <Progress value={75} className="h-2 bg-slate-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-400/30 backdrop-blur-sm shadow-lg shadow-blue-400/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-inter text-blue-300">
                Focus Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-poppins text-blue-200">
                3.2h
              </div>
              <p className="text-xs text-slate-400">4 Pomodoros</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-poppins text-cyan-300">
              Weekly Expenses
            </CardTitle>
            <CardDescription className="font-inter text-slate-400">
              Your spending vs income this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-slate-400">
              <BarChart3 className="h-12 w-12" />
              <span className="ml-2">Chart visualization</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-poppins text-cyan-300">
              Habit Streaks
            </CardTitle>
            <CardDescription className="font-inter text-slate-400">
              Your consistency over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-slate-400">
              <TrendingUp className="h-12 w-12" />
              <span className="ml-2">Streak visualization</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8 bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-poppins flex items-center">
            <Zap className="mr-2 h-5 w-5 text-cyan-400" />
            <span className="text-cyan-300">Smart Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg border border-cyan-500/30">
              <p className="text-sm font-inter text-slate-200">
                🎉 You spent 20% less this week than last week!
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg border border-blue-500/30">
              <p className="text-sm font-inter text-slate-200">
                🔥 You've kept a 10-day streak on workouts—keep going!
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-slate-800/30 to-slate-700/30 rounded-lg border border-slate-500/30">
              <p className="text-sm font-inter text-slate-200">
                ⚠️ 3 tasks are overdue. Suggest rescheduling?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-poppins text-cyan-300">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-20 flex-col font-inter bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 hover:border-cyan-400/50 text-cyan-300 hover:text-cyan-200 backdrop-blur-sm"
            >
              <Plus className="h-5 w-5 mb-2" />
              <span>Add Task</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col font-inter bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/30 hover:border-blue-400/50 text-blue-300 hover:text-blue-200 backdrop-blur-sm"
            >
              <DollarSign className="h-5 w-5 mb-2" />
              <span>Log Expense</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col font-inter bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-400/30 hover:border-cyan-300/50 text-cyan-300 hover:text-cyan-200 backdrop-blur-sm"
            >
              <Heart className="h-5 w-5 mb-2" />
              <span>Log Habit</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col font-inter bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-400/30 hover:border-blue-300/50 text-blue-300 hover:text-blue-200 backdrop-blur-sm"
            >
              <FileText className="h-5 w-5 mb-2" />
              <span>Quick Note</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
