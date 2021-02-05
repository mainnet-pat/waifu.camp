<template>
  <div id="app">
    <div id="nav">
    <Keypress key-event="keyup" :key-code="13" @success="keyUp" />
    <div >
<transition-group name="slide-fade" mode="out-in" class="tile is-parent" style="flex-wrap: wrap;">
      <Card v-for="waifu in waifus" :key="waifu.name" :config="waifu"></Card>
</transition-group>
      <!-- <Card :config="{ name: 'Lul' }"></Card>
      <Card :config="{ name: 'Lul' }"></Card> -->
    </div>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// import * as mainnet from "mainnet-js";

import Card, { Waifu } from "@/components/Card.vue";
import { Network, SlpDbProvider } from "mainnet-js";
import Keypress from 'vue-keypress';

@Component({
  components: {
    Card,
    Keypress: () => import('vue-keypress')
  }
})
export default class App extends Vue {
  @Prop({default: () => []}) waifus!: Waifu[];

  async beforeMount() {
    // const wallet = await mainnet.Wallet.newRandom();
    // (wallet.slp.provider as mainnet.SlpDbProvider).caching = false;
    // const response = await wallet.slp.provider.SlpSpendableUtxos("simpleledger:qrlyugrrhzpedq6mhl3a5k7l0fc576w33qu3v5pl45");
    // response.slice(0, 5).forEach(async val => {
    //   (wallet.slp.provider as mainnet.SlpDbProvider).caching = true;
    //   const info = await wallet.slp.getTokenInfo(val.tokenId);
    //   this.waifus.push(info as unknown as  Waifu)
    // });
    const query = {
    "v": 3,
    "q": {
        "db": ["g"],
        "aggregate": [
            {
                "$match": {
                    "graphTxn.outputs.address": "simpleledger:qrlyugrrhzpedq6mhl3a5k7l0fc576w33qu3v5pl45",
                    "graphTxn.outputs.status": "UNSPENT"
                }
            },
            {
                "$unwind": "$graphTxn.outputs"
            },
            {
                "$match": {
                    "graphTxn.outputs.address": "simpleledger:qrlyugrrhzpedq6mhl3a5k7l0fc576w33qu3v5pl45",
                    "graphTxn.outputs.status": "UNSPENT"
                }
            },
            {
                "$project": {
                    "graphTxn": 1
                }
            },
            {
              "$lookup": {
                "from": "tokens",
                "localField": "graphTxn.details.tokenIdHex",
                "foreignField": "tokenDetails.tokenIdHex",
                "as": "token"
              }
            },
            {
                "$match": {
                    "token.nftParentId": "a2987562a405648a6c5622ed6c205fca6169faa8afeb96a994b48010bd186a66"
                }
            }
        ]
    },
    "r": {
      "f": "[ .[] | { name: .token[0].tokenDetails.name, timestamp: .token[0].tokenDetails.timestamp_unix, tokenId: .graphTxn.details.tokenIdHex, owner: .graphTxn.outputs.address } ]"
    }
    }
    const provider = new SlpDbProvider(Network.MAINNET);
    provider.caching = true;
    const result = (await provider.SlpDbQuery(query)).g as unknown[] as Waifu[];
    console.log(result);
    for (const waifu of result) {
      setTimeout(() => this.waifus.push(waifu), 1);
    }
// this.waifus = result;
  }

  private keyUp() {
    this.waifus.push(...[{ name: 'Lul' }] as unknown[] as Waifu[]);
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

body {
  background-image: url('assets/camp3.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style>
