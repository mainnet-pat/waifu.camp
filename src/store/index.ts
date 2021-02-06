import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: undefined,
    token: undefined,
    loggedIn: false,
  },
  getters: {
    user: state => {
      return state.user;
    },

    token: state => {
      return state.token;
    },

    loggedIn: state => {
      return state.loggedIn;
    },
  },
  mutations: {
    setUser (state, user) {
      state.user = user;
    },

    setToken (state, token) {
      state.token = token;
    },

    loginWithUser (state, payload) {
      state.user = payload.user;
      state.token = payload.token;
      state.loggedIn = true;

      window.localStorage.setItem('user', JSON.stringify(state.user));
      window.localStorage.setItem('token', payload.token);
    },

    logout (state) {
      state.user = undefined;
      state.token = undefined;
      state.loggedIn = false;

      window.localStorage.removeItem('user');
      window.localStorage.removeItem('token');
    },
  },
  actions: {
    logout (context) {
      context.commit('logout');
    },

    restoreState(context) {
      let user = JSON.parse(window.localStorage.getItem('user') || "") || undefined;
      let token = window.localStorage.getItem('token') || undefined;

      if (user) {
        context.commit('loginWithUser', { user: user, token: token, loggedIn: true });
      }
    },
  },
  modules: {}
});
