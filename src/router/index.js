import Vue from 'vue';
import Router from 'vue-router';

// import Recommend from 'components/recommend/recommend';
import Rank from 'components/rank/rank';
import Search from 'components/search/search';
import Singer from 'components/singer/singer';
// import SingerDetail from 'components/singer-detail/singer-detail'
import SongList from 'components/song-list/song-list';
import RankList from 'components/rank-list/rank-list';
import Profile from 'components/profile/profile';

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
          name: 'song-list',
          component: SongList,
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
          name: 'singer-detail',
          component: SingerDetail,
        },
      ],
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank,
      children: [
        {
          path: ':id',
          name: 'rank-list',
          component: RankList,
        },
      ],
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
    },
    {
      path: '/profile',
      component: Profile
    }
  ],
});
