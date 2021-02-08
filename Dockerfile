FROM node:14

WORKDIR /opt
RUN npm install -g @vue/cli-service @vue/cli http-server
RUN git clone https://mainnet-pat:70cee21a42e585d7be2049c8fb5c5f0cc09ad9e3@github.com/mainnet-pat/waifu.camp
WORKDIR /opt/waifu.camp
RUN yarn
RUN yarn add mainnet-js
RUN git pull origin master && echo 6
RUN yarn
RUN yarn build
CMD yarn start
