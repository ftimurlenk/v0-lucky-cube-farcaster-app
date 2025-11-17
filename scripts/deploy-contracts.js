/**
 * Lucky Capsule Contract Deployment Script
 * Base Network için deployment - Supra dVRF ile
 */

const hre = require("hardhat");

const BASE_MAINNET_CONFIG = {
  supraRouter: "0x99a021029EBC90020B193e111Ae2726264a111A2", // Base Mainnet Supra Router
};

const BASE_SEPOLIA_CONFIG = {
  supraRouter: "0x99a021029EBC90020B193e111Ae2726264a111A2", // Base Sepolia Supra Router
};

// Base Network Meme Token Adresleri (güncel adresleri buraya ekleyin)
const TOKEN_ADDRESSES = {
  DEGEN: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed", // DEGEN token
  BRETT: "0x532f27101965dd16442E59d40670FaF5eBB142E4", // BRETT token
  TOSHI: "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4", // TOSHI token
  MOCHI: "0xF6e932Ca12afa26665dC4dDE7e27be02A7c02e50", // MOCHI token
  BASEGOD: "0x9F4e8fA89Af91cA37C4e94AfF8dFEb8D08fecF58", // BASEGOD token
  SHIBA: "0x0Db510e79909666d6dEc7f5e49370838c16D950f", // SHIBA on Base
};

async function main() {
  console.log("🚀 Lucky Capsule Contract Deployment başlatılıyor...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", (await deployer.getBalance()).toString(), "\n");

  // Network seçimi
  const network = hre.network.name;
  const config = network === "base" ? BASE_MAINNET_CONFIG : BASE_SEPOLIA_CONFIG;

  console.log(`Network: ${network}`);
  console.log(`Supra Router: ${config.supraRouter}\n`);

  // Contract deploy
  console.log("📝 LuckyCapsule contract deploy ediliyor...");
  const LuckyCapsule = await hre.ethers.getContractFactory("LuckyCapsule");
  
  const luckyCapsule = await LuckyCapsule.deploy(
    config.supraRouter,
    deployer.address // Supra'ya kayıtlı client wallet address
  );

  await luckyCapsule.deployed();
  console.log("✅ LuckyCapsule deployed to:", luckyCapsule.address, "\n");

  // Token ödüllerini ekle
  console.log("💰 Token ödülleri ekleniyor...");

  // DEGEN - Common (50% chance)
  await luckyCapsule.addRewardToken(
    TOKEN_ADDRESSES.DEGEN,
    hre.ethers.utils.parseEther("100"), // Min: 100 DEGEN
    hre.ethers.utils.parseEther("500"), // Max: 500 DEGEN
    0 // Common
  );
  console.log("✅ DEGEN token ödülü eklendi (Common)");

  // BRETT - Rare (30% chance)
  await luckyCapsule.addRewardToken(
    TOKEN_ADDRESSES.BRETT,
    hre.ethers.utils.parseEther("50"), // Min: 50 BRETT
    hre.ethers.utils.parseEther("200"), // Max: 200 BRETT
    1 // Rare
  );
  console.log("✅ BRETT token ödülü eklendi (Rare)");

  // TOSHI - Rare (30% chance)
  await luckyCapsule.addRewardToken(
    TOKEN_ADDRESSES.TOSHI,
    hre.ethers.utils.parseEther("1000"), // Min: 1000 TOSHI
    hre.ethers.utils.parseEther("5000"), // Max: 5000 TOSHI
    1 // Rare
  );
  console.log("✅ TOSHI token ödülü eklendi (Rare)");

  // MOCHI - Epic (15% chance)
  await luckyCapsule.addRewardToken(
    TOKEN_ADDRESSES.MOCHI,
    hre.ethers.utils.parseEther("20"), // Min: 20 MOCHI
    hre.ethers.utils.parseEther("100"), // Max: 100 MOCHI
    2 // Epic
  );
  console.log("✅ MOCHI token ödülü eklendi (Epic)");

  // BASEGOD - Legendary (5% chance)
  await luckyCapsule.addRewardToken(
    TOKEN_ADDRESSES.BASEGOD,
    hre.ethers.utils.parseEther("10"), // Min: 10 BASEGOD
    hre.ethers.utils.parseEther("50"), // Max: 50 BASEGOD
    3 // Legendary
  );
  console.log("✅ BASEGOD token ödülü eklendi (Legendary)");

  // SHIBA - Epic (15% chance)
  await luckyCapsule.addRewardToken(
    TOKEN_ADDRESSES.SHIBA,
    hre.ethers.utils.parseEther("500000"), // Min: 500k SHIBA
    hre.ethers.utils.parseEther("2000000"), // Max: 2M SHIBA
    2 // Epic
  );
  console.log("✅ SHIBA token ödülü eklendi (Epic)\n");

  // Deployment özeti
  console.log("=".repeat(50));
  console.log("📋 DEPLOYMENT ÖZETİ");
  console.log("=".repeat(50));
  console.log("Contract Address:", luckyCapsule.address);
  console.log("Network:", network);
  console.log("Supra Router:", config.supraRouter);
  console.log("Client Address:", deployer.address);
  console.log("Capsule Fee:", "0.001 ETH");
  console.log("Cooldown Period:", "24 hours");
  console.log("=".repeat(50));
  console.log("\n⚠️  ÖNEMLİ: Supra dVRF Setup");
  console.log("1. Supra ekibi ile wallet adresinizi kaydedin:", deployer.address);
  console.log("2. Contract adresinizi whitelist'e ekleyin:", luckyCapsule.address);
  console.log("3. Callback gas fee için contract'a ETH yatırın");
  console.log("4. Detaylar: https://docs.supra.com/oracles/dvrf/vrf-subscription-model\n");

  // Verification için bilgiler
  console.log("🔍 Contract Verification için komut:");
  console.log(`npx hardhat verify --network ${network} ${luckyCapsule.address} ${config.supraRouter} ${deployer.address}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
