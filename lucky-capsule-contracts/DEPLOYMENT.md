# Lucky Capsule Deployment Guide

Complete step-by-step guide for deploying Lucky Capsule smart contracts to Base Network.

## Prerequisites

- Node.js 18+ installed
- Wallet with Base ETH for deployment (~$5-10 for gas)
- Basescan API key (for verification)
- Base Network meme tokens for pool funding

## Step 1: Environment Setup

1. Clone and navigate to contracts folder:
\`\`\`bash
cd lucky-capsule-contracts
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Fill in `.env` with your values:
\`\`\`env
PRIVATE_KEY=your_private_key_without_0x
BASESCAN_API_KEY=your_basescan_api_key
CONTRACT_ADDRESS=
\`\`\`

## Step 2: Compile Contracts

\`\`\`bash
npm run compile
\`\`\`

Verify compilation succeeds without errors.

## Step 3: Deploy to Testnet (Optional)

Test deployment on Base Sepolia testnet first:

\`\`\`bash
npm run deploy:testnet
\`\`\`

Save the contract address for testing.

## Step 4: Deploy to Mainnet

Deploy to Base mainnet:

\`\`\`bash
npm run deploy:mainnet
\`\`\`

**Important**: Save the contract address immediately! Add it to `.env`:

\`\`\`env
CONTRACT_ADDRESS=0xYourContractAddress
\`\`\`

## Step 5: Supra dVRF Registration

### Register Deployer Wallet

1. Visit Supra dVRF dashboard
2. Connect your deployer wallet (MetaMask)
3. Register for Base Network
4. Provide required information:
   - Network: Base Mainnet
   - Chain ID: 8453
   - Wallet Address: Your deployer address

### Register Contract

1. Add contract as consumer:
   - Contract Address: From deployment
   - Max Gas Price: **1 gwei**
   - Max Gas Limit: **500000**

2. Wait for approval (usually instant)

## Step 6: Verify Contract

Verify on Basescan for transparency:

\`\`\`bash
npm run verify
\`\`\`

Check verification status on Basescan.

## Step 7: Acquire Reward Tokens

You need to acquire these Base Network tokens:

### For 1000 Users (~$7.50 total):

- **DEGEN**: 250,000 tokens
- **BRETT**: 12 tokens
- **TOSHI**: 100,000 tokens
- **MOCHI**: 7,500 tokens
- **BASEGOD**: 100 tokens
- **SHIBA**: 20,000,000 tokens

### Where to Buy:

- Uniswap on Base
- Aerodrome
- BaseSwap

## Step 8: Fund Token Pool

Transfer tokens to contract:

\`\`\`bash
npm run fund
\`\`\`

This will:
1. Approve each token
2. Transfer to contract
3. Show confirmation for each token

## Step 9: Verify Token Balances

Check that tokens were transferred:

\`\`\`bash
npm run balance
\`\`\`

You should see all token balances in the contract.

## Step 10: Test Opening

Test the contract works:

1. Call `openCapsule()` with 0.001 ETH
2. Wait for Supra callback (~1 block)
3. Check `CapsuleOpened` event
4. Verify token was transferred

## Post-Deployment

### Monitor Contract

- Watch for `CapsuleRequested` events
- Monitor token pool levels
- Track ETH fee collection

### Refill Pool

When token levels get low:

\`\`\`bash
npm run fund
\`\`\`

### Withdraw Fees

Accumulated ETH fees can be withdrawn:

\`\`\`javascript
// Using ethers.js
const contract = await ethers.getContractAt("LuckyCapsule", contractAddress);
await contract.withdrawETH();
\`\`\`

## Troubleshooting

### Deployment Fails

**Error**: "insufficient funds"
- Ensure wallet has enough Base ETH for gas

**Error**: "nonce too low"
- Wait a few blocks and retry

### Supra Registration Issues

**Contract not whitelisted**
- Double-check contract address is correct
- Ensure deployer wallet is registered first
- Wait for approval confirmation

### Token Transfer Fails

**Error**: "Insufficient balance"
- Check you have enough tokens in deployer wallet
- Verify token address is correct for Base Network

**Error**: "Approval failed"
- Increase gas limit
- Check token contract allows transfers

### Verification Fails

**Error**: "Already verified"
- Contract is already verified, check Basescan

**Error**: "Invalid API key"
- Get new API key from Basescan
- Update `.env` file

## Production Checklist

Before going live:

- [ ] Contract deployed to mainnet
- [ ] Contract verified on Basescan
- [ ] Supra dVRF registration complete
- [ ] Token pool funded adequately
- [ ] Test transaction successful
- [ ] Frontend connected to contract
- [ ] Monitoring tools set up
- [ ] Emergency contacts established

## Security Notes

- Never share your `PRIVATE_KEY`
- Keep `.env` out of version control
- Use a dedicated deployment wallet
- Test thoroughly on testnet first
- Monitor contract for unusual activity

## Support

- Supra dVRF: https://docs.supra.com/oracles/dvrf
- Base Network: https://docs.base.org
- Hardhat: https://hardhat.org/docs

## Next Steps

After successful deployment:
1. Integrate contract with frontend
2. Set up event listeners
3. Create user dashboard
4. Monitor and maintain token pools
