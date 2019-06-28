<template>
  <transition name="slide">
    <div class="add-song" @click.stop v-show="visible">
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-bar-wrapper">
        <search-bar ref="searchBar" placeholder="搜索歌曲" @search="onSearch"></search-bar>
      </div>
      <div class="shortcut" v-show="!searchText">
        <switches :options="switchOptions" :currentIndex="currentIndex" @switch="onSwitchItem"></switches>
        <div class="list-wrapper">
          <scroll class="list-scroll" ref="songList" :data="playHistory" v-if="currentIndex===0">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="onSelectSong"></song-list>
            </div>
          </scroll>
          <scroll class="list-scroll" ref="searchList" :data="searchHistory" :refreshDelay="refreshDelay">
            <div class="list-inner">
              <search-list
                :searches="searchHistory"
                @select="onHotKeySelect"
                @delete="deleteSearchHistory"
              ></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="searchText">
        <suggest
          :searchText="searchText"
          :showSinger="showSinger"
          @onListScroll="onInputBlur"
          @select="onSelectSuggest"
        ></suggest>
      </div>
      <notification ref="notification">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </notification>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions } from 'vuex';
import { searchMixin } from 'common/js/mixin';
import Scroll from 'base/scroll/scroll';
import Suggest from 'components/suggest/suggest';
import SongList from 'base/song-list/song-list';
import SearchBar from 'base/search-bar/search-bar';
import SearchList from 'base/search-list/search-list';
import Switches from 'base/switches/switches';
import Song from 'common/js/song';
import notification from 'base/notification/notification'

export default {
  mixins: [searchMixin],
  data() {
    return {
      visible: false,
      showSinger: true,
      currentIndex: 0,
      switchOptions: [
        {
          name: '最近播放',
        },
        {
          name: '搜索历史',
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['playHistory']),
  },
  methods: {
    show() {
      this.visible = true;
      this.refreshList();
    },
    refreshList() {
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh();
        } else {
          this.$refs.searchList.refresh();
        }
      }, 20);
    },
    hide() {
      this.visible = false;
    },
    onSwitchItem(index) {
      this.currentIndex = index;
    },
    onSelectSuggest() {
      this.onSaveHistory()
      this.showNitification()
    },
    onSelectSong(song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song));
      }
    },
    showNitification() {
      this.$refs.notification.show()
    },
    ...mapActions(['clearSearchHistory', 'insertSong']),
  },
  components: {
    Scroll,
    Suggest,
    SearchBar,
    SongList,
    SearchList,
    Switches,
    notification,
  },
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: $color-bg;

  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      line-height: 44px;
      font-size: $font-size-lg;
      color: $color-text;
    }

    .close {
      position: absolute;
      top: 0;
      right: 8px;

      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }

  .search-bar-wrapper {
    margin: 20px;
  }

  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 165px;
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
  }

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }

  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;

    .icon-ok {
      font-size: $font-size-md;
      color: $color-theme;
      margin-right: 4px;
    }

    .text {
      font-size: $font-size-md;
      color: $color-text;
    }
  }
}
</style>