<template>
  <div class="player" v-show="playlist.length>0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="isFullScreen">
        <!-- 背景 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" />
        </div>
        <!-- 页面顶部 -->
        <div class="top">
          <div class="back" @click="onBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="song-title" v-html="currentSong.name"></h1>
          <h2 class="song-subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 页面中部 -->
        <div
          class="middle"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend="onTouchEnd"
        >
          <!-- 唱片封面 -->
          <div class="middle-record" ref="recordCover">
            <div class="record-wrapper" ref="recordWrapper">
              <div class="record" ref="recordCoverWrapper">
                <img class="image" ref="image" :class="recordRotate" :src="currentSong.image" />
              </div>
            </div>
            <div class="lyric-preview-wrapper">
              <div class="lyric-preview">{{playingLyric}}</div>
            </div>
          </div>
          <!-- 歌词 -->
          <scroll class="lyric-container" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-viewport">
              <div v-if="currentLyric">
                <p
                  class="lyric-text"
                  ref="lyricLine"
                  v-for="(line, index) of currentLyric.lines"
                  :class="{'current': currentLine === index}"
                  :key="index"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 页面底部 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'record'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <!-- 进度栏 -->
          <div class="progress-wrapper">
            <span class="time time-left">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar ref="progressBar" :percent="percent" @change="onProgressChange"></progress-bar>
            </div>
            <span class="time time-right">{{format(currentSong.duration)}}</span>
          </div>
          <!-- 控制台 -->
          <div class="operators">
            <div class="icon i-left" @click="onModeChange">
              <i :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disabeldCls">
              <i class="icon-prev" @click="onPrev"></i>
            </div>
            <div class="icon i-center" :class="disabeldCls">
              <i :class="playIcon" @click="onToggle"></i>
            </div>
            <div class="icon i-right" :class="disabeldCls">
              <i class="icon-next" @click="onNext"></i>
            </div>
            <div class="icon i-right">
              <i
                class="icon"
                :class="favoriteIcon(currentSong)"
                @click="onFavoriteToggle(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 迷你播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!isFullScreen" @click="onOpen">
        <div class="icon">
          <div class="imgWrapper" ref="miniCoverWrapper">
            <img
              width="40"
              height="40"
              ref="miniImage"
              class="image"
              :class="recordRotate"
              :src="currentSong.image"
            />
          </div>
        </div>
        <!-- 歌曲信息 -->
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i class="icon-mini" :class="miniIcon" @click.stop="onToggle"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 播放列表 -->
    <play-list ref="playlist"></play-list>
    <!-- 播放音频 -->
    <audio
      ref="audio"
      :src="currentSong.url"
      @play="onReady"
      @error="onError"
      @timeupdate="updateTime"
      @ended="onEnd"
    ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from 'vuex';
import animations from 'create-keyframe-animation';
import Lyric from 'lyric-parser';
import { prefixStyle } from 'common/js/dom';
import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/util';
import { playerMixin } from 'common/js/mixin';
import Scroll from 'base/scroll/scroll';
import ProgressBar from 'base/progress-bar/progress-bar';
import ProgressCircle from 'base/progress-circle/progress-circle';
import PlayList from 'components/play-list/play-list';

const transform = prefixStyle('transform');
const transitionDuration = prefixStyle('transitionDuration');

export default {
  components: {
    Scroll,
    ProgressBar,
    ProgressCircle,
    PlayList,
  },
  mixins: [playerMixin],
  data() {
    return {
      canPlay: false,
      currentTime: 0,
      currentLyric: null,
      currentLine: 0,
      currentShow: 'record',
      playingLyric: '',
    };
  },
  computed: {
    recordRotate() {
      return this.playing ? 'play' : '';
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play';
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
    },
    disabeldCls() {
      return this.canPlay ? '' : 'disable';
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      'isFullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList',
    ]),
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        return;
      }
      if (newSong.id === oldSong.id) {
        return;
      }
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$refs.audio.play();
        this.getSongLyric();
      }, 1000);
    },
    playing(newPlaying) {
      if (!this.canPlay) {
        return;
      }
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
      if (!newPlaying) {
        if (this.isFullScreen) {
          this.syncWrapperTransform('recordCoverWrapper', 'image');
        } else {
          this.syncWrapperTransform('miniCoverWrapper', 'miniImage');
        }
      }
    },
  },
  created() {
    this.touch = {};
  },
  methods: {
    onTouchStart(e) {
      this.touch.initiated = true;
      // 用来判断是否是一次移动
      this.touch.moved = false;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    onTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;

      // 纵向滚动时忽略，因为与歌词滚动冲突
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      if (!this.touch.moved) {
        this.touch.moved = true;
      }
      const left = this.currentShow === 'record' ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth},0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = 0;
      this.$refs.recordCover.style.opacity = 1 - this.touch.percent;
      this.$refs.recordCover.style[transitionDuration] = 0;
    },
    onTouchEnd(e) {
      if (!this.touch.moved) {
        return;
      }
      let offsetWidth;
      let opacity;
      if (this.currentShow === 'record') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = 'lyric';
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = 'record';
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      const time = 300;
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
      this.$refs.recordCover.style.opacity = opacity;
      this.$refs.recordCover.style[transitionDuration] = `${time}ms`;
      this.touch.initiated = false;
    },
    onBack() {
      this.setFullScreen(false);
    },
    onOpen() {
      this.setFullScreen(true);
    },
    onNext() {
      if (!this.canPlay) {
        return;
      }
      if (this.playlist.length === 1) {
        this.onLoop();
        return;
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.onToggle();
        }
      }
      this.canPlay = false;
    },
    onPrev() {
      if (!this.canPlay) {
        return;
      }
      if (this.playlist.length === 1) {
        // 播放列表中仅有一首歌曲时循环播放
        // 并且禁用切换歌曲按钮
        this.onLoop();
        return;
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.onToggle();
        }
      }
      this.canPlay = false;
    },
    onReady() {
      this.canPlay = true;
      this.savePlayHistory(this.currentSong);
    },
    onError() {
      this.canPlay = true;
    },
    onEnd() {
      if (this.mode === playMode.loop) {
        this.onLoop();
      } else {
        this.onNext();
      }
    },
    onLoop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    onToggle() {
      if (!this.canPlay) {
        return;
      }
      this.setPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    onProgressChange(percent) {
      const currentTime = this.currentSong.duration * percent;
      this.$refs.audio.currentTime = currentTime;
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
      if (!this.playing) {
        this.onToggle();
      }
    },
    enter(el, done) {
      const { x, y, scale } = this._getPositionAndScroll();

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`,
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`,
        },
      };

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear',
        },
      });

      animations.runAnimation(this.$refs.recordWrapper, 'move', done);
    },
    afterEnter() {
      animations.unregisterAnimation('move');
      this.$refs.recordWrapper.style.animation = '';
    },
    leave(el, done) {
      this.$refs.recordWrapper.style.animation = 'all 0.4s';
      const { x, y, scale } = this._getPositionAndScroll();
      this.$refs.recordWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      const timer = setTimeout(done, 400);
      this.$refs.recordWrapper.addEventListener('transitionEnd', () => {
        clearTimeout(timer);
        done();
      });
    },
    afterLeave() {
      this.$refs.recordWrapper.style.transition = '';
      this.$refs.recordWrapper.style[transform] = '';
    },
    format(interval) {
      interval = interval | 0;
      const min = (interval / 60) | 0;
      const sec = (interval % 60).toString().padStart(2, '0');
      return `${min}:${sec}`;
    },
    getSongLyric() {
      this.currentSong.getLyric().then(lyric => {
        // 防止切换歌曲导致异步执行的歌词获取操作的问题
        if (this.currentSong.lyric !== lyric) {
          return;
        }
        this.currentLyric = new Lyric(lyric, this.handleLyricHightlight);
        if (this.playing) {
          this.currentLyric.play();
        }
      });
    },
    // 歌词改变时回调，让当前歌词高亮
    handleLyricHightlight({ lineNum, txt }) {
      this.currentLine = lineNum;
      // 大于五行时歌词向上滚动
      if (lineNum > 5) {
        // 保证高亮歌词居中
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    syncWrapperTransform(wrapper, inner) {
      if (!this.$refs[wrapper]) {
        return;
      }
      let imageWrapper = this.$refs[wrapper];
      let image = this.$refs[inner];
      let wTransform = getComputedStyle(imageWrapper)[transform];
      let iTransform = getComputedStyle(image)[transform];
      imageWrapper.style[transform] =
        wTransform === 'none' ? iTransform : iTransform.concat(' ', wTransform);
    },
    showPlayList() {
      this.$refs.playlist.show();
    },
    _getPositionAndScroll() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale,
      };
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
    }),
    ...mapActions(['savePlayHistory']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~styles/variable';
@import '~styles/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-bg;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-xl;
          color: $;
          transform: rotate(-90deg);
        }
      }

      .song-title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-lg;
        font-family: $font-family;
        color: $white;
      }

      .song-subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-md;
        font-family: $font-family;
        color: $white;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-record {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .record-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          .record {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }

            .play {
              animation: rotate 20s linear infinite;
            }
          }
        }

        .lyric-preview-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .lyric-preview {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-md;
            font-family: $font-family;
            // color: $text-color;
            color: $white;
          }
        }
      }

      .lyric-container {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-viewport {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .lyric-text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-md;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-md;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
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

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-sm;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-left {
            text-align: left;
          }

          &.time-right {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $;

          &.disable {
            color: $text-color-md;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $white;
    border-top: 1px solid $text-color-xs;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;

      .imgWrapper {
        height: 100%;
        width: 100%;

        img {
          border-radius: 50%;

          &.play {
            animation: rotate 10s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        color: $color-text;
        font-size: $font-size-md;
        font-family: $font-family;
      }

      .desc {
        no-wrap();
        font-size: $font-size-sm;
        color: $text-color-sm;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $theme-color;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>