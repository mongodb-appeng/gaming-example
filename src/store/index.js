/**
 * @file
 * Core Vuex <=> Game Platform Services logic
 */
import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import account from './modules/account'
import gameevent from './modules/gameevent'
import gamerprofile from './modules/gamerprofile'
import leaderboard from './modules/leaderboard'

import 'bulma/css/bulma.css';
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account,
    auth,
    gameevent,
    gamerprofile,
    leaderboard
  }
})