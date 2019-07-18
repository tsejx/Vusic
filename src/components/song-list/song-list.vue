<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascrpit-6">
import { mapGetters } from 'vuex';
import { ERR_OK } from 'api/config';
import { getSongList } from 'api/recommend';
import MusicList from 'components/music-list/music-list';
import { createSong, isValidMusic, injectSongUrl } from 'constants/Song';

export default {
  components: {
    MusicList,
  },
  data() {
    return {
      songs: [],
    };
  },
  computed: {
    title() {
      return this.disclist.songListDesc;
    },
    bgImage() {
      return this.disclist.picUrl;
    },
    ...mapGetters(['disclist']),
  },
  created() {
    this._loadSongList();
  },
  methods: {
    _loadSongList() {
      if (!this.disclist.id) {
        this.$router.push('/recommend');
        return;
      }
      getSongList(this.disclist.id).then(res => {
        if (res.code === ERR_OK) {
          injectSongUrl(this._normalizeSongsData(res.cdlist[0].songlist)).then(songs => {
            this.songs = songs;
          });
        }
      });
    },
    _normalizeSongsData(list) {
      let ret = [];
      list.forEach(musicData => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>