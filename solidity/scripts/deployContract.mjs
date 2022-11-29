const deployContract = async (contractName) => {
    const CrowdNFT = await ethers.getContractFactory(contractName);
    const crowdNFT = await CrowdNFT.deploy();

    await crowdNFT.deployed();

    const txHash = crowdNFT.deployTransaction.hash;
    const txReceipt = await ethers.provider.waitForTransaction(txHash, 5);
    const contractAddress = txReceipt.contractAddress;

    console.log(`Contract ${contractName} deployed to address:`, contractAddress);
    console.log(`Verifying Address for Contract ${contractName}`);

    await hre.run("verify:verify", {
        address: contractAddress,
    });
}

export default deployContract;