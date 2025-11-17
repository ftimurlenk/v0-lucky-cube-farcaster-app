import { WalletConnect } from "./wallet-connect"

interface HeaderProps {
  username?: string
  avatar?: string
}

export function Header({ username, avatar }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 safe-area-inset-top">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--color-base-blue)] to-[var(--color-neon-purple)] bg-clip-text text-transparent">
          Lucky Capsule
        </h1>
        
        <WalletConnect />
      </div>
    </header>
  )
}
