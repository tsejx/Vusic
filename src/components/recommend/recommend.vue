<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll" :data="discList">
      <div>
        <!-- 走马灯 -->
        <div class="slider-wrapper" v-if="sliders.length">
          <div class="slider-content">
            <slider ref="slider">
              <div v-for="item of sliders" :key="item.id">
                <a :href="item.linkUrl">
                  <img @load="loadImage" :src="item.picUrl" />
                </a>
              </div>
            </slider>
          </div>
        </div>
        <!-- 热门歌单推荐 -->
        <div class="recommend-list" v-show="discList.length">
          <h1 class="recommend-header">热门歌单推荐</h1>
          <ul>
            <li
              class="recommend-item"
              v-for="item of discList"
              :key="item.id"
              @click="onSelectItem(item)"
            >
              <div class="recommend-icon">
                <img width="60" height="60" v-lazy="item.picUrl" />
              </div>
              <div class="recommend-text">
                <h3 class="recommend-name" v-html="item.songListAuthor"></h3>
                <p class="recommend-desc" v-html="item.songListDesc"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 加载 -->
      <div class="loading-conteinr" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="ecmascript-6">
import { mapMutations } from 'vuex';
import { ERR_OK } from 'api/config';
import { getRecommend, getDiscList } from 'api/recommend';
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import Loading from 'base/loading/loading';
import { playlistMixin } from 'common/js/mixin';

export default {
  components: {
    Slider,
    Scroll,
    Loading,
  },

  mixins: [playlistMixin],

  data() {
    return {
      sliders: [],
      discList: [],
    };
  },

  created() {
    setTimeout(() => {
      this.loadData();
    }, 2000);
  },

  methods: {
    loadData() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.sliders = res.data.slider;
          this.discList = res.data.songList;
        }
      });
    },
    onSelectItem(item) {
      this.$router.push({
        path: `/recommend/${item.id}`,
      });
      this.setDiscList(item);
    },
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
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
      setDiscList: 'SET_DISC_LIST',
    }),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~styles/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 90px;
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
    margin-left: 16px;
    line-height: 65px;
    text-align: left;
    color: $header-color;
    font-size: $font-size-xl;
    font-family: $font-family;
    font-weight: bold;
  }

  .recommend-item {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    padding: 0 20px 20px 20px;

    .recommend-icon {
      flex: 0 0 60px;
      width: 60px;
      height: 60px;
      margin-right: 20px;
      border-radius: $rounded;
      box-shadow: $shadow;
      overflow: hidden;
    }

    .recommend-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      font-family: $font-family;

      .recommend-name {
        margin-bottom: 10px;
        color: $text-color;
        font-size: $font-size-md;
        font-weight: bold;
      }

      .recommend-desc {
        color: $text-color-md;
        font-size: $font-size-sm;
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
