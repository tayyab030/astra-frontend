"use client";

import React from "react";
import { EllipsisVertical, Edit, Trash2, Star } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProjectDropdownMenuProps {
    projectId: string;
}

const handleMenuContent = ({
    onEdit,
    onDelete,
    onStarred,
}: {
    onEdit: (projectId: string) => void;
    onDelete: (projectId: string) => void;
    onStarred: (projectId: string) => void;
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
            icon: <Star size={14} color="#ffffff" />,
            label: "Add to starred",
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
    projectId,
}) => {
    const menuContent = handleMenuContent({
        onEdit: () => {
            console.log("Edit");
        },
        onDelete: () => {
            console.log("Delete");
        },
        onStarred: () => {
            console.log("Starred");
        },
    });

    return (
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
                                        <div className="w-4 h-4 rounded-md bg-[#D98EEA]" />
                                        <span>Set color & icon</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>Email</DropdownMenuItem>
                                            <DropdownMenuItem>Message</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>More...</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            ) : (
                                <>
                                    {id === "delete" && <DropdownMenuSeparator />}
                                    <DropdownMenuItem
                                        onClick={() => handleClick(projectId)}
                                        className={cn("flex items-center gap-3 p-3", itemClassName)}
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
    );
};

export default ProjectDropdownMenu;
