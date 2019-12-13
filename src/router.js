import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Leaderboard from './components/Leaderboard.vue'
import Gamer from './components/GamerStats.vue'
import Account from './components/Account.vue'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: true
    },
    {
      path: '/stats',
      name: 'stats',
      component: Gamer,
      props: true
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
      props: true
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: Leaderboard,
      props: true
    }
  ]
})
