#!/bin/bash

echo "Flattening LuckyCapsule contract..."

# Hardhat'in built-in flatten komutunu kullan
npx hardhat flatten contracts/LuckyCapsule.sol > LuckyCapsule-flattened.sol

echo "✅ Flattened contract saved to: LuckyCapsule-flattened.sol"
echo ""
echo "Basescan Manual Verification için:"
echo "1. Basescan'de 'Verify and Publish' seçeneğine tıklayın"
echo "2. 'Solidity (Single file)' seçin"
echo "3. Compiler Version: v0.8.20+commit.a1b79de6"
echo "4. License: MIT"
echo "5. Optimization: Yes (200 runs)"
echo "6. LuckyCapsule-flattened.sol dosyasını kopyala-yapıştır yapın"
echo "7. Constructor Arguments (ABI-encoded): (boş bırakın)"
