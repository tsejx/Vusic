<template>
  <div class="search">
    <!-- 搜索栏 -->
    <div class="search-wrapper">
      <search-bar ref="searchBar" @search="onSearchChange"></search-bar>
    </div>
    <!-- 热门搜索 -->
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!searchText">
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <div class="title">热门搜索</div>
            <ul>
              <li
                class="item"
                v-for="item of hotKey"
                :key="item.id"
                @click="onHotKeySelect(item.k)"
              >{{item.k}}</li>
            </ul>
          </div>

          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list
              :searches="searchHistory"
              @select="onHotKeySelect"
              @delete="deleteSearchHistory"
            ></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <!-- 搜索结果 -->
    <div class="search-result" v-show="searchText" ref="searchResult">
      <suggest ref="suggest" :searchText="searchText" @onListScroll="onInputBlur" @select="onSaveHistory"></suggest>
    </div>
    <confirm ref="confirm" text="清空所有历史记录？" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { ERR_OK } from 'api/config';
import { getHotKey } from 'api/search';
import Confirm from 'base/confirm/confirm';
import Scroll from 'base/scroll/scroll';
import SearchBar from 'base/search-bar/search-bar';
import SearchList from 'base/search-list/search-list';
import Suggest from 'components/suggest/suggest';
import { playlistMixin } from 'common/js/mixin';

export default {
  mixins: [playlistMixin],
  data() {
    return {
      hotKey: [],
      searchText: '',
    };
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    },
    ...mapGetters(['searchHistory']),
  },
  watch: {
    searchText(newSearchText) {
      if (!newSearchText) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    },
  },
  created() {
    this._loadHotKey();
  },
  methods: {
    onSearchChange(k) {
      this.searchText = k.trim();
    },
    onHotKeySelect(hotKey) {
      this.$refs.searchBar.onChange(hotKey);
    },
    onInputBlur() {
      this.$refs.searchBar.onBlur();
    },
    onSaveHistory(item) {
      this.saveSearchHistory(this.searchText);
    },
    showConfirm() {
      this.$refs.confirm.showConfirm();
    },
    hideConfirm() {
      this.$refs.confirm.hideConfirm();
    },
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();
      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.onRefresh()
    },
    _loadHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    ...mapActions(['saveSearchHistory', 'deleteSearchHistory', 'clearSearchHistory']),
  },
  components: {
    SearchBar,
    SearchList,
    Suggest,
    Confirm,
    Scroll,
  },
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
  .search-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-md;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-bg;
          font-size: $font-size-md;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-md;
          color: $color-text-l;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-md;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
