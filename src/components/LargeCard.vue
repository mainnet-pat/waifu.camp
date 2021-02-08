<template>
  <div :class="waifu.fullscreen ? '' : 'tile is-child is-3'">

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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Waifu, defaultWaifu } from "@/scripts/Waifu";
import Card from "@/components/Card.vue";

@Component({
  components: {
  }
})
export default class LargeCard extends Vue {
  @Prop() config!: Waifu;

  private waifu: Waifu = {} as Waifu;

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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .card .media:not(:last-child) {
    margin-bottom: 0.75rem;
  }
</style>
