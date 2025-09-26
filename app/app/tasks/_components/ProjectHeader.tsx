"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Globe,
    ChevronDown,
    Star,
    MoreVertical,
    Share2,
    Grid3X3
} from "lucide-react"

interface ProjectHeaderProps {
    projectName?: string
    projectIcon?: React.ReactNode
    teamMembers?: Array<{
        id: string
        name: string
        avatar?: string
        initials?: string
    }>
    onShare?: () => void
    onCustomize?: () => void
    onSetStatus?: () => void
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
    projectName = "CaseFile - Project Tasks",
    projectIcon,
    teamMembers = [
        { id: "1", name: "John Doe", initials: "JD" },
        { id: "2", name: "Mike Nelson", initials: "MN" },
        { id: "3", name: "Sarah Wilson", avatar: "/placeholder-user.jpg" },
        { id: "4", name: "Alex Chen", avatar: "/placeholder-user.jpg" },
        { id: "5", name: "More", initials: "..." }
    ],
    onShare,
    onCustomize,
    onSetStatus
}) => {
    return (
        <div className="flex items-center justify-between w-full bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 p-4">
            {/* Left side - Project info */}
            <div className="flex items-center space-x-4">
                {/* Project icon */}
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    {projectIcon || <Globe className="h-5 w-5 text-white" />}
                </div>

                {/* Project title */}
                <div className="flex items-center space-x-2">
                    <h1 className="text-lg font-semibold text-white">{projectName}</h1>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>

                {/* Star icon */}
                <Star className="h-4 w-4 text-slate-400 hover:text-yellow-400 cursor-pointer" />

                {/* Set status */}
                <div className="flex items-center space-x-1">
                    <span className="text-sm text-slate-400">Set status</span>
                    <div className="w-4 h-4 border border-slate-400 rounded-full"></div>
                </div>
            </div>

            {/* Right side - Team and actions */}
            <div className="flex items-center space-x-4">
                {/* Team member avatars */}
                <div className="flex items-center space-x-2">
                    {teamMembers.map((member, index) => (
                        <Avatar key={member.id} className="h-8 w-8 border-2 border-slate-700">
                            {member.avatar ? (
                                <AvatarImage src={member.avatar} alt={member.name} />
                            ) : (
                                <AvatarFallback className="bg-slate-600 text-white text-xs">
                                    {member.initials}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    ))}
                </div>

                {/* More options */}
                <MoreVertical className="h-4 w-4 text-slate-400 cursor-pointer hover:text-white" />

                {/* Action buttons */}
                <div className="flex items-center space-x-2">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={onShare}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                    >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onCustomize}
                        className="border-slate-600 text-slate-300 hover:bg-slate-800 px-4 py-2"
                    >
                        <Grid3X3 className="h-4 w-4 mr-2" />
                        Customize
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProjectHeader
