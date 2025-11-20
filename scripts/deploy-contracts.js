/**
 * Lucky Capsule Contract Deployment Script
 * Base Network için deployment - Supra dVRF ile
 */

const hre = require("hardhat")

const BASE_MAINNET_CONFIG = {
  supraRouter: "0x99a021029EBC90020B193e111Ae2726264a111A2", // Base Mainnet Supra Router
}

const BASE_SEPOLIA_CONFIG = {
  supraRouter: "0x99a021029EBC90020B193e111Ae2726264a111A2", // Base Sepolia Supra Router
}

// Base Network Meme Token Adresleri (güncel adresleri buraya ekleyin)
const TOKEN_ADDRESSES = {
  DEGEN: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed", // DEGEN token
  BRETT: "0x532f27101965dd16442E59d40670FaF5eBB142E4", // BRETT token
  TOSHI: "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4", // TOSHI token
  MOCHI: "0xF6e932Ca12afa26665dC4dDE7e27be02A7c02e50", // MOCHI token
  BASEGOD: "0x9F4e8fA89Af91cA37C4e94AfF8dFEb8D08fecF58", // BASEGOD token
  SHIBA: "0x0Db510e79909666d6dEc7f5e49370838c16D950f", // SHIBA on Base
}

async function main() {
  console.log("🚀 Lucky Capsule Contract Deployment başlatılıyor...\n")

  const [deployer] = await hre.ethers.getSigners()
  console.log("Deployer address:", deployer.address)
  console.log("Deployer balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n")

  // Network seçimi
  const network = hre.network.name
  const config = network === "base" ? BASE_MAINNET_CONFIG : BASE_SEPOLIA_CONFIG

  console.log(`Network: ${network}`)
  console.log(`Supra Router: ${config.supraRouter}\n`)

  // Contract deploy
  console.log("📝 LuckyCapsule contract deploy ediliyor...")
  const LuckyCapsule = await hre.ethers.getContractFactory("LuckyCapsule")

  const luckyCapsule = await LuckyCapsule.deploy(
    config.supraRouter,
    deployer.address, // Supra'ya kayıtlı client wallet address
  )

  await luckyCapsule.waitForDeployment()
  const contractAddress = await luckyCapsule.getAddress()
  console.log("✅ LuckyCapsule deployed to:", contractAddress, "\n")

  // Token ödüllerini ekle
  console.log("💰 Token ödülleri ekleniyor...")

  // DEGEN - Common (50% chance) - Yaklaşık $0.01/token
  // 1-2 cent = 1-2 DEGEN
  await luckyCapsule.addRewardToken(
    TOKEN_ADDRESSES.DEGEN,
    hre.ethers.parseEther("1"), // Min: 1 DEGEN (~$0.01)
    hre.ethers.parseEther("2"), // Max: 2 DEGEN (~$0.02)
    0, // Common
  )
  console.log("✅ DEGEN token ödülü eklendi (Common - 1-2 DEGEN)")

  // BRETT - Rare (30% chance) - Yaklaşık $0.10/token
  // 1-2 cent = 0.1-0.2 BRETT
  await luckyCapsule.addRewardToken(
    TOKEN_ADDRESSES.BRETT,
    hre.ethers.parseEther("0.1"), // Min: 0.1 BRETT (~$0.01)
    hre.ethers.parseEther("0.2"), // Max: 0.2 BRETT (~$0.02)
    1, // Rare
  )
  console.log("✅ BRETT token ödülü eklendi (Rare - 0.1-0.2 BRETT)")

  // TOSHI - Rare (30% chance) - Yaklaşık $0.0001/token
  // 1-2 cent = 100-200 TOSHI
  await luckyCapsule.addRewardToken(
    TOKEN_ADDRESSES.TOSHI,
    hre.ethers.parseEther("100"), // Min: 100 TOSHI (~$0.01)
    hre.ethers.parseEther("200"), // Max: 200 TOSHI (~$0.02)
    1, // Rare
  )
  console.log("✅ TOSHI token ödülü eklendi (Rare - 100-200 TOSHI)")

  // MOCHI - Epic (15% chance) - Yaklaşık $0.001/token
  // 1-2 cent = 10-20 MOCHI
  await luckyCapsule.addRewardToken(
    TOKEN_ADDRESSES.MOCHI,
    hre.ethers.parseEther("10"), // Min: 10 MOCHI (~$0.01)
    hre.ethers.parseEther("20"), // Max: 20 MOCHI (~$0.02)
    2, // Epic
  )
  console.log("✅ MOCHI token ödülü eklendi (Epic - 10-20 MOCHI)")

  // BASEGOD - Legendary (5% chance) - Yaklaşık $0.005/token
  // 1-2 cent = 2-4 BASEGOD
  await luckyCapsule.addRewardToken(
    TOKEN_ADDRESSES.BASEGOD,
    hre.ethers.parseEther("2"), // Min: 2 BASEGOD (~$0.01)
    hre.ethers.parseEther("4"), // Max: 4 BASEGOD (~$0.02)
    3, // Legendary
  )
  console.log("✅ BASEGOD token ödülü eklendi (Legendary - 2-4 BASEGOD)")

  // SHIBA - Epic (15% chance) - Yaklaşık $0.00000001/token
  // 1-2 cent = 1,000,000-2,000,000 SHIBA
  await luckyCapsule.addRewardToken(
    TOKEN_ADDRESSES.SHIBA,
    hre.ethers.parseEther("1000000"), // Min: 1M SHIBA (~$0.01)
    hre.ethers.parseEther("2000000"), // Max: 2M SHIBA (~$0.02)
    2, // Epic
  )
  console.log("✅ SHIBA token ödülü eklendi (Epic - 1M-2M SHIBA)\n")

  console.log("=".repeat(50))
  console.log("📋 DEPLOYMENT ÖZETİ")
  console.log("=".repeat(50))
  console.log("Contract Address:", contractAddress)
  console.log("Network:", network)
  console.log("Supra Router:", config.supraRouter)
  console.log("Client Address:", deployer.address)
  console.log("Capsule Fee:", "0.001 ETH")
  console.log("Cooldown Period:", "24 hours")
  console.log("Reward Value:", "1-2 cents per capsule")
  console.log("=".repeat(50))
  console.log("\n⚠️  ÖNEMLİ: Supra dVRF Setup")
  console.log("1. Supra ekibi ile wallet adresinizi kaydedin:", deployer.address)
  console.log("2. Contract adresinizi whitelist'e ekleyin:", contractAddress)
  console.log("3. Callback gas fee için contract'a ETH yatırın")
  console.log("4. Detaylar: https://docs.supra.com/oracles/dvrf/vrf-subscription-model\n")

  // Verification için bilgiler
  console.log("🔍 Contract Verification için komut:")
  console.log(`npx hardhat verify --network ${network} ${contractAddress} ${config.supraRouter} ${deployer.address}\n`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
