<template>
  <div class="song-list">
    <ul>
      <li
        class="song-item"
        v-for="(item, index) of songs"
        :key="item.id"
        @click="onSelectItem(item, index)"
      >
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{getSongDescription(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
    rank: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onSelectItem(item, index) {
      this.$emit('select', item, index);
    },
    getSongDescription(song) {
      return `${song.singer} 《${song.album}》`;
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return 'normal';
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~styles/variable';
@import '~styles/mixin';

.song-list {
  .song-item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-md;
    font-family: $font-family;

    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;

      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;

        &.icon0 {
          bg-image('first');
        }

        &.icon1 {
          bg-image('second');
        }

        &.icon2 {
          bg-image('third');
        }
      }

      .normal {
        color: $;
        font-size: $font-size-lg;
      }
    }

    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        no-wrap();
        color: $text-color;
        font-size: $font-size-lg;
        font-family: $font-family;
        font-weight: bold;
      }

      .desc {
        no-wrap();
        margin-top: 4px;
        color: $text-color-sm;
        font-size: $font-size-sm;
      }
    }
  }
}
</style>