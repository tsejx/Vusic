import { mapGetters, mapMutations, mapActions } from 'vuex';
import { playMode } from 'constants/config';
import { shuffle } from 'utils';

export default {
  computed: {
    modeIcon() {
      return this.mode === playMode.sequence
        ? 'micon-sequence'
        : this.mode === playMode.loop
        ? 'micon-loop'
        : 'micon-random';
    },
    ...mapGetters(['playlist', 'currentSong', 'mode', 'sequenceList', 'favoriteList']),
  },
  methods: {
    onModeChange() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    onFavoriteToggle(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    favoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite';
      }
      return 'icon-not-favorite';
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === song.id;
      });
      return index > -1;
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setPlayingState: 'SET_PLAYING_STATE',
    }),
    ...mapActions(['saveFavoriteList', 'deleteFavoriteList']),
  },
};
