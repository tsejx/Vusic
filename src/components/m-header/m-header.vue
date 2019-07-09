<template>
  <div class="m-header">
    <div class="icon"></div>
    <!-- <h1 class="header-title">Vusic</h1> -->
    <router-link to="/profile" class="profile" tag="div">
      <i class="icon-profile"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'm-header',
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~styles/variable';
@import '~styles/mixin';

.m-header {
  position: relative;
  height: 44px;
  text-align: center;
  color: $;
  font-size: 0;

  .icon {
    display: inline-block;
    vertical-align: top;
    width: 96px;
    height: 32px;
    margin-top: 6px;
    margin-right: 9px;
    bg-image('copyright');
    background-size: 96px 32px;
  }

  .header-title {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-xxl;
    font-weight: bold;
  }

  .profile {
    position: absolute;
    top: 0;
    right: 0;

    .icon-profile {
      display: block;
      padding: 12px;
      font-size: 20px;
      color: $;
    }
  }
}
</style>

