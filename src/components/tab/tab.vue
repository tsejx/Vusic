<template>
  <div class="tab-wrapper">
    <ul class="tab-list">
      <router-link
        tag="li"
        ref="li"
        class="tab-item"
        v-for="(router, index) in tabOptions"
        v-bind:key="router.to"
        :to="router.to"
        @click.native="activeChild(index)"
      >
        <span class="tab-text">{{router.title}}</span>
      </router-link>
    </ul>
    <span :style="stylex" class="tab-line" />
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data: () => ({
    value: 0,
    widthx: 60,
    heightx: 2,
    topx: 'auto',
    leftx: 0,
    activeIndex: 0,
    tabOptions: [
      {
        title: '推荐',
        to: '/recommend',
      },
      {
        title: '歌手',
        to: '/singer',
      },
      {
        title: '排行',
        to: '/rank',
      },
      {
        title: '搜索',
        to: '/search',
      },
    ],
  }),
  computed: {
    stylex() {
      return {
        left: `${this.leftx}px`,
        width: `${this.widthx}px`,
        height: `${this.heightx}px`,
        background: 'linear-gradient(30deg, rgb(65,184,131) 0%, rgba(65,184,131,0.5) 100%)',
        boxShadow: '0px 0px 8px 0px rgba(65,184,131,0.5)',
        transform: 'scaleX(1)',
      };
    },
  },
  mounted() {
    this.widthx = this.$refs.li[0].$el.offsetWidth;
  },
  methods: {
    activeChild(index) {
      const elem = this.$refs.li[index].$el;
      this.widthx = elem.offsetWidth;
      this.leftx = elem.offsetLeft;
    },
  },
};
</script>

<style scope lang="stylus" rel="stylesheet/stylus">
@import '~styles/variable.styl';

.tab-wrapper {
  height: 46px;

  .tab-list {
    display: flex;
    height: 40px;
    line-height: 40px;
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
          // border-bottom: 2px solid $theme-color;
        }
      }
    }
  }

  .tab-line {
    display: block;
    position: absolute;
    width: 60px;
    height: 2px;
    transition: all 0.2s ease;
    transform: translate(0);
    will-change: left, right;
  }
}
</style>

