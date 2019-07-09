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
@import '~styles/variable';

.search-bar {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  border-radius: 6px;
  // border: 2px solid $theme-color;
  font-family: $font-family;
  box-shadow: $shadow-sm;

  .icon-search {
    font-size: 24px;
    color:$text-color-md;
  }

  .search-input {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    color: $text-color;
    font-size: $font-size;
    outline: 0;

    &::placeholder {
      color: $text-color-md;
    }
  }

  .icon-dismiss {
    font-size: 16px;
    color: $text-color-md;
  }
}
</style>