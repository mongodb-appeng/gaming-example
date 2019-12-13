/**
 * @file
 * Contains the Leaderboards. Uses the game platform services.
 */
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import gps from '../../api/gps'

// initial state
const state = {
  leaderboards: []
}

// getters
const getters = {
  getLeaderboards: (state) => {
    return state.leaderboards
  },
  getLeaderboardId: (state) => {
    try {
      return state.leaderboards[0].gameId
    } catch (error) {
      return ""
    }
  }
}

// actions
const actions = {
  async clearLeaderboards({commit}) {
    commit('SET_LEADERBOARDS', [])
  },
  async loadLeaderboards({ commit, getters }, id) {
    return new Promise((resolve, reject) => {
      // if the requested id matches the id already loaded then skip call to gps and return success.
      // avoids another round trip to service
      /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
      console.log("Leaderboard id id", id, getters.getLeaderboardId)
      if (id === getters.getLeaderboardId) {
        resolve();
        return
      }
      gps.instance.get('/v1/leaderboard/findByGameID/' + id)
        .then(response => {
          commit('SET_LEADERBOARDS', response.data)
          resolve();
        }, error => {
          reject(error);
        })
    })
  }

  // async loadTotalCounts({ commit }) {
  //   await gps.instance.get('/v1/leaderboard/count?gameId=ttt')
  //     .then(function (response) {
  //       commit('SET_TOTALSCOUNT', response.data)
  //     })
  //     .catch(function (error) {
  //       /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
  //       console.log("GET leaderboards err ", error);
  //     });
  // },
  // async loadUserCounts({ commit }, id) {
  //   await gps.instance.get('/v1/leaderboard/count?gameId=ttt&gamerId=' + id)
  //     .then(function (response) {
  //       commit('SET_USERSCOUNT', response.data)
  //     })
  //     .catch(function (error) {
  //       /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
  //       console.log("GET leaderboards err ", error);
  //     });
  // }


}

// mutations
const mutations = {
  SET_LEADERBOARDS(state, payload) { state.leaderboards = payload }
  // SET_TOTALSCOUNT(state, payload) { state.count.total = payload },
  // SET_USERSCOUNT(state, payload) { state.count.user = payload }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}