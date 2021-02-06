<template>
  <div>
    <h1 class="title is-1" style="padding-top: 1rem;">Camp of {{ short }}-San</h1>
    <Gallery :address="address" style="margin-bottom: 1rem;"></Gallery>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Gallery from "@/components/Gallery.vue";

@Component({
  components: {
    Gallery,
  }
})
export default class Camp extends Vue {
  @Prop() address!: string;

  private short: string = "";

  beforeMount() {
    if (this.address.indexOf(":")>0) {
      this.short = this.address.split(':')[1].substring(0, 4);
    } else {
      this.short = this.address.substring(0, 4);
    }
  }
}
</script>

<style lang="scss">
</style>
