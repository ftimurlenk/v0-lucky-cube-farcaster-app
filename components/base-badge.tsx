export function BaseBadge() {
  return (
    <div className="inline-flex items-center gap-2 glass-panel px-3 py-1.5 rounded-full">
      <div className="w-2 h-2 rounded-full bg-[var(--color-base-blue)] animate-pulse" />
      <span className="text-xs font-medium text-foreground">On Base</span>
    </div>
  )
}
