<template>
  <div>
    <section>
      <b-loading :is-full-page="isFullPage" :active.sync="isLoading" :can-cancel="false"></b-loading>
    </section>

    <section class="hero is-dark" v-for="(leaderboard, lbIndex) in leaderboards" :key="lbIndex">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            <p v-if="leaderboard.name">
              <span class="icon is-large">
                <i class="fas fa-chart-line "></i>
              </span> &nbsp;
              {{ leaderboard.name || 'N/A' }}
            </p>
            <p v-else>
              <span class="icon is-large">
                <i class="fas fa-chart-line "></i>
              </span> &nbsp; N/A
            </p>
          </h1>
          <!-- <h2 class="subtitle">
                Updates every two minutes
              </h2> -->

          <div class="columns ">
            <div class="column" v-for="(data, dIndex) in leaderboard.data" :key="dIndex">
              <p class="notification is-info">{{ data._id || "TITLE" }}</p>
              <table class="table" align="center">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(player, pIndex) in data.players" :key="pIndex">
                    <td>&nbsp; {{pIndex + 1}}</td>
                    <td>&nbsp; {{player.gamerId || "HANDLE"}}</td>
                    <td>&nbsp; {{player.score || "SCORE"}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  export default {
    name: 'leaderboard',
    data() {
      return {
        isLoading: false,
        isFullPage: true
      }
    },
    computed: {
      ...mapGetters('leaderboard', { leaderboards: 'getLeaderboards' }),
    },
    methods: {
      ...mapActions('leaderboard', ['loadLeaderboards']),
      infoMsg(msg) {
        if (typeof msg !== "string") {
          return
        }
        this.$buefy.toast.open({
          duration: 5000,
          message: msg,
          type: 'is-info',
          position: 'is-bottom-left'
        })
      },
      errorMsg(msg) {
        if (typeof msg !== "string") {
          return
        }
        this.$buefy.toast.open({
          duration: 5000,
          message: msg,
          type: 'is-danger',
          position: 'is-bottom-left'
        })
      },
      openLoading() {
        this.isLoading = true
      },
      closeLoading() {
        this.isLoading = false
      }
    },
    created() {

      // TODO - view  my own leaderboards ? here? 
      // if (this.hasUserLoggedIn) {
      //   this.openLoading()
      //   setTimeout(() => {
      //     this.loadAccount(this.getLoggedUserId).then(() => {
      //       this.loadGamerProfile(this.getAccountId).then(resp => {
      //         this.closeLoading()
      //       }).catch(error => {
      //         this.errorMsg(error)
      //         this.closeLoading()
      //       })
      //     }).catch(error => {
      //       this.errorMsg(error)
      //       this.closeLoading()
      //     })
      //   }, 10000);
      // }


      this.openLoading()
      this.loadLeaderboards('ttt').then(() => {
        this.closeLoading()
      }).catch(error => {
        this.errorMsg(String(error))
        this.closeLoading()
      })
    }
  }


</script>