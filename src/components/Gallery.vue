<template>
  <div>
    <div>
      <transition-group name="slide-fade" mode="out-in" class="tile is-parent" style="flex-wrap: wrap;">
        <Card v-for="waifu in waifus" :key="waifu.name" :config="waifu"></Card>
      </transition-group>
      <b-button v-if="moreVisible" v-text="'Load More'" @click="fetchMoreWaifus"></b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Card from "@/components/Card.vue";
import { Waifu } from "@/scripts/Waifu";
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
  @Prop({default: () => []}) waifus!: Waifu[];

  private skip: number = 0;
  private limit: number = 24;

  get moreVisible() {
    // return this.waifus.length >= this.limit;
    return this.waifus.length > 0;
  }

  async beforeMount() {
    this.fetchMoreWaifus();
  }

  async fetchMoreWaifus() {
    const provider = new SlpDbProvider(Network.MAINNET);
    provider.caching = false;

    let query;
    if (this.random) {
      query = SlpDbTemplates.randomWaifus(this.limit);
    } else if (this.new) {
      query = SlpDbTemplates.newWaifus("", this.limit, this.skip);
    } else {
      query = SlpDbTemplates.addressWaifus(this.address, this.limit, this.skip);
    }

    const rawResult = (await provider.SlpDbQuery(query));
    let result: Waifu[] = [...(rawResult.t || []), ...(rawResult.g || []), ...(rawResult.u || []), ...(rawResult.c || [])];

    if (!result.length) {
      this.$buefy.snackbar.open({message: `Nothing more found`, type: 'is-warning', position: 'is-top-right'});
      return;
    }
    for (const waifu of result) {
      waifu.date = new Date((waifu.date as unknown as number) * 1000);
      if (this.waifus.findIndex(val => val.tokenId === waifu.tokenId) === -1) {
        this.waifus.push(waifu);
      }
    }

    this.skip += this.limit;
  }
}
</script>

<style lang="scss">
</style>
