import Vue from 'vue';
import Router from 'vue-router';
import Recommend from 'components/recommend/recommend';
import Rank from 'components/rank/rank';
import Search from 'components/search/search';
import Singer from 'components/singer/singer';

// 注册vue-router插件
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redict: '/recommend',
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank,
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
    },
  ],
});
