import deployContract from "./deployContract.mjs"

deployContract("CrowdNFT")
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
