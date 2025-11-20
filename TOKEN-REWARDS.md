# Lucky Capsule Token Ödül Sistemi

## Ödül Değeri

Tüm ödüller **1-2 cent (0.01-0.02 USD)** değerinde olacak şekilde ayarlanmıştır.

## Token Fiyat Tahminleri ve Miktarlar

| Token | Tahmini Fiyat | Min Miktar | Max Miktar | USD Değeri | Rarity |
|-------|--------------|------------|------------|------------|--------|
| DEGEN | $0.01 | 1 | 2 | $0.01-$0.02 | Common (50%) |
| BRETT | $0.10 | 0.1 | 0.2 | $0.01-$0.02 | Rare (30%) |
| TOSHI | $0.0001 | 100 | 200 | $0.01-$0.02 | Rare (30%) |
| MOCHI | $0.001 | 10 | 20 | $0.01-$0.02 | Epic (15%) |
| BASEGOD | $0.005 | 2 | 4 | $0.01-$0.02 | Legendary (5%) |
| SHIBA | $0.00000001 | 1,000,000 | 2,000,000 | $0.01-$0.02 | Epic (15%) |

## Rarity Dağılımı

### Common (50% şans)
- **DEGEN**: 1-2 token
- Kullanıcıların yarısı bu ödülü alır

### Rare (30% şans)
- **BRETT**: 0.1-0.2 token
- **TOSHI**: 100-200 token
- Her biri %15 şans ile çıkar

### Epic (15% şans)
- **MOCHI**: 10-20 token
- **SHIBA**: 1M-2M token
- Her biri %7.5 şans ile çıkar

### Legendary (5% şans)
- **BASEGOD**: 2-4 token
- En nadir ödül, %5 şans

## Güncelleme Notu

⚠️ **ÖNEMLİ**: Token fiyatları sürekli değişir. Bu miktarlar deployment anındaki fiyatlara göre hesaplanmıştır.

### Fiyat Güncellemesi Nasıl Yapılır?

1. Güncel token fiyatlarını kontrol edin (CoinGecko, DexScreener, vb.)
2. Her token için 1-2 cent değerinde miktar hesaplayın
3. Contract owner olarak `setRewardActive()` ile mevcut ödülü devre dışı bırakın
4. `addRewardToken()` ile güncel miktarlarda yeni ödül ekleyin

### Örnek Güncelleme

\`\`\`javascript
// Eski DEGEN ödülünü devre dışı bırak (index 0)
await luckyCapsule.setRewardActive(0, false);

// Yeni fiyata göre güncelle (örn: DEGEN şimdi $0.02 ise)
await luckyCapsule.addRewardToken(
  TOKEN_ADDRESSES.DEGEN,
  ethers.utils.parseEther("0.5"),  // Min: 0.5 DEGEN (~$0.01)
  ethers.utils.parseEther("1"),    // Max: 1 DEGEN (~$0.02)
  0 // Common
);
\`\`\`

## Token Havuzu Hesaplama

1000 kullanıcı için yaklaşık maliyet: **$10-20**

- Her ödül: $0.01-$0.02
- 1000 ödül × $0.015 (ortalama) = $15

### Havuz Doldurma Örneği

\`\`\`javascript
// Her token için yaklaşık 1000 ödüllük miktar

// DEGEN (50% = 500 ödül × 1.5 avg = 750 token)
await luckyCapsule.fundRewardPool(
  TOKEN_ADDRESSES.DEGEN,
  ethers.utils.parseEther("750")
);

// BRETT (15% = 150 ödül × 0.15 avg = 22.5 token)
await luckyCapsule.fundRewardPool(
  TOKEN_ADDRESSES.BRETT,
  ethers.utils.parseEther("22.5")
);

// TOSHI (15% = 150 ödül × 150 avg = 22,500 token)
await luckyCapsule.fundRewardPool(
  TOKEN_ADDRESSES.TOSHI,
  ethers.utils.parseEther("22500")
);

// MOCHI (7.5% = 75 ödül × 15 avg = 1,125 token)
await luckyCapsule.fundRewardPool(
  TOKEN_ADDRESSES.MOCHI,
  ethers.utils.parseEther("1125")
);

// BASEGOD (5% = 50 ödül × 3 avg = 150 token)
await luckyCapsule.fundRewardPool(
  TOKEN_ADDRESSES.BASEGOD,
  ethers.utils.parseEther("150")
);

// SHIBA (7.5% = 75 ödül × 1.5M avg = 112.5M token)
await luckyCapsule.fundRewardPool(
  TOKEN_ADDRESSES.SHIBA,
  ethers.utils.parseEther("112500000")
);
\`\`\`

## Ekonomik Model

### Gelir
- Kapsül ücreti: 0.001 ETH ($2.50 @ $2500 ETH)
- 1000 kullanıcı = 1 ETH gelir

### Gider
- Ödül maliyeti: $15 (1000 ödül × $0.015)
- Gas maliyetleri: ~$50-100 (Supra callback'ler)

### Net Kar
- 1 ETH ($2500) - $115 = ~$2385 kar
- ROI: %2000+

## Güvenlik Notları

1. Token havuzunu düzenli kontrol edin
2. Fiyat değişimlerini takip edin ve gerekirse güncelleyin
3. Emergency withdraw fonksiyonu sadece acil durumlar için
4. Her token için approval vermeyi unutmayın
