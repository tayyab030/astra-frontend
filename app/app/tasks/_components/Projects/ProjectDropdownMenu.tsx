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
import { getIconComponent, IconName } from "./iconHelper";
import { authApi, TASKS } from "@/lib/api";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Project } from ".";

interface ProjectDropdownMenuProps {
    selectedProject: Project;
    refetchProjects: () => void;
}

export interface HandlePatchProjectPayload {
    starred?: boolean;
    color?: string;
    icon?: string;
}

const handleMenuContent = ({
    onEdit,
    onDelete,
    onStarred,
    starred
}: {
    onEdit: (projectId: number) => void;
    onDelete: (projectId: number) => void;
    onStarred: (projectId: number) => void;
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
    refetchProjects
}) => {
    // const [selectedColor, setSelectedColor] = useState();
    // const [selectedIcon, setSelectedIcon] = useState<IconName>();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { id: projectId, starred, color: projectColor, icon: projectIcon } = selectedProject;

    // handle delete project
    const handleDelete = async () => {
        try {
            const response = await authApi.delete(`${TASKS.PROJECTS}${projectId}/`);
            toast.success(response?.data?.message || "Project deleted successfully");
            setShowDeleteConfirmation(false);
            refetchProjects();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to delete project");
        }
    }

    const { mutate: handleDeleteProject, isPending: isDeletingProject } = useMutation({
        mutationFn: handleDelete,
    })

    // handle star project
    const handlePatchProject = async (payload: HandlePatchProjectPayload) => {
        // Return early if payload is empty
        if (Object.keys(payload).length === 0) {
            return;
        }

        try {
            await authApi.patch(`${TASKS.PROJECTS}${projectId}/`, payload);
            // toast.success(response?.data?.message || "Project starred successfully");
            refetchProjects();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to star project");
        }
    }

    const { mutate: handlePatchMutation, isPending: isStarringProject } = useMutation({
        mutationFn: handlePatchProject,
    })

    const menuContent = handleMenuContent({
        onEdit: () => {
            console.log("Edit");
        },
        onDelete: () => {
            setShowDeleteConfirmation(true);
        },
        onStarred: () => {
            handlePatchMutation({ starred: !starred });
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
                                                    // onColorSelect={setSelectedColor}
                                                    // onIconSelect={setSelectedIcon}
                                                    className="w-80"
                                                    handlePatchMutation={handlePatchMutation}
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
                                            disabled={isDeletingProject || isStarringProject}
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
                                handleDeleteProject();
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
