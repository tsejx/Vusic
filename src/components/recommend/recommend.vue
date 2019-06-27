<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <div class="slider-content">
            <slider ref="slider">
              <div v-for="item of recommends" :key="item.id">
                <a :href="item.linkUrl">
                  <img @load="loadImage" :src="item.picUrl">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="recommend-header">热门歌单推荐</h1>
          <ul>
            <li v-for="item of discList" class="recommend-item" :key="item.id" @click="onSelectItem(item)">
              <div class="recommend-icon">
                <img width="60" height="60" v-lazy="item.picUrl">
              </div>
              <div class="recommend-text">
                <h2 class="recommend-name" v-html="item.songListAuthor"></h2>
                <p class="recommend-desc" v-html="item.songListDesc"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-conteinr" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="ecmascript-6">
import { mapMutations } from 'vuex'
import Slider from 'base/slider/slider';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { ERR_OK } from 'api/config';
import { getRecommend, getDiscList } from 'api/recommend';
import { playlistMixin } from 'common/js/mixin';

export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: [],
    };
  },

  created() {
    setTimeout(() => {
      this.loadData();
    }, 2000);
  },
  methods: {
    onSelectItem(item) {
      this.$router.push({
        path: `/recommend/${item.id}`,
      })
      this.setDiscList(item);
    },
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    loadData() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
          this.discList = res.data.songList;
        }
      });
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.checkloaded = true;
        setTimeout(() => {
          this.$refs.scroll.refresh();
        }, 20);
      }
    },
    ...mapMutations({
      setDiscList: 'SET_DISC_LIST'
    })
  },
  components: {
    slider: Slider,
    scroll: Scroll,
    loading: Loading,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0px;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;

      .slider-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  }

  overflow: hidden;

  .slider-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.recommend-list {
  .recommend-header {
    height: 65px;
    line-height: 65px;
    text-align: center;
    font-size: $font-size-md;
    color: $color-theme;
  }

  .recommend-item {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    padding: 0 20px 20px 20px;

    .recommend-icon {
      flex: 0 0 60px;
      width: 60px;
      padding-right: 20px;
    }

    .recommend-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      font-size: $font-size-md;

      .recommend-name {
        margin-bottom: 10px;
        color: $color-text;
      }

      .recommend-desc {
        color: $color-text-d;
      }
    }
  }
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
