import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
}

export function GlassCard({ children, className, glow = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl p-6",
        glow && "glow-base",
        className
      )}
    >
      {children}
    </div>
  )
}
