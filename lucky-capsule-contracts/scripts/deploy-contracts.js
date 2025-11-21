const hre = require("hardhat")

async function main() {
  console.log("Deploying LuckyCapsule contract to Base Network...")

  const [deployer] = await hre.ethers.getSigners()
  console.log("Deploying with account:", deployer.address)

  const balance = await hre.ethers.provider.getBalance(deployer.address)
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH")

  // Deploy LuckyCapsule
  const LuckyCapsule = await hre.ethers.getContractFactory("LuckyCapsule")
  const luckyCapsule = await LuckyCapsule.deploy()

  await luckyCapsule.waitForDeployment()
  const contractAddress = await luckyCapsule.getAddress()

  console.log("\n✅ LuckyCapsule deployed to:", contractAddress)

  // Token addresses
  const tokens = {
    DEGEN: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
    BRETT: "0x532f27101965dd16442E59d40670FaF5eBB142E4",
    TOSHI: "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4",
    MOCHI: "0xF6e932Ca12afa26665dC4dDE7e27be02A7c02e50",
    BASEGOD: "0xd08a2917653d4E460893203471f0000826fb4034",
    SHIBA: "0x4A8D8eBb5c8e8e0E9b2e5F2c5e3e4d5e6f7a8b9c",
  }

  console.log("\nToken Addresses:")
  for (const [name, address] of Object.entries(tokens)) {
    console.log(`  ${name}: ${address}`)
  }

  console.log("\n📋 Next Steps:")
  console.log("1. Register deployer address with Supra dVRF")
  console.log("2. Add contract address to Supra whitelist")
  console.log("3. Fund contract with tokens using: npx hardhat run scripts/fund-pool.js --network base")
  console.log("4. Verify contract: npx hardhat run scripts/verify-contract.js --network base")

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    tokens: tokens,
  }

  console.log("\n💾 Deployment Info:")
  console.log(JSON.stringify(deploymentInfo, null, 2))

  return contractAddress
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
