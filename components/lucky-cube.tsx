"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface LuckyCubeProps {
  isBreaking: boolean
  canBreak: boolean
}

export function LuckyCube({ isBreaking, canBreak }: LuckyCubeProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    if (isBreaking) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        delay: Math.random() * 0.3,
      }))
      setParticles(newParticles)
    } else {
      setParticles([])
    }
  }, [isBreaking])

  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        <div
          className={cn(
            "relative w-40 h-40 transition-all duration-300",
            canBreak && !isBreaking && "animate-float cursor-pointer hover:scale-105",
            isBreaking && "animate-shake scale-110"
          )}
          style={{
            perspective: "800px",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(-25deg) rotateY(25deg)",
              animation: canBreak && !isBreaking ? "rotate3d 12s infinite linear" : "none",
            }}
          >
            <div
              className={cn(
                "absolute inset-0 rounded-2xl transition-all duration-300 border border-white/20",
                canBreak
                  ? "bg-gradient-to-br from-[var(--color-base-blue)]/90 via-purple-500/90 to-[var(--color-neon-purple)]/90"
                  : "bg-gradient-to-br from-gray-600/60 to-gray-800/60"
              )}
              style={{
                transform: "translateZ(80px)",
                boxShadow: canBreak ? "0 0 40px rgba(0, 122, 255, 0.4)" : "none",
              }}
            >
              <div className="absolute inset-4 border border-white/30 rounded-xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl opacity-40 font-bold">
                ?
              </div>
            </div>

            <div
              className={cn(
                "absolute inset-0 rounded-2xl transition-all duration-300 border border-white/10",
                canBreak
                  ? "bg-gradient-to-br from-purple-400/80 to-[var(--color-base-blue)]/80"
                  : "bg-gradient-to-br from-gray-500/50 to-gray-700/50"
              )}
              style={{
                transform: "rotateX(90deg) translateZ(80px)",
              }}
            />

            <div
              className={cn(
                "absolute inset-0 rounded-2xl transition-all duration-300 border border-white/10",
                canBreak
                  ? "bg-gradient-to-br from-[var(--color-neon-purple)]/80 to-purple-700/80"
                  : "bg-gradient-to-br from-gray-700/50 to-gray-900/50"
              )}
              style={{
                transform: "rotateY(90deg) translateZ(80px)",
              }}
            />
            
            {/* Breaking effect */}
            {isBreaking && (
              <>
                <div className="absolute inset-0 bg-white/40 rounded-2xl animate-pulse z-10" style={{ transform: "translateZ(80px)" }} />
                <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-white/90 z-10" style={{ transform: "translateZ(81px)" }} />
                <div className="absolute top-2/4 left-0 right-0 h-0.5 bg-white/90 z-10" style={{ transform: "translateZ(81px)" }} />
                <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-white/90 z-10" style={{ transform: "translateZ(81px)" }} />
                <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-white/90 z-10" style={{ transform: "translateZ(81px)" }} />
                <div className="absolute left-2/4 top-0 bottom-0 w-0.5 bg-white/90 z-10" style={{ transform: "translateZ(81px)" }} />
                <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-white/90 z-10" style={{ transform: "translateZ(81px)" }} />
              </>
            )}
          </div>
        </div>

        {isBreaking && particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute top-1/2 left-1/2 text-3xl pointer-events-none z-20"
            style={{
              animation: `particle-explosion 1.5s ease-out forwards`,
              animationDelay: `${particle.delay}s`,
              "--particle-x": `${particle.x}px`,
              "--particle-y": `${particle.y}px`,
            } as any}
          >
            🪙
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes rotate3d {
          from { transform: rotateX(-25deg) rotateY(25deg); }
          to { transform: rotateX(-25deg) rotateY(385deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: rotateX(-25deg) rotateY(25deg); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px) rotateX(-25deg) rotateY(25deg); }
          20%, 40%, 60%, 80% { transform: translateX(8px) rotateX(-25deg) rotateY(25deg); }
        }

        @keyframes particle-explosion {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(0, 0) scale(0.5) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(var(--particle-x), var(--particle-y)) scale(1.2) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(calc(var(--particle-x) * 1.5), calc(var(--particle-y) * 1.5)) scale(0.3) rotate(360deg);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
