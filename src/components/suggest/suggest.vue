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
        @click="handleSongSelect(item, index)"
      >
        <div class="suggest-icon">
          <i :class="iconCls(item)"></i>
        </div>
        <div class="suggest-name">
          <p class="suggest-text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title></loading>
    </ul>
    <div class="no-result-wrapper">
      <no-result class="no-result-wrapper" title="抱歉，暂无搜索结果" v-show="!hasMore && !dataList.length"></no-result>
    </div>
  </scroll>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import { ERR_OK } from 'api/config';
import { searchMusic } from 'api/search';
import Singer from 'constants/Singer';
import { createSong, isValidMusic, injectSongUrl } from 'constants/Song';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import NoResult from 'base/no-result/no-result';

const TYPE_SINGER = 'singer';
const pageSize = 20;

export default {
  components: {
    Scroll,
    NoResult,
    Loading,
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
  data() {
    return {
      pageNo: 1,
      dataList: [],
      pullup: true,
      hasMore: true,
      beforeScroll: true,
    };
  },
  watch: {
    searchText() {
      this.onSearch();
    },
  },
  methods: {
    handleSongSelect(item) {
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
      this.$emit('select', item);
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
        return 'icon-singer';
      } else {
        return 'icon-music';
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name} - ${item.singer}`;
      }
    },
    onListScroll() {
      this.$emit('onListScroll');
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
};
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

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

    .suggest-icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $text-color-md;
      }
    }

    .suggest-name {
      flex: 1;
      color: $text-color;
      font-size: $font-size;
      font-family: $font-family;
      overflow: hidden;

      .suggest-text {
        no-wrap();
        font-size: $font-size;
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