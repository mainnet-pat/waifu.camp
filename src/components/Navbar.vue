<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="dropdown navigation"
      v-on:update:title="updateTitle($event)"
      v-on:update:subtitle="updateSubtitle($event)">
      <div class="container">
        <div class="navbar-brand">
          <div class="navbar-item">
            <div class="hero">
              <div class="columns is-vcentered is-mobile">
                <div class="column">
                  <span class="title" @click="navigateTitle">
                    <a style="color: #fff"> {{ Title }} </a>
                  </span>
                  <span style="margin-left: 20pt" class="subtitle">
                    {{ Subtitle }}
                    <slot name="subtitle"></slot>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
        <div id="navbar-menu" class="navbar-menus" :sclass="burgerClass">
          <div class="navbar-end" style="text-align: left">

            <div class="navbar-item">
              <b-field grouped>
                <slot></slot>

                <b-dropdown position="is-bottom-left">
                  <a class="button" slot="trigger">
                    <!-- <span>Menu</span> -->
                    <b-icon icon="menu"></b-icon>
                    <!-- <b-icon icon="menu-down"></b-icon> -->
                  </a>

                  <div v-if="loggedIn()">
                    <b-dropdown-item custom>
                      <p>Logged in as:</p>
                      <p><b>{{ short }}</b></p>
                    </b-dropdown-item>
                    <b-dropdown-item @click="$router.push( { name: 'Camp', params: { address: user().address } } )">
                        <b-icon icon="account"></b-icon>
                        <span class="menu-item-fix">Your camp</span>
                    </b-dropdown-item>
                    <b-dropdown-item @click="logout()">
                        <b-icon icon="logout"></b-icon>
                        <span class="menu-item-fix">Logout</span>
                    </b-dropdown-item>
                    <hr class="dropdown-divider">
                  </div>

                  <b-dropdown-item @click="$router.push('/')">
                      <b-icon icon="home"></b-icon>
                      <span class="menu-item-fix">Home</span>
                  </b-dropdown-item>
                  <b-dropdown-item @click="$router.push('/top')">
                      <b-icon icon="fire"></b-icon>
                      <span class="menu-item-fix">Top</span>
                  </b-dropdown-item>
                  <b-dropdown-item @click="$router.push('/random')">
                      <b-icon icon="dice-multiple"></b-icon>
                      <span class="menu-item-fix">Random</span>
                  </b-dropdown-item>
                  <b-dropdown-item @click="$router.push('/search')">
                      <b-icon icon="magnify"></b-icon>
                      <span class="menu-item-fix">Search</span>
                  </b-dropdown-item>

                  <hr class="dropdown-divider">

                  <b-dropdown-item @click="juungleClick()">
                      <b-icon icon="palm-tree"></b-icon>
                      <span class="menu-item-fix">Marketplace</span>
                  </b-dropdown-item>

                  <b-dropdown-item @click="telegramClick()">
                      <b-icon icon="send"></b-icon>
                      <span class="menu-item-fix">Waifu Research</span>
                  </b-dropdown-item>

                  <b-dropdown-item @click="noiseClick()">
                      <b-icon icon="alpha-n-box-outline"></b-icon>
                      <span class="menu-item-fix">noise.cash</span>
                  </b-dropdown-item>

                  <div v-if="!loggedIn()">
                    <hr class="dropdown-divider">
                    <b-dropdown-item custom paddingless>
                      <form @submit.prevent="login()">
                        <div class="modal-card" style="width:300px;">
                          <section class="modal-card-body">
                              <b-field label="Simpleledger Address">
                                <b-input v-model="auth.address" size="is-small"></b-input>
                              </b-field>

                              <b-field style="margin-top: 10pt;">
                                <p class="control">
                                  <b-button class="button" @click.prevent="login()">Login</b-button>
                                </p>
                              </b-field>
                          </section>
                        </div>
                      </form>
                    </b-dropdown-item>
                  </div>
                </b-dropdown>
              </b-field>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
import bchaddr from 'bchaddrjs-slp';

import { mapGetters } from 'vuex';
import * as Utils from '@/scripts/Utils';

  export default {
    name: 'Navbar',
    props: { title: { default: undefined },
             subtitle: { default: undefined},
           },

    data () {
      return {
        auth: { address: '' },
        burgerActive: false,
        Title: this.title || 'waifu.camp 🏕',
        Subtitle: this.subtitle || '',
      }
    },

    methods: {
      ...mapGetters([
        'user',
        'loggedIn'
      ]),

      navigateTitle() {
        this.$router.push("/");
      },

      faucetClick() {
        window.open("https://waifufaucet.com", "_blank");
      },

      juungleClick() {
        window.open("https://juungle.net", "_blank");
      },

      telegramClick() {
        window.open("https://t.me/waifuresearch", "_blank");
      },

      noiseClick() {
        window.open("http://noise.cash/n/waifu", "_blank");
      },

      getText(elementClassName) {
        return this.$el.getElementsByClassName(elementClassName).item(0).textContent.trim();
      },

      login() {
        if (!bchaddr.isValidAddress(this.auth.address)) {
          this.$buefy.snackbar.open({message: `Invalid simpleledger address`, type: 'is-warning', position: 'is-top-right'});
          return;
        }

        this.auth.address = bchaddr.toSlpAddress(this.auth.address);

        this.$store.commit('loginWithUser', { user: this.auth, token: "" });
        this.$router.push({ path: '/' });
      },

      logout() {
        this.$store.dispatch('logout');
        this.$router.push({ path: '/' });
      },
    },

    computed: {
      short() {
        const address = this.user() ? this.user().address : "";
        return Utils.addressToName(address);
      },

      burgerClass() {
        return this.burgerActive ? 'is-active' : '';
      },
    },
  }
</script>

<style lang="scss">
span.title {
  color: white; text-shadow: 0px 0px 4px #000000;
}

span.subtitle {
  color: white; text-shadow: 0px 0px 4px #000000;
}

div.navbar-menus {
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
  top: 0pt;
  right: 4pt;
  z-index: 100;
}

nav.navbar {
  background-color: #00000000;
}

.menu-item-fix {
  position: relative;
  top: -4px;
  margin-left: 5px;;
}
</style>