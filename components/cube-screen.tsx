"use client"

import { useState } from "react"
import { GlassCard } from "./glass-card"
import { CapsuleMachine } from "./capsule-machine"
import { RewardModal } from "./reward-modal"
import { Button } from "./ui/button"
import { Clock, Zap } from 'lucide-react'

export function CubeScreen() {
  const [isRevealing, setIsRevealing] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [reward, setReward] = useState<any>(null)
  const [canBreak, setCanBreak] = useState(true)
  const [streak, setStreak] = useState(3)

  const handleDispenseCapsule = async () => {
    if (!canBreak) return
    
    setIsRevealing(true)
    
    setTimeout(() => {
      const rewards = [
        { 
          type: "MEME", 
          name: "$DEGEN", 
          amount: 420, 
          rarity: "common", 
          icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DEGEN-sSvew0K6ud5k0ythdiQyjvndNLPZn2.png" 
        },
        { 
          type: "MEME", 
          name: "$BRETT", 
          amount: 150, 
          rarity: "rare", 
          icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BRETT-ozpYg7u7E96NohtamJl7aVELhzhfOz.png" 
        },
        { 
          type: "MEME", 
          name: "$TOSHI", 
          amount: 500, 
          rarity: "common", 
          icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TOSHI-1ZNvWASKhERdy3mCN0eQgICr3EP8z1.png" 
        },
        { 
          type: "MEME", 
          name: "$MOCHI", 
          amount: 300, 
          rarity: "rare", 
          icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MOCHI-NmRIeEx0vGLuEfb1Ooto7feRTeeMM4.png" 
        },
        { 
          type: "MEME", 
          name: "$BASEGOD", 
          amount: 250, 
          rarity: "epic", 
          icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BASEGOD-Ksand5zSx766VPZkM9gLpufGcPg5KH.png" 
        },
        { 
          type: "MEME", 
          name: "$SHIBA", 
          amount: 180, 
          rarity: "rare", 
          icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SHIBA-EraPJJhqAAmtWh96hbCu64KNrrqsWV.png" 
        },
      ]
      
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)]
      setReward(randomReward)
      setIsRevealing(false)
      setShowReward(true)
      setCanBreak(false)
    }, 2500)
  }

  return (
    <>
      <div className="space-y-4">

        <div className="relative flex justify-center py-2">
          <CapsuleMachine isDispensing={isRevealing} canDispense={canBreak} />
        </div>

        <div className="text-center py-1">
          {canBreak ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-base-blue)] animate-pulse" />
              <p className="text-sm font-bold text-[var(--color-base-blue)]">
                Capsule Ready
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Come back tomorrow
            </p>
          )}
        </div>

        <Button
          onClick={handleDispenseCapsule}
          disabled={!canBreak || isRevealing}
          className="w-full h-11 text-sm font-bold bg-[var(--color-base-blue)] hover:bg-[var(--color-base-blue)]/80 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-lg shadow-[var(--color-base-blue)]/20"
        >
          {isRevealing ? "Dispensing..." : canBreak ? "Get Capsule" : "Come Back Tomorrow"}
        </Button>

        <GlassCard className="p-3">
          <p className="text-xs text-muted-foreground mb-2 text-center">Available Tokens</p>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-background/20">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DEGEN-sSvew0K6ud5k0ythdiQyjvndNLPZn2.png" 
                alt="DEGEN"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-[10px] font-medium text-foreground">$DEGEN</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-background/20">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BRETT-ozpYg7u7E96NohtamJl7aVELhzhfOz.png" 
                alt="BRETT"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-[10px] font-medium text-foreground">$BRETT</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-background/20">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TOSHI-1ZNvWASKhERdy3mCN0eQgICr3EP8z1.png" 
                alt="TOSHI"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-[10px] font-medium text-foreground">$TOSHI</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-background/20">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MOCHI-NmRIeEx0vGLuEfb1Ooto7feRTeeMM4.png" 
                alt="MOCHI"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-[10px] font-medium text-foreground">$MOCHI</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-background/20">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BASEGOD-Ksand5zSx766VPZkM9gLpufGcPg5KH.png" 
                alt="BASEGOD"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-[10px] font-medium text-foreground">$BASEGOD</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-background/20">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SHIBA-EraPJJhqAAmtWh96hbCu64KNrrqsWV.png" 
                alt="SHIBA"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-[10px] font-medium text-foreground">$SHIBA</span>
            </div>
          </div>
        </GlassCard>

      </div>

      {showReward && reward && (
        <RewardModal
          reward={reward}
          onClose={() => setShowReward(false)}
          streak={streak}
        />
      )}
    </>
  )
}
