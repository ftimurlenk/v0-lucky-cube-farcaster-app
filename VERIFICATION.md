# Contract Verification Rehberi

Bu rehber Lucky Capsule contract'ının Basescan üzerinde nasıl doğrulanacağını açıklar.

## Neden Contract Verification Önemli?

- **Şeffaflık**: Kullanıcılar kaynak kodunu okuyabilir
- **Güvenlik**: Herkes contract'ı inceleyebilir
- **Güven**: Verified contract'lar daha profesyonel görünür
- **Etkileşim**: Basescan üzerinden direkt fonksiyonları çağırabilirsiniz

## Ön Hazırlık

### 1. Basescan API Key Alın

1. [Basescan](https://basescan.org) hesabı oluşturun
2. API Keys bölümüne gidin
3. Yeni API key oluşturun
4. `.env` dosyanıza ekleyin:

\`\`\`bash
BASESCAN_API_KEY=your_api_key_here
\`\`\`

### 2. Contract Deploy Edin

Önce contract'ı deploy etmeniz gerekiyor:

\`\`\`bash
# Testnet (Base Sepolia)
npm run deploy:testnet

# Mainnet (Base)
npm run deploy:mainnet
\`\`\`

Deploy işlemi sonunda contract adresi ve verification komutu görüntülenecek.

## Verification İşlemi

### Otomatik Verification (Önerilen)

Deploy sonrasında aldığınız contract adresini kullanın:

\`\`\`bash
# Testnet
CONTRACT_ADDRESS=0x... npm run verify:testnet

# Mainnet
CONTRACT_ADDRESS=0x... npm run verify:mainnet
\`\`\`

### Manuel Verification

Hardhat'in yerleşik komutunu da kullanabilirsiniz:

\`\`\`bash
npx hardhat verify --network base \
  CONTRACT_ADDRESS \
  SUPRA_ROUTER_ADDRESS \
  CLIENT_WALLET_ADDRESS
\`\`\`

**Örnek:**
\`\`\`bash
npx hardhat verify --network base \
  0x1234567890123456789012345678901234567890 \
  0x99a021029EBC90020B193e111Ae2726264a111A2 \
  0xYourWalletAddress
\`\`\`

## Verification Kontrolü

Verification başarılı olduyunda şu mesajı göreceksiniz:

\`\`\`
✅ Contract başarıyla doğrulandı!
🔗 Basescan: https://basescan.org/address/0x.../
\`\`\`

### Basescan'de Kontrol

1. Verilen Basescan linkine tıklayın
2. "Contract" sekmesine gidin
3. Yeşil ✓ işareti görmelisiniz: "Contract Source Code Verified"
4. "Read Contract" ve "Write Contract" sekmeleri görünür olmalı

## Yaygın Hatalar ve Çözümler

### "Already Verified" Hatası

Contract zaten doğrulanmış. Bu normal ve sorun değil.

### "Invalid API Key" Hatası

- `.env` dosyanızda `BASESCAN_API_KEY` doğru mu kontrol edin
- API key'in aktif olduğundan emin olun

### "Constructor Arguments Mismatch" Hatası

Deploy ederken kullandığınız constructor arguments'lar yanlış. Deploy script'indeki değerlerle eşleştiğinden emin olun.

### "Rate Limit" Hatası

Basescan API'sinin rate limit'ine ulaştınız. 1-2 dakika bekleyip tekrar deneyin.

## Token Bakiyelerini Kontrol

Contract'a token gönderildikten sonra bakiyeleri kontrol edebilirsiniz:

\`\`\`bash
# Testnet
CONTRACT_ADDRESS=0x... npm run balance:testnet

# Mainnet
CONTRACT_ADDRESS=0x... npm run balance:mainnet
\`\`\`

Bu komut hem contract'ın hem de owner'ın token bakiyelerini gösterir.

## Deployment Sonrası Checklist

- [ ] Contract deploy edildi
- [ ] Contract Basescan'de verified
- [ ] Supra wallet adresi kaydedildi
- [ ] Contract adresi Supra'da whitelisted
- [ ] Token'lar contract'a transfer edildi
- [ ] Contract'ta yeterli ETH var (gas fees için)
- [ ] Frontend'de contract adresi güncellendi

## Yardımcı Linkler

- **Base Mainnet Basescan**: https://basescan.org
- **Base Sepolia Basescan**: https://sepolia.basescan.org
- **Hardhat Verification Docs**: https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify
- **Supra dVRF Docs**: https://docs.supra.com/oracles/dvrf

## Destek

Sorun yaşıyorsanız:

1. `.env` dosyanızı kontrol edin
2. Network bağlantınızı kontrol edin
3. Deploy ve verify komutlarını doğru network ile çalıştırdığınızdan emin olun
4. Hata mesajlarını dikkatlice okuyun
