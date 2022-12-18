FROM node:lts-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install -s
COPY . .

VOLUME ["/app/node_modules"]

EXPOSE 8000

ENTRYPOINT ["npm", "start"]