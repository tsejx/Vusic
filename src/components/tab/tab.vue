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
@import '~common/stylus/variable.styl';

.tab {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-base;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-text {
      padding-bottom: 5px;
      font-family: $font-family;
      font-weight: bold;
    }

    &.router-link-active {
      .tab-text {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>

