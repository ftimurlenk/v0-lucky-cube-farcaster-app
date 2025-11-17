"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { CubeScreen } from "@/components/cube-screen"
import { Toaster } from "@/components/ui/toaster"
import { getUserData } from "@/lib/farcaster"
import { initFarcaster } from "@/lib/farcaster"

export default function Home() {
  const [username, setUsername] = useState<string>()

  useEffect(() => {
    const init = async () => {
      const isFarcaster = await initFarcaster()
      
      const user = await getUserData()
      if (user) {
        setUsername(user.username)
      }
    }
    
    init()
  }, [])

  return (
    <div className="min-h-screen flex flex-col pt-16 pb-4">
      <Header username={username} />
      
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="max-w-md w-full">
          <CubeScreen />
        </div>
      </main>

      <footer className="py-4 text-center">
        <p className="text-xs text-muted-foreground/50">
          Lucky Capsule Mini App for Base
        </p>
      </footer>

      <Toaster />
    </div>
  )
}
