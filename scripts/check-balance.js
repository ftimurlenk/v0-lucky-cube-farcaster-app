/**
 * Contract ve owner token bakiyelerini kontrol eder
 */

const hre = require("hardhat")

// Token adresleri
const TOKEN_ADDRESSES = {
  DEGEN: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
  BRETT: "0x532f27101965dd16442E59d40670FaF5eBB142E4",
  TOSHI: "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4",
  MOCHI: "0xF6e932Ca12afa26665dC4dE7e27be02A7c02e50",
  BASEGOD: "0x9F4e8fA89Af91cA37C4e94AfF8dFEb8D08fecF58",
  SHIBA: "0x0Db510e79909666d6dEc7f5e49370838c16D950f",
}

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS

  if (!contractAddress) {
    console.error("❌ Hata: CONTRACT_ADDRESS environment variable gerekli!")
    console.log("Kullanim: CONTRACT_ADDRESS=0x... npx hardhat run scripts/check-balance.js --network base")
    process.exit(1)
  }

  console.log("💰 Token Bakiye Kontrolü\n")
  console.log("Contract:", contractAddress)
  console.log("Network:", hre.network.name)
  console.log("=".repeat(70), "\n")

  const [owner] = await hre.ethers.getSigners()

  // ERC20 ABI
  const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
  ]

  for (const [symbol, address] of Object.entries(TOKEN_ADDRESSES)) {
    try {
      const token = new hre.ethers.Contract(address, erc20Abi, owner)
      const decimals = await token.decimals()
      const contractBalance = await token.balanceOf(contractAddress)
      const ownerBalance = await token.balanceOf(owner.address)

      console.log(`${symbol}:`)
      console.log(`  Contract Balance: ${hre.ethers.utils.formatUnits(contractBalance, decimals)}`)
      console.log(`  Owner Balance:    ${hre.ethers.utils.formatUnits(ownerBalance, decimals)}`)
      console.log("")
    } catch (error) {
      console.log(`${symbol}: ❌ Kontrol edilemedi (${error.message})\n`)
    }
  }

  // ETH balance
  const contractEthBalance = await hre.ethers.provider.getBalance(contractAddress)
  console.log("ETH:")
  console.log(`  Contract Balance: ${hre.ethers.utils.formatEther(contractEthBalance)} ETH`)
  console.log("=".repeat(70))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
