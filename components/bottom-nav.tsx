"use client"

import { Home, Package, User } from 'lucide-react'
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: "home" | "rewards" | "profile"
  onTabChange: (tab: "home" | "rewards" | "profile") => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home" as const, icon: Home, label: "Home" },
    { id: "rewards" as const, icon: Package, label: "Rewards" },
    { id: "profile" as const, icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom">
      <div className="max-w-md mx-auto px-4 pb-4">
        <div className="glass-panel rounded-2xl px-6 py-3">
          <div className="flex items-center justify-around gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 transition-all",
                    isActive && "scale-110"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      isActive
                        ? "bg-[var(--color-base-blue)] text-white"
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
