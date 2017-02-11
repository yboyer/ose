// @flow

import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
import {router} from './app/app.routes';
import AppRoot from './app/app.component.vue';
Vue.config.ignoredElements = ['app-root'];

export default new Vue({
  el: 'app-root',
  router,
  components: {
    AppRoot
  },
  render: h => h('app-root')
});
