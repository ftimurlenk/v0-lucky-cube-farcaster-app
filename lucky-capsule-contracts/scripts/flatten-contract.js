const hre = require("hardhat")
const fs = require("fs")
const path = require("path")

async function main() {
  console.log("Flattening LuckyCapsule contract...")

  const flattenedCode = await hre.run("flatten:get-flattened-sources", {
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
  console.log("\nYou can use this flattened file for manual verification on Basescan if needed.")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
