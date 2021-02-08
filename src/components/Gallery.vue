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
  @Prop({default: () => []}) waifus!: Waifu[];

  private skip: number = 0;
  private limit: number = 12;

  get moreVisible() {
    return this.waifus.length >= this.limit;
  }

  async beforeMount() {
    this.fetchMoreWaifus();
  }

  async fetchMoreWaifus() {
    let query;
    if (this.random) {
      query = SlpDbTemplates.randomWaifus(this.limit);
    } else {
      query = SlpDbTemplates.addressWaifus(this.address , this.limit, this.skip);
    }

    const provider = new SlpDbProvider(Network.MAINNET);
    provider.caching = true;
    const result = (await provider.SlpDbQuery(query)).t as unknown[] as Waifu[];
    for (const waifu of result) {
      waifu.date = new Date((waifu.date as unknown as number) * 1000);
      setTimeout(() => this.waifus.push(waifu), 1);
    }

    this.skip += this.limit;
  }
}
</script>

<style lang="scss">
</style>
