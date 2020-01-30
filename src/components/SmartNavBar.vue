<template>
  <nav
    class="navbar is-warning "
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a
        class="navbar-item has-text-weight-bold"
        @click="etGoHome"
      >
        <img src="../assets/MongoDB_Logo_Black_RGB.png"> &nbsp; Humongous Microgames &nbsp;
      </a>

      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>
    <div
      id="navbarBasicExample"
      class="navbar-menu"
    >
      <div class="navbar-start">
        <a
          class="navbar-item"
          @click="etGoHome"
        >
          <i class="fas fa-home fa-fw" />&nbsp; Home
        </a>
        <a
          class="navbar-item"
          @click="toptoptop"
        >
          <i class="fas fa-chart-line fa-fw" /> &nbsp; Leaderboards
        </a>
      </div>
    </div>
    <div class="navbar-end">
      <div
        v-if="!hasUserLoggedIn"
        class="navbar-item "
      >
        <button
          class="button is-primary is-medium"
          @click="cardModal"
        >
          <i class="fas fa-sign-in-alt" />&nbsp; SIGN IN
        </button>
      </div>

      <div
        v-if="hasUserLoggedIn"
        class="navbar-item has-dropdown is-hoverable"
      >
        <a class="navbar-link ">
          <i class="fas fa-user-circle" />&nbsp; &nbsp; {{ gamerprofile.handle || 'PLAYER' }}
        </a>
        <div class="navbar-dropdown">
          <a
            class="navbar-item"
            @click="mygamerprofile"
          >
            <i class="fas fa-star fa-fw" />&nbsp; Stats
          </a>
          <a
            class="navbar-item"
            @click="myaccount"
          >
            <i class="fas fa-id-card fa-fw" />&nbsp; Account
          </a>
          <hr class="navbar-divider">
          <a
            class="navbar-item"
            @click="clearAndLogout"
          >
            <i class="fas fa-sign-out-alt fa-fw" />&nbsp; LOG OUT
          </a>
        </div>
      </div>
      <div class="navbar-item ">
        <button
          class="button is-small is-warning  is-inverted"
          @click="forceRefresh"
        >
          <i class="fas fa-sync" />
        </button>
      </div>
    </div>
  </nav>
</template>
<script>
import LoginModal from "../components/modals/Login.vue"
import { mapGetters, mapActions } from 'vuex'
export default {
  name: "SmartNavBar",
  components: {
    LoginModal
  },
  data() {
    return {
      isLoading: false,
      isFullPage: true
    }
  },
  computed: {
    ...mapGetters('auth', {
      hasStitchInitialized: 'hasStitchInitialized',
      hasUserLoggedIn: 'hasUserLoggedIn',
      getLoggedUserId: 'getLoggedUserId'
    }),
    ...mapGetters('account', {
      getAccountId: 'getAccountId'
    }),
    ...mapGetters('gamerprofile', {
      gamerprofile: 'getGamerProfile'
    })
  },
  created() {
    this.closeLoading()
    if (!this.hasStitchInitialized) {
      this.openLoading()
      this.$store.dispatch('auth/init').then(() => {
        this.closeLoading()
      }).catch(error => {
        this.errorMsg(String(error))
        this.closeLoading()
      })
    }
    this.loadAll()
  },
  methods: {
    ...mapActions('gamerprofile', [
      'loadGamerProfile',
      'clearGamerProfile'
    ]),
    ...mapActions('auth', [
      'logout'
    ]),
    ...mapActions('account', [
      'loadAccount',
      'clearAccount'
    ]),
    ...mapActions('leaderboard', [
      'loadLeaderboards',
      'clearLeaderboards'
    ]),

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
    cardModal() {
      this.$buefy.modal.open({
        parent: this,
        component: LoginModal,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        canCancel: true
      })
    },
    toptoptop() {
      this.$router.push({ name: 'leaderboard' }).catch(() => { })
    },
    etGoHome() {
      this.$router.push({ name: 'home' }).catch(() => { })
    },
    mygamerprofile() {
      this.$router.push({ name: 'stats' }).catch(() => { })
    },
    myaccount() {
      this.$router.push({ name: 'account' }).catch(() => { })
    },
    clearAll() {
      this.clearLeaderboards()
      this.clearAccount()
      this.clearGamerProfile()

    },
    loadAll() {
      if (this.hasUserLoggedIn) {
        setTimeout(() => {
          this.loadAccount(this.getLoggedUserId).then(() => {
            this.loadGamerProfile(this.getAccountId).then(() => {
            }).catch(error => {
              this.errorMsg(String(error))
            })
          }).catch(error => {
            this.errorMsg(String(error))
          })
        }, 10000);
      }

      this.loadLeaderboards('ttt')
        .catch(error => {
          this.errorMsg(String(error))
        })
    },
    forceRefresh() {
      this.clearAll()
      this.loadAll()
    },
    clearAndLogout() {
      this.clearAll()
      this.logout()
    }
  }
}
</script>