import type { LucideIcon } from "lucide-react"

interface NotesEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function NotesEmptyState({ icon: Icon, title, description, action }: NotesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-slate-700/30 rounded-full p-6 mb-6 border border-slate-600/50">
        <Icon className="w-12 h-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold font-poppins text-cyan-300 mb-2">{title}</h3>
      <p className="text-slate-400 font-inter text-center text-sm max-w-md mb-6">{description}</p>
      {action}
    </div>
  )
}
