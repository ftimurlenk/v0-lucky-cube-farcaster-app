import { GlassCard } from "./glass-card"
import { Trophy, Zap, Target } from 'lucide-react'

export function ProfileScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Your Lucky Cube stats and achievements
        </p>
      </div>

      {/* User Stats */}
      <GlassCard>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-base-blue)] to-[var(--color-neon-purple)] flex items-center justify-center text-3xl">
            🎲
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">@luckyuser</h3>
            <p className="text-sm text-muted-foreground">Level 12 Player</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">47</p>
            <p className="text-xs text-muted-foreground">Total Cubes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">7</p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">Legendaries</p>
          </div>
        </div>
      </GlassCard>

      {/* Achievements */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Achievements</h3>
        <div className="space-y-3">
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">First Legendary</p>
                <p className="text-xs text-muted-foreground">Got your first legendary reward</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Week Warrior</p>
                <p className="text-xs text-muted-foreground">Maintained a 7-day streak</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Cube Collector</p>
                <p className="text-xs text-muted-foreground">Broke 50 cubes total</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
