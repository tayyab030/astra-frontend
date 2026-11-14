"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WealthScope } from "@/lib/api/wealth"

interface ScopeToggleProps {
  value: WealthScope
  onChange: (scope: WealthScope) => void
}

export function ScopeToggle({ value, onChange }: ScopeToggleProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onChange(next as WealthScope)}
      className="w-full max-w-xs"
    >
      <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-slate-600/50">
        <TabsTrigger
          value="personal"
          className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
        >
          Personal
        </TabsTrigger>
        <TabsTrigger
          value="farm"
          className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white"
        >
          Farm
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
