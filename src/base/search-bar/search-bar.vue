<template>
  <div class="search-bar">
    <i class="icon-search"></i>
    <input class="search-input" ref="input" v-model="searchText" :placeholder="placeholder">
    <i class="icon-dismiss" v-show="searchText" @click="onClear"></i>
  </div>
</template>

<script>
import { debounce } from 'common/js/util';

export default {
  data() {
    return {
      searchText: '',
    };
  },
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手',
    },
  },
  created() {
    //
    this.$watch(
      'searchText',
      debounce(newQuery => {
        this.$emit('search', newQuery);
      }, 300)
    );
  },
  methods: {
    onClear() {
      this.searchText = '';
    },
    onChange(text) {
      this.searchText = text;
    },
    onBlur() {
        this.$refs.input.blur()
    }
  },
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.search-bar {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-bg;
  border-radius: 6px;

  .icon-search {
    font-size: 24px;
    color: $color-bg;
  }

  .search-input {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-bg;
    color: $color-text;
    font-size: $font-size-md;
    outline: 0;

    &::placeholder {
      color: $color-text-d;
    }
  }

  .icon-dismiss {
    font-size: 16px;
    color: $color-bg;
  }
}
</style>