import { cn } from "@/lib/utils"

interface AstraLogoProps {
  className?: string
}

export function AstraLogo({ className }: AstraLogoProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="relative">
        {/* Outer ring */}
        <div className="w-10 h-10 border-2 border-cyan-400 rounded-full animate-pulse">
          {/* Inner core */}
          <div className="absolute inset-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
          </div>
        </div>
        {/* Orbital rings */}
        <div
          className="absolute inset-0 w-10 h-10 border border-cyan-400/30 rounded-full animate-spin"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute inset-1 w-8 h-8 border border-blue-400/20 rounded-full animate-spin"
          style={{ animationDuration: "2s", animationDirection: "reverse" }}
        ></div>
      </div>

      <div className="flex flex-col">
        <span className="text-2xl font-bold font-mono tracking-wider text-cyan-300">ASTRA</span>
        <span className="text-xs font-mono text-cyan-300 -mt-1 tracking-widest">NEURAL OS</span>
      </div>
    </div>
  )
}
