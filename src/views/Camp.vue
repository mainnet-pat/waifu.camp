<template>
  <div>
    <Navbar :ssubtitle="title"></Navbar>
    <h1 class="title is-1" v-text="title"></h1>
    <Gallery :address="address" style="margin-bottom: 1rem;"></Gallery>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from 'vuex';

import Navbar from "@/components/Navbar.vue";
import Gallery from "@/components/Gallery.vue";
import * as Utils from "@/scripts/Utils";


@Component({
  components: {
    Navbar, Gallery,
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
})
export default class Camp extends Vue {
  @Prop() address!: string;

  private title: string = "";

  beforeMount() {
    const short = Utils.addressToName(this.address);

    if (this.$store.state.user && this.$store.state.user.address === this.address) {
      this.title = `Welcome back to your camp ${short}`;
    } else {
      this.title = `Camp of ${short}`
    }
  }
}
</script>

<style lang="scss">
</style>
