import { mapGetters, mapMutations, mapActions } from 'vuex';
import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/util';

export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist']),
  },
  mounted() {
    this.handlePlayList(this.playlist);
  },
  activated() {
    this.handlePlayList(this.playlist);
  },
  watch: {
    playlist(newVal) {
      this.handlePlayList(newVal);
    },
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method');
    },
  },
};

export const playerMixin = {
  computed: {
    modeIcon() {
      return this.mode === playMode.sequence
        ? 'icon-sequence'
        : this.mode === playMode.loop
        ? 'icon-loop'
        : 'icon-random';
    },
    ...mapGetters([
      // 'isFullScreen',
      // 'playlist',
      // 'currentSong',
      // 'playing',
      // 'currentIndex',
      'mode',
      'sequenceList',
    ]),
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
    ...mapMutations({
      // setFullScreen: 'SET_FULL_SCREEN',
      // setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
    }),
  }
}

export const searchMixin = {
  data() {
    return {
      searchText: '',
      refreshDelay: 120,
    }
  },
  computed: {
    ...mapGetters(['searchHistory']),
  },
  methods: {
    onSearch(text) {
      this.searchText = text.trim();
    },
    onInputBlur() {
      this.$refs.searchBar.onBlur();
    },
    onHotKeySelect(text) {
      this.$refs.searchBar.onChange(text);
    },
    onSaveHistory() {
      this.saveSearchHistory(this.searchText);
    },
    ...mapActions(['saveSearchHistory', 'deleteSearchHistory']),
  }
}