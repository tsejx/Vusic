import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// 解决移动端 300ms 延迟
import fastclick from 'fastclick';
import VueLazyload from 'vue-lazyload';
import { SET_PLAY_HISTORY, SET_FAVORITE_LIST } from './store/mutation-types';
import { loadPlay, loadFavorite } from 'common/js/cache';
import { injectSongUrl } from 'common/js/song';

import 'styles/index.styl';

Vue.config.productionTip = false;

fastclick.attach(document.body);

Vue.use(VueLazyload, {
  loading: require('assets/images/default.png'),
});

const historySongs = loadPlay();
injectSongUrl(historySongs).then(songs => {
  store.commit(SET_PLAY_HISTORY, songs);
});

const favoriteSongs = loadFavorite();
injectSongUrl(favoriteSongs).then(songs => {
  store.commit(SET_FAVORITE_LIST, songs);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
