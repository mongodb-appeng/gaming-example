/**
 * @file
 * Contains the Auth Provider Module. Uses MongoDB Stitch as 3rd party provider
 */

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import gps from '../../api/gps'

import {
  Stitch,
  UserPasswordCredential,
  UserPasswordAuthProviderClient
} from "mongodb-stitch-browser-sdk"

const config = require('config')
const myAuthListener = {

  onUserLoggedIn: (auth, loggedInUser) => {

    var cache = [];
    const stringJSONUser = JSON.stringify(loggedInUser.auth.user, function (key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1 || key === 'jsdomWindow' || key === 'auth') { //jsdomWindow is nasty and don't need auth stuff as mostly redundant
          // Duplicate reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
    cache = null; // Enable garbage collection

    //modifying it to conform to account schema in the game platform services api
    const accountDocument = JSON.parse(stringJSONUser);

    console.log('onUserLoggedIn:', stringJSONUser)
    gps.instance.put('/v1/account/' + accountDocument.id, accountDocument)
      .then(function () {

      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
           } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
        } else {
          // Something happened in setting up the request that triggered an Error
        }
      });
  },
  onUserLoggedOut: (auth, loggedOutUser) => {
    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    console.log('onUserLoggedOut:', loggedOutUser.profile)
  },
};

// initial state
const state = {
  stitchClient: null,
  logInError: null
}

// getters
const getters = {
  getLogInError: (state) => {
    return state.logInError
  },
  getStitchClient: (state) => {
    return state.stitchClient
  },
  hasUserLoggedIn: (state, getters) => {
    return getters.hasStitchInitialized && state.stitchClient.auth.isLoggedIn
  },
  hasStitchInitialized: (state) => {
    return state.stitchClient && state.stitchClient !== 'null' && state.stitchClient !== 'undefined';
  },
  getLoggedUserId: (state, getters) => {
    if (getters.hasUserLoggedIn) {
      try {
        const { auth } = state.stitchClient
        const id = auth.user.id
        if (id && id !== 'null' && id !== 'undefined') {
          return id
        }
        return "foobar"
      } catch (error) {
        return "foobar"
      }
    }
    return "foobar"
  }
}

// actions
const actions = {
  async init({ commit, state }) {
    if (!state.hasStitchInitialized) {
      try {
        const s = Stitch.getAppClient(config.get('gamePlatformServices.appID'));
        commit('INIT', s)
      }
      catch {
        // The default client hasn't been set yet
        const s = Stitch.initializeDefaultAppClient(config.get('gamePlatformServices.appID'));
        commit('INIT', s)
      }
    }
  },
  async logout({ commit }) {
    commit('LOGOUT')
  },

  async login({ commit, dispatch }, payload) {
    await dispatch('init')
    return new Promise((resolve, reject) => {
      commit('LOGIN', new UserPasswordCredential(payload.email, payload.password))
      if (state.logInError === null) {
        resolve();
        return
      }
      reject(state.logInError);
    })

  },

  async register({ state, dispatch }, payload) {
    await dispatch('init')
    return new Promise((resolve, reject) => {
      const { auth } = state.stitchClient
      const emailPasswordClient = auth.getProviderClient(UserPasswordAuthProviderClient.factory, "userpass");
      emailPasswordClient.registerWithEmail(payload.email, payload.password).then(() => {
        resolve();
      }, error => {
        if (error.message && error.message !== null && error.message !== 'undefined') {
          reject(error.message);
          return
        }
        else {
          reject("Failed to register, try again later.")
          return
        }
      })
    })
  }
}

// mutations
const mutations = {
  INIT(state, payload) {
    state.stitchClient = payload;
    const { auth } = state.stitchClient
    auth.addAuthListener(myAuthListener)
    state.logInError = null
  },
  LOGOUT(state) {
    const { auth } = state.stitchClient
    auth.logout()
    state.logInError = null
  },
  LOGIN(state, payload) {

    const { auth } = state.stitchClient
    auth.loginWithCredential(payload)
      .then(() => {
        state.logInError = null
      })
      .catch(error => {
        state.logInError = error.message
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}