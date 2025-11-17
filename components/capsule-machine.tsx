"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface CapsuleMachineProps {
  isDispensing: boolean
  canDispense: boolean
}

export function CapsuleMachine({ isDispensing, canDispense }: CapsuleMachineProps) {
  const [capsuleState, setCapsuleState] = useState<'idle' | 'mixing' | 'dropping' | 'breaking'>('idle')
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; rotation: number }>>([])
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
  const [machineShake, setMachineShake] = useState(false)
  const [droppingCapsuleColor, setDroppingCapsuleColor] = useState({
    gradient: "linear-gradient(180deg, #C084FC 0%, #A855F7 30%, #9333EA 60%, #EC4899 100%)",
    glow: "rgba(167, 139, 250, 0.9)"
  })

  const capsuleColors = [
    {
      gradient: "linear-gradient(180deg, #F472B6 0%, #EC4899 50%, #BE185D 100%)",
      glow: "rgba(244, 114, 182, 0.9)"
    },
    {
      gradient: "linear-gradient(180deg, #22D3EE 0%, #06B6D4 50%, #0891B2 100%)",
      glow: "rgba(34, 211, 238, 0.9)"
    },
    {
      gradient: "linear-gradient(180deg, #FCD34D 0%, #FBBF24 50%, #F59E0B 100%)",
      glow: "rgba(252, 211, 77, 0.9)"
    },
    {
      gradient: "linear-gradient(180deg, #C084FC 0%, #A855F7 30%, #9333EA 60%, #EC4899 100%)",
      glow: "rgba(167, 139, 250, 0.9)"
    },
    {
      gradient: "linear-gradient(180deg, #86EFAC 0%, #4ADE80 50%, #22C55E 100%)",
      glow: "rgba(134, 239, 172, 0.9)"
    },
    {
      gradient: "linear-gradient(180deg, #FCA5A5 0%, #EF4444 50%, #DC2626 100%)",
      glow: "rgba(252, 165, 165, 0.9)"
    }
  ]

  useEffect(() => {
    if (canDispense && capsuleState === 'idle') {
      const interval = setInterval(() => {
        const newSparkle = {
          id: Date.now(),
          x: Math.random() * 140 - 70,
          y: Math.random() * 140 - 70,
          delay: 0,
        }
        setSparkles(prev => [...prev.slice(-5), newSparkle])
      }, 800)
      
      return () => clearInterval(interval)
    }
  }, [canDispense, capsuleState])

  useEffect(() => {
    if (isDispensing) {
      const randomColor = capsuleColors[Math.floor(Math.random() * capsuleColors.length)]
      setDroppingCapsuleColor(randomColor)
      
      setMachineShake(true)
      setCapsuleState('mixing')
      
      setTimeout(() => {
        setCapsuleState('dropping')
        setMachineShake(false)
      }, 1400)
      
      setTimeout(() => {
        setCapsuleState('breaking')
        
        const newParticles = Array.from({ length: 48 }, (_, i) => {
          const angle = (i / 48) * Math.PI * 2
          const distance = 90 + Math.random() * 100
          const spiralOffset = (i % 3) * 0.3
          return {
            id: i,
            x: Math.cos(angle + spiralOffset) * distance,
            y: Math.sin(angle + spiralOffset) * distance,
            delay: Math.random() * 0.15,
            rotation: Math.random() * 1080,
          }
        })
        setParticles(newParticles)
      }, 2600)
      
      setTimeout(() => {
        setCapsuleState('idle')
        setParticles([])
      }, 4600)
    }
  }, [isDispensing])

  return (
    <div className="flex justify-center items-center py-4">
      <div className="relative w-full max-w-[220px]">
        {canDispense && (
          <div 
            className="absolute inset-0 rounded-full blur-3xl opacity-50 pointer-events-none"
            style={{
              background: "radial-gradient(circle, var(--color-base-blue) 0%, transparent 70%)",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          />
        )}

        <div className={cn(
          "relative transition-transform duration-100",
          machineShake && "animate-machine-shake"
        )}>
          <div className="relative mx-auto w-36 h-36 mb-3">
            <div 
              className={cn(
                "absolute inset-0 rounded-full border-[3px] transition-all duration-500 overflow-hidden",
                canDispense 
                  ? "border-[var(--color-base-blue)]/60 bg-gradient-to-br from-[var(--color-base-blue)]/20 via-transparent to-[var(--color-base-blue)]/10" 
                  : "border-white/25 bg-gradient-to-br from-white/10 via-transparent to-white/5"
              )}
              style={{
                boxShadow: canDispense 
                  ? "inset 0 8px 20px rgba(0, 122, 255, 0.15), 0 0 40px rgba(0, 122, 255, 0.25), inset -8px -8px 16px rgba(255, 255, 255, 0.08)"
                  : "inset 0 6px 16px rgba(0, 0, 0, 0.2), inset -8px -8px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(16px)",
              }}
            >
              {capsuleState === 'mixing' && (
                <div 
                  className="absolute inset-0 rounded-full border-2 border-[var(--color-base-blue)] animate-energy-ring"
                  style={{
                    boxShadow: "0 0 20px var(--color-base-blue), inset 0 0 20px var(--color-base-blue)",
                  }}
                />
              )}

              <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1.5",
                capsuleState === 'mixing' && "animate-tumble-mix"
              )}>
                <div 
                  className={cn(
                    "w-7 h-9 rounded-full border-2 border-white/50 shadow-lg transition-all duration-300",
                    capsuleState === 'mixing' ? "animate-capsule-shake-1" : "animate-float"
                  )}
                  style={{
                    background: "linear-gradient(180deg, #F472B6 0%, #EC4899 50%, #BE185D 100%)",
                    boxShadow: "0 3px 12px rgba(244, 114, 182, 0.5), inset 0 -6px 10px rgba(0, 0, 0, 0.35)",
                    animation: capsuleState !== 'mixing' ? "float 2.8s ease-in-out infinite" : "capsule-shake-1 1.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
                  }}
                >
                  <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-white/60 blur-[1px]" />
                </div>
                
                <div 
                  className={cn(
                    "w-7 h-9 rounded-full border-2 border-white/50 shadow-lg transition-all duration-300",
                    capsuleState === 'mixing' ? "animate-capsule-shake-2" : "animate-float"
                  )}
                  style={{
                    background: "linear-gradient(180deg, #22D3EE 0%, #06B6D4 50%, #0891B2 100%)",
                    boxShadow: "0 3px 12px rgba(34, 211, 238, 0.5), inset 0 -6px 10px rgba(0, 0, 0, 0.35)",
                    animation: capsuleState !== 'mixing' ? "float 2.8s ease-in-out 0.3s infinite" : "capsule-shake-2 1.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
                  }}
                >
                  <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-white/60 blur-[1px]" />
                </div>
                
                <div 
                  className={cn(
                    "w-7 h-9 rounded-full border-2 border-white/50 shadow-lg transition-all duration-300",
                    capsuleState === 'mixing' ? "animate-capsule-shake-3" : "animate-float"
                  )}
                  style={{
                    background: "linear-gradient(180deg, #FCD34D 0%, #FBBF24 50%, #F59E0B 100%)",
                    boxShadow: "0 3px 12px rgba(252, 211, 77, 0.5), inset 0 -6px 10px rgba(0, 0, 0, 0.35)",
                    animation: capsuleState !== 'mixing' ? "float 2.8s ease-in-out 0.6s infinite" : "capsule-shake-3 1.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
                  }}
                >
                  <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-white/60 blur-[1px]" />
                </div>
              </div>
              
              <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white/30 blur-2xl pointer-events-none" />
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/15 blur-xl pointer-events-none" />
              
              <div 
                className="absolute top-5 left-2 w-1.5 h-24 rounded-full bg-gradient-to-b from-white/50 via-white/15 to-transparent blur-sm pointer-events-none"
                style={{ transform: "rotate(-20deg)" }}
              />
            </div>
          </div>

          <div className="relative mx-auto w-20 h-12 mb-2">
            <div 
              className={cn(
                "absolute inset-0 rounded-lg border-2 transition-all duration-500",
                canDispense 
                  ? "border-[var(--color-base-blue)]/50 bg-gradient-to-b from-transparent via-[var(--color-base-blue)]/8 to-[var(--color-base-blue)]/20"
                  : "border-white/25 bg-gradient-to-b from-transparent via-white/8 to-white/15"
              )}
              style={{
                clipPath: "polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)",
                backdropFilter: "blur(8px)",
                boxShadow: canDispense 
                  ? "inset 0 -6px 16px rgba(0, 122, 255, 0.25)"
                  : "inset 0 -6px 12px rgba(0, 0, 0, 0.35)",
              }}
            />
            
            {(capsuleState === 'dropping' || capsuleState === 'breaking') && (
              <div 
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 w-10 h-12 rounded-full transition-all",
                  capsuleState === 'dropping' && "animate-capsule-drop",
                  capsuleState === 'breaking' && "animate-capsule-break"
                )}
                style={{
                  background: droppingCapsuleColor.gradient,
                  border: "2.5px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: capsuleState === 'breaking' 
                    ? `0 0 80px ${droppingCapsuleColor.glow}, 0 0 120px ${droppingCapsuleColor.glow}, inset 0 -8px 16px rgba(0, 0, 0, 0.45)`
                    : `0 4px 35px ${droppingCapsuleColor.glow}, inset 0 -8px 16px rgba(0, 0, 0, 0.4)`,
                  top: capsuleState === 'dropping' ? '-60px' : 'auto',
                  bottom: capsuleState === 'dropping' ? 'auto' : '-16px',
                }}
              >
                <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-white/60 blur-sm" />
                <div className="absolute top-3 right-1.5 w-3 h-3 rounded-full bg-white/35 blur-[2px]" />
              </div>
            )}
          </div>
        </div>

        {capsuleState === 'breaking' && particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute top-1/2 left-1/2 pointer-events-none z-20"
            style={{
              animation: `particle-explosion 2s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              animationDelay: `${particle.delay}s`,
              "--particle-x": `${particle.x}px`,
              "--particle-y": `${particle.y}px`,
              "--particle-rotation": `${particle.rotation}deg`,
              fontSize: particle.id % 3 === 0 ? '28px' : particle.id % 2 === 0 ? '22px' : '24px',
              filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 1)) drop-shadow(0 0 20px rgba(255, 165, 0, 0.8))',
            } as any}
          >
            🪙
          </div>
        ))}

        {canDispense && sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute top-1/2 left-1/2 text-yellow-300 pointer-events-none animate-sparkle"
            style={{
              transform: `translate(calc(-50% + ${sparkle.x}px), calc(-50% + ${sparkle.y}px))`,
              fontSize: '6px',
            }}
          >
            ✨
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes particle-explosion {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg);
          }
          10% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(calc(var(--particle-x) * 0.2), calc(var(--particle-y) * 0.2)) scale(1.4) rotate(calc(var(--particle-rotation) * 0.2));
          }
          35% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(calc(var(--particle-x) * 0.7), calc(var(--particle-y) * 0.7)) scale(1.8) rotate(calc(var(--particle-rotation) * 0.6));
          }
          60% {
            opacity: 0.9;
            transform: translate(-50%, -50%) translate(var(--particle-x), var(--particle-y)) scale(1.3) rotate(var(--particle-rotation));
          }
          85% {
            opacity: 0.4;
            transform: translate(-50%, -50%) translate(calc(var(--particle-x) * 1.15), calc(var(--particle-y) * 1.3)) scale(0.7) rotate(calc(var(--particle-rotation) * 1.3));
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(calc(var(--particle-x) * 1.3), calc(var(--particle-y) * 1.6)) scale(0.1) rotate(calc(var(--particle-rotation) * 1.8));
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.05);
          }
        }
        
        @keyframes sparkle {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(0.5) rotate(360deg);
          }
        }
        
        @keyframes capsule-shake-1 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          12% {
            transform: translate(-14px, -10px) rotate(-25deg) scale(1.2);
          }
          24% {
            transform: translate(12px, 8px) rotate(20deg) scale(1.15);
          }
          36% {
            transform: translate(-10px, -14px) rotate(-30deg) scale(1.25);
          }
          48% {
            transform: translate(16px, 10px) rotate(25deg) scale(1.1);
          }
          60% {
            transform: translate(-12px, -8px) rotate(-18deg) scale(1.2);
          }
          72% {
            transform: translate(10px, 12px) rotate(22deg) scale(1.15);
          }
          84% {
            transform: translate(-6px, -6px) rotate(-12deg) scale(1.1);
          }
          96% {
            transform: translate(4px, 4px) rotate(8deg) scale(1.05);
          }
        }
        
        @keyframes capsule-shake-2 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          12% {
            transform: translate(12px, 14px) rotate(28deg) scale(1.25);
          }
          24% {
            transform: translate(-16px, -8px) rotate(-22deg) scale(1.15);
          }
          36% {
            transform: translate(14px, -12px) rotate(32deg) scale(1.2);
          }
          48% {
            transform: translate(-12px, 12px) rotate(-20deg) scale(1.1);
          }
          60% {
            transform: translate(12px, 12px) rotate(20deg) scale(1.1);
          }
          72% {
            transform: translate(-8px, -10px) rotate(-18deg) scale(1.2);
          }
          84% {
            transform: translate(6px, 8px) rotate(16deg) scale(1.1);
          }
          96% {
            transform: translate(-4px, -5px) rotate(-12deg) scale(1.05);
          }
        }
        
        @keyframes capsule-shake-3 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          12% {
            transform: translate(10px, -12px) rotate(30deg) scale(1.2);
          }
          24% {
            transform: translate(-14px, 10px) rotate(-26deg) scale(1.25);
          }
          36% {
            transform: translate(16px, 8px) rotate(24deg) scale(1.15);
          }
          48% {
            transform: translate(-10px, -14px) rotate(-32deg) scale(1.2);
          }
          60% {
            transform: translate(12px, 12px) rotate(20deg) scale(1.1);
          }
          72% {
            transform: translate(-8px, -10px) rotate(-18deg) scale(1.2);
          }
          84% {
            transform: translate(6px, 8px) rotate(16deg) scale(1.1);
          }
          96% {
            transform: translate(-4px, -5px) rotate(-12deg) scale(1.05);
          }
        }
        
        @keyframes capsule-drop {
          0% {
            top: -60px;
            transform: translate(-50%, 0) rotate(0deg) scale(1);
            filter: brightness(1.3) drop-shadow(0 0 20px rgba(167, 139, 250, 0.8));
          }
          50% {
            top: 28px;
            transform: translate(-50%, 0) rotate(180deg) scale(1.15);
            filter: brightness(1.5) drop-shadow(0 0 30px rgba(167, 139, 250, 1));
          }
          65% {
            top: 20px;
            transform: translate(-50%, 0) rotate(210deg) scale(0.9);
            filter: brightness(1.2) drop-shadow(0 0 25px rgba(167, 139, 250, 0.9));
          }
          78% {
            top: 28px;
            transform: translate(-50%, 0) rotate(235deg) scale(1.08);
            filter: brightness(1.4) drop-shadow(0 0 28px rgba(167, 139, 250, 1));
          }
          88% {
            top: 24px;
            transform: translate(-50%, 0) rotate(250deg) scale(0.96);
            filter: brightness(1.25) drop-shadow(0 0 26px rgba(167, 139, 250, 0.95));
          }
          100% {
            top: 26px;
            transform: translate(-50%, 0) rotate(260deg) scale(1);
            filter: brightness(1.3) drop-shadow(0 0 27px rgba(167, 139, 250, 1));
          }
        }
        
        @keyframes capsule-break {
          0% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1) rotate(260deg);
            filter: brightness(1.3) drop-shadow(0 0 30px rgba(167, 139, 250, 1));
          }
          20% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1.4) rotate(290deg);
            filter: brightness(2.5) saturate(1.8) drop-shadow(0 0 50px rgba(167, 139, 250, 1)) drop-shadow(0 0 80px rgba(236, 72, 153, 1));
          }
          45% {
            opacity: 0.8;
            transform: translate(-50%, 0) scale(1.8) rotate(330deg);
            filter: brightness(3.5) saturate(2.5) drop-shadow(0 0 70px rgba(167, 139, 250, 1)) drop-shadow(0 0 100px rgba(236, 72, 153, 1));
          }
          70% {
            opacity: 0.5;
            transform: translate(-50%, 0) scale(2.2) rotate(370deg);
            filter: brightness(4) saturate(3) drop-shadow(0 0 90px rgba(255, 215, 0, 1));
          }
          100% {
            opacity: 0;
            transform: translate(-50%, 0) scale(2.8) rotate(420deg);
            filter: brightness(5) saturate(4) drop-shadow(0 0 120px rgba(255, 215, 0, 1));
          }
        }
        
        @keyframes machine-shake {
          0%, 100% {
            transform: translate(0, 0);
          }
          10% {
            transform: translate(-2px, 1px);
          }
          20% {
            transform: translate(2px, -1px);
          }
          30% {
            transform: translate(-1px, 2px);
          }
          40% {
            transform: translate(1px, -2px);
          }
          50% {
            transform: translate(-2px, -1px);
          }
          60% {
            transform: translate(2px, 1px);
          }
          70% {
            transform: translate(-1px, -1px);
          }
          80% {
            transform: translate(1px, 2px);
          }
          90% {
            transform: translate(-1px, -2px);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        
        @keyframes energy-ring {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(1.3);
          }
        }
        
        .animate-sparkle {
          animation: sparkle 1.5s ease-out forwards;
        }
        
        .animate-float {
          animation: float 2.8s ease-in-out infinite;
        }
        
        .animate-capsule-drop {
          animation: capsule-drop 1.2s cubic-bezier(0.6, 0.04, 0.98, 0.335) forwards;
        }
        
        .animate-capsule-break {
          animation: capsule-break 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-machine-shake {
          animation: machine-shake 0.8s ease-in-out infinite;
        }
        
        .animate-energy-ring {
          animation: energy-ring 1.4s ease-out infinite;
        }
      `}</style>
    </div>
  )
}
