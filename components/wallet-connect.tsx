"use client"

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Wallet } from 'lucide-react'
import { connectWallet, getWalletAddress, shortenAddress } from '@/lib/base'

export function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Check if already connected
    getWalletAddress().then(setAddress)
  }, [])

  const handleConnect = async () => {
    setIsConnecting(true)
    const addr = await connectWallet()
    setAddress(addr)
    setIsConnecting(false)
  }

  if (address) {
    return (
      <div className="glass-panel px-3 py-1.5 rounded-full">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-[var(--color-base-blue)]" />
          <span className="text-sm font-medium text-foreground">
            {shortenAddress(address)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      size="sm"
      className="glass-panel border-[var(--color-base-blue)] text-foreground hover:bg-[var(--color-base-blue)]/20"
      variant="outline"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? 'Connecting...' : 'Connect'}
    </Button>
  )
}
