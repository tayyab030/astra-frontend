"use client"

import React from 'react'
import {
    Globe,
    ChevronDown,
    Star
} from "lucide-react"

interface ProjectHeaderProps {
    projectName?: string
    projectIcon?: React.ReactNode
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
    projectName = "CaseFile - Project Tasks",
    projectIcon,
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
        </div>
    )
}

export default ProjectHeader
