FROM node:lts-alpine

WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install -s
COPY ./backend .

RUN mkdir -p /app/contracts
COPY ./solidity/artifacts/contracts/CampaignFactory.sol/CampaignFactory.json ./contracts/
COPY ./solidity/artifacts/contracts/Campaign.sol/Campaign.json ./contracts/
COPY ./solidity/artifacts/contracts/CrowdNFT.sol/CrowdNFT.json ./contracts/

RUN mkdir -p /app/env
COPY .env ./env

EXPOSE 8000

ENTRYPOINT ["npm", "start"]