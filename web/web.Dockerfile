FROM node:8.9

COPY package.json .

# install CLI stuff globally
RUN npm install -g  nodemon@1.14.x
RUN npm install -g  webpack@3.10.x
RUN npm install -g  npm-run-all@4.1.x
RUN npm install

WORKDIR /usr/src/app

COPY . .

CMD npm run ${LUMIX_ENV}
