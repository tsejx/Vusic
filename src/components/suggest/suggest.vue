<template>
  <scroll
    class="suggest"
    ref="suggest"
    :data="dataList"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @beforeScroll="onListScroll"
    @scrollToEnd="onLoadMore"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item, index) of dataList"
        :key="item.id"
        @click="onSelectItem(item, index)"
      >
        <div class="icon">
          <i :class="iconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
    <div class="no-result-wrapper">
      <no-result class="no-result-wrapper" title="抱歉，暂无搜索结果"  v-show="!hasMore && !dataList.length"></no-result>
    </div>

  </scroll>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import { ERR_OK } from 'api/config';
import { searchMusic } from 'api/search';
import Singer from 'common/js/singer';
import { createSong, isValidMusic, injectSongUrl } from 'common/js/song';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer';
const pageSize = 20;

export default {
  data() {
    return {
      pageNo: 1,
      dataList: [],
      pullup: true,
      hasMore: true,
      beforeScroll: true,
    };
  },
  props: {
    searchText: {
      type: String,
      default: '',
    },
    showSinger: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    searchText(k) {
      this.onSearch();
    },
  },
  methods: {
    onSelectItem(item, index) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername,
        });
        this.$router.push({
          path: `/singer/${singer.id}`,
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      // 该组件本身不处理保存搜索历史的使命
      // 所以此处只是往外派发事件
      this.$emit('select', item)
    },
    onSearch() {
      this.pageNo = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      searchMusic(this.searchText, this.pageNo, this.showSinger, pageSize).then(res => {
        if (res.code === ERR_OK) {
          this._normalizeSingerAndSongs(res.data).then(res => {
            this.dataList = res;
          });
          // 检查是否有额外数据
          this._checkMoreData(res.data);
        }
      });
    },
    onLoadMore() {
      if (!this.hasMore) {
        return;
      }
    },
    iconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine';
      } else {
        return 'icon-music';
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    onListScroll() {
      this.$emit('onListScroll')
    },
    onRefresh() {
      this.$refs.suggest.refresh();
    },
    _checkMoreData(data) {
      const song = data.song;
      if (!song.list.length || song.curnum + (song.curpage - 1) * pageSize >= song.totalnum) {
        this.hasMore = false;
      }
    },
    // 区分歌曲与歌手
    _normalizeSingerAndSongs(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid && this.pageNo === 1) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      return injectSongUrl(this._normalizeDataList(data.song.list)).then(songs => {
        ret = ret.concat(songs);
        return ret;
      });
    },
    _normalizeDataList(list) {
      let ret = [];
      list.forEach(musicData => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    ...mapMutations({
      setSinger: 'SET_SINGER',
    }),
    ...mapActions(['insertSong']),
  },
  components: {
    Scroll,
    NoResult
  },
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
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