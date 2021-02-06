<template>
  <div>
    <Navbar :title="'Waifu.camp'"></Navbar>
    <h1 class="title is-1" style="padding-top: 1rem;">Welcome to waifu.camp</h1>
    <Gallery :address="undefined" style="padding-bottom: 1rem;"></Gallery>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Gallery from "@/components/Gallery.vue";
import Navbar from "@/components/Navbar.vue";

@Component({
  components: {
    Navbar, Gallery
  }
})
export default class Home extends Vue {
}
</script>

<style lang="scss">

</style>
