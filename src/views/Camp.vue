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

  private short: string = "";
  private title: string = "";

  beforeMount() {
    if (this.address.indexOf(":")>0) {
      this.short = this.address.split(':')[1].substring(0, 4);
    } else {
      this.short = this.address.substring(0, 4);
    }

    if (this.$store.state.user && this.$store.state.user.address === this.address) {
      this.title = `Welcome back to your camp ${this.short}-San`;
    } else {
      this.title = `Camp of ${this.short}-San`
    }
  }
}
</script>

<style lang="scss">
</style>
