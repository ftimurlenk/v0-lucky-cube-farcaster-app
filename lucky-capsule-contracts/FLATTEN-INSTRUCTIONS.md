# Flattened Contract Oluşturma

## Adımlar

### 1. Terminal'de şu komutu çalıştırın:

\`\`\`bash
npx hardhat flatten contracts/LuckyCapsule.sol > LuckyCapsule-flattened.sol
\`\`\`

### 2. Oluşan dosyayı kontrol edin:

\`\`\`bash
cat LuckyCapsule-flattened.sol
\`\`\`

Dosya şu şekilde başlamalı:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ... OpenZeppelin contracts ...
