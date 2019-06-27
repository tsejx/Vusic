<template>
  <transition appear name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text.ecmascript-6">
import { mapGetters } from 'vuex';
import { ERR_OK } from 'api/config';
import { getMusicList } from 'api/rank';
import { createSong, isValidMusic, injectSongUrl } from 'common/js/song';
import MusicList from 'components/music-list/music-list';

export default {
  data() {
    return {
      songs: [],
      rank: true,
    };
  },
  computed: {
    title() {
      return this.ranklist.topTitle;
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      }
      return '';
    },
    ...mapGetters(['ranklist']),
  },
  created() {
    this._loadRankDetail()
  },
  methods: {
    _loadRankDetail() {
      if (!this.ranklist.id) {
        this.$router.push('/rank');
        return;
      }
      getMusicList(this.ranklist.id).then(res => {
        if (res.code === ERR_OK) {
          injectSongUrl(this._normalizeSongsData(res.songlist)).then(songs => {
            this.songs = songs;
          });
        }
      });
    },
    _normalizeSongsData(list) {
      let ret = [];
      list.forEach(item => {
        const musicData = item.data;
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
  },
  components: {
    MusicList,
  },
};
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>