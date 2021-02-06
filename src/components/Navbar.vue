<template>
  <div>
    <nav class="navbar is-primary" role="navigation" aria-label="dropdown navigation"
      v-on:update:title="updateTitle($event)"
      v-on:update:subtitle="updateSubtitle($event)">
      <div class="container">
        <div class="navbar-brand">
          <div class="navbar-item">
            <div class="hero is-primary">
              <div class="columns is-vcentered is-mobile">
                <div class="column">
                  <span class="title" @click="navigateTitle">
                    <a style="color: #fff"> {{ Title }} 🏕</a>
                  </span>
                  <span style="margin-left: 10pt" class="subtitle">
                    {{ Subtitle }}
                    <slot name="subtitle"></slot>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="navbar-burger burger" style="margin-top:12.5px;" :class="burgerClass" data-target="navbar-menu" @click="burgerActive = !burgerActive">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navbar-menu" class="navbar-menu" :class="burgerClass">
          <div class="navbar-end" style="text-align: left">

            <div class="navbar-item">
              <b-field grouped>
                <slot></slot>

                <b-dropdown position="is-bottom-left" v-if="loggedIn()">
                  <a class="is-primary button" slot="trigger">
                    <span>Menu</span>
                    <b-icon icon="menu-down"></b-icon>
                  </a>

                  <b-dropdown-item custom>
                    <p>Logged in as:</p>
                    <p><b>{{ short }}</b></p>
                  </b-dropdown-item>
                  <hr class="dropdown-divider">
                  <b-dropdown-item @click="$router.push('/')">
                      <b-icon icon="home"></b-icon>
                      Home
                  </b-dropdown-item>
                  <b-dropdown-item @click="$router.push( { name: 'Camp', params: { address: user().address } } )">
                      <b-icon icon="account"></b-icon>
                      Your camp
                  </b-dropdown-item>
                  <b-dropdown-item @click="logout()">
                      <b-icon icon="logout"></b-icon>
                      Logout
                  </b-dropdown-item>
                </b-dropdown>

                <b-dropdown position="is-bottom-left" v-else>
                  <a class="is-primary button" slot="trigger">
                    <span>Login</span>
                    <b-icon icon="menu-down"></b-icon>
                  </a>

                  <b-dropdown-item custom paddingless>
                    <form @submit.prevent="login()">
                      <div class="modal-card" style="width:300px;">
                        <section class="modal-card-body">
                            <b-field label="Simpleledger Address">
                              <b-input v-model="auth.address" size="is-small"></b-input>
                            </b-field>

                            <b-field style="margin-top: 10pt;">
                              <p class="control">
                                <b-button class="button is-primary" @click.prevent="login">Login</b-button>
                              </p>
                            </b-field>
                        </section>
                      </div>
                    </form>
                  </b-dropdown-item>
                </b-dropdown>
              </b-field>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import bchaddr from 'bchaddrjs-slp';

import { mapGetters } from 'vuex';

  export default {
    name: 'Navbar',
    props: { title: { default: undefined },
             subtitle: { default: undefined},
           },

    data () {
      return {
        auth: { address: '' },
        burgerActive: false,
        Title: this.title,
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
        if (address.indexOf(":")>0) {
          return address.split(':')[1].substring(0, 4) + "-San";
        } else {
          return address.substring(0, 4) + "-San";
        }
      },

      burgerClass() {
        return this.burgerActive ? 'is-active' : '';
      },
    },
  }
</script>

<style>
.navbar-menu {
  background-color: rgba(0, 0, 0, 0);
}

.navbar.is-primary {
    background-color: #7957d5;
}
</style>