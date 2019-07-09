<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item, index) in dots"
        :key="index"
        :class="{active: currentIndex === index}"
      ></span>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import BScroll from 'better-scroll';
import { addClass } from 'common/js/dom';
import { setTimeout, clearTimeout } from 'timers';
export default {
  data() {
    return {
      dots: [],
      currentIndex: 0,
    };
  },
  props: {
    loop: {
      type: Boolean,
      default: true,
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 4000,
    },
  },
  mounted() {
    setTimeout(() => {
      this.setSliderWidth();
      this.initDots();
      this.initSlider();

      if (this.autoPlay) {
        this.onAutoPlay();
      }
    }, 20);

    window.addEventListener('resize', () => {
      if (!this.slider || !this.slider.enabled) {
        return;
      }
      // clearTimeout(this.resizeTimer)
      this.setSliderWidth(true);
      this.slider.refresh();
    });
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;

      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, 'slider-item');

        child.style.width = sliderWidth + 'px';
        width += sliderWidth;
      }

      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + 'px';
    },
    initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400,
        },
      });

      this.slider.on('scrollEnd', this.onScrollEnd);
    },
    initDots() {
      this.dots = new Array(this.children.length);
    },
    onScrollEnd() {
      let pageIndex = this.slider.getCurrentPage().pageX;
      this.currentIndex = pageIndex;
      if (this.autoPlay) {
        clearTimeout(this.timer);
        this.onAutoPlay();
      }
    },
    onAutoPlay() {
      let pageIndex = this.currentIndex + 1;
      if (this.loop) {
        pageIndex += 1;
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400);
      }, this.interval);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~styles/variable';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    transform: translateZ(1px);
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
