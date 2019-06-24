import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 解决移动端300ms延迟
import fastclick from 'fastclick'

import 'common/stylus/index.styl'

Vue.config.productionTip = false

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
})