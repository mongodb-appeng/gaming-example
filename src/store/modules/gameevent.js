/**
 * @file
 * Contains the Game Event details. Uses the game platform services
 */

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import gps from '../../api/gps'

// initial state
const state = {
  noop: {}
}

// getters
const getters = {
}

// actions
const actions = {
  async saveEvents({ commit }, payload) {
    commit('NOOP', {})
    return new Promise((resolve, reject) => {

      if ( payload.gamerId === 'null' || payload.gamerId === 'undefined') {
        reject("Log in to save your score!");
        return
      }
      gps.instance.put('/v1/gameevent/', payload)
        .then(() => {
          resolve();
        }, error => {
          reject(error);
        })
    })
  }
}

// mutations
const mutations = {
  NOOP(state, payload) { state.noop = payload }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}