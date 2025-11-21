const hre = require("hardhat")
const fs = require("fs")
const path = require("path")

async function main() {
  console.log("Flattening LuckyCapsule contract...")

  const flattenedCode = await hre.run("flatten", {
    files: ["contracts/LuckyCapsule.sol"],
  })

  const outputPath = path.join(__dirname, "../flattened/LuckyCapsule_flattened.sol")
  const dir = path.dirname(outputPath)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(outputPath, flattenedCode)

  console.log("✅ Contract flattened successfully!")
  console.log(`Output: ${outputPath}`)
  console.log("\nFor Basescan Manual Verification:")
  console.log("1. Go to contract address on Basescan")
  console.log("2. Click 'Verify and Publish'")
  console.log("3. Select 'Solidity (Single file)'")
  console.log("4. Compiler: v0.8.20+commit.a1b79de6")
  console.log("5. Optimization: Yes (200 runs)")
  console.log("6. Paste the flattened code")
  console.log("7. Enter constructor arguments (if any)")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
