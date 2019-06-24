import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
// 解决移动端300ms延迟
import fastclick from 'fastclick';
import VueLazyload from 'vue-lazyload';

import 'common/stylus/index.styl';

Vue.config.productionTip = false;

fastclick.attach(document.body);

Vue.use(VueLazyload, {
  loading: require('common/image/default.png'),
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
