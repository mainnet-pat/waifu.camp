<template>
  <div :class="waifu.fullscreen ? '' : 'tile is-child is-3'">

    <div>
      <div style="text-align: left; margin: 10pt">
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by4">
              <img :src="`https://icons.waifufaucet.com/original/${waifu.tokenId}.png`" :alt="waifu.name">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4" v-text="waifu.name"></p>
              </div>
            </div>

            <div class="content">
              <div style="cursor: pointer">
                <span @click="addressClick(waifu.owner)" v-text="`Owner: ${short()}`"></span>
                <span @click="addressExplore(waifu.owner)"><b-icon style="margin-left:10px" icon="share" size="is-small"></b-icon></span>
              </div>
              <div style="display: flex;  flex-direction: row;">
                <!-- <div class="" style="flex-grow: 8"><time v-text="waifu.date.toLocaleString()"></time></div> -->
                <div class="" style="flex-grow: 2; text-align: right" :style="waifu.liked ? 'color: red' : 'color: black'" @click="toggleLike">
                  <b-icon icon="heart" size="is-small"></b-icon>
                  <span v-text="waifu.likes"></span>
                </div>
              </div>
              <div class="traits" style="margin-top: 1rem">
                <div v-if="traits.beliefs.length">
                  <div style="font-size: 1.5rem">Beliefs</div>
                  <div v-text="traits.beliefs.join(', ')"></div>
                </div>
                <div v-if="traits.facets.length">
                  <div style="font-size: 1.5rem">Facets</div>
                  <div v-text="traits.facets.join(', ')"></div>
                </div>
                <div v-if="traits.body.length">
                  <div style="font-size: 1.5rem">Body</div>
                  <div v-text="traits.body.join(', ')"></div>
                </div>
                <div v-if="traits.soul.length">
                  <div style="font-size: 1.5rem">Soul</div>
                  <div v-text="traits.soul.join(', ')"></div>
                </div>
              </div>

              <div class="history">
                <div style="margin-top: 2rem; font-size: 1.5rem">Token transaction history:</div>
                <b-table
                  :data="loading ? [] : transactions"
                  :bordered="false"
                  :striped="true"
                  :narrowed="true"
                  :hoverable="false"
                  :loading="loading"
                  :focusable="false"
                  :mobile-cards="false">

                  <b-table-column field="previousOwner" label="From" v-slot="props">
                    <span style="cursor: pointer">
                      <span @click="addressClick(props.row.previousOwner)" v-text="`${Utils.addressToName(props.row.previousOwner) || 'Genesis'}`"></span>
                      <span @click="addressExplore(props.row.previousOwner)"><b-icon style="margin-left:10px" icon="share" size="is-small"></b-icon></span>
                    </span>
                  </b-table-column>

                  <b-table-column field="owner" label="To" v-slot="props">
                    <span style="cursor: pointer">
                      <span @click="addressClick(props.row.owner)" v-text="`${Utils.addressToName(props.row.owner) || 'Genesis'}`"></span>
                      <span @click="addressExplore(props.row.owner)"><b-icon style="margin-left:10px" icon="share" size="is-small"></b-icon></span>
                    </span>
                  </b-table-column>

                  <b-table-column field="date" label="Date" centered v-slot="props">
                      {{ new Date(props.row.date * 1000).toLocaleDateString() }}
                  </b-table-column>
                </b-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Waifu, defaultWaifu } from "@/scripts/Waifu";
import { Transaction } from "@/scripts/Transaction";
import Card from "@/components/Card.vue";
import * as Utils from "@/scripts/Utils";
import { traits } from "@/scripts/traits";
import { Network, SlpDbProvider } from "mainnet-js";
import * as SlpDbTemplates from "@/scripts/SlpDbTemplates";

@Component({
  components: {
  }
})
export default class LargeCard extends Vue {
  @Prop() config!: Waifu;

  private waifu: Waifu = {} as Waifu;
  private transactions: Transaction[] = [];
  private traits: any = {};
  private Utils: any = Utils;

  beforeMount() {
    this.setConfig(this.config);
    this.traits = {...this.traits, ...traits(this.waifu.tokenId)};
    this.fetchTransactionHistory();
  }

  beforeDestroy() {
    const parent: Card = this.$parent.$parent as Card;
    if (parent instanceof Card) {
      this.waifu.fullscreen = false;
      parent.setConfig(this.waifu);
    }
  }

  public setConfig(val: Waifu) {
    this.waifu = {... defaultWaifu, ...val};
  }

  public toggleLike() {
    this.waifu.likes += this.waifu.likes ? -1 : 1;
    this.waifu.liked = !this.waifu.liked;
  }

  public addressClick(address: string) {
    if (!address)
      return;
    let short = address.split(":")[1];
    this.$router.push({name: 'Camp', params: { address: short }});
  }

  public addressExplore(address: string) {
    if (!address) {
      window.open(`https://simpleledger.info/#tx/${this.waifu.tokenId}`, "_blank");
    } else {
      window.open(`https://simpleledger.info/#address/${address}`, "_blank");
    }
  }

  public short() {
    return Utils.addressToName(this.waifu.owner);
  }


  public async fetchTransactionHistory() {
    const provider = new SlpDbProvider(Network.MAINNET);
    provider.caching = false;

    let query = SlpDbTemplates.transactionHistory(this.waifu.tokenId);

    const rawResult = (await provider.SlpDbQuery(query));
    let result = [...(rawResult.t || []), ...(rawResult.g || []), ...(rawResult.u || []), ...(rawResult.c || [])];

    for (const tx of result) {
      this.transactions.push(tx);
    }
  }

  get loading() {
    return this.transactions.length === 0;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .card .media:not(:last-child) {
    margin-bottom: 0.75rem;
  }
</style>
