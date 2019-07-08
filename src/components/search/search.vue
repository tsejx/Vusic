<template>
  <div class="search">
    <!-- 搜索栏 -->
    <div class="search-wrapper">
      <search-bar ref="searchBar" @search="onSearch"></search-bar>
    </div>
    <!-- 热门搜索 -->
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!searchText">
      <scroll class="shortcut" ref="shortcut" :data="shortcut" :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key">
            <div class="hot-title">热门搜索</div>
            <ul>
              <li
                class="hot-item"
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
      <suggest
        ref="suggest"
        :searchText="searchText"
        @onListScroll="onInputBlur"
        @select="onSaveHistory"
      ></suggest>
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
import { playlistMixin, searchMixin } from 'common/js/mixin';

export default {
  components: {
    SearchBar,
    SearchList,
    Suggest,
    Confirm,
    Scroll,
  },
  mixins: [playlistMixin, searchMixin],
  data() {
    return {
      hotKey: [],
    };
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    },
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
    showConfirm() {
      this.$refs.confirm.show();
    },
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();
      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.onRefresh();
    },
    _loadHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    ...mapActions(['clearSearchHistory']),
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

        .hot-title {
          margin-bottom: 20px;
          text-align: left;
          color: $black;
          font-size: $font-size-xl;
          font-family: $font-family;
          font-weight: bold;
        }

        .hot-item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: #D9DAF0;
          color: #5E60D1;
          font-size: $font-size-md;
          font-family: $family;
          font-weight: bold;
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
