# Lucky Capsule Smart Contracts

Smart contracts for Lucky Capsule - A daily capsule game on Base Network powered by Supra dVRF.

## Overview

Lucky Capsule allows users to open a daily capsule and receive Base Network meme tokens. The rewards are determined using Supra dVRF for true randomness.

## Features

- **True Randomness**: Powered by Supra dVRF
- **Fair Distribution**: Rarity-based reward system
- **24-Hour Cooldown**: One capsule per day per user
- **Base Network Tokens**: DEGEN, BRETT, TOSHI, MOCHI, BASEGOD, SHIBA
- **Low Fee**: 0.00001 ETH per capsule opening (approximately 2.5 cents)

## Rarity System

- **Common (50%)**: DEGEN - 100-500 tokens (~$0.01-0.02)
- **Rare (30%)**: BRETT, TOSHI - 50-5000 tokens (~$0.01-0.02)
- **Epic (15%)**: MOCHI, SHIBA - Variable amounts (~$0.01-0.02)
- **Legendary (5%)**: BASEGOD - 10-50 tokens (~$0.01-0.02)

## Setup

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

\`\`\`bash
cp .env.example .env
\`\`\`

Required variables:
- `PRIVATE_KEY`: Your wallet private key (without 0x prefix)
  - **Important**: The address associated with this private key will become the contract owner
  - The owner has admin privileges to withdraw funds, update fees, etc.
- `BASESCAN_API_KEY`: API key from Basescan for verification
- `BASE_MAINNET_RPC_URL`: Base mainnet RPC URL (optional)

### 3. Compile Contracts

\`\`\`bash
npm run compile
\`\`\`

## Deployment

### Testnet (Base Sepolia)

\`\`\`bash
npm run deploy:testnet
\`\`\`

### Mainnet (Base)

\`\`\`bash
npm run deploy:mainnet
\`\`\`

The deployment will:
1. Deploy the LuckyCapsule contract
2. Set the deployer address as the contract owner
3. Display the contract address and deployment information

After deployment, save the contract address to `.env`:

\`\`\`
CONTRACT_ADDRESS=0x...
\`\`\`

**Note**: The deployer address will automatically become the contract owner with the following privileges:
- Withdraw collected ETH fees
- Withdraw tokens from the pool
- Update Supra Router address
- Update capsule opening fee

## Supra dVRF Setup

### 1. Register with Supra

Visit Supra dVRF dashboard and register:
- Your deployer wallet address (contract owner)
- The deployed contract address
- Network: Base Mainnet (Chain ID: 8453)

### 2. Set Parameters

When registering, use these values:
- **Max Gas Price**: 1 gwei
- **Max Gas Limit**: 500000

## Fund Token Pool

After deployment and Supra registration, fund the contract with tokens:

\`\`\`bash
npm run fund
\`\`\`

This script will transfer the recommended token amounts for 1000 users (~$7.50 total).

## Contract Verification

Verify the contract on Basescan:

\`\`\`bash
npm run verify
\`\`\`

## Check Balances

Check token balances in the contract:

\`\`\`bash
npm run balance
\`\`\`

## Contract Functions

### User Functions

- `openCapsule()`: Open a capsule (requires 0.00001 ETH fee)
- `canOpenCapsule(address)`: Check if user can open capsule
- `timeUntilNextCapsule(address)`: Get cooldown time remaining

### Owner Functions

- `updateSupraRouter(address)`: Update Supra Router address
- `updateCapsuleFee(uint256)`: Update capsule opening fee
- `withdrawETH()`: Withdraw collected fees
- `withdrawTokens(address, uint256)`: Withdraw tokens from pool

## Security

- ReentrancyGuard protection
- SafeERC20 for token transfers
- Ownable for admin functions (deployer is owner)
- 24-hour cooldown per user
- Pool balance validation

## Support

For issues or questions:
- Create an issue in the repository
- Check Supra dVRF documentation: https://docs.supra.com/oracles/dvrf
- Check Base documentation: https://docs.base.org

## License

MIT
