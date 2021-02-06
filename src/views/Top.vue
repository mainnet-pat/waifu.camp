<template>
  <div>
    <Navbar></Navbar>
    <h1 class="title is-1">Top waifus</h1>
    <h1 class="title is-2" style="margin-top:5rem">Coming Soon...</h1>
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
export default class Top extends Vue {
}
</script>

<style lang="scss">

</style>
