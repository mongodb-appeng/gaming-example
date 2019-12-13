
/**
 * @file
 * Stitches the vue app with router and store
 * 
 * @author
 * MongoDB
 * 
 */

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import './main.scss'
import 'bulma/css/bulma.css'


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Vue.prototype.toJSON = function () {
  return this; //https://github.com/storybookjs/storybook/issues/6153#issuecomment-499404461
};
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
