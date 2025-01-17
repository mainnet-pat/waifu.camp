import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '@mdi/font/css/materialdesignicons.css'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

// @ts-ignore
import { SlpDbProvider } from "mainnet-js";
SlpDbProvider.servers.mainnet.dataSource = "https://slpserve.waifu.camp"

Vue.use(Buefy)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
