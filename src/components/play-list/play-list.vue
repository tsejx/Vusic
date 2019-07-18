<template>
  <transition name="list-fade">
    <div class="play-list" v-show="visible" @click="hide">
      <!-- 这里的 click.stop 是防止冒泡 -->
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="modeIcon" @click="onModeChange"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="onShowConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <!-- 播放列表内容 -->
        <scroll class="list-content" ref="listContent" :data="sequenceList" :refreshDelay="refreshDelay">
          <transition-group ref="list" name="list" tag="ul">
            <li
              class="item"
              ref="listItem"
              v-for="(item, index) of sequenceList"
              :key="item.id"
              @click="handleSongSelect(item, index)"
            >
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text" v-html="item.name"></span>
              <span class="like">
                <i :class="favoriteIcon(item)" @click.stop="onFavoriteToggle(item)"></i>
              </span>
              <span class="delete" @click.stop="onDelete(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click.stop="onShowAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" okBtnText="清空" @confirm="onConfirmClear"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { playMode } from 'common/js/config';
import { playerMixin } from 'common/js/mixin';
import Scroll from 'base/scroll/scroll';
import Confirm from 'base/confirm/confirm';
import AddSong from 'components/add-song/add-song'
import { setTimeout } from 'timers';

export default {
  mixins: [playerMixin],
  data() {
    return {
      visible: false,
      refreshDelay: 100,
    };
  },
  computed: {
    modeText() {
      switch (this.mode) {
        case playMode.sequence:
          return '顺序播放';
        case playMode.random:
          return '随机播放';
        case playMode.loop:
          return '单曲循环';
        default:
          return '';
      }
    },
    ...mapGetters(['sequenceList', 'currentSong', 'playlist', 'mode']),
  },
  methods: {
    show() {
      this.visible = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      }, 200);
    },
    hide() {
      this.visible = false;
    },
    handleSongSelect(item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex(song => {
          return song.id === item.id;
        });
        this.setCurrentIndex(index);
      }
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    onDelete(item) {
      this.deleteSong(item);
      if (!this.playlist.length) {
        this.hide();
      }
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return 'micon-play';
      }
      return '';
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id;
      });
      // 切换成功后，滚动到歌曲
      this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300);
    },
    onShowConfirm() {
      this.$refs.confirm.show();
    },
    onConfirmClear() {
      this.clearSongList();
      this.hide();
    },
    onShowAddSong() {
      this.$refs.addSong.show()
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE',
    }),
    ...mapActions(['deleteSong', 'clearSongList']),
  },
  watch: {
    currentSong(next, prev) {
      if (!this.visible || next.id === prev.id) {
        return;
      }
      setTimeout(() => {
        this.scrollToCurrent(next);
      }, 20);
    },
  },
  components: {
    Scroll,
    Confirm,
    AddSong,
  },
};
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.play-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $mask-background-color;

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  &.list-fade-enter, .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    // background-color: $color-highlight-bg;
    border-top: 1px solid $text-color-xs;
    background-color: $background-color;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $theme-color;
        }

        .text {
          flex: 1;
          font-size: $font-size-md;
          font-family: $font-family;
          color: $text-color;
        }

        .clear {
          extend-click();

          .icon-clear {
            font-size: $font-size-md;
            color: $text-color-md;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
          height: 0;
        }

        .current {
          flex: 0 0 20px;
          width: 20px;
          color: $theme-color;
          font-size: $font-size-sm;
        }

        .text {
          flex: 1;
          no-wrap();
          color: $text-color;
          font-size: $font-size-md;
          font-family: $font-family;
        }

        .like {
          extend-click();
          margin-right: 15px;
          font-size: $font-size-sm;
          color: $;

          .icon-favorite {
            color: $theme-color;
          }
        }

        .delete {
          extend-click();
          font-size: $font-size-sm;
          color: $;
        }
      }
    }

    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $theme-color;
        border-radius: 100px;
        color: $theme-color;
        font-family: $font-family;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-xs;
        }

        .text {
          font-size: $font-size-sm;
        }
      }
    }

    .list-close {
      border-top: 1px solid $text-color-xs;
      text-align: center;
      line-height: 50px;
      background: $background-color;
      font-size: $font-size-lg;
      font-family: $font-family;
      color: $theme-color;
    }
  }
}
</style>