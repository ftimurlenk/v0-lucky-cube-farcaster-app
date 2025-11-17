# Lucky Capsule - Farcaster Mini App

Lucky Capsule, Base Network üzerinde çalışan bir günlük şans oyunu mini uygulamasıdır. Kullanıcılar her gün bir kapsül açabilir ve içinden Base Network meme tokenleri kazanabilirler.

## 🎮 Özellikler

- **Günlük Kapsül**: Her 24 saatte bir kapsül açma hakkı
- **Base Network Meme Tokens**: DEGEN, BRETT, TOSHI, MOCHI, BASEGOD, SHIBA
- **Rarity Sistemi**: Common (50%), Rare (30%), Epic (15%), Legendary (5%)
- **Manipüle Edilemez**: Supra dVRF ile gerçek randomness
- **Mobile-First**: Farcaster Mini App uyumlu tasarım
- **Glassmorphism UI**: Modern ve premium görünüm
- **Animated Capsule Machine**: Candy dispenser tarzı animasyonlar

## 🚀 Teknolojiler

### Frontend
- Next.js 16 with App Router
- React 19.2
- TailwindCSS v4
- TypeScript
- Farcaster SDK

### Smart Contracts
- Solidity 0.8.20
- Hardhat
- OpenZeppelin Contracts
- Supra dVRF (Decentralized Verifiable Random Function)

## 📦 Kurulum

\`\`\`bash
# Repository'yi klonlayın
git clone <repo-url>
cd lucky-capsule

# Dependencies yükleyin
npm install

# Environment variables ayarlayın
cp .env.example .env
# .env dosyasını düzenleyin

# Development server'ı başlatın
npm run dev
\`\`\`

## 🔧 Smart Contract Deployment

### Gereksinimler
1. Base Network için ETH
2. Supra dVRF wallet kaydı (zorunlu!)
3. Token havuzu için meme tokenler

### Deployment Adımları

1. **Supra dVRF Kaydı** (Öncelikle yapılmalı!)
   - Supra dökümanlarını inceleyin: https://docs.supra.com/oracles/dvrf/vrf-subscription-model
   - Wallet adresinizi Supra ekibine bildirin
   - Whitelist onayı bekleyin (24-48 saat)

2. **Testnet'e Deploy**
\`\`\`bash
npm run compile
npm run deploy:testnet
\`\`\`

3. **Contract'ı Whitelist'e Ekleyin**
   - Deploy edilen contract adresini Supra ekibine bildirin

4. **Token Havuzunu Doldurun**
\`\`\`bash
# scripts/fund-pool.js içinde CONTRACT_ADDRESS güncelleyin
npm run fund:testnet
\`\`\`

5. **Mainnet Deploy**
\`\`\`bash
npm run deploy:mainnet
npm run fund:mainnet
\`\`\`

Detaylı deployment kılavuzu için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın.

## 🎲 Token Ödülleri

| Token | Rarity | Şans | Miktar |
|-------|--------|------|--------|
| DEGEN 🎩 | Common | 50% | 100-500 |
| BRETT 🔵 | Rare | 30% | 50-200 |
| TOSHI 🐱 | Rare | 30% | 1K-5K |
| MOCHI 🍡 | Epic | 15% | 20-100 |
| SHIBA 🐕 | Epic | 15% | 500K-2M |
| BASEGOD ⚡ | Legendary | 5% | 10-50 |

## 🔐 Güvenlik

- **Supra dVRF**: Manipüle edilemez randomness
- **ReentrancyGuard**: Reentrancy saldırılarına karşı korumalı
- **24h Cooldown**: Spam ve abuse önleme
- **SafeERC20**: Güvenli token transferleri
- **Ownable**: Yetkilendirilmiş admin fonksiyonları

## 📱 Proje Yapısı

\`\`\`
app/
  ├── page.tsx              # Ana uygulama giriş noktası
  ├── layout.tsx            # Root layout (Lucky Capsule title)
  └── globals.css           # Custom theme & glassmorphism

components/
  ├── cube-screen.tsx       # Ana kapsül ekranı
  ├── capsule-machine.tsx   # Candy dispenser animasyonu
  ├── reward-modal.tsx      # Ödül gösterimi
  ├── header.tsx            # Başlık ve cüzdan bağlantısı
  └── ui/                   # shadcn/ui components

contracts/
  └── LuckyCapsule.sol      # Ana smart contract

scripts/
  ├── deploy-contracts.js   # Deployment script
  └── fund-pool.js          # Token havuzu doldurma

lib/
  ├── farcaster.ts          # Farcaster SDK utilities
  └── base.ts               # Base network integration
\`\`\`

## 🎨 Tasarım Sistemi

**Renkler:**
- Primary: Base Blue `oklch(0.65 0.25 250)`
- Background: Dark `oklch(0.08 0.02 265)`
- Glassmorphism: backdrop-blur with transparency

**Animasyonlar:**
- Capsule mixing (800ms shake animation)
- Drop animation (1.5s with bounce)
- Explosion (1.5s with 32 particles)
- Smooth color transitions

## 🧪 Test

\`\`\`bash
# Contract testleri
npm run test

# Coverage
npm run coverage

# Gas report
REPORT_GAS=true npm run test
\`\`\`

## 📄 Lisans

MIT

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır! Büyük değişiklikler için lütfen önce bir issue açın.

## ⚠️ Önemli Notlar

- Private key'lerinizi ASLA paylaşmayın
- Mainnet deploy öncesi testnet'te test edin
- Token havuzunu düzenli kontrol edin
- Supra whitelist kaydınızı tamamlayın
- Contract'ta yeterli ETH bulundurun (callback gas için)

## 🔗 Faydalı Linkler

- [Supra dVRF Docs](https://docs.supra.com/oracles/dvrf)
- [Base Network](https://base.org)
- [Farcaster](https://www.farcaster.xyz/)
- [Hardhat](https://hardhat.org)

---

Made with ❤️ for Base Network and Farcaster
