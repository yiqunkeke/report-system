import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import app from './modules/app';
import settings from './modules/settings';
import user from './modules/user';
import composing from './modules/composing';
import permission from './modules/permission';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    composing,
    permission
  },
  getters
});

export default store;
