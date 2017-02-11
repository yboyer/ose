// @flow

import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Board from './components/Board/Board.vue';

export const router = new VueRouter({
  mode: 'history',
  routes: [
    {path: '/', name: 'board', component: Board}
  ]
});
