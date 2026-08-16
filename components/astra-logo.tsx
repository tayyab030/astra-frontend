import Image from "next/image"
import { cn } from "@/lib/utils"

interface AstraLogoProps {
  className?: string
  /** Prefer icon-only when space is tight (falls back to full logo). */
  compact?: boolean
}

export function AstraLogo({ className, compact = false }: AstraLogoProps) {
  return (
    <Image
      src="/images/navbar-logo.png"
      alt="ASTRA"
      width={compact ? 200 : 260}
      height={compact ? 56 : 72}
      priority
      className={cn(
        "h-11 w-auto max-h-11 object-contain object-left sm:h-12 sm:max-h-12",
        className
      )}
    />
  )
}
