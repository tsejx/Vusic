import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      searchText: '',
      refreshDelay: 120,
    };
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
  },
};
