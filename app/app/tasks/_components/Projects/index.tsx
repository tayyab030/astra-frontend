"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    FolderOpen,
    Star,
} from "lucide-react";
import SelectField from "@/components/common/SelectField";
import CreateProjectDialog from "./CreateProjectDialog";
import dynamic from "next/dynamic";
import { getIconComponent, IconName } from "./iconHelper";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "../../_hooks/useProjects";
import { ROUTES } from "@/constants/routes";
import { CardTaskSummary } from "../CardTaskSummary";

const ProjectDropdownMenu = dynamic(() => import("./ProjectDropdownMenu"), {
    ssr: false,
});

const PROJECTS_GRID_CLASSES = "grid grid-cols-2 md:grid-cols-4 gap-4";
const CARD_GRID_MAX_HEIGHT = "max-h-72 overflow-y-auto overflow-x-hidden pr-1";

const Projects = () => {
    const router = useRouter();
    const [filter, setFilter] = useState("all");
    const {
        projects: allProjects,
        isLoading: loadingProjects,
        refetch: refetchProjects,
        patchProject,
        deleteProject,
        isPatchingProject,
        isDeletingProject,
    } = useProjects();

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

            {loadingProjects ? (
                <div className={CARD_GRID_MAX_HEIGHT}>
                    <div className={PROJECTS_GRID_CLASSES}>
                        {Array.from({ length: 4 }, (_, index) => (
                            <Skeleton key={index} className="w-full h-32" />
                        ))}
                    </div>
                </div>
            ) : projects.length > 0 ? (
                <div className={CARD_GRID_MAX_HEIGHT}>
                    <div className={PROJECTS_GRID_CLASSES}>
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => router.push(`${ROUTES.APP.TASKS}/${project.id}`)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    router.push(`${ROUTES.APP.TASKS}/${project.id}`);
                                }
                            }}
                            className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:bg-slate-700/50 transition-colors cursor-pointer group relative h-32 flex justify-center items-center"
                        >
                            <div
                                className="absolute top-1.5 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5"
                                onClick={(event) => event.stopPropagation()}
                                onPointerDown={(event) => event.stopPropagation()}
                            >
                                <ProjectDropdownMenu
                                    selectedProject={project}
                                    refetchProjects={refetchProjects}
                                    onPatchProject={patchProject}
                                    onDeleteProject={deleteProject}
                                    isPatchingProject={isPatchingProject}
                                    isDeletingProject={isDeletingProject}
                                />
                            </div>
                            {project.starred && (
                                <div className="absolute z-20 top-2.5 left-2.5 pointer-events-none">
                                    <Star size={16} color="yellow" fill="yellow" />
                                </div>
                            )}

                            <div className="flex flex-col items-center text-center pointer-events-none">
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
                                <h3 className="text-sm font-medium text-white mb-1 leading-tight line-clamp-2">
                                    {project.title}
                                </h3>
                                <CardTaskSummary summary={project.linked_tasks ?? { total: 0, completed: 0, pending: 0 }} />
                            </div>
                        </div>
                    ))}
                    </div>
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
