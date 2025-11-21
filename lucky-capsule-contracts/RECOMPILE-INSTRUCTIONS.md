# Contract Recompile Instructions

If you've already deployed the contract with viaIR enabled, you need to redeploy with the updated settings for verification to work.

## Steps to Fix

1. **Clean previous build artifacts:**
\`\`\`bash
npx hardhat clean
rm -rf cache artifacts
\`\`\`

2. **Recompile with new settings:**
\`\`\`bash
npx hardhat compile
\`\`\`

3. **Redeploy the contract:**
\`\`\`bash
npx hardhat run scripts/deploy-contracts.js --network base
\`\`\`

4. **Verify the new deployment:**
\`\`\`bash
npx hardhat verify --network base YOUR_NEW_CONTRACT_ADDRESS
\`\`\`

## Why This Happened

The `viaIR` setting changes how Solidity compiles the bytecode. Basescan's verification system expects standard compilation without viaIR. When viaIR is enabled, the bytecode differs and verification fails.

## Alternative: Manual Verification

If you cannot redeploy, you can try manual verification on Basescan:

1. Generate flattened contract:
\`\`\`bash
npm run flatten
\`\`\`

2. Go to Basescan contract page → "Verify & Publish"

3. Use these settings:
   - Compiler: 0.8.20
   - Optimization: Yes
   - Runs: 200
   - **Via IR**: Yes (if your deployed contract used it)
   - License: MIT

4. Paste the flattened contract code

## Checking Current Deployment

To check if your deployed contract was compiled with viaIR, compare the bytecode size:
- viaIR typically produces slightly different bytecode
- You can check the deployed bytecode on Basescan and compare with local compilation
