# Lucky Capsule - Smart Contract Deployment App

This is a separate standalone project for deploying and managing Lucky Capsule smart contracts on Base Network.

## 📁 Project Structure

\`\`\`
lucky-capsule-contracts/
├── contracts/
│   └── LuckyCapsule.sol
├── scripts/
│   ├── deploy-contracts.js
│   ├── verify-contract.js
│   ├── fund-pool.js
│   ├── check-balance.js
│   └── update-rewards.js
├── hardhat.config.js
├── package.json
├── .env.example
├── DEPLOYMENT.md
├── VERIFICATION.md
└── TOKEN-REWARDS.md
\`\`\`

## 🚀 Quick Start

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
- `PRIVATE_KEY`: Your wallet private key
- `BASESCAN_API_KEY`: Basescan API key for verification
- `SUPRA_ROUTER_ADDRESS`: Supra dVRF router address

### 3. Deploy Contract

Testnet:
\`\`\`bash
npm run deploy:testnet
\`\`\`

Mainnet:
\`\`\`bash
npm run deploy:mainnet
\`\`\`

### 4. Verify Contract

\`\`\`bash
npm run verify:testnet  # or verify:mainnet
\`\`\`

### 5. Fund Token Pool

\`\`\`bash
npm run fund:testnet  # or fund:mainnet
\`\`\`

### 6. Check Token Balances

\`\`\`bash
npm run balance:testnet  # or balance:mainnet
\`\`\`

## 📦 Package.json

Create this file with Hardhat dependencies only.

## 🔧 Available Scripts

- `npm run compile` - Compile smart contracts
- `npm run test` - Run contract tests
- `npm run deploy:testnet` - Deploy to Base Sepolia
- `npm run deploy:mainnet` - Deploy to Base Mainnet
- `npm run verify:testnet` - Verify on Base Sepolia
- `npm run verify:mainnet` - Verify on Base Mainnet
- `npm run fund:testnet` - Fund token pool on testnet
- `npm run fund:mainnet` - Fund token pool on mainnet
- `npm run balance:testnet` - Check balances on testnet
- `npm run balance:mainnet` - Check balances on mainnet

## 📚 Documentation

- **DEPLOYMENT.md** - Comprehensive deployment guide
- **VERIFICATION.md** - Contract verification instructions
- **TOKEN-REWARDS.md** - Token economics and reward configuration

## 🔒 Security

- Never commit `.env` file
- Keep private keys secure
- Test on testnet before mainnet deployment
- Verify contracts on Basescan

## 🆘 Support

For issues or questions, refer to:
- Hardhat Docs: https://hardhat.org/docs
- Supra dVRF: https://docs.supra.com/oracles/dvrf
- Base Network: https://docs.base.org
