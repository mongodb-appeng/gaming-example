<template>
  <div id="app">
    <SmartNavBar />
    <router-view />
  </div>
</template>

<script>
import SmartNavBar from "./components/SmartNavBar.vue";
import Vue from "vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import Vuex from "vuex";
import VueFormGenerator from "vue-form-generator";
import vmodal from "vue-js-modal";

const config = require("config");

Vue.use(vmodal);
Vue.use(VueFormGenerator);
Vue.use(Buefy);
Vue.use(Vuex);

export default {
  name: config.get("appName"),
  components: {
    SmartNavBar
  }
};
</script>