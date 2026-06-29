"use client"

import React, { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import type { TaskPeriodFilter, TasksListParams } from "@/lib/api/tasks"
import Header from "./Header"
import MyTasks from "./MyTasks"

const Goals = dynamic(() => import("./Goals"), { ssr: false })
const Projects = dynamic(() => import("./Projects"), { ssr: false })

function TasksContent() {
  const [period, setPeriod] = useState<TaskPeriodFilter>("month")

  const listParams = useMemo<Omit<TasksListParams, "filter">>(
    () => ({ period }),
    [period],
  )

  return (
    <>
      <Header period={period} onPeriodChange={setPeriod} listParams={listParams} />
      <div className="flex-1">
        <MyTasks listParams={listParams} />
        <Goals />
        <Projects />
      </div>
    </>
  )
}

export default TasksContent
