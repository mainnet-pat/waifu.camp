<template>
  <div id="app">
    <div id="nav">
<div class="tile is-parent" style="flex-wrap: wrap;">
  <!-- <Card name="Hiroa Sen"></Card> -->
  <Card :config="{ name: 'Kek' }"></Card>
  <Card :config="{ name: 'Lul' }"></Card>
  <Card :config="{ name: 'Lul' }"></Card>

  <Card :config="{ name: 'Lul' }"></Card>

  <Card :config="{ name: 'Lul' }"></Card>

  <Card :config="{ name: 'Lul' }"></Card>

  <!-- <Card name="keks"></Card> -->
  <!-- <Card name="keks"></Card> -->
  <!-- <Card name="keks"></Card> -->
</div>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Card from "@/components/Card.vue";

@Component({
  components: {
    Card
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
