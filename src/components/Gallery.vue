<template>
  <div>
    <div>
      <transition-group name="slide-fade" mode="out-in" class="tile is-parent" style="flex-wrap: wrap;">
        <Card v-for="waifu in waifus" :key="waifu.tokenId" :config="waifu"></Card>
      </transition-group>
      <b-button v-if="moreVisible" v-text="'Load More'" @click="() => fetchMoreWaifus()"></b-button>
      <b-button v-if="loadAllVisible" v-text="'Load All'" @click="fetchAllWaifus" style="margin-left: 30px"></b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Card from "@/components/Card.vue";
import { Waifu } from "@/scripts/Waifu";
// @ts-ignore
import { Network, SlpDbProvider } from "mainnet-js";
import * as SlpDbTemplates from "@/scripts/SlpDbTemplates";

@Component({
  components: {
    Card,
    Keypress: () => import('vue-keypress')
  }
})

export default class Gallery extends Vue {
  @Prop() address!: string;
  @Prop({default: false}) random!: boolean;
  @Prop({default: false}) new!: boolean;
  @Prop({default: false}) topTransacted!: boolean;
  @Prop({default: ""}) searchQuery!: string;
  @Prop({default: () => []}) waifus!: Waifu[];

  private skip: number = 0;
  private limit: number = 24;

  get moreVisible() {
    // return this.waifus.length >= this.limit;
    return this.waifus.length > 0;
  }

  get loadAllVisible() {
    return this.moreVisible && this.address;
  }

  async beforeMount() {
    this.fetchMoreWaifus();
  }

  async fetchMoreWaifus(limit?: number) {
    if (!limit) {
      limit = this.limit;
    }

    const provider = new SlpDbProvider(Network.MAINNET);
    provider.caching = false;

    let query;
    if (this.random) {
      query = SlpDbTemplates.randomWaifus(limit);
    } else if (this.new) {
      query = SlpDbTemplates.newWaifus("", limit, this.skip);
    } else if (this.searchQuery) {
      query = SlpDbTemplates.searchWaifus(this.searchQuery, limit, this.skip);
    } else if (this.topTransacted) {
      query = SlpDbTemplates.topTransactedWaifus(limit, this.skip);
    } else {
      query = SlpDbTemplates.addressWaifus(this.address, limit, this.skip);
    }

    const rawResult = (await provider.SlpDbQuery(query));
    let result: Waifu[] = [...(rawResult.t || []), ...(rawResult.g || []), ...(rawResult.u || []), ...(rawResult.c || [])];

    if (!result.length) {
      this.$buefy.snackbar.open({message: `Nothing found`, type: 'is-warning', position: 'is-top-right'});
      return;
    }
    for (const waifu of result) {
      waifu.date = new Date((waifu.date as unknown as number) * 1000);
      if (this.waifus.findIndex(val => val.tokenId === waifu.tokenId) === -1) {
        this.waifus.push(waifu);
      }
    }

    this.skip += limit;
  }

  async fetchAllWaifus(limit?: number) {
    return this.fetchMoreWaifus(1e6);
  }
}
</script>

<style lang="scss">
</style>
