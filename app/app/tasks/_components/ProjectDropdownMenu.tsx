"use client"

import React from 'react';
import { EllipsisVertical, Edit, Trash2, Archive, Settings, Share } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';

interface ProjectDropdownMenuProps {
    projectId: string;
    projectName: string;
    onEdit?: (projectId: string) => void;
    onDelete?: (projectId: string) => void;
    onArchive?: (projectId: string) => void;
    onSettings?: (projectId: string) => void;
    onShare?: (projectId: string) => void;
}

const ProjectDropdownMenu: React.FC<ProjectDropdownMenuProps> = ({
    projectId,
    projectName,
    onEdit,
    onDelete,
    onArchive,
    onSettings,
    onShare,
}) => {
    const handleEdit = () => {
        onEdit?.(projectId);
    };

    const handleDelete = () => {
        onDelete?.(projectId);
    };

    const handleArchive = () => {
        onArchive?.(projectId);
    };

    const handleSettings = () => {
        onSettings?.(projectId);
    };

    const handleShare = () => {
        onShare?.(projectId);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisVertical size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProjectDropdownMenu;
