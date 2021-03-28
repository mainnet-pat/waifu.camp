FROM node:14

WORKDIR /opt
RUN npm install -g @vue/cli-service @vue/cli && echo 4
RUN git clone https://github.com/mainnet-pat/waifu.camp
WORKDIR /opt/waifu.camp
RUN yarn add mainnet-js
RUN yarn
RUN yarn build
CMD node server.js
