<template>
  <transition name="drop">
    <div class="notification" v-show="visible" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  props: {
    delay: {
      type: Number,
      default: 2000,
    }
  },
  methods: {
    show() {
      this.visible = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    hide() {
      this.visible = false
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~styles/variable';

.notification{
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 500;
  background: $theme-color;

  &.drop-enter-active, &.drop-leave-active {
    transition: all 0.3s;
  }

  &.drop-enter, &.drop-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}
</style>