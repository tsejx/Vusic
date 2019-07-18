<template>
  <transition name="slide">
    <div class="profile">
      <div class="back" @click.stop="onBack">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :options="switchOptions" :currentIndex="currentIndex" @switch="onSwitchItem"></switches>
      </div>
      <div class="play-button" ref="playBtn" @click="onRandom">
        <i class="micon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll class="list-scroll" ref="favoriteList" :data="favoriteList" v-if="currentIndex===0">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="handleSongSelect"></song-list>
          </div>
        </scroll>
        <scroll class="list-scroll" ref="playList" :data="playHistory" v-if="currentIndex===1">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="handleSongSelect"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result></no-result>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import { mapGetters, mapActions } from 'vuex';
import { playlistMixin } from 'common/js/mixin';
import Scroll from 'base/scroll/scroll';
import Switches from 'base/switches/switches';
import SongList from 'base/song-list/song-list';
import NoResult from 'base/no-result/no-result';

export default {
  components: {
    Scroll,
    Switches,
    SongList,
    NoResult,
  },
  mixins: [playlistMixin],
  data() {
    return {
      currentIndex: 0,
      switchOptions: [{ name: '我喜欢的' }, { name: '最近听的' }],
    };
  },
  computed: {
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length;
      } else {
        return !this.playHistory.length;
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲';
      } else {
        return '你还没有听过歌曲';
      }
    },
    ...mapGetters(['favoriteList', 'playHistory']),
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.listWrapper.style.bottom = bottom;
      this.$refs.favoriteList && this.$refs.favoriteList.refresh();
      this.$refs.playList && this.$refs.playList.refresh();
    },
    onSwitchItem(nextIndex) {
      this.currentIndex = nextIndex;
    },
    handleSongSelect(song) {
      this.insertSong(song);
    },
    onBack() {
      this.$router.back();
    },
    onRandom() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
      if (list.length === 0) {
        return;
      }
      this.randomPlay({
        list
      });
    },
    ...mapActions(['insertSong', 'randomPlay']),
  },
};
</script>

<style lang="stylus" scoped>
@import '~styles/variable';

.profile {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $background-color;

  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-xl;
      color: $;
    }
  }

  .switches-wrapper {
    margin: 10px 0 30px 0;
  }

  .play-button {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $theme-color;
    color: $theme-color;
    border-radius: 100px;
    font-size: 0;

    .micon-play {
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

  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        padding: 20px 30px;
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>