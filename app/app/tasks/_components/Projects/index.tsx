"use client";

import React, { useState } from "react";
import {
    FolderOpen,
    Star,
} from "lucide-react";
import SelectField from "@/components/common/SelectField";
import CreateProjectDialog from "./CreateProjectDialog";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { authApi, TASKS } from "@/lib/api";
import { toast } from "sonner";
import { getIconComponent, IconName } from "./iconHelper";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectDropdownMenu = dynamic(() => import("./ProjectDropdownMenu"), {
    ssr: false,
});

const PROJECTS_GRID_CLASSES = "grid grid-cols-2 md:grid-cols-4 gap-4";

export interface Project {
    color: string;
    description: string;
    due_date: string;
    icon: IconName;
    id: number;
    starred: boolean;
    status: string;
    title: string;
}

const Projects = () => {
    const [filter, setFilter] = useState("all");

    const getProjects = async () => {
        try {
            const response = await authApi.get(TASKS.PROJECTS);

            return response.data;
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.detail || "Failed to get projects");
            return error;
        }
    };

    const {
        data,
        refetch: refetchProjects,
        isLoading: loadingProjects,
    } = useQuery({
        queryKey: ["projects"],
        queryFn: () => getProjects(),
    });

    // Sample projects with starred status
    const allProjects: Project[] = data || [];

    // Filter projects based on selected filter
    const projects =
        filter === "starred"
            ? allProjects.filter((project) => project.starred)
            : allProjects;

    const selectOptions = [
        { value: "all", label: "All" },
        { value: "starred", label: "Starred" },
    ];

    return (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4.5 border border-slate-700/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-white">Projects</h2>
                    <SelectField
                        value={filter}
                        onValueChange={setFilter}
                        placeholder="All"
                        options={selectOptions}
                    />
                </div>
                <CreateProjectDialog refetchProjects={refetchProjects} />
            </div>

            {/* Projects Grid or Empty State */}
            {loadingProjects ? (
                <div className={PROJECTS_GRID_CLASSES}>
                    {Array.from({ length: 4 }, (_, index) => (
                        <Skeleton key={index} className="w-full h-32" />
                    ))}
                </div>
            ) : projects.length > 0 ? (
                <div className={PROJECTS_GRID_CLASSES}>
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:bg-slate-700/50 transition-colors cursor-pointer group relative h-32 flex justify-center items-center"
                        >
                            <div className="absolute top-1.5 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1.5">
                                <ProjectDropdownMenu
                                    selectedProject={project}
                                    refetchProjects={refetchProjects}
                                />
                            </div>
                            <Link href={`/tasks/projects/${project.id}`}>
                                {project.starred && (
                                    <div className="absolute z-20 top-2.5 left-2.5">
                                        <Star size={16} color="yellow" fill="yellow" />
                                    </div>
                                )}

                                <div className="flex flex-col items-center text-center">
                                    <div
                                        className={`${project.color} mb-3 group-hover:scale-110 transition-transform`}
                                    >
                                        {getIconComponent(
                                            project.icon as IconName,
                                            28,
                                            "",
                                            project.color
                                        )}
                                    </div>
                                    <h3 className="text-sm font-medium text-white mb-2 leading-tight">
                                        {project.title}
                                    </h3>
                                    {/* {project.tasksDue > 0 && (
                                    <p className="text-xs text-gray-400">
                                        {project.tasksDue} tasks due soon
                                    </p>
                                )} */}
                                    <p className="text-xs text-gray-400">16 tasks due soon</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="bg-slate-700/30 rounded-full p-6 mb-6 border border-slate-600/50">
                        {filter === "starred" ? (
                            <Star className="w-12 h-12 text-slate-400" />
                        ) : (
                            <FolderOpen className="w-12 h-12 text-slate-400" />
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        {filter === "starred" ? "No starred projects" : "No projects yet"}
                    </h3>
                    <p className="text-slate-400 text-center mb-6 max-w-md">
                        {filter === "starred"
                            ? "You haven't starred any projects yet. Star projects to quickly access them from this view."
                            : "Get started by creating your first project to organize your tasks and track your progress."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Projects;
