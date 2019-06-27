<template>
  <div class="rank" ref="rank">
    <scroll class="ranklist" ref="scroll" :data="rankList">
      <ul>
        <li class="item" v-for="item of rankList" :key="item.id" @click="onSelectItem(item)">
          <div class="icon">
            <img width="100" height="100" :src="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) of item.songList" :key="song.id">
              <span>{{index+1}}</span>
              <span>{{song.songname}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!rankList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapMutations } from 'vuex';
import { getTopList } from 'api/rank';
import { ERR_OK } from 'api/config';
import { playlistMixin } from 'common/js/mixin';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';

export default {
  mixins: [playlistMixin],
  data() {
    return {
      rankList: [],
    };
  },
  created() {
    this._getTopList();
  },
  methods: {
    onSelectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`,
      });
      this.setRankList(item)
    },
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.rank.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.rankList = res.data.topList;
        }
      });
    },
    ...mapMutations({
      setRankList: 'SET_RANK_LIST',
    }),
  },
  components: {
    Scroll,
    Loading,
  },
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .ranklist {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-bg;
        color: $color-text-d;
        font-size: $font-size-sm;

        .song {
          no-wrap();
          line-height: 26px;
        }
      }
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
