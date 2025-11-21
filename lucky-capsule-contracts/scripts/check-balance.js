const hre = require("hardhat")

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS

  if (!contractAddress) {
    console.error("❌ Please set CONTRACT_ADDRESS in .env file")
    process.exit(1)
  }

  console.log("Checking token balances for contract:", contractAddress)
  console.log("")

  const tokens = [
    { name: "DEGEN", address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed", decimals: 18 },
    { name: "BRETT", address: "0x532f27101965dd16442E59d40670FaF5eBB142E4", decimals: 18 },
    { name: "TOSHI", address: "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4", decimals: 18 },
    { name: "MOCHI", address: "0xF6e932Ca12afa26665dC4dDE7e27be02A7c02e50", decimals: 18 },
    { name: "BASEGOD", address: "0xd08a2917653d4E460893203471f0000826fb4034", decimals: 18 },
    { name: "SHIBA", address: "0x4A8D8eBb5c8e8e0E9b2e5F2c5e3e4d5e6f7a8b9c", decimals: 18 },
  ]

  for (const token of tokens) {
    try {
      const tokenContract = await hre.ethers.getContractAt("IERC20", token.address)
      const balance = await tokenContract.balanceOf(contractAddress)
      const formattedBalance = hre.ethers.formatUnits(balance, token.decimals)

      console.log(`${token.name.padEnd(10)}: ${formattedBalance}`)
    } catch (error) {
      console.log(`${token.name.padEnd(10)}: Error - ${error.message}`)
    }
  }

  // Check ETH balance
  const ethBalance = await hre.ethers.provider.getBalance(contractAddress)
  console.log(`\nETH Balance: ${hre.ethers.formatEther(ethBalance)} ETH`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
