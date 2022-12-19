FROM node:lts-alpine

WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install -s
COPY ./frontend .

RUN mkdir -p /app/src/contracts
COPY ./solidity/artifacts/contracts/CampaignFactory.sol/CampaignFactory.json ./src/contracts/
COPY ./solidity/artifacts/contracts/Campaign.sol/Campaign.json ./src/contracts/
COPY ./solidity/artifacts/contracts/CrowdNFT.sol/CrowdNFT.json ./src/contracts/

COPY .env .
RUN sed -i 's/^/REACT_APP_/' .env

EXPOSE 3000
ENTRYPOINT ["npm", "start"]