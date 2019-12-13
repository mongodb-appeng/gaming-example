/**
 * @file
 * Contains the Gamer Profile. Uses the game platform services
 */

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
import gps from '../../api/gps'

// initial state
const state = {
  gamerprofile:
  {
    image:
    {
      banner: "",
      avatar: ""
    }
  }
}

// getters
const getters = {
  getGamerProfile: (state) => {
    return state.gamerprofile
  },
  getGamerProfileId: (state) => {
    return state.gamerprofile.id
  }
}

// actions
const actions = {
  async clearGamerProfile({ commit }) {
    commit('SET_GAMERPROFILE', {
      image:
      {
        banner: "",
        avatar: ""
      }
    })
  },
  async loadGamerProfile({ commit, getters }, id) {
    return new Promise((resolve, reject) => {
      // if the requested id matches the id already loaded then skip call to gps and return success.
      // avoids another round trip to service
      /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
      console.log("GamerProfile id id", id, getters.getGamerProfileId)

      if (id === getters.getGamerProfileId) {
        resolve();
        return
      }
      gps.instance.get('/v1/gamerprofile/' + id)
        .then(response => {
          commit('SET_GAMERPROFILE', response.data)
          resolve();
        }, error => {
          reject(error);
        })
    })
  },

  async generateHandle() {
    return new Promise((resolve, reject) => {
      gps.instance.get('/v1/gamerhandle/') // returns a random gamer handle
        .then(response => {
          resolve(response.data.name);
        }, error => {
          reject("Oops, " + error);
        })
    })
  },

  async updateHandle({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      gps.instance.patch('/v1/gamerprofile/' + getters.getGamerProfileId, payload)
        .then(() => {
          commit('SET_HANDLE', payload.handle)
          resolve();
        }, error => {
          reject("Oops, " + error);
        })
    })
  },
  async updateAvatar({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      gps.instance.patch('/v1/gamerprofile/' + getters.getGamerProfileId, payload)
        .then(() => {
          commit('SET_AVATAR', payload.avatar)
          resolve();
        }, error => {
          reject("Oops, " + error);
        })
    })
  },
  async updateBanner({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      gps.instance.patch('/v1/gamerprofile/' + getters.getGamerProfileId, payload)
        .then(() => {
          commit('SET_AVATAR', payload.banner)
          resolve();
        }, error => {
          reject("Oops, " + error);
        })
    })
  }
}

// mutations
const mutations = {
  SET_GAMERPROFILE(state, payload) { state.gamerprofile = payload },
  SET_AVATAR(state, payload) { state.gamerprofile.image.avatar = payload },
  SET_HANDLE(state, payload) { state.gamerprofile.handle = payload },
  SET_BANNER(state, payload) { state.gamerprofile.image.banner = payload }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}