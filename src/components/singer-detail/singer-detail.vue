<template>
  <transition apper name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import { ERR_OK } from 'api/config';
import { getSingerDetail } from 'api/singer';
import { createSong, injectSongUrl } from 'common/js/song';
import MusicList from 'components/music-list/music-list';

export default {
  data() {
    return {
      songs: [],
    };
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(['singer']),
  },
  methods: {
    loadData() {
      // 边界处理
      if (!this.singer.id) {
        this.$router.go(-1);
        return;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (ERR_OK === res.code) {
          injectSongUrl(this.normalizeSongData(res.data.list)).then(songs => (this.songs = songs));
        }
      });
    },
    normalizeSongData(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
  },
  created() {
    this.loadData();
  },
  components: {
    MusicList,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~styles/variable';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: $color-bg;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>