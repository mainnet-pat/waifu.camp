<template>
  <div>
    <Navbar></Navbar>
    <div v-if="loaded">
      <h1 class="title is-1">{{ waifu.name }}</h1>
      <div class="tile is-5" style="margin: auto;">
        <LargeCard style="margin:auto;" :config="waifu"></LargeCard>
      </div>
    </div>
    <div v-else>
      <h1 v-if="notFound" class="title is-1">Nothing found ¯\_(ツ)_/¯</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Navbar from "@/components/Navbar.vue";
import LargeCard from "@/components/LargeCard.vue";
import Card from "@/components/Card.vue";


import { Waifu } from "@/scripts/Waifu";
// @ts-ignore
import { Network, SlpDbProvider } from "mainnet-js";
import * as SlpDbTemplates from "@/scripts/SlpDbTemplates";

@Component({
  components: {
    Navbar, LargeCard, Card
  }
})
export default class WaifuView extends Vue {
  @Prop() tokenId!: string;

  private waifu: Waifu = {} as Waifu;
  private loaded = false;
  private notFound = false;

  async beforeMount() {
    const query = SlpDbTemplates.singleWaifu(this.tokenId);

    const provider = new SlpDbProvider(Network.MAINNET);
    provider.caching = true;
    const result = (await provider.SlpDbQuery(query)).t as unknown[] as Waifu[];

    if (result.length < 1) {
      this.notFound = true;
      return;
    }

    Vue.set(this, "waifu", result[0]);
    this.waifu.date = new Date((this.waifu.date as unknown as number) * 1000);
    this.waifu.fullscreen = true;
    this.loaded = true;
  }
}
</script>

<style lang="scss">

</style>
