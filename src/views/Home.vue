<template>
  <div>
    <Navbar :ssubtitle="'New waifus'"></Navbar>
    <h1 class="title is-1">Welcome to waifu.camp</h1>
    <Gallery style="padding-bottom: 1rem;"></Gallery>
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
