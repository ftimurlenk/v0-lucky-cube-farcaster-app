# Separating Smart Contract Deployment from Frontend

## Files to Move to New Project

Create a new folder called `lucky-capsule-contracts/` and copy these files:

### Smart Contracts
- `contracts/LuckyCapsule.sol`

### Scripts
- `scripts/deploy-contracts.js`
- `scripts/verify-contract.js`
- `scripts/fund-pool.js`
- `scripts/check-balance.js`
- `scripts/update-rewards.js`

### Configuration
- `hardhat.config.js`
- `.env.example`

### Documentation
- `DEPLOYMENT.md`
- `VERIFICATION.md`
- `TOKEN-REWARDS.md`

### Package File
- Rename `CONTRACT-DEPLOYMENT-PACKAGE.json` to `package.json`
- Use `SMART-CONTRACT-DEPLOYMENT.md` as your README.md

## Setup New Contract Project

\`\`\`bash
mkdir lucky-capsule-contracts
cd lucky-capsule-contracts

# Copy files from main project
# Then:

npm install
cp .env.example .env
# Edit .env with your values

npm run compile
npm run deploy:testnet
\`\`\`

## Files to Delete from Frontend Project

After moving to separate project, delete these from the Next.js app:

### Remove Files
- `contracts/` (entire folder)
- `scripts/` (entire folder)
- `hardhat.config.js`
- `DEPLOYMENT.md`
- `VERIFICATION.md`
- `TOKEN-REWARDS.md`

### Clean package.json

Remove these dependencies:
\`\`\`json
"@nomicfoundation/hardhat-chai-matchers": "2.0.8",
"@nomicfoundation/hardhat-ethers": "3.0.8",
"@nomicfoundation/hardhat-network-helpers": "1.0.12",
"@nomicfoundation/hardhat-verify": "2.0.11",
"@openzeppelin/contracts": "^5.2.0",
"chai": "^4.5.0",
"hardhat": "2.22.18",
"@types/chai": "^4.3.20",
"@types/mocha": "^10.0.10",
"ts-node": "^10.9.2"
\`\`\`

Remove these scripts:
\`\`\`json
"compile": "hardhat compile",
"test": "hardhat test",
"deploy:testnet": "...",
"deploy:mainnet": "...",
"verify:testnet": "...",
"verify:mainnet": "...",
"fund:testnet": "...",
"fund:mainnet": "...",
"balance:testnet": "...",
"balance:mainnet": "..."
\`\`\`

## Result

You'll have two separate projects:

1. **lucky-capsule-contracts/** - Smart contract deployment and management
2. **lucky-capsule/** - Next.js frontend application

This separation keeps your frontend lightweight and smart contract management independent.
