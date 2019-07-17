<template>
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <!-- 路由匹配到的组件将渲染在这里 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import Tab from 'components/tab/tab';
import Player from 'components/player/player';
import MHeader from 'components/m-header/m-header';

export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
// .slide-fade-enter-active {
//   transition: all 0.3s ease;
// }

// .slide-fade-leave-active {
//   transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
// }

// .slide-fade-enter, .slide-fade-leave-to {
//   transform: translateX(10px);
//   opacity: 0;
// }
</style>