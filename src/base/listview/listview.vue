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
            @click="handleSingerSelect(item)"
            v-for="item of group.items"
            class="list-group-item"
            :key="item.id"
          >
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 字母导航栏 -->
    <div
      class="alphabet"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchmove"
      @touchend.stop
    >
      <ul>
        <li
          class="alphabet-item"
          v-for="(item, index) of alphabetNavigation"
          :class="{'current': currentIndex === index}"
          :data-index="index"
          :key="item"
        >{{item}}</li>
      </ul>
    </div>
    <div class="fixed" ref="fixed" v-show="fixedTitle">
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
import { getData } from 'utils';

const TITLE_HEIGHT = 30;
const ANCHOR_HEIGHT = 18;

export default {
  components: {
    Scroll,
    Loading,
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
    };
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
  created() {
    // 并不需要观察 touch 所以不放在 data
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  methods: {
    // 进入歌手详情页
    handleSingerSelect(item) {
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
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~styles/variable';

$header-background = linear-gradient(-225deg, #119865 0%, #A7DCBF 100%);

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $background-color;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      color: $white;
      font-size: $font-size-lg;
      font-weight: bold;
      background-image: $header-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border: 2px solid $white;
        border-radius: 50%;
        box-shadow: $shadow;
      }

      .name {
        margin-left: 20px;
        color: $text-color;
        font-size: $font-size-md;
        font-family: $font-family;
      }
    }
  }

  .alphabet {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: rgba($theme-color-sm, .3);
    font-family: Helvetica;

    .alphabet-item {
      padding: 3px;
      line-height: 1;
      color: $text-color;
      font-size: $font-size-sm;

      &.current {
        color: $theme-color;
        font-weight: bold;
      }
    }
  }

  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      color: $white;
      font-size: $font-size-lg;
      font-weight: bold;
      background-image: $header-background;
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