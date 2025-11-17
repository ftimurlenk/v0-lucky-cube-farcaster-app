# Lucky Capsule Smart Contract Deployment Kılavuzu

## Gereksinimler

1. Node.js (v18+)
2. Hardhat
3. Base Network için ETH
4. Chainlink LINK tokens (VRF için)
5. Token havuzu için meme tokenler

## Kurulum

\`\`\`bash
# Dependencies yükle
npm install

# .env dosyası oluştur
cp .env.example .env
\`\`\`

## .env Konfigürasyonu

\`\`\`env
# Deployer Private Key (ASLA PAYLAŞMAYIN!)
PRIVATE_KEY=your_private_key_here

# Base Network RPC URLs
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# BaseScan API Key (verification için)
BASESCAN_API_KEY=your_basescan_api_key

# Chainlink VRF Subscription ID (subscription oluşturduktan sonra)
VRF_SUBSCRIPTION_ID=your_subscription_id
\`\`\`

## Deployment Adımları

### 1. Test Network'e Deploy (Base Sepolia)

\`\`\`bash
npx hardhat run scripts/deploy-contracts.js --network baseSepolia
\`\`\`

### 2. Chainlink VRF Subscription Kurulumu

1. https://vrf.chain.link adresine git
2. Base Sepolia network'ü seç
3. "Create Subscription" butonuna tıkla
4. Subscription oluştuktan sonra ID'yi not al
5. "Add Funds" ile subscription'a LINK token ekle (minimum 5 LINK önerilir)
6. "Add Consumer" ile deploy ettiğin contract adresini ekle

### 3. Token Havuzu Doldurma

Her token için approval ve transfer işlemi:

\`\`\`bash
# DEGEN token için örnek
# 1. Token contract'ında approve çağır
# approve(luckyCapsuleAddress, amount)

# 2. LuckyCapsule contract'ında fundRewardPool çağır
npx hardhat run scripts/fund-pool.js --network baseSepolia
\`\`\`

### 4. Mainnet'e Deploy (Base)

\`\`\`bash
# Production deployment
npx hardhat run scripts/deploy-contracts.js --network base

# Contract verification
npx hardhat verify --network base CONTRACT_ADDRESS \
  VRF_COORDINATOR SUBSCRIPTION_ID GAS_LANE CALLBACK_GAS_LIMIT
\`\`\`

## Contract Adresleri

### Base Mainnet
- LuckyCapsule: `TBD`
- VRF Coordinator: `0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634`

### Base Sepolia (Testnet)
- LuckyCapsule: `TBD`
- VRF Coordinator: `0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634`

## Güvenlik Notları

### ✅ Güvenlik Özellikleri

1. **Chainlink VRF Kullanımı**
   - Gerçek randomness, manipüle edilemez
   - On-chain doğrulanabilir randomness
   - 3 block confirmation ile güvenlik

2. **ReentrancyGuard**
   - Reentrancy saldırılarına karşı korumalı
   - OpenZeppelin standart implementasyonu

3. **Access Control**
   - Owner-only fonksiyonlar
   - Ownable pattern ile yetkilendirme

4. **Cooldown Sistemi**
   - 24 saatlik bekleme süresi
   - Spam ve abuse önleme

5. **SafeERC20**
   - Güvenli token transferleri
   - Return value kontrolü

### ⚠️ Önemli Güvenlik Kontrolleri

- Private key'leri ASLA commit etmeyin
- `.env` dosyasını `.gitignore`'a ekleyin
- Mainnet deploy öncesi testnet'te kapsamlı test yapın
- Token havuzunu düzenli kontrol edin
- VRF subscription'da yeterli LINK olduğundan emin olun

## Test

\`\`\`bash
# Contract testleri çalıştır
npx hardhat test

# Coverage raporu
npx hardhat coverage

# Gas raporu
REPORT_GAS=true npx hardhat test
\`\`\`

## Kullanım

### Kullanıcı Tarafından

1. `openCapsule()` fonksiyonunu 0.001 ETH ile çağır
2. Chainlink VRF randomness isteği oluşturulur
3. 3 block sonra `fulfillRandomWords` callback çağrılır
4. Random token ödülü kullanıcıya transfer edilir

### Admin Tarafından

```solidity
// Yeni token ödülü ekle
addRewardToken(tokenAddress, minAmount, maxAmount, rarity);

// Token havuzu doldur
fundRewardPool(tokenAddress, amount);

// Ücretleri çek
withdrawFees(payable(adminAddress));
