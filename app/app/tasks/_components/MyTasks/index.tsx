"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { authApi, TASKS } from "@/lib/api";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface Task {
    id: string;
    title: string;
    project: string;
    projectColor: string;
    dueDate: string;
    completed: boolean;
    tags?: { id: string; name: string; color: string }[];
}

const MyTasks = () => {

    const getTasks = async () => {
        try {
            const response = await authApi.get(TASKS.PROJECT_TASKS("32"));
            console.log(response, "response");
            return response.data;
        } catch (error: any) {
            console.error(error);
            console.log(error, "error");
            toast.error(error?.response?.data?.detail || "Failed to get tasks");
            return error;
        }
    };

    const { data, refetch: refetchTasks, isLoading: loadingTasks, error } = useQuery({
        queryKey: ["tasks"],
        queryFn: () => getTasks(),
    });

    console.log(data, "data", error);

    const tasks: Task[] = [
        {
            id: "1",
            title:
                "Restaurants (Menu, Courses, Dishes): Fix the dropdown action values hovers to occupy full width of the container",
            project: "Plate...",
            projectColor: "bg-blue-500",
            dueDate: "Today",
            completed: false,
        },
        {
            id: "2",
            title:
                "Restaurant & Company: Improve the Table UI similar to the Menu Tables",
            project: "Plate...",
            projectColor: "bg-blue-500",
            dueDate: "Today",
            completed: false,
        },
        {
            id: "3",
            title:
                "Restaurant(Mobile): Adjust the widths of the buttons to full-width",
            project: "Plate...",
            tags: [
                {
                    id: "1",
                    name: "Tag 1",
                    color: "blue",
                },
                {
                    id: "2",
                    name: "Tag 2",
                    color: "red",
                },
            ],
            projectColor: "bg-blue-500",
            dueDate: "Today",
            completed: false,
        },
        {
            id: "4",
            title:
                "Case Summary: Add clear icon button on the fields (referred, attorney and case manager)",
            project: "*Case...",
            projectColor: "bg-purple-500",
            dueDate: "Monday",
            completed: true,
        },
        {
            id: "5",
            title:
                "Sequence of Mediation / Action 3: Integrate improved UI for Missing Documents Section",
            project: "*Case...",
            projectColor: "bg-purple-500",
            dueDate: "",
            completed: true,
        },
        {
            id: "6",
            title:
                "Case Sequence of Mediation Sheets: Integrate additional components on a specific sheets",
            project: "*Case...",
            projectColor: "bg-purple-500",
            dueDate: "",
            completed: false,
        },
        {
            id: "7",
            title: "Database Migration: Update user authentication system",
            project: "Plate...",
            projectColor: "bg-blue-500",
            dueDate: "Yesterday",
            completed: false,
        },
    ];

    const getDueDateColor = (dueDate: string) => {
        if (!dueDate) return "text-gray-400";
        if (dueDate === "Today" || dueDate === "Tomorrow") return "text-green-400";
        if (dueDate === "Yesterday" || dueDate.includes("ago"))
            return "text-red-400";
        return "text-gray-400";
    };

    return (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4.5 border border-slate-700/50 mb-4">
            {/* Tabs */}
            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700/50 border-slate-600">
                    <TabsTrigger
                        value="upcoming"
                        className="text-white data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                    >
                        Upcoming
                    </TabsTrigger>
                    <TabsTrigger
                        value="overdue"
                        className="text-white data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                    >
                        Overdue (62)
                    </TabsTrigger>
                    <TabsTrigger
                        value="completed"
                        className="text-white data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                    >
                        Completed
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-2">
                    <div className="space-y-3">
                        <div
                            className="flex items-start gap-3 pb-2 border-b border-slate-700/50 px-3"
                        >
                            <Button variant="ghost" type="button" className="text-sm text-gray-400 hover:text-white hover:bg-slate-700/30" size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Create task
                            </Button>
                        </div>
                        <div className="overflow-y-auto max-h-48">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-start gap-3 py-2 border-b border-slate-700/50 px-3 hover:bg-slate-700/30 transition-colors"
                                >
                                    {/* Custom Circular Checkbox */}
                                    <div className="mt-1">
                                        <div
                                            className={cn(
                                                "w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors",
                                                task.completed
                                                    ? "bg-green-500 border-green-500"
                                                    : "border-gray-400 hover:border-gray-300"
                                            )}
                                        >
                                            {task.completed && (
                                                <svg
                                                    className="w-2.5 h-2.5 text-white"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={cn(
                                                "text-sm truncate",
                                                task.completed
                                                    ? "line-through text-gray-500"
                                                    : "text-white"
                                            )}
                                        >
                                            {task.title}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-3 h-3 rounded ${task.projectColor}`}
                                            ></div>
                                            <span className="text-xs text-gray-400">
                                                {task.project}
                                            </span>
                                        </div>
                                        {task?.tags && task.tags.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                {task.tags?.map((tag) => (
                                                    <div
                                                        key={tag.id}
                                                        className="rounded-sm p-1 h-fit w-fit flex items-center justify-center"
                                                        style={{ backgroundColor: tag.color }}
                                                    >
                                                        <span className="!text-xs text-gray-400">
                                                            {tag.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {task.dueDate ? (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                <span
                                                    className={`text-xs ${getDueDateColor(task.dueDate)}`}
                                                >
                                                    {task.dueDate}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center size-6 rounded-full border border-dashed border-gray-400">
                                                <Calendar className="size-3 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="text-center mt-3">
                                <button className="text-blue-400 hover:text-blue-300 text-sm">
                                    Show more
                                </button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="overdue" className="mt-4">
                    <div className="text-center text-gray-400 py-8">
                        Overdue tasks will appear here
                    </div>
                </TabsContent>

                <TabsContent value="completed" className="mt-4">
                    <div className="text-center text-gray-400 py-8">
                        Completed tasks will appear here
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MyTasks;
