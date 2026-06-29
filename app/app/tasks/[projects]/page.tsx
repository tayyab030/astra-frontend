"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { fetchProject } from "@/lib/api/tasks"
import ProjectHeader from "./_components/ProjectHeader"
import TaskDetailLayout from "../_components/detail/TaskDetailLayout"

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.projects as string

  const projectQuery = useQuery({
    queryKey: ["projectDetails", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: Boolean(projectId),
  })

  const project = projectQuery.data

  return (
    <TaskDetailLayout
      header={
        <ProjectHeader
          projectId={projectId}
          projectName={project?.title ?? "Project Tasks"}
          projectIcon={project?.icon}
          projectColor={project?.color}
          starred={project?.starred}
        />
      }
      listParams={{ project_id: projectId }}
      fixedProjectId={projectId}
    />
  )
}
