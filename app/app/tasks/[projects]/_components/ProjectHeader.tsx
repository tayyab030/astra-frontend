"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, Globe, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchProjects } from "@/lib/api/tasks"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/constants/routes"
import { getIconComponent, type IconName } from "../../_components/Projects/iconHelper"

interface ProjectHeaderProps {
  projectId?: string
  projectName?: string
  projectIcon?: string
  projectColor?: string
  starred?: boolean
}

export default function ProjectHeader({
  projectId,
  projectName = "Project Tasks",
  projectIcon,
  projectColor = "#9333ea",
  starred = false,
}: ProjectHeaderProps) {
  const router = useRouter()

  const projectsQuery = useQuery({
    queryKey: ["projects", "project-header"],
    queryFn: fetchProjects,
  })

  const projects = projectsQuery.data ?? []

  const renderProjectIcon = (icon?: string, color?: string, size = 20) =>
    getIconComponent(
      (icon as IconName) || "Globe",
      size,
      "text-white",
      color ?? projectColor,
    )

  return (
    <div className="flex w-full items-center justify-between border-b border-slate-700/50 bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
          onClick={() => router.push(ROUTES.APP.TASKS)}
          aria-label="Back to tasks"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: projectColor }}
        >
          {projectIcon ? renderProjectIcon(projectIcon, "#ffffff") : <Globe className="h-5 w-5" />}
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex min-w-0 items-center gap-2 rounded-md px-1 py-0.5 text-left transition-colors hover:bg-slate-800/40"
            >
              <h1 className="truncate text-lg font-semibold text-white">{projectName}</h1>
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="z-[100] w-72 border-slate-600/50 bg-slate-800 p-1 text-slate-200"
          >
            <div className="max-h-64 overflow-y-auto overflow-x-hidden overscroll-y-contain scrollbar-thin">
              {projectsQuery.isLoading ? (
                <div className="space-y-1 p-1">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-full bg-slate-900/50" />
                  ))}
                </div>
              ) : projects.length > 0 ? (
                projects.map((project) => {
                  const isActive = project.id === projectId

                  return (
                    <DropdownMenuItem
                      key={project.id}
                      asChild
                      className={cn(
                        "cursor-pointer font-mono focus:bg-slate-700 focus:text-slate-100",
                        isActive && "bg-cyan-500/10 text-cyan-200",
                      )}
                    >
                      <Link
                        href={`${ROUTES.APP.TASKS}/${project.id}`}
                        className="flex min-w-0 items-center gap-2"
                      >
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white"
                          style={{ backgroundColor: project.color }}
                        >
                          {renderProjectIcon(project.icon, "#ffffff", 14)}
                        </div>
                        <span className="truncate">{project.title}</span>
                        {project.starred ? (
                          <Star className="ml-auto h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
                        ) : null}
                      </Link>
                    </DropdownMenuItem>
                  )
                })
              ) : (
                <div className="px-3 py-4 text-center font-mono text-xs text-slate-400">
                  No projects found
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Star
          className={cn(
            "hidden h-4 w-4 shrink-0 sm:block",
            starred ? "fill-yellow-400 text-yellow-400" : "text-slate-400",
          )}
        />

        <div className="hidden items-center gap-1 sm:flex">
          <span className="text-sm text-slate-400">Set status</span>
          <div className="h-4 w-4 rounded-full border border-slate-400" />
        </div>
      </div>
    </div>
  )
}
