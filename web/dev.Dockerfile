FROM node:10.15-alpine
WORKDIR /home/node/app
COPY package.json .
RUN yarn install
COPY . .
