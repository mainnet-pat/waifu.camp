<template>
  <div id="app">
    <router-view></router-view>
        <b-tooltip multilined type="is-primary is-light" class="sticky" position="is-left" size="is-large">
          <template v-slot:content>
              Background image: Yuru Camp<br/> No copyright infringement intended.<br/>Made by pat with ❤️
          </template>
          <b-icon class="is-primary" icon="help-circle"></b-icon>
        </b-tooltip>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Home from "@/views/Home.vue"

@Component({
  components: {
    Home
  }
})
export default class App extends Vue {
  beforeMount() {
    this.$store.dispatch("restoreState");
  }
}
</script>

<style lang="scss">
//   @import "~bulma/sass/utilities/_all";
//   $primary: #2059AF;
//   $primary-invert: findColorInvert($primary);
//   $twitter: #4099FF;
//   $twitter-invert: findColorInvert($twitter);

//   $colors: (
//       "white": ($white, $black),
//       "black": ($black, $white),
//       "light": ($light, $light-invert),
//       "dark": ($dark, $dark-invert),
//       "primary": ($primary, $primary-invert),
//       "info": ($info, $info-invert),
//       "success": ($success, $success-invert),
//       "warning": ($warning, $warning-invert),
//       "danger": ($danger, $danger-invert),
//       "twitter": ($twitter, $twitter-invert)
//   );

//   // Links
//   $link: $primary;
//   $link-invert: $primary-invert;
//   $link-focus-border: $primary;

//   // Import Bulma and Buefy styles
// @import "~bulma";
// @import "~buefy/src/scss/buefy";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

html {
  background-image: url('assets/camp3.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  height: 100%;
  margin: 0;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

h1.title {
  color: white; text-shadow: 0px 0px 9px #000000;
}

span.sticky{
    position: fixed;
    bottom: 17pt;
    right: 12pt;
}

</style>
