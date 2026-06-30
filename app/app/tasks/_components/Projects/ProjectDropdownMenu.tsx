"use client";

import React, { useState } from "react";
import { EllipsisVertical, Edit, Trash2, Star } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import ColorIconSelector from "./ColorIconSelector";
import type { PatchProjectPayload, Project } from "@/lib/api/tasks";
import { useActiveItem } from "@/hooks/handleparams";

interface ProjectDropdownMenuProps {
    selectedProject: Project;
    refetchProjects: () => void;
    onPatchProject: (payload: { id: string; data: PatchProjectPayload }) => Promise<unknown>;
    onDeleteProject: (id: string) => Promise<unknown>;
    isPatchingProject?: boolean;
    isDeletingProject?: boolean;
}

const handleMenuContent = ({
    onEdit,
    onDelete,
    onStarred,
    starred
}: {
    onEdit: (projectId: string) => void;
    onDelete: (projectId: string) => void;
    onStarred: (projectId: string) => void;
    starred: boolean;
}) => {
    const menuContent = [
        {
            icon: <Edit size={14} color="#ffffff" />,
            label: "Edit",
            handleClick: onEdit,
            itemClassName:
                "text-white hover:text-white focus:text-white cursor-pointer",
        },
        {
            icon: <Star size={14} color="#ffffff" fill={starred ? "yellow" : "none"} />,
            label: starred ? "Remove from starred" : "Add to starred",
            handleClick: onStarred,
            itemClassName:
                "text-white hover:text-white focus:text-white cursor-pointer",
        },
        {
            id: "set-color-icon",
            handleClick: () => { },
        },
        {
            id: "delete",
            icon: <Trash2 size={14} className="text-red-600" />,
            label: "Delete",
            handleClick: onDelete,
            itemClassName:
                "text-red-600 hover:text-red-600 focus:text-red-600 cursor-pointer",
        },
    ];

    return menuContent;
};

const ProjectDropdownMenu: React.FC<ProjectDropdownMenuProps> = ({
    selectedProject,
    refetchProjects,
    onPatchProject,
    onDeleteProject,
    isPatchingProject,
    isDeletingProject,
}) => {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { setActiveItem: setSelectedProjectId } =
        useActiveItem("edit_project_id");

    const { id: projectId, starred, color: projectColor, icon: projectIcon } = selectedProject;

    const handleDelete = async () => {
        await onDeleteProject(projectId);
        setShowDeleteConfirmation(false);
        refetchProjects();
    };

    const handlePatchProject = async (payload: PatchProjectPayload) => {
        if (Object.keys(payload).length === 0) {
            return;
        }

        await onPatchProject({ id: projectId, data: payload });
        refetchProjects();
    };

    const menuContent = handleMenuContent({
        onEdit: () => {
            setSelectedProjectId(projectId);
        },
        onDelete: () => {
            setShowDeleteConfirmation(true);
        },
        onStarred: () => {
            void handlePatchProject({ starred: !starred });
        },
        starred
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <EllipsisVertical size={18} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                    {menuContent.map(
                        ({ id, icon, label, itemClassName, handleClick }, index) => (
                            <React.Fragment key={index}>
                                {id === "set-color-icon" ? (
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger className="flex items-center gap-3 p-3">
                                            <div
                                                className="w-4 h-4 rounded-md"
                                                style={{ backgroundColor: projectColor }}
                                            />
                                            <span>Set color & icon</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent className="p-0 border-0 bg-transparent">
                                                <ColorIconSelector
                                                    selectedColor={projectColor}
                                                    selectedIcon={projectIcon}
                                                    className="w-80"
                                                    handlePatchMutation={handlePatchProject}
                                                />
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                ) : (
                                    <>
                                        {id === "delete" && <DropdownMenuSeparator />}
                                        <DropdownMenuItem
                                            onClick={() => handleClick(projectId)}
                                            className={cn("flex items-center gap-3 p-3", itemClassName)}
                                            disabled={isDeletingProject || isPatchingProject}
                                        >
                                            {icon}
                                            <span>{label}</span>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </React.Fragment>
                        )
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project
                            and remove all associated tasks.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                void handleDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeletingProject}
                        >
                            {isDeletingProject ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ProjectDropdownMenu;
