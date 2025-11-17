# 🎲 Lucky Cube - Farcaster Mini App

A mobile-first Farcaster Mini App built on Base blockchain where users can break a lucky cube once per day to discover random rewards.

## Features

- **Daily Cube Breaking**: Break one cube per day with smooth 3D animations
- **Reward System**: Earn rewards with different rarities (Common, Rare, Epic, Legendary)
- **Farcaster Integration**: Authenticate with Farcaster and share your results
- **Base Network**: Onchain reward claiming on Base blockchain
- **Streak Tracking**: Build daily streaks and unlock achievements
- **Glassmorphism UI**: Modern dark theme with neon Base-blue accents

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with custom glassmorphism utilities
- **Blockchain**: Base (Ethereum L2)
- **Social**: Farcaster Mini App SDK
- **Components**: shadcn/ui with custom mobile-first components

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Farcaster Integration

The app uses the Farcaster Mini App SDK for:
- `quickAuth()` - Quick user authentication
- `getUserData()` - Fetch user profile data
- `getFrameContext()` - Detect Farcaster environment
- `shareToCast()` - Share cube results to Farcaster

## Base Network Integration

Connected to Base network for onchain features:
- Wallet connection with automatic network switching
- Onchain reward claiming (ERC-1155 tokens)
- Transaction status tracking with loading states

## Project Structure

\`\`\`
app/
  ├── page.tsx              # Main app entry with tab navigation
  ├── layout.tsx            # Root layout with dark theme
  └── globals.css           # Custom theme with glassmorphism utilities

components/
  ├── cube-screen.tsx       # Main cube breaking screen
  ├── lucky-cube.tsx        # 3D animated cube component
  ├── reward-modal.tsx      # Reward reveal with share functionality
  ├── rewards-screen.tsx    # Reward history
  ├── profile-screen.tsx    # User stats and achievements
  ├── header.tsx            # App header with user info
  ├── bottom-nav.tsx        # Mobile navigation
  ├── wallet-connect.tsx    # Base wallet connection
  └── ui/                   # shadcn/ui components

lib/
  ├── farcaster.ts          # Farcaster SDK utilities
  ├── base.ts               # Base network integration
  └── utils.ts              # Helper functions
\`\`\`

## Design System

**Colors:**
- Primary: Base Blue `oklch(0.65 0.25 250)`
- Secondary: Neon Purple `oklch(0.6 0.2 280)`
- Background: Dark `oklch(0.08 0.02 265)`
- Glassmorphism panels with backdrop blur

**Typography:**
- Font: Geist Sans for UI, Geist Mono for code

**Animations:**
- Cube rotation and float effects
- Smooth page transitions
- Rarity-based reveal effects

## Mobile-First Design

Optimized for mobile devices (390px - 428px width):
- Safe area insets for notch/home bar
- Touch-friendly tap targets
- Bottom navigation for thumb accessibility
- Responsive glassmorphism panels

## Future Enhancements

- Real smart contract integration for rewards
- Multiplayer features and leaderboards  
- Additional cube skins and themes
- Weekly challenges and special events
- NFT rewards for legendary items
