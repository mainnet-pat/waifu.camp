<template>
  <div :class="waifu.fullscreen ? '' : 'tile is-child is-3 h-489'">

    <div>
      <div style="text-align: left; margin: 10pt">
        <div class="card">
          <div class="card-image" @click="imageClick">
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
                <span @click="addressClick()" v-text="`Owner: ${waifu.owner.split(':')[1].substring(0, 12)}...`"></span>
                <span @click="addressExplore()"><b-icon style="margin-left:10px" icon="share" size="is-small"></b-icon></span>
              </div>
              <div style="display: flex;  flex-direction: row;">
                <div class="" style="flex-grow: 8"><time v-text="waifu.date.toLocaleString()"></time></div>
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
      <Card :config="Object.assign({}, {...waifu, ...{fullscreen: true}})"></Card>
    </b-modal>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

export interface Waifu {
  name: string;
  tokenId: string;
  owner: string;
  date: Date;
  likes: number;
  liked: boolean;
  fullscreen: boolean;
}

const defaultWaifu: Waifu = {
    name: "Hiroa Sen",
    tokenId: "418a19475fb028a983f8c83454d5cb043b1c7740391d279f759a2eb6c531c6ef",
    owner: "simpleledger:qp8dwmz6qjcku3kuxhhl83u3zxvnkxth55erf2s94z",
    date: new Date(),
    likes: 0,
    liked: false,
    fullscreen: false
  }

@Component
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .card .media:not(:last-child) {
    margin-bottom: 0.75rem;
  }
</style>
