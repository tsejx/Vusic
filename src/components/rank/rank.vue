<template>
  <div class="rank" ref="rank">
    <scroll class="rank-list" ref="scroll" :data="rankList">
      <ul>
        <li
          class="rank-item"
          v-for="item of rankList"
          :key="item.id"
          @click="handleRankingSelect(item)"
        >
          <div class="rank-cover">
            <img width="100" height="100" :src="item.picUrl" />
          </div>
          <ul class="song-list">
            <li class="song-cell" v-for="(song,index) of item.songList" :key="song.id">
              <span>{{index+1}}.</span>
              <span>{{song.singername + ' - ' + song.songname}}</span>
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
import { ERR_OK } from 'api/config';
import { getTopList } from 'api/rank';
import { playlistMixin } from 'common/js/mixin';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';

export default {
  components: {
    Scroll,
    Loading,
  },
  mixins: [playlistMixin],
  data() {
    return {
      rankList: [],
    };
  },
  created() {
    this._loadRankingList();
  },
  methods: {
    handleRankingSelect(item) {
      this.$router.push({
        path: `/rank/${item.id}`,
      });
      this.setRankList(item);
    },
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.rank.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    _loadRankingList() {
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
};
</script>

<style lang="stylus" scoped>
@import '~styles/variable';
@import '~styles/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .rank-list {
    height: 100%;
    overflow: hidden;

    .rank-item {
      display: flex;
      justify-content: between;
      margin: 0 20px;
      margin-top: 20px;
      height: 100px;
      border-radius: $rounded-md;
      box-shadow: $card-shadow;
      overflow: hidden;

      .rank-cover {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        color: $theme-color;
        font-size: $font-size-sm;
        font-family: $font-family;

        .song-cell {
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
