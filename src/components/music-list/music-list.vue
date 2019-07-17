<template>
  <div class="music-list">
    <!-- 返回按钮 -->
    <div class="back" @click="onBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="music-list-title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="onRandomPlay">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 背景层 -->
    <div class="bg-layer" ref="layer"></div>
    <!-- 歌曲列表 -->
    <scroll
      class="list"
      ref="list"
      :data="songs"
      :probeType="probeType"
      :listen-scroll="listenScroll"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :rank="rank" :songs="songs" @select="handleSongSelect"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapActions } from 'vuex';
import { prefixStyle } from 'common/js/dom';
import { playlistMixin } from 'common/js/mixin';
import Scroll from 'base/scroll/scroll';
import SongList from 'base/song-list/song-list';
import Loading from 'base/loading/loading';

const transform = prefixStyle('transform');
const backdrop = prefixStyle('backdrop-filter');

const RESERVED_HEIGHT = 40;

export default {
  components: {
    Scroll,
    SongList,
    Loading,
  },
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: '',
    },
    songs: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: '',
    },
    rank: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scrollY: 0,
    };
  },

  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`;
    },
  },
  watch: {
    scrollY(newVal) {
      let translateY = Math.max(this.minTranslateY, newVal);
      let scale = 1;
      let zIndex = 0;
      let blur = 0;
      const percent = Math.abs(newVal / this.imageHeight);
      if (newVal > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20, percent * 20);
      }
      this.$refs.layer.style[transform] = `translate3d(0, ${newVal}px, 0)`;
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
      if (newVal < this.minTranslateY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        this.$refs.playBtn.style.display = 'none';
      } else {
        this.$refs.bgImage.style.paddingTop = '70%';
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = '';
      }
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
    },
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    onScroll(pos) {
      this.scrollY = pos.y;
    },
    onBack() {
      this.$router.go(-1);
    },
    onRandomPlay() {
      this.randomPlay({
        list: this.songs,
      });
    },
    handleSongSelect(item, index) {
      this.selectPlay({
        list: this.songs,
        index,
      });
    },
    ...mapActions(['selectPlay', 'randomPlay']),
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~styles/variable';
@import '~styles/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $background-color;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-xl;
      color: $white;
    }
  }

  .music-list-title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    text-align: center;
    line-height: 40px;
    color: $white;
    font-size: $font-size-lg;
    font-family: $font-family;
    font-weight: bold;
    no-wrap();
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $white;
        color: $white;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-md;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-sm;
          font-family: $font-family;
          font-weight: bold;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $background-color;
  }

  .list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $background-color;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>