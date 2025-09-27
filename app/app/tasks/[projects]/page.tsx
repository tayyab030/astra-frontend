"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Calendar,
  List,
  Kanban,
  Clock,
  Zap,
  Target,
  CheckCircle2,
  Circle,
  Star,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Paperclip,
  GripVertical,
  ChevronLeft,
} from "lucide-react";
import dynamic from "next/dynamic";
import ProjectHeader from "./_components/ProjectHeader";
import NavigationTabs from "./_components/NavigationTabs";

const Wrapper = dynamic(() => import("../_components/Wrapper"), { ssr: false });

export default function TasksPage() {
  const [currentView, setCurrentView] = useState("list");
  const [selectedProject, setSelectedProject] = useState("my-tasks");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    starred: true,
    projects: true,
  });
  const [draggedTask, setDraggedTask] = useState<number | null>(null);
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("due-date");
  const [calendarView, setCalendarView] = useState<"month" | "week" | "year">(
    "month"
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [taskList, setTaskList] = useState([
    {
      id: 1,
      title: "Complete ASTRA dashboard design",
      description: "Finalize the dashboard layout with all modules integrated",
      priority: "high",
      status: "todo",
      dueDate: "2024-01-15",
      assignee: "You",
      tags: ["design", "ui/ux"],
      project: "astra-dashboard",
      subtasks: 3,
      completedSubtasks: 1,
      comments: 2,
      attachments: 1,
    },
    {
      id: 2,
      title: "Review quarterly budget analysis",
      description:
        "Analyze spending patterns and adjust budget for next quarter",
      priority: "medium",
      status: "todo",
      dueDate: "2024-01-20",
      assignee: "You",
      tags: ["finance", "planning"],
      project: "quarterly-review",
      subtasks: 5,
      completedSubtasks: 0,
      comments: 0,
      attachments: 2,
    },
    {
      id: 3,
      title: "Morning workout routine",
      description: "30-minute cardio + strength training",
      priority: "low",
      status: "in-progress",
      dueDate: "2024-01-10",
      assignee: "You",
      tags: ["health", "routine"],
      project: "health-tracking",
      subtasks: 2,
      completedSubtasks: 2,
      comments: 1,
      attachments: 0,
    },
    {
      id: 4,
      title: "User research interviews for dashboard feedback",
      description: "Conduct 5 user interviews for dashboard feedback",
      priority: "high",
      status: "todo",
      dueDate: "2024-01-18",
      assignee: "Sarah",
      tags: ["research", "user-feedback"],
      project: "astra-dashboard",
      subtasks: 5,
      completedSubtasks: 1,
      comments: 4,
      attachments: 0,
    },
    {
      id: 5,
      title: "API integration testing",
      description: "Test all API endpoints for the new features",
      priority: "medium",
      status: "in-progress",
      dueDate: "2024-01-16",
      assignee: "Mike",
      tags: ["development", "testing"],
      project: "astra-dashboard",
      subtasks: 8,
      completedSubtasks: 3,
      comments: 6,
      attachments: 1,
    },
    {
      id: 6,
      title: "Design system documentation update",
      description: "Document all components and design patterns",
      priority: "low",
      status: "review",
      dueDate: "2024-01-22",
      assignee: "Alex",
      tags: ["documentation", "design"],
      project: "astra-dashboard",
      subtasks: 4,
      completedSubtasks: 4,
      comments: 2,
      attachments: 3,
    },
    {
      id: 7,
      title: "Weekly meal prep",
      description: "Prepare healthy meals for the week",
      priority: "medium",
      status: "done",
      dueDate: "2024-01-08",
      assignee: "You",
      tags: ["health", "nutrition"],
      project: "health-tracking",
      subtasks: 3,
      completedSubtasks: 3,
      comments: 0,
      attachments: 0,
    },
    {
      id: 8,
      title: "Budget analysis report generation",
      description: "Generate comprehensive budget analysis",
      priority: "high",
      status: "done",
      dueDate: "2024-01-05",
      assignee: "You",
      tags: ["finance", "reporting"],
      project: "quarterly-review",
      subtasks: 6,
      completedSubtasks: 6,
      comments: 3,
      attachments: 2,
    },
    {
      id: 9,
      title: "Neural network optimization research",
      description: "Research latest optimization techniques for AI models",
      priority: "high",
      status: "todo",
      dueDate: "2024-01-12",
      assignee: "You",
      tags: ["ai", "research"],
      project: "astra-dashboard",
      subtasks: 4,
      completedSubtasks: 0,
      comments: 1,
      attachments: 0,
    },
    {
      id: 10,
      title: "Security audit implementation",
      description: "Implement security recommendations from audit",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-01-14",
      assignee: "Mike",
      tags: ["security", "implementation"],
      project: "astra-dashboard",
      subtasks: 7,
      completedSubtasks: 2,
      comments: 5,
      attachments: 1,
    },
    {
      id: 11,
      title: "Client presentation preparation",
      description: "Prepare slides and demo for client meeting",
      priority: "medium",
      status: "todo",
      dueDate: "2024-01-17",
      assignee: "Sarah",
      tags: ["presentation", "client"],
      project: "quarterly-review",
      subtasks: 3,
      completedSubtasks: 1,
      comments: 2,
      attachments: 0,
    },
    {
      id: 12,
      title: "Database performance optimization",
      description: "Optimize database queries for better performance",
      priority: "medium",
      status: "review",
      dueDate: "2024-01-19",
      assignee: "Alex",
      tags: ["database", "performance"],
      project: "astra-dashboard",
      subtasks: 5,
      completedSubtasks: 5,
      comments: 3,
      attachments: 2,
    },
    {
      id: 13,
      title: "Mobile app responsive design fixes",
      description: "Fix responsive design issues on mobile devices",
      priority: "low",
      status: "todo",
      dueDate: "2024-01-21",
      assignee: "You",
      tags: ["mobile", "responsive"],
      project: "astra-dashboard",
      subtasks: 6,
      completedSubtasks: 0,
      comments: 0,
      attachments: 1,
    },
    {
      id: 14,
      title: "Team standup meeting",
      description: "Weekly team sync and progress review",
      priority: "low",
      status: "todo",
      dueDate: "2024-01-11",
      assignee: "You",
      tags: ["meeting", "team"],
      project: "quarterly-review",
      subtasks: 1,
      completedSubtasks: 0,
      comments: 0,
      attachments: 0,
    },
    {
      id: 15,
      title: "Code review for authentication module",
      description: "Review and approve authentication system changes",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-01-13",
      assignee: "Mike",
      tags: ["code-review", "auth"],
      project: "astra-dashboard",
      subtasks: 2,
      completedSubtasks: 1,
      comments: 4,
      attachments: 0,
    },
    {
      id: 16,
      title: "Q3 Performance Review Preparation",
      description: "Prepare documentation and metrics for quarterly review",
      priority: "high",
      status: "todo",
      dueDate: "2024-09-05",
      assignee: "You",
      tags: ["review", "quarterly"],
      project: "quarterly-review",
      subtasks: 4,
      completedSubtasks: 0,
      comments: 1,
      attachments: 2,
    },
    {
      id: 17,
      title: "Neural Network Model Training",
      description: "Train new AI model with updated dataset",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-09-08",
      assignee: "Alex",
      tags: ["ai", "training"],
      project: "astra-dashboard",
      subtasks: 6,
      completedSubtasks: 2,
      comments: 3,
      attachments: 1,
    },
    {
      id: 18,
      title: "September Fitness Challenge Setup",
      description: "Plan and organize monthly fitness goals",
      priority: "medium",
      status: "todo",
      dueDate: "2024-09-10",
      assignee: "You",
      tags: ["health", "challenge"],
      project: "health-tracking",
      subtasks: 3,
      completedSubtasks: 0,
      comments: 0,
      attachments: 0,
    },
    {
      id: 19,
      title: "Client Demo Presentation",
      description: "Prepare comprehensive demo for major client",
      priority: "high",
      status: "todo",
      dueDate: "2024-09-12",
      assignee: "Sarah",
      tags: ["presentation", "client"],
      project: "quarterly-review",
      subtasks: 5,
      completedSubtasks: 1,
      comments: 2,
      attachments: 3,
    },
    {
      id: 20,
      title: "Database Migration Planning",
      description: "Plan migration strategy for new database architecture",
      priority: "medium",
      status: "review",
      dueDate: "2024-09-15",
      assignee: "Mike",
      tags: ["database", "migration"],
      project: "astra-dashboard",
      subtasks: 7,
      completedSubtasks: 5,
      comments: 4,
      attachments: 2,
    },
    {
      id: 21,
      title: "Weekly Meal Prep Automation",
      description: "Set up automated meal planning system",
      priority: "low",
      status: "todo",
      dueDate: "2024-09-18",
      assignee: "You",
      tags: ["health", "automation"],
      project: "health-tracking",
      subtasks: 2,
      completedSubtasks: 0,
      comments: 1,
      attachments: 0,
    },
    {
      id: 22,
      title: "Security Audit Implementation",
      description: "Implement security recommendations from audit",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-09-20",
      assignee: "Alex",
      tags: ["security", "audit"],
      project: "astra-dashboard",
      subtasks: 8,
      completedSubtasks: 3,
      comments: 6,
      attachments: 1,
    },
    {
      id: 23,
      title: "Budget Analysis for Q4",
      description: "Analyze spending patterns and prepare Q4 budget",
      priority: "medium",
      status: "todo",
      dueDate: "2024-09-22",
      assignee: "You",
      tags: ["finance", "planning"],
      project: "quarterly-review",
      subtasks: 4,
      completedSubtasks: 0,
      comments: 0,
      attachments: 1,
    },
    {
      id: 24,
      title: "Mobile App UI Optimization",
      description: "Optimize mobile interface for better performance",
      priority: "medium",
      status: "review",
      dueDate: "2024-09-25",
      assignee: "Sarah",
      tags: ["mobile", "optimization"],
      project: "astra-dashboard",
      subtasks: 5,
      completedSubtasks: 4,
      comments: 2,
      attachments: 0,
    },
    {
      id: 25,
      title: "Team Building Event Planning",
      description: "Organize quarterly team building activities",
      priority: "low",
      status: "todo",
      dueDate: "2024-09-28",
      assignee: "You",
      tags: ["team", "event"],
      project: "quarterly-review",
      subtasks: 6,
      completedSubtasks: 1,
      comments: 3,
      attachments: 2,
    },
    {
      id: 26,
      title: "API Documentation Update",
      description: "Update API documentation with new endpoints",
      priority: "medium",
      status: "done",
      dueDate: "2024-09-30",
      assignee: "Mike",
      tags: ["documentation", "api"],
      project: "astra-dashboard",
      subtasks: 3,
      completedSubtasks: 3,
      comments: 1,
      attachments: 1,
    },
  ]);
  const [sectionList, setSectionList] = useState([
    {
      id: "todo",
      name: "To Do",
      tasks: [1, 2, 4, 9, 11, 16, 18, 19],
    },
    {
      id: "in-progress",
      name: "In Progress",
      tasks: [3, 5, 10, 17, 22],
    },
    {
      id: "review",
      name: "Review",
      tasks: [6, 12, 20, 24],
    },
    {
      id: "done",
      name: "Done",
      tasks: [7, 8, 26],
    },
  ]);

  const projects = [
    {
      id: "astra-dashboard",
      name: "ASTRA Dashboard",
      icon: Target,
      color: "purple",
      taskCount: 12,
    },
    {
      id: "quarterly-review",
      name: "Quarterly Review",
      icon: BarChart3,
      color: "green",
      taskCount: 7,
    },
    {
      id: "health-tracking",
      name: "Health Tracking",
      icon: Zap,
      color: "red",
      taskCount: 4,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "review":
        return <Eye className="h-4 w-4 text-purple-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(25);
    setTimerSeconds(0);
  };

  const handleDragStart = (taskId: number) => {
    setDraggedTask(taskId);
    console.log(`[v0] Started dragging task ${taskId}`);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    console.log(`[v0] Ended drag operation`);
  };

  const handleDrop = (sectionId: string) => {
    if (draggedTask) {
      console.log(`[v0] Moving task ${draggedTask} to section ${sectionId}`);

      const statusMap: { [key: string]: string } = {
        todo: "todo",
        "in-progress": "in-progress",
        review: "review",
        done: "done",
      };

      setTaskList((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggedTask
            ? { ...task, status: statusMap[sectionId] || task.status }
            : task
        )
      );

      setSectionList((prevSections) =>
        prevSections.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              tasks: section.tasks.includes(draggedTask!)
                ? section.tasks
                : [...section.tasks, draggedTask!],
            };
          } else {
            return {
              ...section,
              tasks: section.tasks.filter((taskId) => taskId !== draggedTask),
            };
          }
        })
      );

      setDraggedTask(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredTasks.filter((task) => task.dueDate === dateStr);
  };

  const navigateCalendar = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (calendarView === "month") {
      newDate.setMonth(
        currentDate.getMonth() + (direction === "next" ? 1 : -1)
      );
    } else if (calendarView === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (calendarView === "year") {
      newDate.setFullYear(
        currentDate.getFullYear() + (direction === "next" ? 1 : -1)
      );
    }
    setCurrentDate(newDate);
  };

  const filteredTasks = taskList.filter((task) => {
    if (selectedProject !== "my-tasks" && task.project !== selectedProject)
      return false;
    if (filterBy === "assigned-to-me" && task.assignee !== "You") return false;
    if (filterBy === "high-priority" && task.priority !== "high") return false;
    if (filterBy === "overdue") {
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      return dueDate < today && task.status !== "done";
    }
    return true;
  });

  const renderCalendar = () => {
    if (calendarView === "month") {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDay = getFirstDayOfMonth(currentDate);
      const days = [];

      // Empty cells for days before month starts
      for (let i = 0; i < firstDay; i++) {
        days.push(
          <div
            key={`empty-${i}`}
            className="h-24 border border-slate-700/30"
          ></div>
        );
      }

      // Days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        );
        const tasksForDay = getTasksForDate(date);
        const isToday = date.toDateString() === new Date().toDateString();

        days.push(
          <div
            key={day}
            className={`h-24 border border-slate-700/30 p-1 ${isToday
              ? "bg-cyan-500/10 border-cyan-500/30"
              : "hover:bg-slate-800/30"
              }`}
          >
            <div
              className={`text-sm font-mono mb-1 ${isToday ? "text-cyan-300" : "text-slate-300"
                }`}
            >
              {day}
            </div>
            <div className="space-y-1">
              {tasksForDay.slice(0, 2).map((task) => (
                <div
                  key={task.id}
                  className={`text-xs p-1 rounded truncate ${getPriorityColor(
                    task.priority
                  )} bg-opacity-20 text-white font-mono`}
                  title={task.title}
                >
                  {task.title.length > 20
                    ? `${task.title.substring(0, 20)}...`
                    : task.title}
                </div>
              ))}
              {tasksForDay.length > 2 && (
                <div className="text-xs text-slate-400 font-mono">
                  +{tasksForDay.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-7 gap-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="h-10 border border-slate-700/30 bg-slate-800/50 flex items-center justify-center"
            >
              <span className="text-sm text-slate-300 font-mono">{day}</span>
            </div>
          ))}
          {days}
        </div>
      );
    } else if (calendarView === "week") {
      // Week view
      const weekDays = getWeekDays(currentDate);

      return (
        <div className="grid grid-cols-7 gap-0">
          {weekDays.map((day, index) => {
            const tasksForDay = getTasksForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`border border-slate-700/30 p-2 min-h-[300px] ${isToday
                  ? "bg-cyan-500/10 border-cyan-500/30"
                  : "hover:bg-slate-800/30"
                  }`}
              >
                <div
                  className={`text-sm font-mono mb-2 ${isToday ? "text-cyan-300" : "text-slate-300"
                    }`}
                >
                  {day.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="space-y-2">
                  {tasksForDay.map((task) => (
                    <Card
                      key={task.id}
                      className="bg-slate-900/50 border-slate-600/30 backdrop-blur-sm"
                    >
                      <CardContent className="p-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getPriorityColor(
                              task.priority
                            )}`}
                          />
                          <span
                            className="text-xs font-mono text-slate-200 truncate"
                            title={task.title}
                          >
                            {task.title.length > 25
                              ? `${task.title.substring(0, 25)}...`
                              : task.title}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1 font-mono">
                          {task.assignee}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      // Year view
      const year = currentDate.getFullYear();
      const months = [];

      for (let month = 0; month < 12; month++) {
        const monthDate = new Date(year, month, 1);
        const monthName = monthDate.toLocaleDateString("en-US", {
          month: "long",
        });
        const daysInMonth = getDaysInMonth(monthDate);
        const firstDay = getFirstDayOfMonth(monthDate);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const isCurrentMonth = month === currentMonth && year === currentYear;

        // Count tasks for this month
        const tasksInMonth = taskList.filter((task) => {
          const taskDate = new Date(task.dueDate);
          return (
            taskDate.getMonth() === month && taskDate.getFullYear() === year
          );
        }).length;

        months.push(
          <div
            key={month}
            className={`border border-slate-700/30 p-3 rounded-lg ${isCurrentMonth
              ? "bg-cyan-500/10 border-cyan-500/30"
              : "bg-slate-900/30 hover:bg-slate-800/50"
              } backdrop-blur-sm cursor-pointer transition-all duration-300`}
            onClick={() => {
              setCurrentDate(new Date(year, month, 1));
              setCalendarView("month");
            }}
          >
            <div
              className={`text-sm font-mono font-bold mb-2 ${isCurrentMonth ? "text-cyan-300" : "text-slate-300"
                }`}
            >
              {monthName}
            </div>

            {/* Mini calendar grid */}
            <div className="grid grid-cols-7 gap-px text-xs">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div
                  key={i}
                  className="text-slate-500 text-center font-mono h-4 flex items-center justify-center"
                >
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} className="h-4"></div>
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                const hasTask = taskList.some((task) => {
                  const taskDate = new Date(task.dueDate);
                  return taskDate.toDateString() === date.toDateString();
                });
                const isToday =
                  date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={day}
                    className={`h-4 flex items-center justify-center font-mono ${isToday
                      ? "bg-cyan-500 text-white rounded-full text-xs"
                      : hasTask
                        ? "text-cyan-300 font-bold"
                        : "text-slate-400"
                      }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Task count indicator */}
            {tasksInMonth > 0 && (
              <div className="mt-2 flex items-center justify-center">
                <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-full px-2 py-1">
                  <span className="text-xs font-mono text-cyan-300">
                    {tasksInMonth} tasks
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      }

      return <div className="grid grid-cols-3 gap-4">{months}</div>;
    }
  };

  return (
    <Wrapper>
      <div className="relative z-10 flex flex-col auth-h-screen">
        {/* Project Header */}
        <ProjectHeader projectName="ASTRA - Project Tasks" />

        {/* Navigation Tabs */}
        <NavigationTabs activeTab={currentView} onTabChange={setCurrentView} />

        {/* <div className="p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold font-mono text-cyan-100">Task Command Center</h1>
              <p className="text-slate-400 font-mono text-sm">
                {filteredTasks.length} tasks • {filteredTasks.filter((t) => t.status === "done").length} completed
              </p>
            </div>

            <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-red-500/20 shadow-2xl shadow-red-500/10 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <p className="text-xs font-mono text-red-300">Focus Timer</p>
                    <p className="text-lg font-bold font-mono text-red-200">
                      {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      onClick={toggleTimer}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border border-red-400/20 shadow-lg shadow-red-500/25"
                    >
                      {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resetTimer}
                      className="border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center space-x-6 mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleSection("starred")}
                className="flex items-center text-sm font-mono text-slate-300 hover:text-cyan-300"
              >
                {expandedSections.starred ? (
                  <ChevronDown className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1" />
                )}
                Starred
              </button>

              {expandedSections.starred && (
                <div className="flex items-center space-x-2">
                  <button className="flex items-center text-sm font-mono text-slate-400 hover:text-yellow-400 px-2 py-1 rounded hover:bg-slate-800/50">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    Important Tasks
                  </button>
                </div>
              )}
            </div>

            <Separator orientation="vertical" className="bg-slate-700/50 h-6" />

            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleSection("projects")}
                className="flex items-center text-sm font-mono text-slate-300 hover:text-cyan-300"
              >
                {expandedSections.projects ? (
                  <ChevronDown className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1" />
                )}
                Projects
              </button>

              {expandedSections.projects && (
                <div className="flex items-center space-x-2">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={`flex items-center text-sm font-mono px-3 py-1 rounded transition-all ${selectedProject === project.id
                        ? "bg-cyan-500/20 text-cyan-100"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-cyan-300"
                        }`}
                    >
                      <div className={`w-2 h-2 rounded mr-2 bg-${project.color}-500`}></div>
                      {project.name}
                      <span className="ml-2 text-xs bg-slate-700/50 px-1.5 py-0.5 rounded">{project.taskCount}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="ml-auto">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-mono text-sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 font-mono bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 backdrop-blur-sm"
              />
            </div>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-slate-900/50 border border-slate-600/50 text-white font-mono text-sm rounded px-3 py-2 focus:border-cyan-500/50 focus:ring-cyan-500/20 backdrop-blur-sm"
            >
              <option value="all">All tasks</option>
              <option value="assigned-to-me">Assigned to me</option>
              <option value="high-priority">High priority</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900/50 border border-slate-600/50 text-white font-mono text-sm rounded px-3 py-2 focus:border-cyan-500/50 focus:ring-cyan-500/20 backdrop-blur-sm"
            >
              <option value="due-date">Due date</option>
              <option value="priority">Priority</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="assignee">Assignee</option>
            </select>

            <Tabs value={currentView} onValueChange={setCurrentView}>
              <TabsList className="bg-slate-800/50 border-slate-600/50 backdrop-blur-sm">
                <TabsTrigger
                  value="list"
                  className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                >
                  <List className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger
                  value="board"
                  className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                >
                  <Kanban className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger
                  value="calendar"
                  className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                >
                  <Calendar className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div> */}

        <div className="flex-1 overflow-auto">
          <Tabs value={currentView} onValueChange={setCurrentView}>
            <TabsContent value="list" className="p-6 space-y-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onDragEnd={handleDragEnd}
                  className={`group flex items-center p-3 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 hover:border-cyan-500/30 rounded-lg transition-all duration-200 cursor-grab active:cursor-grabbing ${draggedTask === task.id ? "opacity-50 scale-95" : ""
                    }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <GripVertical className="h-4 w-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {getStatusIcon(task.status)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium font-mono text-slate-200 truncate">
                          {task.title}
                        </h3>
                        <div
                          className={`w-2 h-2 rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        />
                      </div>
                      {task.description && (
                        <p className="text-sm text-slate-400 font-mono truncate mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-slate-700 text-slate-300">
                          {task.assignee === "You"
                            ? "Y"
                            : task.assignee.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <span className="font-mono">{task.dueDate}</span>

                      <div className="flex items-center space-x-2">
                        {task.subtasks > 0 && (
                          <span className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {task.completedSubtasks}/{task.subtasks}
                          </span>
                        )}
                        {task.comments > 0 && (
                          <span className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {task.comments}
                          </span>
                        )}
                        {task.attachments > 0 && (
                          <span className="flex items-center">
                            <Paperclip className="h-3 w-3 mr-1" />
                            {task.attachments}
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-1">
                        {task.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs border-slate-600/50 text-slate-400 px-1 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-cyan-300 hover:bg-slate-700/50"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="board" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {sectionList.map((section) => (
                  <div
                    key={section.id}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(section.id)}
                    className={`bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 min-h-[500px] transition-all duration-200 ${draggedTask ? "border-cyan-500/50 bg-slate-800/50" : ""
                      }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold font-mono text-slate-200">
                        {section.name}
                      </h3>
                      <span className="text-xs bg-slate-700/50 text-slate-400 px-2 py-1 rounded">
                        {section.tasks.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {section.tasks.map((taskId) => {
                        const task = taskList.find((t) => t.id === taskId);
                        if (!task || !filteredTasks.includes(task)) return null;

                        return (
                          <Card
                            key={task.id}
                            draggable
                            onDragStart={() => handleDragStart(task.id)}
                            onDragEnd={handleDragEnd}
                            className={`bg-slate-900/50 hover:bg-slate-800/50 transition-all duration-200 cursor-grab active:cursor-grabbing border-slate-600/30 backdrop-blur-sm ${draggedTask === task.id
                              ? "opacity-50 scale-95 rotate-2"
                              : ""
                              }`}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium font-mono text-sm text-slate-200 flex-1">
                                  {task.title}
                                </h4>
                                <div
                                  className={`w-2 h-2 rounded-full ${getPriorityColor(
                                    task.priority
                                  )} ml-2 mt-1`}
                                />
                              </div>

                              {task.description && (
                                <p className="text-xs text-slate-400 font-mono mb-3 line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between">
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="text-xs bg-slate-700 text-slate-300">
                                    {task.assignee === "You"
                                      ? "Y"
                                      : task.assignee.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex items-center space-x-2 text-xs text-slate-500">
                                  {task.comments > 0 && (
                                    <span className="flex items-center">
                                      <MessageSquare className="h-3 w-3 mr-1" />
                                      {task.comments}
                                    </span>
                                  )}
                                  {task.attachments > 0 && (
                                    <span className="flex items-center">
                                      <Paperclip className="h-3 w-3 mr-1" />
                                      {task.attachments}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="text-xs text-slate-500 font-mono mt-2">
                                {task.dueDate}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}

                      {draggedTask && section.tasks.length === 0 && (
                        <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-8 text-center">
                          <p className="text-slate-400 font-mono text-sm">
                            Drop task here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="p-6">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-xl font-semibold font-mono text-slate-200">
                        {currentDate.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                          ...(calendarView === "week" && { day: "numeric" }),
                        })}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateCalendar("prev")}
                          className="border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateCalendar("next")}
                          className="border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant={
                          calendarView === "month" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCalendarView("month")}
                        className={
                          calendarView === "month"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono"
                            : "border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent font-mono"
                        }
                      >
                        Month
                      </Button>
                      <Button
                        variant={
                          calendarView === "week" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCalendarView("week")}
                        className={
                          calendarView === "week"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono"
                            : "border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent font-mono"
                        }
                      >
                        Week
                      </Button>
                      <Button
                        variant={
                          calendarView === "year" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCalendarView("year")}
                        className={
                          calendarView === "year"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono"
                            : "border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent font-mono"
                        }
                      >
                        Year
                      </Button>
                    </div>
                  </div>

                  {renderCalendar()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Wrapper>
  );
}
