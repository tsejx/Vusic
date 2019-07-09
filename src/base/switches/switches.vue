<template>
  <ul class="switches">
    <li
      class="switch-item"
      :class="{'active': currentIndex === index}"
      :key="index"
      v-for="(item, index) of options"
      @click="onSwitch(index)"
    >
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    onSwitch(index) {
      this.$emit('switch', index);
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~styles/variable';

.switches {
  display: flex;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 2px solid $theme-color-sm;
  background: $theme-color-sm;
  border-radius: 5px;
  color: $white;

  .switch-item {
    flex: 1;
    padding: 8px;
    text-align: center;
    font-size: $font-size-md;
    font-family: $font-family;

    &.active {
      color: $white;
      background-color: $theme-color;
      border-radius: 5px;
    }
  }
}
</style>