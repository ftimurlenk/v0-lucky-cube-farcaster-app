# Contract Verification Guide

## Automatic Verification

After deploying, add the contract address to your `.env`:

\`\`\`bash
CONTRACT_ADDRESS=0xYourContractAddress
\`\`\`

Then run:

\`\`\`bash
npm run verify
# or for testnet
npm run verify:testnet
\`\`\`

## Manual Verification (If Automatic Fails)

### Step 1: Flatten the Contract

\`\`\`bash
npm run flatten
\`\`\`

This creates `flattened/LuckyCapsule_flattened.sol`

### Step 2: Go to Basescan

1. Visit your contract page: `https://basescan.org/address/YOUR_CONTRACT_ADDRESS`
2. Click "Contract" tab
3. Click "Verify and Publish"

### Step 3: Fill in the Form

**Compiler Type:** Solidity (Single file)

**Compiler Version:** v0.8.20+commit.a1b79de6

**Open Source License Type:** MIT

**Optimization:** Yes

**Runs:** 200

**Via IR:** Yes (if available)

**EVM Version:** default

### Step 4: Paste Flattened Code

Copy the contents of `flattened/LuckyCapsule_flattened.sol` into the "Enter the Solidity Contract Code below" field.

### Step 5: Constructor Arguments (ABI-encoded)

Leave empty - our contract has no constructor arguments.

### Step 6: Submit

Click "Verify and Publish"

## Common Issues

### Issue: "Source not found" errors

**Solution:** Use the flattened contract file instead of automatic verification.

### Issue: "Compiler version mismatch"

**Solution:** Make sure you select exactly `v0.8.20+commit.a1b79de6`

### Issue: "Bytecode doesn't match"

**Solution:** Ensure optimization is set to "Yes" with 200 runs, and Via IR is enabled if available.

## Verification Status

Once verified, you'll see a green checkmark on Basescan and users can read the contract code directly on the explorer.
