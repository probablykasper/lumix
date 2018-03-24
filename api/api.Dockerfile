FROM node:8.10

COPY package.json .

# install CLI stuff globally
RUN npm install -g  nodemon@1.17.x
RUN npm install

WORKDIR /usr/src/app

COPY . .

CMD npm run ${APP_ENV}
