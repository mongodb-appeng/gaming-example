/**
 * @file
 * Contains the User Account detais. Uses the game platform services
 */
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import gps from '../../api/gps'

// initial state
const state = {
  account: {}
}


// getters
const getters = {
  getAccount: (state) => {
    return state.account
  },
  getAccountId: (state) => {
    return state.account.id
  }

}

// actions
const actions = {
  async clearAccount({ commit }) {
    commit('SET_ACCOUNT', {})
  },
  async loadAccount({ commit, getters }, id) {
    return new Promise((resolve, reject) => {
      // if the requested id matches the id already loaded then skip call to gps and return success.
      // avoids another round trip to service

      /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
      console.log("Account id id", id, getters.getAccountId)

      if (id === getters.getAccountId) {
        resolve();
        return
      }
      gps.instance.get('/v1/account/' + id)
        .then(response => {
          commit('SET_ACCOUNT', response.data)
          resolve();
        }, error => {
          reject(error);
        })
    })
  },

  async updateAccount({ getters }, payload) {
    return new Promise((resolve, reject) => {
      gps.instance.patch('/v1/account/' + getters.getAccountId, payload)
        .then(() => {
          // commit('SET_ACCOUNT', response.data)
          resolve();
        }, error => {
          reject(error);
        })
    })
  }

}

// mutations
const mutations = {
  SET_ACCOUNT(state, payload) { state.account = payload }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}