/**
 * Lucky Capsule Token Pool Funding Script
 * Token havuzunu Base Network meme tokenleri ile doldurur
 */

const hre = require("hardhat");

// Lucky Capsule contract adresi (deploy ettikten sonra güncelleyin)
const LUCKY_CAPSULE_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

// Base Network Meme Token Adresleri
const TOKEN_ADDRESSES = {
  DEGEN: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
  BRETT: "0x532f27101965dd16442E59d40670FaF5eBB142E4",
  TOSHI: "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4",
  MOCHI: "0xF6e932Ca12afa26665dC4dDE7e27be02A7c02e50",
  BASEGOD: "0x9F4e8fA89Af91cA37C4e94AfF8dFEb8D08fecF58",
  SHIBA: "0x0Db510e79909666d6dEc7f5e49370838c16D950f",
};

// Her token için havuza eklenecek miktar
const FUNDING_AMOUNTS = {
  DEGEN: hre.ethers.utils.parseEther("50000"), // 50,000 DEGEN
  BRETT: hre.ethers.utils.parseEther("10000"), // 10,000 BRETT
  TOSHI: hre.ethers.utils.parseEther("500000"), // 500,000 TOSHI
  MOCHI: hre.ethers.utils.parseEther("5000"), // 5,000 MOCHI
  BASEGOD: hre.ethers.utils.parseEther("1000"), // 1,000 BASEGOD
  SHIBA: hre.ethers.utils.parseEther("100000000"), // 100M SHIBA
};

async function main() {
  console.log("🪙 Lucky Capsule Token Pool Funding başlatılıyor...\n");

  if (LUCKY_CAPSULE_ADDRESS === "YOUR_CONTRACT_ADDRESS_HERE") {
    console.error("❌ Lütfen LUCKY_CAPSULE_ADDRESS değişkenini güncelleyin!");
    process.exit(1);
  }

  const [funder] = await hre.ethers.getSigners();
  console.log("Funder address:", funder.address);
  console.log("Funder balance:", (await funder.getBalance()).toString(), "\n");

  const luckyCapsule = await hre.ethers.getContractAt("LuckyCapsule", LUCKY_CAPSULE_ADDRESS);

  // Her token için approval ve funding işlemi
  for (const [tokenName, tokenAddress] of Object.entries(TOKEN_ADDRESSES)) {
    console.log(`\n💰 ${tokenName} token funding...`);
    
    const amount = FUNDING_AMOUNTS[tokenName];
    const token = await hre.ethers.getContractAt("IERC20", tokenAddress);

    // Mevcut balance kontrolü
    const balance = await token.balanceOf(funder.address);
    console.log(`   Wallet balance: ${hre.ethers.utils.formatEther(balance)} ${tokenName}`);

    if (balance.lt(amount)) {
      console.log(`   ⚠️  Yetersiz ${tokenName} bakiyesi! Gereken: ${hre.ethers.utils.formatEther(amount)}`);
      continue;
    }

    // Approval
    console.log(`   📝 Approval veriliyor...`);
    const approveTx = await token.approve(LUCKY_CAPSULE_ADDRESS, amount);
    await approveTx.wait();
    console.log(`   ✅ Approval verildi`);

    // Fund pool
    console.log(`   💸 Token havuza ekleniyor...`);
    const fundTx = await luckyCapsule.fundRewardPool(tokenAddress, amount);
    await fundTx.wait();
    console.log(`   ✅ ${hre.ethers.utils.formatEther(amount)} ${tokenName} havuza eklendi`);

    // Contract balance kontrolü
    const contractBalance = await token.balanceOf(LUCKY_CAPSULE_ADDRESS);
    console.log(`   📊 Contract ${tokenName} balance: ${hre.ethers.utils.formatEther(contractBalance)}`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ Token pool funding tamamlandı!");
  console.log("=".repeat(50));
  console.log("Contract Address:", LUCKY_CAPSULE_ADDRESS);
  console.log("\nHavuz durumunu kontrol etmek için:");
  console.log("Her token için contract balance'ı BaseScan'de kontrol edebilirsiniz.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
