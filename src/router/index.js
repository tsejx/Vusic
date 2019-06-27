import Vue from 'vue';
import Router from 'vue-router';

// import Recommend from 'components/recommend/recommend';
import Rank from 'components/rank/rank';
import Search from 'components/search/search';
import Singer from 'components/singer/singer';
// import SingerDetail from 'components/singer-detail/singer-detail'
import Playlist from 'components/playlist/playlist';

// 注册vue-router插件
Vue.use(Router);

const Recommend = () => import('components/recommend/recommend');
const SingerDetail = () => import('components/singer-detail/singer-detail');

export default new Router({
  routes: [
    {
      path: '/',
      redict: '/recommend',
    },
    {
      name: 'recommend',
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Playlist,
        },
      ],
    },
    {
      name: 'singer',
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail,
        },
      ],
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
  ],
});
