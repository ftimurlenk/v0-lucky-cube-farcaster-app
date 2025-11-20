/**
 * Token ödül miktarlarını güncellemek için script
 * Fiyatlar değiştiğinde kullanın
 */

const hre = require("hardhat")

// Contract adresinizi buraya girin
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"

// Base Network Meme Token Adresleri
const TOKEN_ADDRESSES = {
  DEGEN: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
  BRETT: "0x532f27101965dd16442E59d40670FaF5eBB142E4",
  TOSHI: "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4",
  MOCHI: "0xF6e932Ca12afa26665dC4dDE7e27be02A7c02e50",
  BASEGOD: "0x9F4e8fA89Af91cA37C4e94AfF8dFEb8D08fecF58",
  SHIBA: "0x0Db510e79909666d6dEc7f5e49370838c16D950f",
}

// Güncel token fiyatlarını buraya girin (USD)
const TOKEN_PRICES = {
  DEGEN: 0.01, // $0.01
  BRETT: 0.1, // $0.10
  TOSHI: 0.0001, // $0.0001
  MOCHI: 0.001, // $0.001
  BASEGOD: 0.005, // $0.005
  SHIBA: 0.00000001, // $0.00000001
}

// Target ödül değeri (USD)
const MIN_REWARD_VALUE = 0.01 // 1 cent
const MAX_REWARD_VALUE = 0.02 // 2 cent

function calculateTokenAmount(tokenPrice, targetValue) {
  return targetValue / tokenPrice
}

async function main() {
  console.log("🔄 Token ödüllerini güncelliyoruz...\n")

  const [deployer] = await hre.ethers.getSigners()
  console.log("Deployer:", deployer.address, "\n")

  // Contract'ı yükle
  const LuckyCapsule = await hre.ethers.getContractFactory("LuckyCapsule")
  const luckyCapsule = await LuckyCapsule.attach(CONTRACT_ADDRESS)

  console.log("📊 Yeni ödül miktarları hesaplanıyor...\n")

  // Her token için hesapla
  const updates = [
    {
      name: "DEGEN",
      address: TOKEN_ADDRESSES.DEGEN,
      price: TOKEN_PRICES.DEGEN,
      rarity: 0, // Common
      oldIndex: 0,
    },
    {
      name: "BRETT",
      address: TOKEN_ADDRESSES.BRETT,
      price: TOKEN_PRICES.BRETT,
      rarity: 1, // Rare
      oldIndex: 1,
    },
    {
      name: "TOSHI",
      address: TOKEN_ADDRESSES.TOSHI,
      price: TOKEN_PRICES.TOSHI,
      rarity: 1, // Rare
      oldIndex: 2,
    },
    {
      name: "MOCHI",
      address: TOKEN_ADDRESSES.MOCHI,
      price: TOKEN_PRICES.MOCHI,
      rarity: 2, // Epic
      oldIndex: 3,
    },
    {
      name: "BASEGOD",
      address: TOKEN_ADDRESSES.BASEGOD,
      price: TOKEN_PRICES.BASEGOD,
      rarity: 3, // Legendary
      oldIndex: 4,
    },
    {
      name: "SHIBA",
      address: TOKEN_ADDRESSES.SHIBA,
      price: TOKEN_PRICES.SHIBA,
      rarity: 2, // Epic
      oldIndex: 5,
    },
  ]

  for (const token of updates) {
    const minAmount = calculateTokenAmount(token.price, MIN_REWARD_VALUE)
    const maxAmount = calculateTokenAmount(token.price, MAX_REWARD_VALUE)

    console.log(`${token.name}:`)
    console.log(`  Fiyat: $${token.price}`)
    console.log(`  Yeni min: ${minAmount.toFixed(2)} tokens ($${MIN_REWARD_VALUE})`)
    console.log(`  Yeni max: ${maxAmount.toFixed(2)} tokens ($${MAX_REWARD_VALUE})`)

    // Eski ödülü devre dışı bırak
    console.log(`  ⏸️  Eski ödülü devre dışı bırakıyoruz (index ${token.oldIndex})...`)
    const deactivateTx = await luckyCapsule.setRewardActive(token.oldIndex, false)
    await deactivateTx.wait()

    // Yeni ödül ekle
    console.log(`  ➕ Yeni ödül ekleniyor...`)
    const addTx = await luckyCapsule.addRewardToken(
      token.address,
      hre.ethers.utils.parseEther(minAmount.toString()),
      hre.ethers.utils.parseEther(maxAmount.toString()),
      token.rarity,
    )
    await addTx.wait()
    console.log(`  ✅ ${token.name} güncellendi!\n`)
  }

  console.log("🎉 Tüm token ödülleri başarıyla güncellendi!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
