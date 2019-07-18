<template>
  <div class="progress-bar" ref="progressBar" @click="onProgressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="onTouchStart"
        @touchove.prevent="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { prefixStyle } from 'utils';

const progressBtnWidth = 16;
const transform = prefixStyle('transform');

export default {
  props: {
    percent: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const offsetWidth = newPercent * barWidth;
        this.$refs.progress.style.width = `${offsetWidth}px`;
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
      }
    },
  },
  created() {
    this.touch = {};
  },
  methods: {
    onTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    onTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      // 纵向偏移量
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + deltaX)
      );
      this._handleProgressOffset(offsetWidth);
      this.$emit('changing', this._getPercent())
    },
    onTouchEnd() {
      this.touch.initiated = false;
      this._handlerTriggerPercent();
    },
    onProgressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      this._handleProgressOffset(offsetWidth);
      // this._handleProgressOffset(e.offsetX);
      this._handlerTriggerPercent();
    },
    _handlerTriggerPercent() {
      this.$emit('change', this._getPercent());
    },
    _handleProgressOffset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
    },
    _getPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      return this.$refs.progress.clientWidth / barWidth;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~styles/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $theme-color;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 2px solid $theme-color-sm;
        border-radius: 50%;
        background: $theme-color;
      }
    }
  }
}
</style>