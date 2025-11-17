import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"

const mockRewards = [
  { id: 1, type: "XP", amount: 100, rarity: "common", date: "Today" },
  { id: 2, type: "Ticket", amount: 1, rarity: "rare", date: "Yesterday" },
  { id: 3, type: "Fragment", name: "Legendary Shard", rarity: "legendary", date: "2 days ago" },
  { id: 4, type: "Aura", name: "Cosmic Glow", rarity: "epic", date: "3 days ago" },
  { id: 5, type: "XP", amount: 150, rarity: "common", date: "4 days ago" },
]

const rarityColors = {
  common: "text-gray-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
}

export function RewardsScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Reward History</h2>
        <p className="text-sm text-muted-foreground">
          View all your past rewards and rarities
        </p>
      </div>

      <div className="space-y-3">
        {mockRewards.map((reward) => (
          <GlassCard key={reward.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-base-blue)] to-[var(--color-neon-purple)] flex items-center justify-center text-2xl">
                {reward.type === "XP" && "⭐"}
                {reward.type === "Ticket" && "🎫"}
                {reward.type === "Aura" && "✨"}
                {reward.type === "Fragment" && "💎"}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">
                    {reward.name || `${reward.amount} ${reward.type}`}
                  </h3>
                  <span className={cn("text-xs font-bold uppercase", rarityColors[reward.rarity as keyof typeof rarityColors])}>
                    {reward.rarity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{reward.date}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
