FROM node:10.15-alpine AS base
WORKDIR /home/node/app
COPY . .
RUN yarn config set cache-folder /home/node/app/.yarn-cache
RUN yarn build && yarn --production

FROM node:10.15-alpine
WORKDIR /home/node/app
COPY --from=base /home/node/app .
CMD ["yarn", "start"]
