<template>
  <transition class="confirm-fade">
    <div class="confirm" v-show="visible" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div class="operate-btn left" @click="onCancel">{{cancelBtnText}}</div>
            <div class="operate-btn" @click="onConfirm">{{okBtnText}}</div>
          </div>
        </div>
      </div>
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
    text: {
      type: String,
      default: '',
    },
    okBtnText: {
      type: String,
      default: '确定',
    },
    cancelBtnText: {
      type: String,
      default: '取消',
    },
  },
  methods: {
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
    onCancel() {
      this.hide();
      this.$emit('cancel');
    },
    onConfirm() {
      this.hide();
      this.$emit('confirm');
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~styles/variable';

.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 998;
  background-color: $mask-background-color-dark;

  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.3s;

    .confirm-content {
      animation: confirm-zoom 0.3s;
    }
  }

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;

    .confirm-content {
      width: 270px;
      border-radius: 13px;
      background: $white;

      .text {
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        color: $text-color;
        font-size: $font-size-lg;
        font-family: $font-family;
        font-weight: bold;
      }

      .operate {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: $font-size-lg;
        font-family: $font-family;

        .operate-btn {
          flex: 1;
          line-height: 22px;
          padding: 10px 0;
          border-top: 1px solid $gray-500;
          color: $text-color;

          &.left {
            border-right: 1px solid $gray-500;
          }
        }
      }
    }
  }
}

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes confirm-zoom {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>