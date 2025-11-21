# Manual Contract Verification on Basescan

If automatic verification fails, follow these steps for manual verification:

## Step 1: Flatten the Contract

\`\`\`bash
npm run flatten
\`\`\`

This will create `flattened/LuckyCapsule_flattened.sol`

## Step 2: Go to Basescan

1. Navigate to your contract address on Basescan
2. Click on the "Contract" tab
3. Click "Verify and Publish"

## Step 3: Fill in the Form

### Compiler Type
- Select: **Solidity (Single file)**

### Compiler Version
- Select: **v0.8.20+commit.a1b79de6**

### Open Source License Type
- Select: **MIT License (MIT)**

### Optimization
- Enabled: **Yes**
- Runs: **200**

## Step 4: Enter Contract Code

Copy the entire content of `flattened/LuckyCapsule_flattened.sol` and paste it into the "Enter the Solidity Contract Code" field.

## Step 5: Constructor Arguments (if any)

If your contract was deployed with constructor arguments, you need to encode them.

For LuckyCapsule, if you deployed with default values, leave this field empty (constructor uses msg.sender and hardcoded addresses).

## Step 6: Verify

Click "Verify and Publish" button.

## Troubleshooting

### "Bytecode mismatch" Error
- Make sure you're using the exact same compiler version (0.8.20)
- Ensure optimization is set to 200 runs
- Verify that you copied the complete flattened file

### "Constructor arguments invalid" Error
- Double-check the encoded constructor arguments
- Make sure they match the deployment transaction

### Still Not Working?
Try using Hardhat's built-in verification:

\`\`\`bash
npx hardhat verify --network base YOUR_CONTRACT_ADDRESS
