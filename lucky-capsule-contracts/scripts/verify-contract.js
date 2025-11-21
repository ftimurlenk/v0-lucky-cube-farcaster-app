const hre = require("hardhat")

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS

  if (!contractAddress) {
    console.error("❌ Please set CONTRACT_ADDRESS in .env file")
    process.exit(1)
  }

  console.log("Verifying contract at:", contractAddress)
  console.log("Network:", hre.network.name)

  try {
    console.log("Waiting 30 seconds for Basescan to index the contract...")
    await new Promise((resolve) => setTimeout(resolve, 30000))

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
      force: true,
    })

    console.log("✅ Contract verified successfully!")
    console.log(
      `View on Basescan: https://${
        hre.network.name === "baseSepolia" ? "sepolia." : ""
      }basescan.org/address/${contractAddress}#code`,
    )
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!")
      console.log(
        `View on Basescan: https://${
          hre.network.name === "baseSepolia" ? "sepolia." : ""
        }basescan.org/address/${contractAddress}#code`,
      )
    } else {
      console.error("❌ Verification failed:", error.message)
      console.log("\n📝 Manual Verification Instructions:")
      console.log("1. Go to Basescan contract page")
      console.log("2. Click 'Verify and Publish'")
      console.log("3. Select 'Solidity (Single file)'")
      console.log("4. Compiler: v0.8.20+commit.a1b79de6")
      console.log("5. Optimization: Yes, 200 runs")
      console.log("6. Copy the flattened contract code from: artifacts/contracts/LuckyCapsule.sol/LuckyCapsule.json")
      throw error
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
