# Lucky Capsule Smart Contract Deployment Kılavuzu

## Gereksinimler

1. Node.js (v18+)
2. Hardhat
3. Base Network için ETH
4. Supra dVRF wallet kaydı (ZORUNLU)
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
\`\`\`

## Deployment Adımları

### 1. Supra dVRF Wallet Kaydı (ÖNCELİKLE YAPILMALI)

**Bu adım ZORUNLUDUR!** Supra dVRF kullanmak için wallet adresinizi Supra ekibine kaydettirmeniz gerekiyor.

1. Supra dökümanlarını inceleyin: https://docs.supra.com/oracles/dvrf/vrf-subscription-model
2. Wallet adresinizi Supra ekibine bildirin ve whitelist'e ekleyin
3. Onay bekleyin (genelde 24-48 saat)

### 2. Test Network'e Deploy (Base Sepolia)

\`\`\`bash
npx hardhat run scripts/deploy-contracts.js --network baseSepolia
\`\`\`

### 3. Contract'ı Supra'ya Kaydet

Deploy edilen contract adresini Supra ekibine bildirin ve whitelist'e eklettirin. Contract callback fonksiyonunu çağırabilmesi için bu adres da kayıtlı olmalı.

### 4. Callback Gas Fee Yatır

Contract'ın callback fonksiyonunu çağırabilmesi için gas fee gerekiyor. Contract adresine ETH yatırın:

\`\`\`bash
# Örnek: 0.01 ETH yatır
cast send <CONTRACT_ADDRESS> --value 0.01ether --rpc-url $BASE_SEPOLIA_RPC_URL
\`\`\`

### 5. Token Havuzu Doldurma

Her token için approval ve transfer işlemi:

\`\`\`bash
# Token approval ve transfer scripti çalıştır
npx hardhat run scripts/fund-pool.js --network baseSepolia
\`\`\`

### 6. Mainnet'e Deploy (Base)

\`\`\`bash
# Production deployment
npx hardhat run scripts/deploy-contracts.js --network base

# Contract verification
npx hardhat verify --network base CONTRACT_ADDRESS \
  SUPRA_ROUTER_ADDRESS CLIENT_WALLET_ADDRESS
\`\`\`

## Contract Adresleri

### Base Mainnet
- LuckyCapsule: `TBD`
- Supra Router: `0x99a021029EBC90020B193e111Ae2726264a111A2`

### Base Sepolia (Testnet)
- LuckyCapsule: `TBD`
- Supra Router: `0x99a021029EBC90020B193e111Ae2726264a111A2`

## Güvenlik Notları

### ✅ Güvenlik Özellikleri

1. **Supra dVRF Kullanımı**
   - Decentralized VRF ile gerçek randomness
   - Manipüle edilemez random sayı üretimi
   - On-chain doğrulanabilir randomness
   - 1 block confirmation (hızlı sonuç)

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
- Contract'ta yeterli ETH olduğundan emin olun (callback gas için)
- Supra whitelist kaydınızı tamamlayın

## Supra dVRF vs Chainlink VRF

### Supra dVRF Avantajları
- ✅ Daha hızlı sonuç (1 confirmation)
- ✅ Daha düşük gas maliyeti
- ✅ Subscription gerekmez
- ✅ LINK token gerekmez

### Önemli Farklar
- ⚠️ Wallet kaydı zorunlu
- ⚠️ Contract whitelist gerekli
- ⚠️ Callback için contract'ta ETH bulunmalı

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
2. Supra dVRF randomness isteği oluşturulur (nonce döner)
3. 1 block sonra `requestCallback` otomatik çağrılır
4. Random token ödülü kullanıcıya transfer edilir

### Admin Tarafından

```solidity
// Yeni token ödülü ekle
addRewardToken(tokenAddress, minAmount, maxAmount, rarity);

// Token havuzu doldur
fundRewardPool(tokenAddress, amount);

// Ücretleri çek
withdrawFees(payable(adminAddress));

// Callback gas fee kontrolü
// Contract balance'ı kontrol et, düşükse ETH yatır
