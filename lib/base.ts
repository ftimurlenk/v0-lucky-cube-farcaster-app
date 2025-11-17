"use client"

// Base network integration utilities
export const BASE_CHAIN_ID = 8453
export const BASE_RPC_URL = 'https://mainnet.base.org'

export interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>
  on: (event: string, handler: (...args: any[]) => void) => void
  removeListener: (event: string, handler: (...args: any[]) => void) => void
  isConnected: () => boolean
}

// Get Ethereum provider for Base network
export function getEthereumProvider(): EthereumProvider | null {
  if (typeof window === 'undefined') return null
  
  // Check for injected provider
  const provider = (window as any).ethereum
  if (provider) {
    return provider as EthereumProvider
  }
  
  return null
}

// Connect wallet to Base network
export async function connectWallet(): Promise<string | null> {
  try {
    const provider = getEthereumProvider()
    if (!provider) {
      throw new Error('No Ethereum provider found')
    }

    // Request account access
    const accounts = await provider.request({
      method: 'eth_requestAccounts'
    })

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found')
    }

    // Switch to Base network
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }]
      })
    } catch (switchError: any) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
            chainName: 'Base',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: [BASE_RPC_URL],
            blockExplorerUrls: ['https://basescan.org']
          }]
        })
      } else {
        throw switchError
      }
    }

    return accounts[0]
  } catch (error) {
    console.error('Failed to connect wallet:', error)
    return null
  }
}

// Get current wallet address
export async function getWalletAddress(): Promise<string | null> {
  try {
    const provider = getEthereumProvider()
    if (!provider) return null

    const accounts = await provider.request({
      method: 'eth_accounts'
    })

    return accounts && accounts.length > 0 ? accounts[0] : null
  } catch (error) {
    console.error('Failed to get wallet address:', error)
    return null
  }
}

// Shorten wallet address for display
export function shortenAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Check if on Base network
export async function isOnBaseNetwork(): Promise<boolean> {
  try {
    const provider = getEthereumProvider()
    if (!provider) return false

    const chainId = await provider.request({
      method: 'eth_chainId'
    })

    return parseInt(chainId, 16) === BASE_CHAIN_ID
  } catch (error) {
    console.error('Failed to check network:', error)
    return false
  }
}

// Simulate onchain reward claim transaction
export async function claimRewardOnchain(rewardId: string): Promise<string | null> {
  try {
    const provider = getEthereumProvider()
    if (!provider) {
      throw new Error('No Ethereum provider found')
    }

    const address = await getWalletAddress()
    if (!address) {
      throw new Error('Wallet not connected')
    }

    // Simulate transaction (in production, this would call a smart contract)
    console.log('[v0] Claiming reward onchain:', { rewardId, address })
    
    // Simulate pending transaction
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Return mock transaction hash
    const txHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`
    
    console.log('[v0] Reward claimed, tx hash:', txHash)
    return txHash
  } catch (error) {
    console.error('Failed to claim reward onchain:', error)
    return null
  }
}
