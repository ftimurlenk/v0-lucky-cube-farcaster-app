const hre = require("hardhat")

async function main() {
  // Contract adresi (deploy script'inden alınacak)
  const contractAddress = process.env.CONTRACT_ADDRESS

  if (!contractAddress) {
    console.error("❌ Hata: CONTRACT_ADDRESS environment variable gerekli!")
    console.log("Kullanim: CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify-contract.js --network base")
    process.exit(1)
  }

  console.log("🔍 Contract verification başlıyor...")
  console.log("📍 Contract Adresi:", contractAddress)
  console.log("⛓️  Network:", hre.network.name)

  try {
    const network = hre.network.name
    const supraRouterAddress = "0x99a021029EBC90020B193e111Ae2726264a111A2" // Base Mainnet ve Sepolia için aynı

    // Deployer address'i al
    const [deployer] = await hre.ethers.getSigners()

    // Constructor arguments
    const constructorArgs = [supraRouterAddress, deployer.address]

    console.log("Constructor Args:", {
      supraRouter: supraRouterAddress,
      clientWallet: deployer.address,
    })

    console.log("⏳ Basescan'de doğrulama yapılıyor...")

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArgs,
    })

    console.log("✅ Contract başarıyla doğrulandı!")

    const basescanUrl =
      network === "base"
        ? `https://basescan.org/address/${contractAddress}#code`
        : `https://sepolia.basescan.org/address/${contractAddress}#code`

    console.log(`🔗 Basescan: ${basescanUrl}`)
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  Contract zaten doğrulanmış!")
      const basescanUrl =
        hre.network.name === "base"
          ? `https://basescan.org/address/${contractAddress}#code`
          : `https://sepolia.basescan.org/address/${contractAddress}#code`
      console.log(`🔗 Basescan: ${basescanUrl}`)
    } else {
      console.error("❌ Doğrulama hatası:", error)
      process.exit(1)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
