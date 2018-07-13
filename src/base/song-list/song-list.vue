<template>
  <div class="song-list">
    <ul>
      <li @click="selectSong(song,index)" class="item" v-for="(song,index) in songs" :key="song.id">
        <div class="rank-order" v-show="rank">
          <span :class="getRankClaz(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <div class="desc">{{ getDesc(song) }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import { requestFullScreen } from 'common/js/util';

  export default {
    props: {
      songs: {
        type: Array,
        default: null
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getDesc (song) {
        return `${song.name} · ${song.album}`;
      },
      selectSong (song, index) {
        this.$emit('select_song', song, index);
        // 全屏补丁
        requestFullScreen();
        this.$store.commit('SET_SCREEN_STATE', true);
      },
      getRankClaz (index) {
        if (index <= 2) {
          return `icon icon${index}`;
        } else {
          return 'text';
        }
      },
      getRankText (index) {
        if (index > 2) {
          return index + 1;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .item
    display: flex
    align-items: center
    height: 64px
    box-sizing: border-box
    font-size: $font-size-medium
    .rank-order
      flex: 0 0 25px
      width: 25px
      margin-right: 30px
      text-align: center
      .icon
        display: inline-block
        width: 25px
        height: 24px
        background-size: 25px 24px
        &.icon0
          bg-image('first')
        &.icon1
          bg-image('second')
        &.icon2
          bg-image('third')
      .text
        color: $color-theme
        font-size: $font-size-large
    .content
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        no-wrap()
        color: $color-text
      .desc
        no-wrap()
        margin-top: 4px
        color: $color-text-d

</style>
