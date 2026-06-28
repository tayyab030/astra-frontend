import type { LucideIcon } from "lucide-react"

interface WealthEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

export function WealthEmptyState({ icon: Icon, title, description }: WealthEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-slate-700/30 rounded-full p-6 mb-6 border border-slate-600/50">
        <Icon className="w-12 h-12 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold font-mono text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 font-mono text-center text-sm max-w-md">{description}</p>
    </div>
  )
}
