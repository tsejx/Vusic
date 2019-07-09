<template>
  <div class="loading">
    <div class="loading-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...',
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~styles/variable';

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 90vh;
  text-align: center;

  .desc {
    line-height: 20px;
    color: $theme-color;
    font-size: $font-size;
    font-family: $font-family;
  }
}

.loading-ellipsis {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}

.loading-ellipsis div {
  position: absolute;
  top: 27px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: $theme-color;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.loading-ellipsis div:nth-child(1) {
  left: 6px;
  animation: loading-ellipsis1 0.6s infinite;
}

.loading-ellipsis div:nth-child(2) {
  left: 6px;
  animation: loading-ellipsis2 0.6s infinite;
}

.loading-ellipsis div:nth-child(3) {
  left: 26px;
  animation: loading-ellipsis2 0.6s infinite;
}

.loading-ellipsis div:nth-child(4) {
  left: 45px;
  animation: loading-ellipsis3 0.6s infinite;
}

@keyframes loading-ellipsis1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes loading-ellipsis3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes loading-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(19px, 0);
  }
}
</style>
