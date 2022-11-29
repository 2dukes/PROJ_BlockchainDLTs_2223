import deployContract from "./deployContract.mjs"

deployContract("CampaignFactory")
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
