<template>
  <div :class="waifu.fullscreen ? '' : 'tile is-child is-2 h-489'">

    <div>
      <div style="text-align: left; margin: 10pt">
        <div class="card">
          <div class="card-image" @click="imageClick">
            <figure class="image is-4by4">
              <img :src="`https://icons.waifufaucet.com/original/${waifu.tokenId}.png`" :alt="waifu.name">
            </figure>
          </div>
          <div class="card-content card-content-fix">
            <div class="media media-fix">
              <router-link tag="a" class="media-content" :to="`/waifu/${waifu.tokenId}`" target="_blank">
                <p class="title is-6" v-text="waifu.name"></p>
              </router-link>
            </div>

            <div class="content">
              <div style="cursor: pointer">
                <span @click="addressClick()" v-text="`Owner: ${short()}`"></span>
                <span @click="addressExplore()"><b-icon style="margin-left:10px" icon="share" size="is-small"></b-icon></span>
              </div>
              <div v-if="waifu.txCount">
                <span v-text="`Transactions: ${waifu.txCount}`"></span>
              </div>
              <div style="display: box;  flex-direction: row;">
                <!-- <div class="" style="flex-grow: 8"><time v-text="waifu.date.toLocaleString()"></time></div> -->
                <div class="" style="flex-grow: 2; text-align: right" :style="waifu.liked ? 'color: red' : 'color: black'" @click="toggleLike">
                  <b-icon icon="heart" size="is-small"></b-icon>
                  <span v-text="waifu.likes"></span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <b-modal v-model="modal" :width="550">
      <LargeCard :config="Object.assign({}, {...waifu, ...{fullscreen: true}})"></LargeCard>
    </b-modal>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import LargeCard from "@/components/LargeCard.vue";
import { Waifu, defaultWaifu } from "@/scripts/Waifu";
import * as Utils from "@/scripts/Utils";

@Component({
  components: {
    LargeCard
  }
})
export default class Card extends Vue {
  @Prop() config!: Waifu;

  private waifu: Waifu = {} as Waifu;

  private modal: boolean = false;

  beforeMount() {
    this.setConfig(this.config);
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

  public addressClick() {
    let short = this.waifu.owner.split(":")[1];
    this.$router.push({name: 'Camp', params: { address: short }});
  }

  public addressExplore() {
    window.open(`https://simpleledger.info/#address/${this.waifu.owner}`, "_blank"); 
  }

  public imageClick() {
    if (!this.waifu.fullscreen) {
      this.modal = !this.modal;
    } else {
      (this.$parent.$parent as Card).imageClick();
    }
  }

  public short() {
    return Utils.addressToName(this.waifu.owner);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  // .card .media:not(:last-child) {
  //   margin-bottom: 0.75rem;
  // }

  .card-content-fix {
    padding: 0.7rem !important
  }

  .media-fix {
    margin-bottom: 0.5rem !important
  }
</style>
