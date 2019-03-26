FROM node:10.15-alpine
WORKDIR /home/node/app
COPY . .
RUN yarn config set cache-folder /home/node/app/.yarn-cache
CMD ["sh", "-c", "yarn --silent && yarn dev"]
