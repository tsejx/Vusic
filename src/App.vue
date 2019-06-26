<template>
  <div id="app">
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
import MHeader from 'components/m-header/m-header';
import Tab from 'components/tab/tab';
import Player from 'components/player/player'

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
</style>