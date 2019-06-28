<template>
  <scroll
    class="listview"
    ref="listview"
    :data="data"
    :listen-scroll="listenScroll"
    :probe-type="probeType"
    @scroll="scroll"
  >
    <ul>
      <li v-for="(group, index) of data" class="list-group" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
            @click="onSelectItem(item)"
            v-for="item of group.items"
            class="list-group-item"
            :key="item.id"
          >
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchmove"
      @touchend.stop
    >
      <ul>
        <li
          v-for="(item, index) of alphabetNavigation"
          class="item"
          :data-index="index"
          :key="index"
          :class="{'current': currentIndex === index}"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { getData } from 'common/js/dom';

const TITLE_HEIGHT = 30;
const ANCHOR_HEIGHT = 18;

export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    // 字母锚点导航
    alphabetNavigation() {
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    },
    // 滚动固定标题
    fixedTitle() {
      if (this.scrollY > 0) {
        return '';
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
    },
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
    };
  },
  created() {
    // 并不需要观察 touch 所以不放在 data
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  methods: {
    onSelectItem(item) {
      this.$emit('select', item);
    },
    onShortcutTouchStart(e) {
      const anchorIndex = getData(e.target, 'index');
      const firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;

      this.handleScrollTo(anchorIndex);
    },
    onShortcutTouchmove(e) {
      const firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;

      this.handleScrollTo(anchorIndex);
    },
    refresh() {
      this.$refs.listview.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    handleScrollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 500);
      this.scrollY = this.$refs.listview.scroll.y;
    },
    calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    refresh() {
      this.$refs.listview.refresh();
    },
  },
  watch: {
    data() {
      setTimeout(() => {
        this.calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop = newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    },
  },
  components: {
    Scroll,
    Loading,
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-sm;
      color: $color-text-l;
      background: $color-highlight-bg;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-md;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-sm;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-sm;
      color: $color-text-l;
      background: $color-highlight-bg;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>