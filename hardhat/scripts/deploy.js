const { ethers } = require("hardhat")

// Contract Address: 0xd7D16fa758259eF954bA2744264774e14aEF74A7

async function main() {
    const metadataURL = "ipfs://QmdHFQCgUaZxiEsiXjwbAEwmtnUBmc1gQutUnvyCn8H81x/"

    const LW3PunksFactory = await ethers.getContractFactory("LW3Punks")
    console.log("Deploying Contract")
    const LW3Punks = await LW3PunksFactory.deploy(metadataURL)
    await LW3Punks.deployed()
    console.log(`LW3Punks deployed at : ${LW3Punks.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
