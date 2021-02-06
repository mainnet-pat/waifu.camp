<template>
  <div>
    <Navbar :ssubtitle="'Random waifus'"></Navbar>
    <h1 class="title is-1">Random waifus</h1>
    <Gallery :random="true" style="padding-bottom: 1rem;"></Gallery>
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
export default class Random extends Vue {
}
</script>

<style lang="scss">

</style>
