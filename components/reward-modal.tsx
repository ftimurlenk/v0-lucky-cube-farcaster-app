"use client"

import { useState } from "react"
import { GlassCard } from "./glass-card"
import { Button } from "./ui/button"
import { Share2, X, Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { shareToCast, generateShareMessage } from "@/lib/farcaster"
import { claimRewardOnchain } from "@/lib/base"
import { useToast } from "@/hooks/use-toast"

interface RewardModalProps {
  reward: {
    type: string
    amount?: number
    name?: string
    rarity: "common" | "rare" | "epic" | "legendary"
    icon?: string
  }
  onClose: () => void
  streak: number
}

const rarityColors = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-600",
}

const rarityGlows = {
  common: "shadow-gray-500/50",
  rare: "shadow-blue-500/50",
  epic: "shadow-purple-500/50",
  legendary: "shadow-yellow-500/50",
}

export function RewardModal({ reward, onClose, streak }: RewardModalProps) {
  const [isClaiming, setIsClaiming] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  const handleClaim = async () => {
    setIsClaiming(true)
    
    // Simulate onchain claim
    const rewardId = `${reward.type}_${Date.now()}`
    const txHash = await claimRewardOnchain(rewardId)
    
    if (txHash) {
      toast({
        title: "Reward Claimed!",
        description: "Your reward has been claimed on Base",
      })
      
      // Wait a moment to show success
      setTimeout(() => {
        onClose()
      }, 1500)
    } else {
      toast({
        title: "Claim Failed",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive"
      })
      setIsClaiming(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    
    const message = generateShareMessage(reward, streak)
    const success = await shareToCast({
      text: message,
      embeds: ['https://luckycube.app']
    })
    
    if (success) {
      toast({
        title: "Shared to Farcaster!",
        description: "Your Lucky Capsule result has been casted",
      })
    } else {
      toast({
        title: "Share Failed",
        description: "Failed to share to Farcaster. Please try again.",
        variant: "destructive"
      })
    }
    
    setIsSharing(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xs animate-scale-in">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-1.5 text-white hover:text-gray-300 transition-colors"
          disabled={isClaiming}
        >
          <X className="w-5 h-5" />
        </button>

        <GlassCard className="space-y-4 p-4">
          {/* Reward Display */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div
                className={cn(
                  "w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-2xl",
                  rarityColors[reward.rarity],
                  rarityGlows[reward.rarity]
                )}
              >
                {reward.icon?.startsWith('http') ? (
                  <img 
                    src={reward.icon || "/placeholder.svg"} 
                    alt={reward.name || 'reward'} 
                    className="w-14 h-14 rounded-full"
                  />
                ) : (
                  <span className="text-4xl">
                    {reward.icon || (reward.type === "MEME" ? "🪙" : "⭐")}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className={cn(
                "inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase mb-1.5",
                "bg-gradient-to-r text-white",
                rarityColors[reward.rarity]
              )}>
                {reward.rarity}
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {reward.name || `${reward.amount} ${reward.type}`}
              </h2>
              {reward.type === "MEME" && reward.amount && (
                <p className="text-base text-[var(--color-base-blue)] font-semibold">
                  {reward.amount} tokens
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Base Network
              </p>
            </div>
          </div>

          {/* Confetti effect for rare+ rewards */}
          {(reward.rarity === "epic" || reward.rarity === "legendary") && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-[var(--color-base-blue)] rounded-full animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10px',
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${2 + Math.random()}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleClaim}
              disabled={isClaiming}
              className="w-full h-10 bg-[var(--color-base-blue)] hover:bg-[var(--color-base-blue)]/80 text-white rounded-xl font-bold text-sm"
            >
              {isClaiming ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Claiming...
                </>
              ) : (
                'Claim Reward'
              )}
            </Button>
            <Button
              onClick={handleShare}
              disabled={isSharing || isClaiming}
              variant="outline"
              className="w-full h-10 glass-panel border-[var(--color-glass-border)] text-foreground rounded-xl hover:bg-white/5 text-sm"
            >
              {isSharing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 mr-2" />
                  Share to Farcaster
                </>
              )}
            </Button>
          </div>
        </GlassCard>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(200px) rotate(360deg);
            opacity: 0;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  )
}
