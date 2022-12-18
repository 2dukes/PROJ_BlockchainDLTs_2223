FROM node:lts-alpine

WORKDIR /app
COPY ./backend/package*.json ./
RUN npm install -s
COPY ./backend .

RUN mkdir -p /app/env
COPY .env ./env

EXPOSE 8000

ENTRYPOINT ["npm", "start"]