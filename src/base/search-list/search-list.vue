<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li class="search-item" v-for="item of searches" :key="item.id" @click="onSelectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon">
          <i class="icon-delete" @click.stop="onDeleteItem(item)"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: [],
    },
  },
  methods: {
      // 基础组件应该将事件派发出去
      onSelectItem(item) {
          this.$emit('select', item)
      },
      onDeleteItem(item) {
          this.$emit('delete', item)
      }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;

    &.list-enter-active, &.list-leave-active {
      transition: all 0.1s;
    }

    &.list-enter, &.list-leave-to {
      height: 0;
    }

    .text {
      flex: 1;
      color: $color-text-l;
    }

    .icon {
      extend-click();

      .icon-delete {
        font-size: $font-size-sm;
        color: $color-text-d;
      }
    }
  }
}
</style>