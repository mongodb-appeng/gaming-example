<template>
  <div class="profile">
    <div v-if="hasUserLoggedIn">
      <section>
        <b-loading
          :is-full-page="isFullPage"
          :active.sync="isLoading"
          :can-cancel="false"
        />
      </section>
      <hr>
      <nav class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">
              Overall Completion
            </p>
            <p
              v-if="gamerprofile.stats"
              class="title"
            >
              {{ gamerprofile.stats.overall.completionRatePercentage || 'N/A' }}
              &nbsp; <i class="title fas fa-percent fa-fw" />
            </p>
            <p
              v-else
              class="title"
            >
              N/A <i class="title fas fa-percent fa-fw" />
            </p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">
              Hours Played
            </p>
            <p
              v-if="gamerprofile.stats"
              class="title"
            >
              {{ gamerprofile.stats.overall.playTime || 'N/A' }} &nbsp; <i
                class="title fas fa-user-clock fa-fw"
              />
            </p>
            <p
              v-else
              class="title"
            >
              N/A <i class="title fas fa-user-clock fa-fw" />
            </p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">
              Games Played
            </p>
            <p
              v-if="gamerprofile.games"
              class="title"
            >
              {{ gamerprofile.games.length || 'N/A' }} &nbsp; <i
                class="title fas fa-gamepad fa-fw"
              />
            </p>
            <p
              v-else
              class="title"
            >
              N/A <i class="title fas fa-gamepad fa-fw" />
            </p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">
              Achievements Unlocked
            </p>
            <p
              v-if="gamerprofile.achievements"
              class="title"
            >
              {{ gamerprofile.achievements.length || 'N/A' }} &nbsp; <i
                class="title fas fa-unlock fa-fw"
              />
            </p>
            <p
              v-else
              class="title"
            >
              N/A <i class="title fas fa-unlock fa-fw" />
            </p>
          </div>
        </div>
      </nav>
      <section class="hero is-small is-bold ">
        <div class="hero-body">
          <div class="container">
            <h1 class="title ">
              <figure class=" image is-3by1  ">
                <img
                  class="is-rounded"
                  :src="gamerprofile.image.banner"
                >
              </figure>
            </h1>
            <h1 class="title is-overlay">
              <figure class="image is-128x128">
                <img
                  class="is-rounded"
                  :src="gamerprofile.image.avatar"
                >
              </figure>
              <a
                class="button is-link"
                @click="cardModal"
              >
                <p>{{ gamerprofile.handle || 'update profile' }}</p>
              </a>
            </h1>
          </div>
        </div>
      </section>
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">
              <span class="icon">
                <i class="fas fa-chart-line fa-fw" />
              </span>&nbsp; &nbsp; &nbsp; Leaderboards
            </p>
            <p class="subtitle">
              You appear in NUMBER leaderboards
            </p>
            <div class="content">
              <p> Showing your top 10 </p>
              <a class="button">
                <span>View All</span>
              </a>
            </div>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">
              <span class="icon">
                <i class="fas fa-trophy fa-fw" />
              </span> &nbsp; &nbsp; &nbsp; Achievements
            </p>
            <p class="subtitle">
              PERCENT % Completed
            </p>
            <div class="content">
              <p> Showing 10 most recent </p>
              <a class="button">
                <span>View All</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </div>
    <AccessDenied v-else />
  </div>
</template>

<script>
import AccessDenied from '../components/modals/AccessDenied.vue'
import UpdateGamerModal from '../components/modals/UpdateGamer.vue'
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'Stats',
  components: {
    AccessDenied,
    UpdateGamerModal
  },
  data() {
    return {
      isLoading: false,
      isFullPage: true
    }
  },
  computed: {
    ...mapGetters('auth', {
      hasUserLoggedIn: 'hasUserLoggedIn',
      getLoggedUserId: 'getLoggedUserId'
    }),
    ...mapGetters('account', { getAccountId: 'getAccountId' }),
    ...mapGetters('gamerprofile', { gamerprofile: 'getGamerProfile' })
  },
  created() {
    this.closeLoading()
    if (this.hasUserLoggedIn) {  // most likely a no-op
      this.openLoading()
      this.loadAccount(this.getLoggedUserId).then(() => {
        this.loadGamerProfile(this.getAccountId).then(() => {
          this.closeLoading()
        }).catch(error => {
          this.errorMsg(String(error))
          this.closeLoading()
        })
      }).catch(error => {
        this.errorMsg(String(error))
        this.closeLoading()
      })
    }
  },
  methods: {
    ...mapActions('gamerprofile', [
      'loadGamerProfile'
    ]),
    ...mapActions('account', ['loadAccount']),
    cardModal() {
      this.$buefy.modal.open({
        parent: this,
        component: UpdateGamerModal,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        canCancel: true
      })
    },
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
    },
    refreshData() {
      this.errorMsg("Ooops, not yet implemented")
    }
  }
}

</script>