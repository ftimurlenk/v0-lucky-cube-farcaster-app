const hre = require("hardhat")

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS

  if (!contractAddress) {
    console.error("❌ Please set CONTRACT_ADDRESS in .env file")
    process.exit(1)
  }

  console.log("Funding token pool for contract:", contractAddress)

  const [owner] = await hre.ethers.getSigners()
  console.log("Funding from account:", owner.address)

  // Token addresses and amounts for 1000 users
  const tokens = [
    {
      name: "DEGEN",
      address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
      amount: hre.ethers.parseEther("250000"), // 250k tokens
      decimals: 18,
    },
    {
      name: "BRETT",
      address: "0x532f27101965dd16442E59d40670FaF5eBB142E4",
      amount: hre.ethers.parseEther("12"), // 12 tokens
      decimals: 18,
    },
    {
      name: "TOSHI",
      address: "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4",
      amount: hre.ethers.parseEther("100000"), // 100k tokens
      decimals: 18,
    },
    {
      name: "MOCHI",
      address: "0xF6e932Ca12afa26665dC4dDE7e27be02A7c02e50",
      amount: hre.ethers.parseEther("7500"), // 7.5k tokens
      decimals: 18,
    },
    {
      name: "BASEGOD",
      address: "0xd08a2917653d4E460893203471f0000826fb4034",
      amount: hre.ethers.parseEther("100"), // 100 tokens
      decimals: 18,
    },
    {
      name: "SHIBA",
      address: "0x4A8D8eBb5c8e8e0E9b2e5F2c5e3e4d5e6f7a8b9c",
      amount: hre.ethers.parseEther("20000000"), // 20M tokens
      decimals: 18,
    },
  ]

  console.log("\nTransferring tokens to contract...\n")

  for (const token of tokens) {
    try {
      const tokenContract = await hre.ethers.getContractAt("IERC20", token.address)

      // Check balance
      const balance = await tokenContract.balanceOf(owner.address)
      console.log(`${token.name} balance:`, hre.ethers.formatUnits(balance, token.decimals))

      if (balance < token.amount) {
        console.log(`⚠️  Insufficient ${token.name} balance. Skipping...`)
        continue
      }

      // Approve
      console.log(`Approving ${token.name}...`)
      const approveTx = await tokenContract.approve(contractAddress, token.amount)
      await approveTx.wait()

      // Transfer
      console.log(`Transferring ${token.name}...`)
      const transferTx = await tokenContract.transfer(contractAddress, token.amount)
      await transferTx.wait()

      console.log(`✅ ${token.name} transferred: ${hre.ethers.formatUnits(token.amount, token.decimals)}\n`)
    } catch (error) {
      console.error(`❌ Error with ${token.name}:`, error.message, "\n")
    }
  }

  console.log("✅ Token pool funding complete!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
