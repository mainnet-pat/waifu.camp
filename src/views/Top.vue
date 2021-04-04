<template>
  <div>
    <Navbar></Navbar>

    <h1 class="title is-1">Top holders</h1>
    <div class="container" style="max-width: 400pt">
      <b-table
        :data="loading ? [] : holders"
        :bordered="false"
        :striped="true"
        :narrowed="true"
        :hoverable="false"
        :loading="loading"
        :focusable="false"
        :mobile-cards="false">

        <b-table-column field="idx" label="" v-slot="props">
          <span v-if="props.row.idx > 3" style="margin-left: 17pt">&nbsp;</span>
          <b-icon v-if="props.row.idx <= 3" :style="crownStyle(props.row.idx)" icon="crown" size="is-small"></b-icon> {{ props.row.idx }}
        </b-table-column>

        <b-table-column field="address" label="Address" v-slot="props" centered>
          <span style="cursor: pointer">
            <span @click="addressClick(props.row.address)" v-text="`${Utils.addressToName(props.row.address)}`"></span>
            <span @click="addressExplore(props.row.address)"><b-icon style="margin-left:10px" icon="share" size="is-small"></b-icon></span>
          </span>
        </b-table-column>

        <b-table-column field="count" label="Collection size" v-slot="props" centered>
            {{ props.row.count }}
        </b-table-column>
      </b-table>
    </div>
    <h1 style="margin-top:20pt" class="title is-1">Top waifus</h1>
    <Gallery :topTransacted="true" style="padding-bottom: 1rem;"></Gallery>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Gallery from "@/components/Gallery.vue";
import Navbar from "@/components/Navbar.vue";

// @ts-ignore
import { Network, SlpDbProvider } from "mainnet-js";
import * as SlpDbTemplates from "@/scripts/SlpDbTemplates";
import * as Utils from "@/scripts/Utils";

@Component({
  components: {
    Navbar, Gallery
  }
})
export default class Top extends Vue {
  private holders: any[] = [];
  private loading: boolean = true;
  private Utils: any = Utils;

  async beforeMount() {
    const provider = new SlpDbProvider(Network.MAINNET);
    provider.caching = false;

    let query = SlpDbTemplates.topHolders();

    const rawResult = (await provider.SlpDbQuery(query));
    let result: any[] = [...(rawResult.t || []), ...(rawResult.g || []), ...(rawResult.u || []), ...(rawResult.c || [])];
    result.forEach((el, idx) => el.idx = idx + 1);
    this.holders = result;
    this.loading = false;
  }

  public addressClick(address: string) {
    if (!address)
      return;
    let short = address.split(":")[1];
    this.$router.push({name: 'Camp', params: { address: short }});
  }

  public addressExplore(address: string) {
    window.open(`https://simpleledger.info/#address/${address}`, "_blank");
  }

  private crownStyle(idx: number) {
    return {color: ["black", "gold", "silver", "#cd7f32"][idx]};
  }
}
</script>

<style lang="scss">
  table.table {
    background: rgba(255, 255, 255, 0.8)
  }

  table.table.is-striped tbody tr:not(.is-selected):nth-child(2n) {
    background: rgba(255, 255, 255, 0.4)
  }

</style>
