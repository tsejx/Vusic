<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header';
import Tab from 'components/tab/tab';

export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>