const hre = require("hardhat")

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS

  if (!contractAddress) {
    console.error("❌ Please set CONTRACT_ADDRESS in .env file")
    process.exit(1)
  }

  console.log("Verifying contract at:", contractAddress)

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    })

    console.log("✅ Contract verified successfully!")
    console.log(`View on Basescan: https://basescan.org/address/${contractAddress}#code`)
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!")
    } else {
      console.error("❌ Verification failed:", error.message)
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
