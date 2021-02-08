<template>
  <div>
    <Navbar></Navbar>
    <h1 class="title is-1">Search waifus</h1>

    <section>
      <b-field position="is-centered" class="w-512">
        <b-input v-model="address" placeholder="Simpleledger address" type="search" icon="magnify"></b-input>
        <p class="control">
          <b-button @click="search()" label="Search" type="is-info" />
        </p>
      </b-field>
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
  private address: string = "";

  private search() {
    if (!bchaddr.isValidAddress(this.address)) {
      this.$buefy.snackbar.open({message: `Invalid simpleledger address`, type: 'is-warning', position: 'is-top-right'});
      return;
    }

    const address = bchaddr.toSlpAddress(this.address);
    this.$router.push({name: "Camp", params: { address: address }});
  }
}
</script>

<style lang="scss">
.w-512  div.control {
	width: 512px;
}
</style>
