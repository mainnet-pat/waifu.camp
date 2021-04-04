<template>
  <div>
    <Navbar></Navbar>
    <h1 class="title is-1">Search waifus</h1>

    <section>
      <b-field position="is-centered" class="w-512">
        <b-input v-model="query" placeholder="Address, token id or name" type="search" icon="magnify" @keyup.native.enter="() => search()"></b-input>
        <p class="control">
          <b-button @click="() => search()" label="Search" type="is-info" />
        </p>
      </b-field>
      <div v-if="update" :key="update">
        <Gallery :searchQuery="query" style="padding-bottom: 1rem;"></Gallery>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Gallery from "@/components/Gallery.vue";
import Navbar from "@/components/Navbar.vue";

import bchaddr from "bchaddrjs-slp";

@Component({
  components: {
    Navbar, Gallery
  }
})
export default class Search extends Vue {
  @Prop({default: ""}) searchQuery!: string;
  private query: string = "";
  private update: number = 0;

  async beforeMount() {
    if (this.searchQuery) {
      this.query = this.searchQuery;
      this.search();
    }
  }

  private search() {
    if (bchaddr.isValidAddress(this.query)) {
      const address = bchaddr.toSlpAddress(this.query);
      this.$router.push({name: "Camp", params: { address: address }});
      return;
    }

    if (this.query.match(/^[0-9a-fA-F]{64}$/)) {
      this.$router.push({name: "Waifu", params: { tokenId: this.query }});
      return;
    }

    this.update++;
  }
}
</script>

<style lang="scss">
.w-512  div.control {
	width: 512px;
}
</style>
