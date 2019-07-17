<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-text">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-text">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-text">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-text">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {};
</script>

<style scope lang="stylus" rel="stylesheet/stylus">
@import '~styles/variable.styl';

.tab {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-text {
      padding-bottom: 5px;
      color: $text-color;
      font-family: $font-family;
      font-weight: bold;
    }

    &.router-link-active {
      .tab-text {
        color: $theme-color;
        border-bottom: 2px solid $theme-color;
      }
    }
  }
}
</style>

