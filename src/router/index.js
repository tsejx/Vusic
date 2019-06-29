import Vue from 'vue';
import Router from 'vue-router';

// 注册vue-router插件
Vue.use(Router);

const Recommend = () => import('components/recommend/recommend');
const SingerDetail = () => import('components/singer-detail/singer-detail');
const Rank = () => import('components/rank/rank');
const Search = () => import('components/search/search');
const Singer = () => import('components/singer/singer');
const SongList = () => import('components/song-list/song-list');
const RankList = () => import('components/rank-list/rank-list');
const Profile = () => import('components/profile/profile');

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend',
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
      component: Profile,
    },
  ],
});
